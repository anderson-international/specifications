const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to recursively find all markdown files
function findMarkdownFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (path.extname(item) === '.md') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to validate graph consistency
function validateGraphConsistency() {
  console.log('🔗 Validating document graph consistency...\n');
  
  const graphPath = path.join(__dirname, '..', 'docs', 'document-graph.json');
  
  if (!fs.existsSync(graphPath)) {
    console.log('❌ Graph file not found: docs/document-graph.json');
    return false;
  }
  
  const graph = JSON.parse(fs.readFileSync(graphPath));
  let hasErrors = false;
  
  // Validate all node paths exist
  console.log('📄 Validating node file paths...');
  for (const node of graph.nodes) {
    const fullPath = path.join(__dirname, '..', 'docs', node.path);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Graph node references missing file: ${node.path}`);
      hasErrors = true;
    } else {
      console.log(`✅ ${node.path}`);
    }
  }
  
  // Validate all edges reference valid nodes
  console.log('\n🔗 Validating edge relationships...');
  const nodeIds = new Set(graph.nodes.map(n => n.id));
  
  for (const edge of graph.edges) {
    const sourceExists = nodeIds.has(edge.source);
    const targetExists = nodeIds.has(edge.target);
    
    if (!sourceExists || !targetExists) {
      console.log(`❌ Invalid edge: ${edge.source} -> ${edge.target}`);
      if (!sourceExists) console.log(`   Source node "${edge.source}" does not exist`);
      if (!targetExists) console.log(`   Target node "${edge.target}" does not exist`);
      hasErrors = true;
    } else {
      console.log(`✅ ${edge.source} -> ${edge.target} (${edge.relationship})`);
    }
  }
  
  // Validate workflow integration references
  console.log('\n⚙️ Validating workflow integrations...');
  for (const workflow of graph.workflowIntegration) {
    for (const docId of workflow.documents) {
      if (!nodeIds.has(docId)) {
        console.log(`❌ Workflow "${workflow.workflow}" references invalid document: ${docId}`);
        hasErrors = true;
      } else {
        console.log(`✅ ${workflow.workflow}: ${docId}`);
      }
    }
  }
  
  if (hasErrors) {
    console.log('\n❌ Graph consistency validation FAILED');
    return false;
  } else {
    console.log('\n✅ Graph consistency validation PASSED');
    return true;
  }
}

// Main validation function
function validateLinks() {
  console.log('🔍 Finding markdown files in docs directory...');
  
  const docsDir = path.join(__dirname, '..', 'docs');
  const markdownFiles = findMarkdownFiles(docsDir);
  
  console.log(`📄 Found ${markdownFiles.length} markdown files`);
  console.log('🔗 Validating links...\n');
  
  let totalErrors = 0;
  let totalFiles = 0;
  let filesWithErrors = [];
  
  for (const file of markdownFiles) {
    totalFiles++;
    const relativePath = path.relative(process.cwd(), file);
    console.log(`Checking: ${relativePath}\n`);
    
    try {
      // Run markdown-link-check and capture output
      const output = execSync(`npx markdown-link-check "${file}" --config .mlc-config.json`, {
        encoding: 'utf8',
        cwd: process.cwd()
      });
      
      // Display the output
      console.log(output);
      
      // Check if the output contains failed link indicators
      const hasFailedLinks = output.includes('[✖]');
      
      if (hasFailedLinks) {
        totalErrors++;
        filesWithErrors.push(relativePath);
        console.log(`❌ ${relativePath} - Contains broken links\n`);
      } else {
        console.log(`✅ ${relativePath} - All links valid\n`);
      }
      
    } catch (error) {
      // This catches actual execution errors, not link validation errors
      totalErrors++;
      filesWithErrors.push(relativePath);
      console.log(`❌ ${relativePath} - Script execution error: ${error.message}\n`);
    }
  }
  
  // Validate graph consistency
  const graphValidationResult = validateGraphConsistency();
  if (!graphValidationResult) {
    totalErrors++;
  }
  
  // Summary report
  console.log('='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files checked: ${totalFiles}`);
  console.log(`Files with errors: ${totalErrors}`);
  console.log(`Files with valid links: ${totalFiles - totalErrors}`);
  
  if (totalErrors > 0) {
    console.log('\n❌ Files with broken links:');
    filesWithErrors.forEach(file => console.log(`   - ${file}`));
    console.log('\n❌ Validation FAILED - Please fix the broken links above');
    process.exit(1);
  } else {
    console.log('\n✅ All links are valid!');
  }
}

// Run validation
validateLinks();
