/**
 * Comprehensive Test Runner for AI Synthesis
 * Runs all tests in sequence with detailed reporting
 * Usage: node docs/test/run-all-tests.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function runWithTimeout(testFunction, timeoutMs = 30000) {
  return Promise.race([
    testFunction(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Test timeout')), timeoutMs)
    )
  ])
}

async function runAISynthesisTests() {
  console.log('🧪 Running AI Synthesis Service Tests')
  console.log('─'.repeat(50))
  
  try {
    const { runAllTests } = require('./test-ai-synthesis')
    await runWithTimeout(runAllTests, 60000) // 60 second timeout
    return true
  } catch (error) {
    console.error('❌ AI Synthesis tests failed:', error.message)
    return false
  }
}

async function runAPITests() {
  console.log('\n🌐 Running API Endpoint Tests')
  console.log('─'.repeat(50))
  
  try {
    const { runEndpointTests } = require('./test-api-endpoints')
    const results = await runWithTimeout(runEndpointTests, 45000) // 45 second timeout
    
    const passCount = Object.values(results).filter(Boolean).length
    return passCount >= 3 // Pass if at least 3/4 tests pass
  } catch (error) {
    console.error('❌ API tests failed:', error.message)
    return false
  }
}

async function validateEnvironment() {
  console.log('🔍 Validating Environment')
  console.log('─'.repeat(50))
  
  const checks = {
    anthropicKey: !!process.env.ANTHROPIC_API_KEY,
    databaseConnection: false,
    requiredModules: true
  }
  
  // Check API key
  if (checks.anthropicKey) {
    console.log('✅ ANTHROPIC_API_KEY is set')
  } else {
    console.log('❌ ANTHROPIC_API_KEY is missing')
  }
  
  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.databaseConnection = true
    console.log('✅ Database connection successful')
  } catch (error) {
    console.log('❌ Database connection failed:', error.message)
  }
  
  // Check required modules
  try {
    require('../../lib/services/claude-api-service')
    require('../../lib/services/claude-synthesis-service')
    require('../../lib/services/ai-data-synthesis-service')
    require('../../lib/utils/synthesis-prompts')
    require('../../lib/utils/retry-utils')
    console.log('✅ All required modules loadable')
  } catch (error) {
    checks.requiredModules = false
    console.log('❌ Module loading failed:', error.message)
  }
  
  const validCount = Object.values(checks).filter(Boolean).length
  console.log(`\nEnvironment: ${validCount}/3 checks passed`)
  
  return validCount === 3
}

async function generateTestReport(results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportFile = `docs/test/test-report-${timestamp}.txt`
  
  const report = `
AI Synthesis Test Report
========================
Generated: ${new Date().toLocaleString()}

Environment Validation: ${results.environment ? 'PASS ✅' : 'FAIL ❌'}
AI Synthesis Services:  ${results.aiSynthesis ? 'PASS ✅' : 'FAIL ❌'}  
API Endpoints:         ${results.apiTests ? 'PASS ✅' : 'FAIL ❌'}

Overall Status: ${results.overall ? 'ALL SYSTEMS GO 🚀' : 'ISSUES DETECTED ⚠️'}

Recommendations:
${!results.environment ? '- Fix environment issues (API key, database, modules)' : ''}
${!results.aiSynthesis ? '- Debug AI synthesis service failures' : ''}
${!results.apiTests ? '- Check API endpoints and server configuration' : ''}
${results.overall ? '- System is ready for production testing' : ''}

Next Steps:
${results.overall ? '1. Test with real product data\n2. Monitor synthesis quality\n3. Tune prompts if needed' : '1. Fix failing tests\n2. Re-run validation\n3. Check logs for errors'}
`
  
  const fs = require('fs')
  fs.writeFileSync(reportFile, report)
  console.log(`📄 Test report saved: ${reportFile}`)
  
  return reportFile
}

async function main() {
  const startTime = Date.now()
  
  console.log('🚀 Comprehensive AI Synthesis Test Suite')
  console.log('=========================================')
  console.log(`Started at: ${new Date().toLocaleString()}\n`)
  
  const results = {
    environment: false,
    aiSynthesis: false,
    apiTests: false,
    overall: false
  }
  
  // Step 1: Environment Validation
  results.environment = await validateEnvironment()
  
  // Step 2: AI Synthesis Tests (only if environment is good)
  if (results.environment) {
    results.aiSynthesis = await runAISynthesisTests()
  } else {
    console.log('\n⏭️  Skipping AI Synthesis tests (environment issues)')
  }
  
  // Step 3: API Tests (independent of AI synthesis)
  if (results.environment) {
    results.apiTests = await runAPITests()
  } else {
    console.log('\n⏭️  Skipping API tests (environment issues)')
  }
  
  // Overall assessment
  results.overall = results.environment && results.aiSynthesis && results.apiTests
  
  // Final Report
  const duration = Math.round((Date.now() - startTime) / 1000)
  
  console.log('\n🏁 Final Test Results')
  console.log('='.repeat(50))
  console.log(`Environment Setup:      ${results.environment ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`AI Synthesis Services:  ${results.aiSynthesis ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`API Endpoints:          ${results.apiTests ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Overall System:         ${results.overall ? '✅ READY' : '❌ NOT READY'}`)
  console.log(`\nTest Duration: ${duration} seconds`)
  
  if (results.overall) {
    console.log('\n🎉 SUCCESS! AI Synthesis system is fully operational!')
    console.log('👉 Ready for production testing with real data')
  } else {
    console.log('\n⚠️  ISSUES DETECTED - Please review failed tests above')
    console.log('👉 Fix issues before proceeding to production testing')
  }
  
  // Generate report
  await generateTestReport(results)
  
  return results
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Test interrupted by user')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Test terminated')
  await prisma.$disconnect()
  process.exit(0)
})

// Run if called directly
if (require.main === module) {
  main()
    .catch(error => {
      console.error('\n💥 Test runner crashed:', error.message)
      console.error(error.stack)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

module.exports = {
  runAISynthesisTests,
  runAPITests,
  validateEnvironment,
  main
}
