/**
 * AI Synthesis Testing Script
 * Tests Claude AI synthesis without database writes
 * Usage: node docs/test/test-ai-synthesis.js
 */

const path = require('path')
const { PrismaClient } = require('@prisma/client')

// Set up absolute paths
const rootDir = path.join(__dirname, '../../')
const libDir = path.join(rootDir, 'lib')

const prisma = new PrismaClient()

// Mock specification data for testing
const mockSpecifications = [
  {
    id: 1,
    shopify_handle: 'test-tobacco-blend',
    product_type_id: 1,
    product_brand_id: 1,
    grind_id: 2,
    nicotine_level_id: 3,
    moisture_level_id: 2,
    experience_level_id: 1,
    is_fermented: true,
    is_oral_tobacco: false,
    is_artisan: true,
    star_rating: 4,
    rating_boost: 0,
    review: "Excellent tobacco with rich, earthy flavors. Perfect for morning smoking. The Virginia leaf provides sweetness while the burley adds body.",
    user_id: 'user1',
    status_id: 1,
    spec_junction_tasting_notes: [
      { spec_enum_tasting_notes: { id: 1, name: 'Sweet' } },
      { spec_enum_tasting_notes: { id: 5, name: 'Earthy' } }
    ],
    spec_junction_cures: [
      { spec_enum_cures: { id: 1, name: 'Air Cured' } }
    ],
    spec_junction_tobacco_types: [
      { spec_enum_tobacco_types: { id: 2, name: 'Virginia' } },
      { spec_enum_tobacco_types: { id: 3, name: 'Burley' } }
    ]
  },
  {
    id: 2,
    shopify_handle: 'test-tobacco-blend',
    product_type_id: 1,
    product_brand_id: 1,
    grind_id: 2,
    nicotine_level_id: 2,
    moisture_level_id: 2,
    experience_level_id: 2,
    is_fermented: true,
    is_oral_tobacco: false,
    is_artisan: true,
    star_rating: 5,
    rating_boost: 0,
    review: "Fantastic blend! The chocolate and vanilla notes really shine through. Great room note and burns evenly. Highly recommend for evening relaxation.",
    user_id: 'user2',
    status_id: 1,
    spec_junction_tasting_notes: [
      { spec_enum_tasting_notes: { id: 8, name: 'Chocolate' } },
      { spec_enum_tasting_notes: { id: 12, name: 'Vanilla' } },
      { spec_enum_tasting_notes: { id: 1, name: 'Sweet' } }
    ],
    spec_junction_cures: [
      { spec_enum_cures: { id: 1, name: 'Air Cured' } }
    ],
    spec_junction_tobacco_types: [
      { spec_enum_tobacco_types: { id: 2, name: 'Virginia' } },
      { spec_enum_tobacco_types: { id: 4, name: 'Cavendish' } }
    ]
  },
  {
    id: 3,
    shopify_handle: 'test-tobacco-blend',
    product_type_id: 1,
    product_brand_id: 1,
    grind_id: 2,
    nicotine_level_id: 3,
    moisture_level_id: 1,
    experience_level_id: 1,
    is_fermented: false,
    is_oral_tobacco: false,
    is_artisan: true,
    star_rating: 3,
    rating_boost: 0,
    review: "Decent tobacco but a bit harsh for my taste. The spicy notes are prominent. Better after some aging in the tin.",
    user_id: 'user3',
    status_id: 1,
    spec_junction_tasting_notes: [
      { spec_enum_tasting_notes: { id: 15, name: 'Spicy' } },
      { spec_enum_tasting_notes: { id: 20, name: 'Harsh' } }
    ],
    spec_junction_cures: [
      { spec_enum_cures: { id: 2, name: 'Flue Cured' } }
    ],
    spec_junction_tobacco_types: [
      { spec_enum_tobacco_types: { id: 6, name: 'Perique' } },
      { spec_enum_tobacco_types: { id: 2, name: 'Virginia' } }
    ]
  }
]

async function testClaudeAPIService() {
  console.log('🔄 Testing Claude API Service...')
  
  try {
    // Import the service
    const { ClaudeAPIService } = require(path.join(libDir, 'services/claude-api-service.ts'))
    
    const testMessage = {
      role: 'user',
      content: 'Hello! This is a test message. Please respond with "Test successful!"'
    }
    
    const response = await ClaudeAPIService.sendMessage([testMessage])
    
    console.log('✅ Claude API Test Result:')
    console.log('   Response:', response.content[0]?.text?.substring(0, 100) + '...')
    console.log('   Usage:', response.usage)
    
    return true
  } catch (error) {
    console.error('❌ Claude API Test Failed:', error.message)
    return false
  }
}

