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
