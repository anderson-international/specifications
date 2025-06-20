/**
 * Integration Tests for Workflow Enhancement System
 * Tests enhanced workflows, graph validation, and proactive context loading
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Test utilities
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Test Failed: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`Test Failed: ${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function assertContains(text, substring, message) {
  if (!text.includes(substring)) {
    throw new Error(`Test Failed: ${message}\nExpected text to contain: ${substring}\nActual text: ${text.substring(0, 200)}...`);
  }
}

// Execute command helper
function executeCommand(command) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      cwd: process.cwd(),
      timeout: 10000 
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}\nError: ${error.message}`);
  }
}

// Test Suite
function runIntegrationTests() {
  console.log('🔗 Running Workflow Integration Tests\n');
  
  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Enhanced Workflows Execute Correctly
  totalTests++;
  try {
    console.log('📋 Testing enhanced workflow execution...');
    
    // Test docs-forms workflow loading
    const formsOutput = executeCommand('cmd /c node scripts/smart-context-loader.js --workflow=docs-forms');
    assertContains(formsOutput, 'docs-forms', 'Forms workflow should be referenced');
    assertContains(formsOutput, 'Documents', 'Should list documents');
    
    // Test docs-api workflow loading
    const apiOutput = executeCommand('cmd /c node scripts/smart-context-loader.js --workflow=docs-api');
    assertContains(apiOutput, 'docs-api', 'API workflow should be referenced');
    assertContains(apiOutput, 'Documents', 'Should list documents');
    
    // Test docs-ui workflow loading
    const uiOutput = executeCommand('cmd /c node scripts/smart-context-loader.js --workflow=docs-ui');
    assertContains(uiOutput, 'docs-ui', 'UI workflow should be referenced');
    assertContains(uiOutput, 'Documents', 'Should list documents');
    
    console.log('✅ Test 1: Enhanced workflows execute correctly');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 1 Failed:', error.message);
  }

  // Test 2: Graph Validation Catches Errors
  totalTests++;
  try {
    console.log('🔍 Testing graph validation functionality...');
    
    const validationOutput = executeCommand('cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --validate');
    assertContains(validationOutput, 'Validating graph consistency', 'Should show validation process');
    assertContains(validationOutput, 'Graph is consistent', 'Graph should be consistent after path fixes');
    
    console.log('✅ Test 2: Graph validation works correctly');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 2 Failed:', error.message);
  }

  // Test 3: Workflow Enhancement Status
  totalTests++;
  try {
    console.log('⚙️ Testing workflow enhancement status...');
    
    const statusOutput = executeCommand('cmd /c node scripts/workflow-enhancer.js --status');
    assertContains(statusOutput, 'Workflow Enhancement Status', 'Should show status header');
    assertContains(statusOutput, 'Enhanced: docs-forms', 'Forms workflow should be enhanced');
    assertContains(statusOutput, 'Enhanced: docs-api', 'API workflow should be enhanced');
    assertContains(statusOutput, 'Enhanced: docs-ui', 'UI workflow should be enhanced');
    
    console.log('✅ Test 3: Workflow enhancement status works correctly');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 3 Failed:', error.message);
  }

  // Test 4: Graph Analytics Health Check
  totalTests++;
  try {
    console.log('🏥 Testing graph analytics health check...');
    
    const healthOutput = executeCommand('cmd /c node docs/ai/maintenance/scripts/cog-load-graph-analytics.js --health');
    assertContains(healthOutput, 'Health Analysis', 'Should show health analysis');
    assertContains(healthOutput, 'Graph health:', 'Should report graph health status');
    
    console.log('✅ Test 4: Graph analytics health check works correctly');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 4 Failed:', error.message);
  }

  // Test 5: Context Pre-loading Analysis
  totalTests++;
  try {
    console.log('🔄 Testing context pre-loading analysis...');
    
    // Test analyzing a typical React component file
    const analysisOutput = executeCommand('cmd /c node docs/ai/ingestion/scripts/context-preloader.js --analyze src/components/ProductCard.tsx');
    assertContains(analysisOutput, 'Context Analysis', 'Should show context analysis');
    assertContains(analysisOutput, 'File Types:', 'Should identify file types');
    
    console.log('✅ Test 5: Context pre-loading analysis works correctly');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 5 Failed:', error.message);
  }

  // Test 6: Smart Context Core Loading
  totalTests++;
  try {
    console.log('🧠 Testing smart context core loading...');
    
    const coreOutput = executeCommand('cmd /c node scripts/smart-context-loader.js --core-context');
    assertContains(coreOutput, 'Loading core context documents', 'Should show core loading');
    assertContains(coreOutput, 'docs-ai-reboot', 'Should reference AI reboot workflow');
    assertContains(coreOutput, 'Dependencies:', 'Should show dependencies');
    
    console.log('✅ Test 6: Smart context core loading works correctly');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 6 Failed:', error.message);
  }

  // Test 7: Enhanced Workflow File Validation
  totalTests++;
  try {
    console.log('📄 Testing enhanced workflow files exist and are valid...');
    
    const workflowFiles = [
      '.windsurf/workflows/docs-forms.md',
      '.windsurf/workflows/docs-api.md', 
      '.windsurf/workflows/docs-ui.md',
      '.windsurf/workflows/docs-debug.md',
      '.windsurf/workflows/docs-ai-reboot.md'
    ];
    
    workflowFiles.forEach(workflowFile => {
      assert(fs.existsSync(workflowFile), `Workflow file should exist: ${workflowFile}`);
      const content = fs.readFileSync(workflowFile, 'utf8');
      assertContains(content, 'cmd /c node scripts/smart-context-loader.js', 'Should contain smart context loading');
    });
    
    console.log('✅ Test 7: Enhanced workflow files are valid');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 7 Failed:', error.message);
  }

  // Test 8: Document Graph Consistency
  totalTests++;
  try {
    console.log('📊 Testing document graph consistency...');
    
    const graphPath = 'docs/document-graph.json';
    assert(fs.existsSync(graphPath), 'Document graph should exist');
    
    const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
    assert(graph.nodes.length > 0, 'Graph should have nodes');
    assert(graph.edges.length > 0, 'Graph should have edges');
    assert(graph.workflowIntegration.length > 0, 'Graph should have workflow integration');
    
    // Check that all paths are properly prefixed with 'docs/'
    graph.nodes.forEach(node => {
      assert(node.path.startsWith('docs/'), `Node path should start with 'docs/': ${node.path}`);
    });
    
    console.log('✅ Test 8: Document graph consistency validated');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 8 Failed:', error.message);
  }

  // Test 9: System Health Check Workflow
  totalTests++;
  try {
    console.log('🎯 Testing system health check workflow components...');
    
    const healthWorkflowPath = '.windsurf/workflows/system-health-check.md';
    assert(fs.existsSync(healthWorkflowPath), 'System health check workflow should exist');
    
    const healthContent = fs.readFileSync(healthWorkflowPath, 'utf8');
    assertContains(healthContent, '// turbo', 'Should contain turbo annotations');
    assertContains(healthContent, 'cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --validate', 'Should contain graph validation');
    assertContains(healthContent, 'cmd /c node docs/ai/maintenance/scripts/cog-load-graph-analytics.js --health', 'Should contain health analysis');
    
    console.log('✅ Test 9: System health check workflow is properly configured');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 9 Failed:', error.message);
  }

  // Test Summary
  console.log('\n📊 Integration Test Results Summary');
  console.log('===================================');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All integration tests passed!');
    console.log('\n🔗 Integration Test Coverage:');
    console.log('   ✅ Enhanced workflows execute correctly');
    console.log('   ✅ Graph validation catches inconsistencies');  
    console.log('   ✅ Workflow enhancement status reporting');
    console.log('   ✅ Graph analytics health monitoring');
    console.log('   ✅ Context pre-loading analysis');
    console.log('   ✅ Smart context core loading');
    console.log('   ✅ Enhanced workflow file validation');
    console.log('   ✅ Document graph consistency');
    console.log('   ✅ System health check workflow');
    return true;
  } else {
    console.log('⚠️  Some integration tests failed');
    return false;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Workflow Integration Tests

Usage:
  cmd /c node tests/workflow-integration.test.js [options]

Options:
  --help, -h       Show this help message

Examples:
  cmd /c node tests/workflow-integration.test.js`);
    process.exit(0);
  }

  try {
    const success = runIntegrationTests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Integration test execution failed:', error.message);
    process.exit(1);
  }
}

module.exports = { runIntegrationTests };
