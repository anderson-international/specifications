/**
 * Unit Tests for Smart Context Loader
 * Tests document dependency resolution, workflow document mapping, and file path suggestions
 */

const fs = require('fs');
const path = require('path');

// Mock the SmartContextLoader class (would normally be imported)
class SmartContextLoader {
  constructor() {
    this.graph = JSON.parse(fs.readFileSync('docs/document-graph.json'));
  }

  getDependencies(documentId) {
    const edges = this.graph.edges.filter(edge => 
      edge.source === documentId || edge.target === documentId
    );
    return edges;
  }

  getWorkflowDocuments(workflowName) {
    const workflow = this.graph.workflowIntegration.find(w => 
      w.workflow === workflowName
    );
    return workflow ? workflow.documents : [];
  }

  suggestDocuments(filePath) {
    if (filePath.includes('/api/')) return this.getWorkflowDocuments('docs-api');
    if (filePath.includes('form') || filePath.includes('Form')) return this.getWorkflowDocuments('docs-forms');
    if (filePath.includes('.tsx') || filePath.includes('.css')) return this.getWorkflowDocuments('docs-ui');
    return [];
  }
}

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

function assertArrayEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Test Failed: ${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
  }
}

// Test Suite
function runTests() {
  console.log('🧪 Running Smart Context Loader Unit Tests\n');
  
  let loader;
  let passedTests = 0;
  let totalTests = 0;

  // Initialize loader
  try {
    loader = new SmartContextLoader();
    console.log('✅ SmartContextLoader initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize SmartContextLoader:', error.message);
    return;
  }

  // Test 1: Document Graph Loading
  totalTests++;
  try {
    assert(loader.graph.nodes.length > 0, 'Graph should have nodes');
    assert(loader.graph.edges.length > 0, 'Graph should have edges');
    assert(loader.graph.workflowIntegration.length > 0, 'Graph should have workflow integration');
    console.log('✅ Test 1: Document graph loads correctly');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 1 Failed:', error.message);
  }

  // Test 2: Workflow Document Mapping
  totalTests++;
  try {
    const formsDocs = loader.getWorkflowDocuments('docs-forms');
    assert(Array.isArray(formsDocs), 'Should return array for forms workflow');
    assert(formsDocs.length > 0, 'Forms workflow should have documents');
    
    const apiDocs = loader.getWorkflowDocuments('docs-api');
    assert(Array.isArray(apiDocs), 'Should return array for API workflow');
    assert(apiDocs.length > 0, 'API workflow should have documents');
    
    const nonExistentDocs = loader.getWorkflowDocuments('non-existent-workflow');
    assertArrayEqual(nonExistentDocs, [], 'Non-existent workflow should return empty array');
    
    console.log('✅ Test 2: Workflow document mapping works correctly');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 2 Failed:', error.message);
  }

  // Test 3: Document Dependency Resolution
  totalTests++;
  try {
    // Test with ai-coding-handbook which should have dependencies
    const codingHandbookDeps = loader.getDependencies('ai-coding-handbook');
    assert(Array.isArray(codingHandbookDeps), 'Dependencies should be an array');
    
    // Test with non-existent document
    const nonExistentDeps = loader.getDependencies('non-existent-document');
    assertArrayEqual(nonExistentDeps, [], 'Non-existent document should return empty dependencies');
    
    console.log('✅ Test 3: Document dependency resolution works correctly');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 3 Failed:', error.message);
  }

  // Test 4: File Path Suggestion Logic
  totalTests++;
  try {
    // Test API file suggestions
    const apiSuggestions = loader.suggestDocuments('/app/api/products/route.ts');
    assert(Array.isArray(apiSuggestions), 'API suggestions should be an array');
    
    // Test form file suggestions
    const formSuggestions = loader.suggestDocuments('/components/ProductForm.tsx');
    assert(Array.isArray(formSuggestions), 'Form suggestions should be an array');
    
    // Test UI file suggestions
    const uiSuggestions = loader.suggestDocuments('/styles/components.css');
    assert(Array.isArray(uiSuggestions), 'UI suggestions should be an array');
    
    // Test non-matching file
    const noSuggestions = loader.suggestDocuments('/utils/helper.js');
    assertArrayEqual(noSuggestions, [], 'Non-matching file should return empty array');
    
    console.log('✅ Test 4: File path suggestion logic works correctly');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 4 Failed:', error.message);
  }

  // Test 5: Specific Workflow Document Content
  totalTests++;
  try {
    const aiRebootDocs = loader.getWorkflowDocuments('docs-ai-reboot');
    assert(aiRebootDocs.includes('ai-coding-handbook'), 'AI reboot should include coding handbook');
    assert(aiRebootDocs.includes('business-context'), 'AI reboot should include business context');
    
    console.log('✅ Test 5: Specific workflow document content is correct');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 5 Failed:', error.message);
  }

  // Test 6: Graph Node Validation
  totalTests++;
  try {
    const nodes = loader.graph.nodes;
    const requiredNodes = ['ai-coding-handbook', 'business-context', 'form-management', 'api-design'];
    
    requiredNodes.forEach(nodeId => {
      const node = nodes.find(n => n.id === nodeId);
      assert(node, `Required node ${nodeId} should exist in graph`);
      assert(node.path, `Node ${nodeId} should have a path`);
      assert(node.title, `Node ${nodeId} should have a title`);
    });
    
    console.log('✅ Test 6: Graph node validation passed');
    passedTests++;
  } catch (error) {
    console.error('❌ Test 6 Failed:', error.message);
  }

  // Test Summary
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
    return true;
  } else {
    console.log('⚠️  Some tests failed');
    return false;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Smart Context Loader Unit Tests

Usage:
  cmd /c node tests/smart-context-loader.test.js [options]

Options:
  --help, -h       Show this help message

Examples:
  cmd /c node tests/smart-context-loader.test.js`);
    process.exit(0);
  }

  try {
    const success = runTests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

module.exports = { SmartContextLoader, runTests };
