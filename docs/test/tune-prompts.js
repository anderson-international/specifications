/**
 * Prompt Tuning Helper Script
 * Interactive tool for testing and refining AI synthesis prompts
 * Usage: node docs/test/tune-prompts.js
 */

const readline = require('readline')
const { mockSpecifications } = require('./test-ai-synthesis')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function displayCurrentPrompts() {
  console.log('📝 Current Synthesis Prompts')
  console.log('============================\n')
  
  try {
    const { SynthesisPrompts } = require('../../lib/utils/synthesis-prompts')
    
    const systemPrompt = SynthesisPrompts.getSystemPrompt()
    const userPrompt = SynthesisPrompts.getUserPrompt(mockSpecifications.slice(0, 2)) // Show sample
    
    console.log('🤖 SYSTEM PROMPT:')
    console.log('─'.repeat(50))
    console.log(systemPrompt)
    console.log('\n👤 USER PROMPT (sample with 2 specs):')
    console.log('─'.repeat(50))
    console.log(userPrompt)
    console.log('\n')
    
  } catch (error) {
    console.error('❌ Error loading prompts:', error.message)
  }
}

async function testSingleSynthesis(specCount = 3) {
  console.log(`🧪 Testing synthesis with ${specCount} specifications...`)
  
  try {
    const { ClaudeSynthesisService } = require('../../lib/services/claude-synthesis-service')
    
    const testSpecs = mockSpecifications.slice(0, specCount)
    console.log('📊 Input specifications:')
    testSpecs.forEach((spec, i) => {
      console.log(`   ${i + 1}. Rating: ${spec.star_rating}⭐ - "${spec.review.substring(0, 60)}..."`)
    })
    
    console.log('\n⏳ Calling Claude...')
    const startTime = Date.now()
    
    const result = await ClaudeSynthesisService.synthesizeSpecifications(testSpecs)
    
    const duration = Date.now() - startTime
    
    console.log(`✅ Synthesis complete (${duration}ms)`)
    console.log('\n📋 RESULTS:')
    console.log('─'.repeat(60))
    console.log(`🎯 Confidence Level: ${result.confidence}/3`)
    console.log(`⭐ Star Rating: ${result.star_rating}`)
    console.log(`📝 Review Length: ${result.review.length} characters`)
    console.log(`🏷️  Tasting Notes: ${result.tasting_note_ids.length} selected`)
    console.log(`🔥 Cure Types: ${result.cure_ids.length} selected`) 
    console.log(`🌿 Tobacco Types: ${result.tobacco_type_ids.length} selected`)
    
    console.log('\n📖 SYNTHESIZED REVIEW:')
    console.log('─'.repeat(60))
    console.log(`"${result.review}"`)
    console.log('\n')
    
    return result
    
  } catch (error) {
    console.error('❌ Synthesis failed:', error.message)
    if (error.response?.data) {
      console.error('API Error:', JSON.stringify(error.response.data, null, 2))
    }
    return null
  }
}

async function comparePromptVersions() {
  console.log('🔄 Prompt Version Comparison')
  console.log('============================\n')
  
  // Test with different spec combinations
  const testCases = [
    { name: 'Positive Reviews (4-5 stars)', specs: mockSpecifications.filter(s => s.star_rating >= 4) },
    { name: 'Mixed Reviews (3-5 stars)', specs: mockSpecifications },
    { name: 'Two Similar Reviews', specs: mockSpecifications.slice(0, 2) },
    { name: 'Single Specification', specs: mockSpecifications.slice(0, 1) }
  ]
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`)
    console.log('─'.repeat(40))
    
    if (testCase.specs.length === 1) {
      console.log('ℹ️  Single spec - would use passthrough logic')
      continue
    }
    
    const result = await testSingleSynthesis(testCase.specs.length)
    
    if (result) {
      console.log(`✅ Success - Confidence: ${result.confidence}, Rating: ${result.star_rating}⭐`)
    } else {
      console.log('❌ Failed')
    }
    
    await question('Press Enter to continue to next test case...')
  }
}

async function interactivePromptTesting() {
  console.log('🎮 Interactive Prompt Testing Mode')
  console.log('===================================\n')
  
  while (true) {
    console.log('Choose an option:')
    console.log('1. View current prompts')
    console.log('2. Test synthesis (3 specs)')
    console.log('3. Test synthesis (2 specs)')  
    console.log('4. Test synthesis (all specs)')
    console.log('5. Compare different scenarios')
    console.log('6. Exit')
    
    const choice = await question('\nEnter your choice (1-6): ')
    
    switch (choice) {
      case '1':
        await displayCurrentPrompts()
        break
        
      case '2':
        await testSingleSynthesis(3)
        break
        
      case '3':
        await testSingleSynthesis(2)
        break
        
      case '4':
        await testSingleSynthesis(mockSpecifications.length)
        break
        
      case '5':
        await comparePromptVersions()
        break
        
      case '6':
        console.log('👋 Goodbye!')
        return
        
      default:
        console.log('❌ Invalid choice. Please try again.')
    }
    
    console.log('\n' + '='.repeat(50) + '\n')
  }
}

async function runBatchTests() {
  console.log('🔄 Running Batch Prompt Tests')
  console.log('=============================\n')
  
  const results = []
  
  // Test different combinations
  for (let i = 2; i <= Math.min(mockSpecifications.length, 4); i++) {
    console.log(`\n📊 Testing with ${i} specifications`)
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`   Attempt ${attempt}/3...`)
      
      const result = await testSingleSynthesis(i)
      
      if (result) {
        results.push({
          specCount: i,
          attempt,
          confidence: result.confidence,
          rating: result.star_rating,
          reviewLength: result.review.length,
          tastingNotes: result.tasting_note_ids.length,
          success: true
        })
      } else {
        results.push({
          specCount: i,
          attempt,
          success: false
        })
      }
      
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  // Analysis
  console.log('\n📈 Batch Test Analysis')
  console.log('======================')
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`✅ Successful: ${successful.length}`)
  console.log(`❌ Failed: ${failed.length}`)
  console.log(`📊 Success Rate: ${(successful.length / results.length * 100).toFixed(1)}%`)
  
  if (successful.length > 0) {
    const avgConfidence = successful.reduce((sum, r) => sum + r.confidence, 0) / successful.length
    const avgRating = successful.reduce((sum, r) => sum + r.rating, 0) / successful.length
    const avgReviewLength = successful.reduce((sum, r) => sum + r.reviewLength, 0) / successful.length
    
    console.log(`🎯 Average Confidence: ${avgConfidence.toFixed(1)}/3`)
    console.log(`⭐ Average Rating: ${avgRating.toFixed(1)}/5`)
    console.log(`📝 Average Review Length: ${Math.round(avgReviewLength)} chars`)
  }
}

async function main() {
  console.log('🔧 AI Prompt Tuning Tool')
  console.log('========================\n')
  
  const mode = await question('Choose mode:\n1. Interactive testing\n2. Batch testing\n\nEnter choice (1 or 2): ')
  
  if (mode === '1') {
    await interactivePromptTesting()
  } else if (mode === '2') {
    await runBatchTests()
  } else {
    console.log('❌ Invalid choice')
  }
  
  rl.close()
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  displayCurrentPrompts,
  testSingleSynthesis,
  comparePromptVersions,
  runBatchTests
}
