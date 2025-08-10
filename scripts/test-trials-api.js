/*
 E2E test script for Trials API
 - Requires dev server running
 - Node 18+ recommended

 Env vars:
 - BASE_URL (default: http://localhost:3000)
 - TEST_USER_ID (default: 90bd804a-874b-4b89-9407-262f99893b06)
 - VERBOSE=true for more logs
*/

const http = require('node:http')
const https = require('node:https')
const { URL } = require('node:url')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const TEST_USER_ID = process.env.TEST_USER_ID || '90bd804a-874b-4b89-9407-262f99893b06'
const VERBOSE = /^true$/i.test(process.env.VERBOSE || '')

function log(...args) {
  console.log('[Trials-API]', ...args)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function request(method, path, body) {
  const url = new URL(path, BASE_URL)
  const isHttps = url.protocol === 'https:'
  const lib = isHttps ? https : http

  const payload = body ? JSON.stringify(body) : null

  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }

  return new Promise((resolve, reject) => {
    const req = lib.request(url, options, (res) => {
      const chunks = []
      res.on('data', (d) => chunks.push(d))
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8')
        let json
        try {
          json = text ? JSON.parse(text) : null
        } catch (e) {
          if (VERBOSE) log('Non-JSON response:', text)
        }
        if (VERBOSE)
          log(
            method,
            url.toString(),
            '->',
            res.statusCode,
            json ? JSON.stringify(json).slice(0, 300) : text?.slice(0, 300)
          )
        resolve({ status: res.statusCode, json, text })
      })
    })
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

async function getBrands() {
  const res = await request('GET', '/api/trial-brands')
  if (res.status !== 200) throw new Error(`Brands failed: ${res.status}`)
  const data = res.json && res.json.data
  if (!data || !Array.isArray(data.brands) || data.brands.length === 0) {
    throw new Error('No brands found; seed brands first.')
  }
  return data.brands
}

async function getTastingNotesWithRetry(maxRetries = 6, delayMs = 1500) {
  for (let i = 0; i < maxRetries; i++) {
    const res = await request('GET', '/api/enums')
    if (res.status === 202) {
      log(`Enum cache warming... retrying in ${delayMs}ms`)
      await sleep(delayMs)
      continue
    }
    if (res.status !== 200) throw new Error(`Tasting notes failed: ${res.status}`)
    const data = res.json && res.json.data
    if (!data || !Array.isArray(data.tastingNotes)) throw new Error('Unexpected tasting notes shape')
    return data.tastingNotes
  }
  throw new Error('Enum cache did not warm in time')
}

async function createTrial({ brandId, tastingNoteIds }) {
  const timestamp = new Date().toISOString()
  const body = {
    trial: {
      product_name: `API Test ${timestamp}`,
      supplier_id: brandId,
      rating: 4,
      review: 'integration test',
      should_sell: true,
      user_id: TEST_USER_ID,
    },
    junctionData: { tasting_note_ids: tastingNoteIds },
  }
  const res = await request('POST', '/api/trials', body)
  if (res.status !== 200) throw new Error(`Create failed: ${res.status}`)
  const data = res.json && res.json.data
  if (!data || typeof data.id !== 'number') throw new Error('Create: missing id in response')
  return data
}

async function listTrials() {
  const res = await request('GET', '/api/trials')
  if (res.status !== 200) throw new Error(`List failed: ${res.status}`)
  const data = res.json && res.json.data
  if (!data || !Array.isArray(data.trials)) throw new Error('List: unexpected shape')
  return data.trials
}

async function getTrialById(id, withUser = false) {
  const path = withUser ? `/api/trials/${id}?userId=${encodeURIComponent(TEST_USER_ID)}` : `/api/trials/${id}`
  const res = await request('GET', path)
  if (res.status !== 200) throw new Error(`Get by id failed: ${res.status}`)
  const data = res.json && res.json.data
  if (!data || !data.trial || data.trial.id !== id) throw new Error('Get by id: mismatch')
  return data.trial
}

async function updateTrial(id, tastingNoteIds) {
  const body = { rating: 5, tasting_note_ids: tastingNoteIds.slice(0, 1) }
  const res = await request('PUT', `/api/trials/${id}?userId=${encodeURIComponent(TEST_USER_ID)}`, body)
  if (res.status !== 200) throw new Error(`Update failed: ${res.status}`)
  const data = res.json && res.json.data
  if (!data || !data.trial || data.trial.id !== id) throw new Error('Update: unexpected response')
  return data.trial
}

async function deleteTrial(id) {
  const res = await request('DELETE', `/api/trials/${id}`)
  if (res.status !== 200) throw new Error(`Delete failed: ${res.status}`)
  return true
}

async function main() {
  log('BASE_URL =', BASE_URL)
  log('TEST_USER_ID =', TEST_USER_ID)

  // 1) Brands
  const brands = await getBrands()
  log(`Brands found: ${brands.length}`)
  const brandId = brands[0].id

  // 2) Tasting notes (with warming handling)
  const tastingNotes = await getTastingNotesWithRetry()
  log(`Tasting notes found: ${tastingNotes.length}`)
  const tnIds = tastingNotes.map((t) => t.id)

  // 3) Create
  const created = await createTrial({ brandId, tastingNoteIds: tnIds.slice(0, 2) })
  log('Created trial id =', created.id)

  // 4) List
  const list = await listTrials()
  log('List total =', list.length)

  // 5) Get by id (no user filter)
  const t1 = await getTrialById(created.id, false)
  log('Fetched (no user filter):', { id: t1.id, rating: t1.rating })

  // 6) Get by id (with user filter)
  const t2 = await getTrialById(created.id, true)
  log('Fetched (with user filter):', { id: t2.id, rating: t2.rating })

  // 7) Update
  const meta = await updateTrial(created.id, tnIds)
  log('Updated meta =', meta)

  // 8) Delete
  await deleteTrial(created.id)
  log('Deleted trial id =', created.id)

  log('All tests completed successfully.')
}

main().catch((err) => {
  console.error('\n[Trials-API] FAILED:', err?.message || err)
  if (VERBOSE && err?.stack) console.error(err.stack)
  process.exitCode = 1
})
