/**
 * Simple Claude API Integration Test
 * Direct test without complex path resolution
 * Usage: node docs/test/simple-claude-test.js
 */

const https = require('https')
require('dotenv').config({ quiet: true })

// Mock specification data
const testSpecs = [
  {
    review: "Excellent tobacco blend with rich, earthy flavors. Perfect for morning smoking.",
    star_rating: 4,
    spec_junction_tasting_notes: [
      { spec_enum_tasting_notes: { id: 1, name: 'Sweet' } },
      { spec_enum_tasting_notes: { id: 5, name: 'Earthy' } }
    ]
  },
  {
    review: "Fantastic blend! The chocolate and vanilla notes really shine through.",
    star_rating: 5,
    spec_junction_tasting_notes: [
      { spec_enum_tasting_notes: { id: 8, name: 'Chocolate' } },
      { spec_enum_tasting_notes: { id: 12, name: 'Vanilla' } }
    ]
  }
]

async function testClaudeAPIDirectly() {
  console.log('🔄 Testing Claude API directly...')
  
  const apiKey = process.env.ANTHROPIC_API_KEY
  
  if (!apiKey) {
    console.log('❌ ANTHROPIC_API_KEY not found in environment')
    return false
  }
  
  console.log('✅ API key found (length:', apiKey.length, 'characters)')
  
  const messages = [
    {
      role: 'user',
      content: 'Please respond with exactly: "Claude API is working correctly!"'
    }
  ]
  
  const requestData = JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 100,
    messages: messages
  })
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    }
    
    const req = https.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          
          if (res.statusCode === 200 && response.content) {
            console.log('✅ Claude API test successful!')
            console.log('   Response:', response.content[0]?.text || 'No text content')
            console.log('   Usage:', response.usage)
            resolve(true)
          } else {
            console.log('❌ Claude API test failed')
            console.log('   Status:', res.statusCode)
            console.log('   Response:', data)
            resolve(false)
          }
        } catch (error) {
          console.log('❌ Failed to parse Claude response:', error.message)
          console.log('   Raw response:', data)
          resolve(false)
        }
      })
    })
    
    req.on('error', (error) => {
      console.log('❌ Request error:', error.message)
      resolve(false)
    })
    
    req.write(requestData)
    req.end()
  })
}

async function testPromptGeneration() {
  console.log('\n🔄 Testing prompt generation...')
  
  // Simple prompt template
  const systemPrompt = `You are an expert tobacco analyst. Analyze multiple tobacco product specifications and synthesize them into a single coherent specification.

Return only a JSON object with these fields:
{
  "review": "synthesized review text",
  "star_rating": 1-5,
  "confidence": 1-3,
  "tasting_note_ids": [array of numbers],
  "cure_ids": [array of numbers],
  "tobacco_type_ids": [array of numbers]
}`

  const userPrompt = `Please synthesize these ${testSpecs.length} tobacco specifications:

${testSpecs.map((spec, i) => `
Specification ${i + 1}:
- Review: "${spec.review}"
- Rating: ${spec.star_rating}/5 stars
- Tasting notes: ${spec.spec_junction_tasting_notes?.map(tn => tn.spec_enum_tasting_notes.name).join(', ') || 'None'}
`).join('\n')}

Synthesize into a single specification that captures the consensus view.`

  console.log('✅ Prompt generation successful')
  console.log('   System prompt length:', systemPrompt.length)
  console.log('   User prompt length:', userPrompt.length)
  
  return { systemPrompt, userPrompt }
}

async function testSynthesisWithClaude() {
  console.log('\n🔄 Testing full synthesis with Claude...')
  
  const prompts = await testPromptGeneration()
  if (!prompts) return false
  
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.log('❌ API key not available')
    return false
  }
  
  const messages = [
    { role: 'user', content: prompts.systemPrompt + '\n\n' + prompts.userPrompt }
  ]
  
  const requestData = JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    messages: messages
  })
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    }
    
    const req = https.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          
          if (res.statusCode === 200 && response.content) {
            const text = response.content[0]?.text
            console.log('✅ Claude synthesis successful!')
            console.log('   Raw response length:', text?.length || 0)
            
            // Try to parse JSON response
            try {
              // Remove markdown code blocks if present
              let cleanJson = text.trim()
              if (cleanJson.startsWith('```json')) {
                cleanJson = cleanJson.replace(/```json\s*/g, '').replace(/\s*```$/g, '')
              } else if (cleanJson.startsWith('```')) {
                cleanJson = cleanJson.replace(/```\s*/g, '').replace(/\s*```$/g, '')
              }
              
              const synthesisResult = JSON.parse(cleanJson)
              console.log('✅ JSON parsing successful!')
              console.log('   Synthesized review:', synthesisResult.review?.substring(0, 100) + '...')
              console.log('   Star rating:', synthesisResult.star_rating)
              console.log('   Confidence:', synthesisResult.confidence)
              console.log('   Tasting notes:', synthesisResult.tasting_note_ids?.length || 0, 'selected')
              resolve(true)
            } catch (parseError) {
              console.log('⚠️  Claude responded but JSON parsing failed')
              console.log('   Raw response:', text?.substring(0, 200) + '...')
              resolve(false)
            }
          } else {
            console.log('❌ Claude synthesis failed')
            console.log('   Status:', res.statusCode)
            console.log('   Error:', response.error?.message || data)
            resolve(false)
          }
        } catch (error) {
          console.log('❌ Failed to parse response:', error.message)
          resolve(false)
        }
      })
    })
    
    req.on('error', (error) => {
      console.log('❌ Request error:', error.message)
      resolve(false)
    })
    
    req.write(requestData)
    req.end()
  })
}

async function main() {
  console.log('🚀 Simple Claude Integration Test')
  console.log('=================================\n')
  
  const results = {
    apiConnection: false,
    promptGeneration: false,
    fullSynthesis: false
  }
  
  // Test 1: Basic API connection
  results.apiConnection = await testClaudeAPIDirectly()
  
  // Test 2: Prompt generation
  results.promptGeneration = !!(await testPromptGeneration())
  
  // Test 3: Full synthesis (only if API works)
  if (results.apiConnection) {
    results.fullSynthesis = await testSynthesisWithClaude()
  } else {
    console.log('\n⏭️  Skipping full synthesis (API connection failed)')
  }
  
  // Summary
  console.log('\n🏁 Test Results')
  console.log('===============')
  console.log(`API Connection:     ${results.apiConnection ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Prompt Generation:  ${results.promptGeneration ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Full Synthesis:     ${results.fullSynthesis ? '✅ PASS' : '❌ FAIL'}`)
  
  const passCount = Object.values(results).filter(Boolean).length
  console.log(`\nOverall: ${passCount}/3 tests passed`)
  
  if (passCount === 3) {
    console.log('🎉 All tests passed! Claude integration is working!')
  } else {
    console.log('⚠️  Some tests failed. Check configuration and API key.')
  }
  
  return results
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { main, testClaudeAPIDirectly, testSynthesisWithClaude }
