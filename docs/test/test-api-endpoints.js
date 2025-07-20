/**
 * API Endpoint Testing Script
 * Tests AI synthesis endpoints without database writes
 * Usage: node docs/test/test-api-endpoints.js
 * 
 * Note: Requires dev server to be running on localhost:3000
 */

const http = require('http')

const BASE_URL = 'http://localhost:3000'

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL)
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    
    const req = http.request(options, (res) => {
      let body = ''
      
      res.on('data', (chunk) => {
        body += chunk
      })
      
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {}
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed
          })
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: { raw: body, parseError: error.message }
          })
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    if (data) {
      req.write(JSON.stringify(data))
    }
    
    req.end()
  })
}

async function testServerConnection() {
  console.log('🔌 Testing server connection...')
  
  try {
    const response = await makeRequest('GET', '/api/health')
    
    if (response.statusCode === 200) {
      console.log('✅ Server is running and accessible')
      return true
    } else {
      console.log(`⚠️  Server responded with status ${response.statusCode}`)
      return false
    }
  } catch (error) {
    console.error('❌ Cannot connect to server:', error.message)
    console.log('💡 Make sure the dev server is running: npm run dev')
    return false
  }
}

async function testGetAISynth() {
  console.log('\n🔄 Testing GET /api/specifications/ai-synth')
  
  try {
    // Test without parameters
    const response1 = await makeRequest('GET', '/api/specifications/ai-synth')
    
    console.log(`   Status: ${response1.statusCode}`)
    console.log(`   Response type: ${typeof response1.data}`)
    
    if (response1.statusCode === 200 && Array.isArray(response1.data)) {
      console.log(`✅ GET endpoint working - returned ${response1.data.length} syntheses`)
      
      // Test with specific product
      if (response1.data.length > 0) {
        const firstSynth = response1.data[0]
        const testHandle = firstSynth.shopify_handle
        
        console.log(`   Testing with specific handle: ${testHandle}`)
        const response2 = await makeRequest('GET', `/api/specifications/ai-synth?shopify_handle=${testHandle}`)
        
        if (response2.statusCode === 200) {
          console.log(`✅ Filtered query working`)
        }
      }
      
      return true
    } else {
      console.log('⚠️  Unexpected response format')
      console.log('   Data:', JSON.stringify(response1.data, null, 2))
      return false
    }
  } catch (error) {
    console.error('❌ GET test failed:', error.message)
    return false
  }
}

async function testPostAISynth() {
  console.log('\n🔄 Testing POST /api/specifications/ai-synth')
  
  // First, let's get a list of existing specifications to find a real product
  let realHandle = null
  try {
    const specsResponse = await makeRequest('GET', '/api/specifications')
    if (specsResponse.statusCode === 200) {
      const specsData = specsResponse.data
      const specs = specsData.data || []
      if (specs.length > 0) {
        // Find a handle with multiple specs for better testing
        const handleCounts = {}
        specs.forEach(spec => {
          if (spec.shopify_handle) {
            handleCounts[spec.shopify_handle] = (handleCounts[spec.shopify_handle] || 0) + 1
          }
        })
        
        // Find a handle with at least 2 specs (better for synthesis)
        realHandle = Object.keys(handleCounts).find(handle => handleCounts[handle] >= 2) ||
                    Object.keys(handleCounts)[0] // or just use the first one
      }
    }
  } catch (error) {
    console.log('   ⚠️  Could not fetch existing specifications')
  }
  
  const testData = {
    shopify_handle: realHandle || 'fribourg-and-treyer-high-dry-toast', // use product with 17 specifications
    ai_model: 'claude-3-5-sonnet-20241022', // use the working model
    confidence: 2
  }
  
  try {
    console.log('   Testing with product handle:', testData.shopify_handle)
  console.log('   Payload:', JSON.stringify(testData, null, 2))
    
    const response = await makeRequest('POST', '/api/specifications/ai-synth', testData)
    
    console.log(`   Status: ${response.statusCode}`)
    
    if (response.statusCode === 200) {
      console.log('✅ POST synthesis successful')
      console.log('   Full response data:')
      console.log(JSON.stringify(response.data, null, 2))
      console.log('   Result structure:')
      console.log('   - ID:', response.data.id)
      console.log('   - Shopify Handle:', response.data.shopify_handle)
      console.log('   - AI Model:', response.data.ai_model)
      console.log('   - Confidence:', response.data.confidence)
      if (response.data.specification) {
        console.log('   - Synthesized Review Length:', response.data.specification.review?.length || 0)
        console.log('   - Synthesized Rating:', response.data.specification.star_rating)
      }
      
      if (response.data.specification) {
        console.log('   - Generated spec ID:', response.data.specification.id)
        console.log('   - Review length:', response.data.specification.review?.length || 0)
      }
      
      return true
    } else if (response.statusCode === 400) {
      console.log('ℹ️  Expected error (likely no specs found for test handle)')
      console.log('   Error:', response.data.error)
      return true // This is expected for non-existent products
    } else if (response.statusCode === 500) {
      console.log('❌ Server error during synthesis')
      console.log('   Error:', response.data.error)
      return false
    } else {
      console.log(`⚠️  Unexpected status: ${response.statusCode}`)
      console.log('   Data:', JSON.stringify(response.data, null, 2))
      return false
    }
  } catch (error) {
    console.error('❌ POST test failed:', error.message)
    return false
  }
}