async function testSynthesisPrompts() {
  console.log('\n🔄 Testing Synthesis Prompts...')
  
  try {
    const { SynthesisPrompts } = require(path.join(libDir, 'utils/synthesis-prompts.ts'))
    
    const systemPrompt = SynthesisPrompts.getSystemPrompt()
    const userPrompt = SynthesisPrompts.getUserPrompt(mockSpecifications)
    
    console.log('✅ Prompt Generation Successful')
    console.log('   System prompt length:', systemPrompt.length)
    console.log('   User prompt length:', userPrompt.length)
    console.log('   Sample system prompt:', systemPrompt.substring(0, 150) + '...')
    console.log('   Sample user prompt:', userPrompt.substring(0, 200) + '...')
    
    return { systemPrompt, userPrompt }
  } catch (error) {
    console.error('❌ Prompt Generation Failed:', error.message)
    return null
  }
}

async function testClaudeSynthesis() {
  console.log('\n🔄 Testing Claude Synthesis Service...')
  
  try {
    const { ClaudeSynthesisService } = require(path.join(libDir, 'services/claude-synthesis-service.ts'))
    
    console.log('   Input specifications count:', mockSpecifications.length)
    console.log('   Processing synthesis...')
    
    const result = await ClaudeSynthesisService.synthesizeSpecifications(mockSpecifications)
    
    console.log('✅ Claude Synthesis Successful!')
    console.log('   Synthesized review length:', result.review.length)
    console.log('   Confidence level:', result.confidence)
    console.log('   Tasting notes:', result.tasting_note_ids.length + ' selected')
    console.log('   Cure types:', result.cure_ids.length + ' selected')
    console.log('   Tobacco types:', result.tobacco_type_ids.length + ' selected')
    console.log('\n📝 Synthesized Review:')
    console.log('   "' + result.review + '"')
    
    return result
  } catch (error) {
    console.error('❌ Claude Synthesis Failed:', error.message)
    if (error.response) {
      console.error('   API Response:', error.response.data)
    }
    return null
  }
}

async function testFullSynthesisPipeline() {
  console.log('\n🔄 Testing Full AI Data Synthesis Pipeline...')
  
  try {
    const { AIDataSynthesisService } = require(path.join(libDir, 'services/ai-data-synthesis-service.ts'))
    
    console.log('   Testing multi-source synthesis...')
    const result = await AIDataSynthesisService.synthesizeSpecifications(mockSpecifications)
    
    console.log('✅ Full Pipeline Successful!')
    console.log('   Result structure:')
    console.log('   - Specification object:', Object.keys(result.specification))
    console.log('   - Junction data:', Object.keys(result.junctionData))
    console.log('   - Review:', result.specification.review.substring(0, 100) + '...')
    console.log('   - Star rating:', result.specification.star_rating)
    
    // Test single source passthrough
    console.log('\n   Testing single-source passthrough...')
    const singleResult = await AIDataSynthesisService.synthesizeSpecifications([mockSpecifications[0]])
    console.log('✅ Single-source test successful')
    console.log('   Passthrough review:', singleResult.specification.review.substring(0, 80) + '...')
    
    return { multiResult: result, singleResult }
  } catch (error) {
    console.error('❌ Full Pipeline Failed:', error.message)
    return null
  }
}

async function runAllTests() {
  console.log('🚀 Starting AI Synthesis Testing Suite')
  console.log('=====================================\n')
  
  const results = {
    claudeAPI: false,
    prompts: false,
    claudeSynthesis: false,
    fullPipeline: false
  }
  
  // Test 1: Claude API
  results.claudeAPI = await testClaudeAPIService()
  
  // Test 2: Prompt Generation
  const promptResult = await testSynthesisPrompts()
  results.prompts = !!promptResult
  
  // Test 3: Claude Synthesis (only if API works)
  if (results.claudeAPI) {
    const synthesisResult = await testClaudeSynthesis()
    results.claudeSynthesis = !!synthesisResult
  } else {
    console.log('\n⏭️  Skipping Claude Synthesis (API test failed)')
  }
  
  // Test 4: Full Pipeline (only if synthesis works)
  if (results.claudeSynthesis) {
    const pipelineResult = await testFullSynthesisPipeline()
    results.fullPipeline = !!pipelineResult
  } else {
    console.log('\n⏭️  Skipping Full Pipeline (synthesis test failed)')
  }
  
  // Summary
  console.log('\n🏁 Test Results Summary')
  console.log('======================')
  console.log(`Claude API Service:     ${results.claudeAPI ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Synthesis Prompts:      ${results.prompts ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Claude Synthesis:       ${results.claudeSynthesis ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Full Pipeline:          ${results.fullPipeline ? '✅ PASS' : '❌ FAIL'}`)
  
  const passCount = Object.values(results).filter(Boolean).length
  console.log(`\nOverall: ${passCount}/4 tests passed`)
  
  if (passCount === 4) {
    console.log('🎉 All tests passed! AI Synthesis is ready.')
  } else {
    console.log('⚠️  Some tests failed. Check error messages above.')
  }
}

// Run if called directly
if (require.main === module) {
  runAllTests()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
}

module.exports = {
  testClaudeAPIService,
  testSynthesisPrompts,
  testClaudeSynthesis,
  testFullSynthesisPipeline,
  runAllTests,
  mockSpecifications
}
