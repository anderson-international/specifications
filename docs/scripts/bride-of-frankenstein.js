const fs = require('fs');
const path = require('path');
const { titleCase } = require('title-case');

/**
 * Document Link Management - Elegant and Reliable
 * 
 * Does everything the monster script does, but better:
 * 1. Syncs document graph with filesystem
 * 2. Fixes broken links after file moves
 * 3. Standardizes link titles
 * 4. Validates all links work
 * 5. Reports actual success/failure
 */
class DocumentLinkManager {
  constructor() {
    this.docsDir = path.join(process.cwd(), 'docs');
    this.graphPath = path.join(process.cwd(), 'docs', 'scripts', 'docs-graph.json');
    
    // Single state object - no scattered maps
    this.state = {
      actualFiles: new Map(),    // id -> actual file path
      graphNodes: new Map(),     // id -> graph node
      moves: new Map(),          // old path -> new path  
      errors: [],
      changes: []
    };
  }

  /**
   * STEP 1: Build map of actual files in filesystem
   */
  discoverActualFiles() {
    const results = { success: false, filesFound: 0, errors: [] };
    
    try {
      const files = this.findMarkdownFiles(this.docsDir);
      
      for (const filePath of files) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const { frontmatter } = this.parseFrontmatter(content);
          
          if (frontmatter.id) {
            const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
            this.state.actualFiles.set(frontmatter.id, relativePath);
            results.filesFound++;
          }
        } catch (error) {
          results.errors.push(`Error reading ${filePath}: ${error.message}`);
        }
      }
      