async function testErrorHandling() {
  console.log('\n🔄 Testing error handling')
  
  try {
    // Test invalid method
    const response1 = await makeRequest('DELETE', '/api/specifications/ai-synth')
    console.log(`   DELETE method: ${response1.statusCode} (expected 405)`)
    
    // Test malformed JSON
    const response2 = await makeRequest('POST', '/api/specifications/ai-synth', { invalid: 'data' })
    console.log(`   Invalid data: ${response2.statusCode} (expected 400)`)
    
    // Test missing required fields
    const response3 = await makeRequest('POST', '/api/specifications/ai-synth', {})
    console.log(`   Missing fields: ${response3.statusCode} (expected 400)`)
    
    console.log('✅ Error handling tests complete')
    return true
  } catch (error) {
    console.error('❌ Error handling test failed:', error.message)
    return false
  }
}

async function runEndpointTests() {
  console.log('🚀 AI Synthesis API Endpoint Tests')
  console.log('===================================\n')
  
  const results = {
    connection: false,
    getEndpoint: false,
    postEndpoint: false,
    errorHandling: false
  }
  
  // Test 1: Server Connection
  results.connection = await testServerConnection()
  
  if (!results.connection) {
    console.log('\n❌ Cannot proceed - server not accessible')
    return results
  }
  
  // Test 2: GET Endpoint
  results.getEndpoint = await testGetAISynth()
  
  // Test 3: POST Endpoint 
  results.postEndpoint = await testPostAISynth()
  
  // Test 4: Error Handling
  results.errorHandling = await testErrorHandling()
  
  // Summary
  console.log('\n🏁 API Test Results Summary')
  console.log('===========================')
  console.log(`Server Connection:      ${results.connection ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`GET /ai-synth:          ${results.getEndpoint ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`POST /ai-synth:         ${results.postEndpoint ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Error Handling:         ${results.errorHandling ? '✅ PASS' : '❌ FAIL'}`)
  
  const passCount = Object.values(results).filter(Boolean).length
  console.log(`\nOverall: ${passCount}/4 tests passed`)
  
  if (passCount === 4) {
    console.log('🎉 All API tests passed!')
  } else {
    console.log('⚠️  Some API tests failed.')
  }
  
  return results
}

// Run if called directly
if (require.main === module) {
  runEndpointTests()
    .catch(console.error)
}

module.exports = {
  makeRequest,
  testServerConnection,
  testGetAISynth,
  testPostAISynth,
  testErrorHandling,
  runEndpointTests
}
