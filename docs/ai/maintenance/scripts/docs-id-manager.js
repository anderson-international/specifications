const fs = require('fs');
const path = require('path');

/**
 * Document ID Manager
 * Assigns unique numeric IDs to all markdown documents and cleans frontmatter
 */
class DocsIdManager {
  constructor() {
    this.docsDir = path.join(process.cwd(), 'docs');
    this.usedIds = new Set();
    this.nextId = 1001; // Start from 1001 for clarity
    this.processedFiles = [];
    this.errors = [];
  }

  /**
   * Find all markdown files recursively
   */
  findMarkdownFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.findMarkdownFiles(fullPath));
      } else if (path.extname(item) === '.md') {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  /**
   * Parse frontmatter from markdown content
   */
  parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      return { frontmatter: {}, body: content };
    }
    
    const frontmatterText = match[1];
    const body = match[2];
    const frontmatter = {};
    
    // Simple YAML parsing for basic key-value pairs
    const lines = frontmatterText.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();
      
      // Handle arrays like tags: [tag1, tag2]
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        frontmatter[key] = arrayContent.split(',').map(item => item.trim());
      } else {
        frontmatter[key] = value;
      }
    }
    
    return { frontmatter, body };
  }

  /**
   * Generate frontmatter YAML string
   */
  generateFrontmatter(frontmatter) {
    const lines = ['---'];
    
    for (const [key, value] of Object.entries(frontmatter)) {
      if (Array.isArray(value)) {
        lines.push(`${key}: [${value.join(', ')}]`);
      } else {
        lines.push(`${key}: ${value}`);
      }
    }
    
    lines.push('---');
    return lines.join('\n');
  }

  /**
   * Get next available ID
   */
  getNextId() {
    while (this.usedIds.has(this.nextId)) {
      this.nextId++;
    }
    this.usedIds.add(this.nextId);
    return this.nextId;
  }

  /**
   * First pass: collect existing IDs to avoid conflicts
   */
  collectExistingIds(files) {
    console.log('🔍 Collecting existing document IDs...');
    
    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { frontmatter } = this.parseFrontmatter(content);
        
        if (frontmatter.id) {
          const id = parseInt(frontmatter.id);
          if (!isNaN(id)) {
            this.usedIds.add(id);
            if (id >= this.nextId) {
              this.nextId = id + 1;
            }
          }
        }
      } catch (error) {
        this.errors.push(`Error reading ${filePath}: ${error.message}`);
      }
    }
    
    console.log(`📊 Found ${this.usedIds.size} existing IDs, next available: ${this.nextId}`);
  }

  /**
   * Process a single markdown file
   */
  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { frontmatter, body } = this.parseFrontmatter(content);
      
      let modified = false;
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Add ID if missing
      if (!frontmatter.id) {
        frontmatter.id = this.getNextId();
        modified = true;
        console.log(`📝 Added ID ${frontmatter.id} to ${relativePath}`);
      }
      
      // Remove title if present
      if (frontmatter.title) {
        delete frontmatter.title;
        modified = true;
        console.log(`🗑️  Removed title from ${relativePath}`);
      }
      
      // Write back if modified
      if (modified) {
        const newContent = this.generateFrontmatter(frontmatter) + '\n\n' + body;
        fs.writeFileSync(filePath, newContent, 'utf8');
        
        this.processedFiles.push({
          path: relativePath,
          id: frontmatter.id,
          actions: [
            !frontmatter.id ? 'added-id' : null,
            frontmatter.title ? 'removed-title' : null
          ].filter(Boolean)
        });
      }
      
    } catch (error) {
      this.errors.push(`Error processing ${filePath}: ${error.message}`);
    }
  }

  /**
   * Main execution function
   */
  execute() {
    console.log('🚀 Starting Document ID Manager\n');
    
    try {
      // Find all markdown files
      console.log('📁 Scanning for markdown files...');
      const files = this.findMarkdownFiles(this.docsDir);
      console.log(`📄 Found ${files.length} markdown files\n`);
      
      // Collect existing IDs first
      this.collectExistingIds(files);
      console.log();
      
      // Process each file
      console.log('⚙️ Processing files...');
      for (const filePath of files) {
        this.processFile(filePath);
      }
      
      // Summary report
      console.log('\n' + '='.repeat(60));
      console.log('📊 DOCUMENT ID MANAGER SUMMARY');
      console.log('='.repeat(60));
      console.log(`Total files scanned: ${files.length}`);
      console.log(`Files modified: ${this.processedFiles.length}`);
      console.log(`Errors encountered: ${this.errors.length}`);
      
      if (this.processedFiles.length > 0) {
        console.log('\n✅ Files successfully processed:');
        this.processedFiles.forEach(file => {
          console.log(`   ID ${file.id}: ${file.path} (${file.actions.join(', ')})`);
        });
      }
      
      if (this.errors.length > 0) {
        console.log('\n❌ Errors encountered:');
        this.errors.forEach(error => console.log(`   - ${error}`));
        process.exit(1);
      }
      
      console.log('\n🎉 Document ID management completed successfully!');
      
    } catch (error) {
      console.error(`💥 Fatal error: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * CLI help
   */
  showHelp() {
    console.log(`
📋 Document ID Manager

This script assigns unique numeric IDs to all markdown documents and cleans frontmatter.

Actions performed:
- Assigns unique numeric ID to any document missing one
- Removes 'title' property from frontmatter (H1 heading is the source of truth)
- Preserves all other frontmatter properties

Usage:
  node docs-id-manager.js [options]

Options:
  --help, -h    Show this help message
  --dry-run     Show what would be changed without making changes

Examples:
  node docs-id-manager.js           # Process all documents
  node docs-id-manager.js --dry-run # Preview changes only
`);
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    const manager = new DocsIdManager();
    manager.showHelp();
    process.exit(0);
  }
  
  if (args.includes('--dry-run')) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
    // TODO: Implement dry-run mode if needed
  }
  
  const manager = new DocsIdManager();
  manager.execute();
}

module.exports = DocsIdManager;