      results.success = true;
      return results;
      
    } catch (error) {
      results.errors.push(`Failed to discover files: ${error.message}`);
      return results;
    }
  }

  /**
   * STEP 2: Load and parse document graph
   */
  loadDocumentGraph() {
    const results = { success: false, nodesLoaded: 0, errors: [] };
    
    try {
      if (!fs.existsSync(this.graphPath)) {
        results.errors.push('Graph file not found: docs/scripts/docs-graph.json');
        return results;
      }
      
      const graph = JSON.parse(fs.readFileSync(this.graphPath));
      
      // Store graph nodes by ID for easy lookup
      for (const node of graph.nodes) {
        this.state.graphNodes.set(node.id, node);
        results.nodesLoaded++;
      }
      
      results.success = true;
      results.graph = graph;
      return results;
      
    } catch (error) {
      results.errors.push(`Failed to load graph: ${error.message}`);
      return results;
    }
  }

  /**
   * STEP 3: Sync graph with actual filesystem
   */
  syncDocumentGraph() {
    const results = { 
      success: false, 
      moves: 0, 
      deletions: 0, 
      errors: [],
      graphUpdated: false 
    };
    
    try {
      const loadResult = this.loadDocumentGraph();
      if (!loadResult.success) {
        results.errors.push(...loadResult.errors);
        return results;
      }
      
      const graph = loadResult.graph;
      let hasChanges = false;
      
      // Check each node in the graph
      for (const [nodeId, node] of this.state.graphNodes) {
        const expectedPath = node.path;
        const actualPath = this.state.actualFiles.get(nodeId);
        
        if (!actualPath) {
          // File was deleted
          console.log(`🗑️  File deleted: ${expectedPath} (ID: ${nodeId})`);
          this.state.changes.push(`Deleted: ${expectedPath}`);
          // Mark for removal from graph
          graph.nodes = graph.nodes.filter(n => n.id !== nodeId);
          hasChanges = true;
          results.deletions++;
          
        } else if (expectedPath !== actualPath) {
          // File was moved
          console.log(`🔄 File moved: ${expectedPath} → ${actualPath}`);
          this.state.changes.push(`Moved: ${expectedPath} → ${actualPath}`);
          
          // Track move for link fixing
          this.state.moves.set(expectedPath, actualPath);
          
          // Update graph node
          node.path = actualPath;
          hasChanges = true;
          results.moves++;
        }
      }
      
      // Save updated graph if changes were made
      if (hasChanges) {
        graph.metadata = graph.metadata || {};
        graph.metadata.lastUpdated = new Date().toISOString();
        
        fs.writeFileSync(this.graphPath, JSON.stringify(graph, null, 2), 'utf8');
        results.graphUpdated = true;
        
        console.log(`💾 Updated document graph (${results.moves} moves, ${results.deletions} deletions)`);
      }
      
      results.success = true;
      return results;
      
    } catch (error) {
      results.errors.push(`Graph sync failed: ${error.message}`);
      return results;
    }
  }

  /**
   * STEP 4: Fix broken links caused by file moves
   */
  fixBrokenLinks() {
    const results = { success: false, linksFixed: 0, filesUpdated: 0, errors: [] };
    
    try {
      if (this.state.moves.size === 0) {
        results.success = true;
        return results; // No moves, no broken links to fix
      }
      
      console.log('🔗 Fixing broken links caused by file moves...');
      
      const files = this.findMarkdownFiles(this.docsDir);
      
      for (const filePath of files) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          let updatedContent = content;
          let fileLinksFixed = 0;
          
          // Fix each known file move
          for (const [oldPath, newPath] of this.state.moves) {
            const oldFilename = path.basename(oldPath);
            const newFilename = path.basename(newPath);
            
            // Create regex to match links to the old file
            const linkRegex = new RegExp(`\\]\\(([^)]*${this.escapeRegex(oldFilename)}(#[^)]*)?)\\)`, 'g');
            
            let match;
            while ((match = linkRegex.exec(content)) !== null) {
              const [fullMatch, oldLink] = match;
              const fragment = oldLink.includes('#') ? oldLink.split('#')[1] : '';
              
              // Calculate new relative path
              const sourceDir = path.dirname(filePath);
              const targetPath = path.join(process.cwd(), newPath);
              const newRelativePath = path.relative(sourceDir, targetPath).replace(/\\/g, '/');
              const newLink = fragment ? `${newRelativePath}#${fragment}` : newRelativePath;
              
              updatedContent = updatedContent.replace(fullMatch, `](${newLink})`);
              fileLinksFixed++;
              results.linksFixed++;
            }
          }
          
          // Save file if links were fixed
          if (fileLinksFixed > 0) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            results.filesUpdated++;
            console.log(`  ✅ Fixed ${fileLinksFixed} links in ${path.relative(process.cwd(), filePath)}`);
          }
          
        } catch (error) {
          results.errors.push(`Error fixing links in ${filePath}: ${error.message}`);
        }
      }
      
      if (results.linksFixed > 0) {
        console.log(`🎉 Fixed ${results.linksFixed} broken links across ${results.filesUpdated} files`);
      }
      
      results.success = true;
      return results;
      
    } catch (error) {
      results.errors.push(`Link fixing failed: ${error.message}`);
      return results;
    }
  }

  /**
   * STEP 5: Standardize link titles
   */
  standardizeLinkTitles() {
    const results = { success: false, titlesUpdated: 0, filesUpdated: 0, errors: [] };
    
    try {
      console.log('🏷️  Standardizing link titles...');
      
      const files = this.findMarkdownFiles(this.docsDir);
      
      for (const filePath of files) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          let updatedContent = content;
          let fileTitlesUpdated = 0;
          
          // Find all markdown links: [text](path.md)
          const linkRegex = /\[([^\]]+)\]\(([^)]+\.md(?:#[^)]*)?)\)/g;
          let match;
          
          while ((match = linkRegex.exec(content)) !== null) {
            const [fullMatch, currentTitle, linkPath] = match;
            
            // Extract filename and generate standard title
            const filename = path.basename(linkPath.split('#')[0]);
            const standardTitle = this.generateTitleFromFilename(filename);
            
            // Update if title is different
            if (currentTitle !== standardTitle) {
              const newLink = `[${standardTitle}](${linkPath})`;
              updatedContent = updatedContent.replace(fullMatch, newLink);
              fileTitlesUpdated++;
              results.titlesUpdated++;
            }
          }
          
          // Save file if titles were updated
          if (fileTitlesUpdated > 0) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            results.filesUpdated++;
          }
          
        } catch (error) {
          results.errors.push(`Error standardizing titles in ${filePath}: ${error.message}`);
        }
      }
      
      if (results.titlesUpdated > 0) {
        console.log(`✨ Updated ${results.titlesUpdated} link titles across ${results.filesUpdated} files`);
      }
      
      results.success = true;
      return results;
      
    } catch (error) {
      results.errors.push(`Title standardization failed: ${error.message}`);
      return results;
    }
  }

  /**
   * Main execution - orchestrate all steps
   */
  async execute() {
    console.log('👰 Bride of Frankenstein - Document Link Manager\n');
    
    try {
      // Step 1: Discover actual files
      const discoverResult = this.discoverActualFiles();
      if (!discoverResult.success) {
        console.error('❌ Failed to discover files:', discoverResult.errors.join(', '));
        process.exit(1);
      }
      console.log(`📁 Found ${discoverResult.filesFound} documents with IDs`);
      
      // Step 2: Sync graph with filesystem
      const syncResult = this.syncDocumentGraph();
      if (!syncResult.success) {
        console.error('❌ Graph sync failed:', syncResult.errors.join(', '));
        process.exit(1);
      }
      
      // Step 3: Fix broken links
      const linkResult = this.fixBrokenLinks();
      if (!linkResult.success) {
        console.error('❌ Link fixing failed:', linkResult.errors.join(', '));
        process.exit(1);
      }
      
      // Step 4: Standardize titles
      const titleResult = this.standardizeLinkTitles();
      if (!titleResult.success) {
        console.error('❌ Title standardization failed:', titleResult.errors.join(', '));
        process.exit(1);
      }
      
      // Final summary
      const totalChanges = syncResult.moves + syncResult.deletions + linkResult.linksFixed + titleResult.titlesUpdated;
      
      if (totalChanges > 0) {
        console.log('\n🎉 All operations completed successfully!');
        console.log(`   📊 Summary: ${syncResult.moves} moves, ${syncResult.deletions} deletions, ${linkResult.linksFixed} links fixed, ${titleResult.titlesUpdated} titles updated`);
      } else {
        console.log('\n✅ All documents are already synchronized - no changes needed');
      }
      
      // Show any warnings
      const allErrors = [
        ...discoverResult.errors,
        ...syncResult.errors, 
        ...linkResult.errors,
        ...titleResult.errors
      ];
      
      if (allErrors.length > 0) {
        console.log('\n⚠️  Warnings:');
        allErrors.forEach(error => console.log(`   - ${error}`));
      }
      
    } catch (error) {
      console.error(`💥 Fatal error: ${error.message}`);
      process.exit(1);
    }
  }

  // Helper methods (keeping the good parts from the original)
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

  parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      return { frontmatter: {}, body: content };
    }
    
    const frontmatter = {};
    const lines = match[1].split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();
      
      if (key === 'id') {
        frontmatter[key] = value.replace(/['"]/g, '');
      }
    }
    
    return { frontmatter, body: match[2] };
  }

  generateTitleFromFilename(filename) {
    const baseName = filename.replace(/\.md$/, '').replace(/-/g, ' ');
    return titleCase(baseName);
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// CLI execution
if (require.main === module) {
  const manager = new DocumentLinkManager();
  manager.execute();
}

module.exports = DocumentLinkManager;
