const fs = require('fs');
const path = require('path');

// Debug version to find why api-shopify.md is missing
class DebugDocAnalyzer {
  constructor() {
    this.rootDir = path.resolve(process.cwd(), 'docs');
    this.excludedPaths = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage'
    ];
  }

  findDocuments(dir = this.rootDir) {
    const docs = [];
    
    try {
      const items = fs.readdirSync(dir);
      console.log(`📁 Scanning directory: ${dir}`);
      console.log(`   Found ${items.length} items: ${items.join(', ')}`);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!this.excludedPaths.includes(item)) {
            console.log(`   📁 Recursing into directory: ${item}`);
            docs.push(...this.findDocuments(fullPath));
          } else {
            console.log(`   ⏭️  Skipping excluded directory: ${item}`);
          }
        } else if (item.endsWith('.md')) {
          console.log(`   📄 Found .md file: ${item}`);
          docs.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`❌ Error reading directory ${dir}:`, error.message);
    }
    
    return docs;
  }

  analyzeDocument(filePath) {
    console.log(`\n🔍 Analyzing: ${filePath}`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const stats = fs.statSync(filePath);
      const byteSize = stats.size;
      
      console.log(`   ✅ Successfully read file: ${byteSize} bytes`);
      return { filePath, byteSize, success: true };
    } catch (error) {
      console.error(`   ❌ Error analyzing ${filePath}:`, error.message);
      return null;
    }
  }

  debugScan() {
    console.log('🐛 DEBUG: Document Discovery and Analysis');
    console.log('========================================\n');
    
    console.log('Step 1: Finding all .md files...');
    const documents = this.findDocuments();
    console.log(`\n📊 Total .md files found: ${documents.length}`);
    
    console.log('\nStep 2: Analyzing each file...');
    const results = [];
    const errors = [];
    
    for (const doc of documents) {
      const analysis = this.analyzeDocument(doc);
      if (analysis) {
        results.push(analysis);
      } else {
        errors.push(doc);
      }
    }
    
    console.log('\n📈 RESULTS:');
    console.log(`✅ Successfully analyzed: ${results.length} files`);
    console.log(`❌ Failed to analyze: ${errors.length} files`);
    
    if (errors.length > 0) {
      console.log('\n❌ FILES WITH ERRORS:');
      errors.forEach(file => console.log(`   - ${file}`));
    }
    
    console.log('\n📄 ALL FOUND FILES:');
    results.forEach(result => {
      const relativePath = path.relative(process.cwd(), result.filePath);
      console.log(`   ✅ ${relativePath} (${result.byteSize} bytes)`);
    });
    
    // Check specifically for api-shopify.md
    const apiShopifyFile = documents.find(doc => doc.includes('api-shopify.md'));
    if (apiShopifyFile) {
      console.log(`\n🎯 FOUND api-shopify.md at: ${apiShopifyFile}`);
    } else {
      console.log(`\n❌ api-shopify.md NOT FOUND in document list`);
    }
  }
}

const debugAnalyzer = new DebugDocAnalyzer();
debugAnalyzer.debugScan();
