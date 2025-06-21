const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Document Link Fix Tool
 * Automatically finds and repairs broken links while ensuring graph consistency
 */
class DocsLinkFixer {
  constructor() {
    this.docsDir = path.join(process.cwd(), 'docs');
    this.documentMap = new Map(); // ID -> file path
    this.pathToIdMap = new Map(); // file path -> ID
    this.processedFiles = [];
    this.errors = [];
    this.fileMoves = new Map(); // old path -> new path
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
      let value = trimmed.substring(colonIndex + 1).trim();
      
      // Handle arrays like tags: [tag1, tag2]
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        frontmatter[key] = arrayContent.split(',').map(item => item.trim());
      } else {
        // Handle quoted values
        if ((value.startsWith('"') && value.endsWith('"')) || 
           (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        // Handle numeric values
        if (!isNaN(value)) {
          frontmatter[key] = parseInt(value);
        } else {
          frontmatter[key] = value;
        }
      }
    }
    
    return { frontmatter, body };
  }

  /**
   * Build document ID-to-path mapping from all markdown files
   */
  buildDocumentMap() {
    console.log('🗺️ Building document ID-to-path mapping...');
    
    const files = this.findMarkdownFiles(this.docsDir);
    let mappedCount = 0;
    
    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { frontmatter } = this.parseFrontmatter(content);
        
        if (frontmatter.id) {
          const id = parseInt(frontmatter.id);
          if (!isNaN(id)) {
            const relativePath = path.relative(process.cwd(), filePath);
            // Normalize path separators for consistent lookup
            const normalizedPath = relativePath.replace(/\\/g, '/');
            this.documentMap.set(id, normalizedPath);
            this.pathToIdMap.set(normalizedPath, id);
            mappedCount++;
          }
        }
      } catch (error) {
        this.errors.push(`Error reading ${filePath}: ${error.message}`);
      }
    }
    
    console.log(`📊 Mapped ${mappedCount} documents by ID`);
    
    if (this.documentMap.size === 0) {
      throw new Error('No documents with IDs found. Run docs-id-manager.js first.');
    }
  }

  /**
   * Resolve relative path from source file to target ID
   */
  resolveIdLink(sourceFilePath, targetId) {
    const targetPath = this.documentMap.get(parseInt(targetId));
    if (!targetPath) {
      return null; // ID not found
    }
    
    const sourceDir = path.dirname(sourceFilePath);
    const relativePath = path.relative(sourceDir, targetPath);
    
    // Normalize path separators for cross-platform compatibility
    return relativePath.replace(/\\/g, '/');
  }

  /**
   * Auto-fix ID-based links by converting IDs to proper relative paths
   */
  autoFixIdLinks(content, sourceFilePath) {
    let modifiedContent = content;
    let fixCount = 0;
    
    // Pattern to match ID-based links: [text](1234) or [text](@1234)
    const idLinkPattern = /\[([^\]]+)\]\(@?(\d+)\)/g;
    const matches = [...content.matchAll(idLinkPattern)];
    
    for (const match of matches) {
      const fullMatch = match[0];
      const linkText = match[1];
      const targetId = match[2];
      
      // Resolve ID to relative path
      const relativePath = this.resolveIdLink(sourceFilePath, targetId);
      
      if (relativePath) {
        // Replace with proper relative path
        const newLink = `[${linkText}](${relativePath})`;
        modifiedContent = modifiedContent.replace(fullMatch, newLink);
        fixCount++;
      } else {
        console.warn(`⚠️ Unresolved ID ${targetId} in ${path.relative(process.cwd(), sourceFilePath)}`);
      }
    }
    
    return { content: modifiedContent, fixCount };
  }

  /**
   * Process a single file for link fixing
   */
  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      
      // Fix ID-based links by resolving to proper relative paths
      const { content: fixedContent, fixCount } = this.autoFixIdLinks(content, filePath);
      
      // Write back if changes were made
      if (fixCount > 0) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`🔧 Fixed ${fixCount} ID-based links in ${relativePath}`);
        
        this.processedFiles.push({
          path: relativePath,
          changes: fixCount
        });
      }
      
    } catch (error) {
      this.errors.push(`Error processing ${filePath}: ${error.message}`);
    }
  }

  /**
   * Validate links using markdown-link-check
   */
  validateLinks() {
    console.log('🔗 Validating links...\n');
    
    const files = this.findMarkdownFiles(this.docsDir);
    let totalErrors = 0;
    const filesWithErrors = [];
    
    for (const file of files) {
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
    
    return { totalErrors, filesWithErrors, totalFiles: files.length };
  }

  /**
   * Fix broken relative path links caused by file moves
   */
  fixBrokenRelativeLinks() {
    if (this.fileMoves.size === 0) {
      return; // No file moves to process
    }

    console.log('🔗 Fixing broken relative path links...\n');
    
    const files = this.findMarkdownFiles(this.docsDir);
    let totalFixedLinks = 0;
    let totalFixedFiles = 0;
    
    for (const filePath of files) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        let modifiedContent = content;
        let fileFixCount = 0;
        
        // Check if this file itself was moved
        const currentRelativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
        let wasThisFileMoved = false;
        let oldFileLocation = null;
        
        for (const [oldPath, newPath] of this.fileMoves) {
          const newRelativePath = path.relative(process.cwd(), newPath).replace(/\\/g, '/');
          if (currentRelativePath === newRelativePath) {
            wasThisFileMoved = true;
            oldFileLocation = oldPath;
            break;
          }
        }
        
        // If this file was moved, update its internal relative links
        if (wasThisFileMoved && oldFileLocation) {
          console.log(`📝 Updating internal links in moved file: ${currentRelativePath}`);
          
          // Find all relative links in the file
          const relativeLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
          const matches = [...modifiedContent.matchAll(relativeLinkPattern)];
          
          for (const match of matches) {
            const fullMatch = match[0];
            const linkText = match[1];
            const linkPath = match[2];
            
            // Skip if it's not a relative path (external URLs, anchors, etc.)
            if (linkPath.startsWith('http') || linkPath.startsWith('#') || linkPath.startsWith('mailto:')) {
              continue;
            }
            
            try {
              // Calculate the old absolute path this link pointed to
              const oldFileDir = path.dirname(oldFileLocation);
              const oldTargetPath = path.resolve(oldFileDir, linkPath);
              
              // Calculate the new relative path from the new file location
              const newFileDir = path.dirname(filePath);
              const newRelativePath = path.relative(newFileDir, oldTargetPath).replace(/\\/g, '/');
              
              // Only update if the path actually changed
              if (linkPath !== newRelativePath) {
                const newLink = `[${linkText}](${newRelativePath})`;
                modifiedContent = modifiedContent.replace(fullMatch, newLink);
                fileFixCount++;
                totalFixedLinks++;
                
                console.log(`  🔄 ${linkPath} → ${newRelativePath}`);
              }
            } catch (error) {
              // Skip problematic links
              console.log(`  ⚠️ Could not update link: ${linkPath}`);
            }
          }
        }
        
        // Process links TO moved files (existing logic)
        for (const [oldPath, newPath] of this.fileMoves) {
          const sourceDir = path.dirname(filePath);
          
          // Calculate what the old relative path would have been from this file
          const oldRelativePath = path.relative(sourceDir, oldPath).replace(/\\/g, '/');
          
          // Calculate what the new relative path should be
          const newRelativePath = path.relative(sourceDir, newPath).replace(/\\/g, '/');
          
          // Create regex patterns to match the old link (with and without extensions)
          const oldPathNoExt = oldRelativePath.replace(/\.md$/, '');
          const patterns = [
            // [text](old/path.md)
            new RegExp(`\\[([^\\]]+)\\]\\(${this.escapeRegex(oldRelativePath)}\\)`, 'g'),
            // [text](old/path) - without .md extension
            new RegExp(`\\[([^\\]]+)\\]\\(${this.escapeRegex(oldPathNoExt)}\\)`, 'g'),
            // [text](old/path.md#section)
            new RegExp(`\\[([^\\]]+)\\]\\(${this.escapeRegex(oldRelativePath)}(#[^\\)]+)?\\)`, 'g'),
            // [text](old/path#section) - without .md extension
            new RegExp(`\\[([^\\]]+)\\]\\(${this.escapeRegex(oldPathNoExt)}(#[^\\)]+)?\\)`, 'g')
          ];
          
          for (const pattern of patterns) {
            const matches = [...modifiedContent.matchAll(pattern)];
            if (matches.length > 0) {
              for (const match of matches) {
                const fullMatch = match[0];
                const linkText = match[1];
                const fragment = match[2] || ''; // #section if present
                
                // Create the replacement link
                const newLink = `[${linkText}](${newRelativePath}${fragment})`;
                modifiedContent = modifiedContent.replace(fullMatch, newLink);
                fileFixCount++;
                totalFixedLinks++;
                
                console.log(`  🔄 ${path.relative(process.cwd(), filePath)}: ${oldRelativePath} → ${newRelativePath}`);
              }
            }
          }
        }
        
        // Write back if changes were made
        if (fileFixCount > 0) {
          fs.writeFileSync(filePath, modifiedContent, 'utf8');
          totalFixedFiles++;
          
          this.processedFiles.push({
            path: path.relative(process.cwd(), filePath),
            changes: fileFixCount
          });
        }
        
      } catch (error) {
        this.errors.push(`Error fixing links in ${filePath}: ${error.message}`);
      }
    }
    
    if (totalFixedLinks > 0) {
      console.log(`\n🎉 Fixed ${totalFixedLinks} broken links across ${totalFixedFiles} files\n`);
    } else {
      console.log('💡 No broken relative path links found to fix\n');
    }
  }

  /**
   * Escape special regex characters in file paths
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Clean up deleted files from document graph
   */
  cleanupDeletedFiles(graph, deletedFiles) {
    console.log(`🗑️ Cleaning up ${deletedFiles.length} deleted files from graph...\n`);
    
    const deletedIds = new Set(deletedFiles.map(f => f.id));
    
    // Report what's being cleaned up
    for (const file of deletedFiles) {
      console.log(`  🗑️ Removing: ${file.path} (ID: ${file.id})`);
    }
    
    // Remove nodes
    const originalNodeCount = graph.nodes.length;
    graph.nodes = graph.nodes.filter(n => !deletedIds.has(n.id));
    
    // Remove edges
    const originalEdgeCount = graph.edges.length;
    graph.edges = graph.edges.filter(e => 
      !deletedIds.has(e.source) && !deletedIds.has(e.target)
    );
    
    // Clean workflow references
    for (const workflow of graph.workflowIntegration) {
      workflow.documents = workflow.documents.filter(id => !deletedIds.has(id));
    }
    
    console.log(`\n🎉 Cleanup complete:`);
    console.log(`  - Removed ${originalNodeCount - graph.nodes.length} nodes`);
    console.log(`  - Removed ${originalEdgeCount - graph.edges.length} edges`);
    console.log(`  - Updated workflow references\n`);
  }

  /**
   * Validate graph consistency and update paths when files are moved
   */
  validateAndUpdateGraphConsistency() {
    console.log('🔗 Validating and updating document graph consistency...\n');
    
    const graphPath = path.join(process.cwd(), 'docs', 'document-graph.json');
    
    if (!fs.existsSync(graphPath)) {
      console.log('❌ Graph file not found: docs/document-graph.json');
      return false;
    }
    
    const graph = JSON.parse(fs.readFileSync(graphPath));
    let hasErrors = false;
    let hasUpdates = false;
    const deletedFiles = [];
    
    // Build reverse lookup: ID -> actual current file path
    const currentPaths = new Map(); // ID -> current actual path
    for (const [id, currentPath] of this.documentMap) {
      currentPaths.set(id, currentPath);
    }
    
    // Validate all node paths exist and update if moved
    console.log('📄 Validating and updating node file paths...');
    for (const node of graph.nodes) {
      const expectedPath = node.path;
      const fullExpectedPath = path.join(process.cwd(), expectedPath);
      
      if (!fs.existsSync(fullExpectedPath)) {
        // File doesn't exist at expected location, check if we know where it moved
        const actualPath = currentPaths.get(node.id);
        
        if (actualPath) {
          // File was moved, track the move and update the graph
          console.log(`🔄 File moved: ${expectedPath} → ${actualPath}`);
          
          // Track this file move for link fixing
          this.fileMoves.set(
            path.join(process.cwd(), expectedPath),
            path.join(process.cwd(), actualPath)
          );
          
          node.path = actualPath;
          hasUpdates = true;
        } else {
          // File was deleted, collect for cleanup instead of erroring
          deletedFiles.push({
            id: node.id,
            path: expectedPath,
            workflows: node.workflows || []
          });
        }
      } else {
        // Verify the file has the expected ID
        const normalizedExpectedPath = expectedPath.replace(/\\/g, '/');
        const expectedId = this.pathToIdMap.get(normalizedExpectedPath);
        if (expectedId !== node.id) {
          console.log(`❌ ID mismatch: ${expectedPath} has ID ${expectedId} but graph expects ${node.id}`);
          hasErrors = true;
        } else {
          console.log(`✅ ${expectedPath} (ID: ${node.id})`);
        }
      }
    }
    
    // Clean up deleted files automatically
    if (deletedFiles.length > 0) {
      this.cleanupDeletedFiles(graph, deletedFiles);
      hasUpdates = true;
    }
    
    // Save updated graph if we made changes
    if (hasUpdates) {
      // Update the lastUpdated timestamp
      graph.metadata = graph.metadata || {};
      graph.metadata.lastUpdated = new Date().toISOString();
      
      // Write the updated graph back to disk
      fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2), 'utf8');
      console.log(`🎉 Updated document graph with new file paths`);
    }
    
    // Validate all edges reference valid node IDs
    console.log('\n🔗 Validating edge relationships...');
    const nodeIds = new Set(graph.nodes.map(n => n.id));
    
    for (const edge of graph.edges) {
      const sourceExists = nodeIds.has(edge.source);
      const targetExists = nodeIds.has(edge.target);
      
      if (!sourceExists || !targetExists) {
        console.log(`❌ Invalid edge: ${edge.source} -> ${edge.target}`);
        if (!sourceExists) console.log(`   Source node ID "${edge.source}" does not exist`);
        if (!targetExists) console.log(`   Target node ID "${edge.target}" does not exist`);
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
          console.log(`❌ Workflow "${workflow.workflow}" references invalid document ID: ${docId}`);
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
      if (hasUpdates) {
        console.log('✅ Graph has been updated to reflect current file locations');
      }
      if (deletedFiles.length > 0) {
        console.log(`✅ All file deletions handled automatically!`);
      }
      return true;
    }
  }

  /**
   * Main execution function
   */
  execute() {
    console.log('🚀 Starting Document Link Fixer\n');
    console.log('Purpose: Fix broken links and update graph after file moves\n');
    
    try {
      // Build document mapping from current file system
      this.buildDocumentMap();
      console.log();
      
      // Validate and update graph consistency (this populates fileMoves)
      const graphValid = this.validateAndUpdateGraphConsistency();
      
      // Fix broken relative path links caused by file moves
      if (this.fileMoves.size > 0) {
        this.fixBrokenRelativeLinks();
      }
      
      // Auto-fix any remaining ID-based links (legacy cleanup)
      console.log('⚙️ Checking for any remaining ID-based links...');
      const files = this.findMarkdownFiles(this.docsDir);
      let idLinksFound = false;
      
      for (const filePath of files) {
        this.processFile(filePath);
        if (this.processedFiles.some(f => f.path === path.relative(process.cwd(), filePath))) {
          idLinksFound = true;
        }
      }
      
      if (idLinksFound) {
        console.log('🎉 Converted remaining ID-based links to relative paths\n');
      } else {
        console.log('💡 No ID-based links found (migration complete)\n');
      }
      
      // Validate all links
      const { totalErrors, filesWithErrors, totalFiles } = this.validateLinks();
      
      if (!graphValid) {
        totalErrors++;
      }
      
      // Summary report
      console.log('='.repeat(60));
      console.log('📊 LINK FIX SUMMARY');
      console.log('='.repeat(60));
      console.log(`Total files checked: ${totalFiles}`);
      console.log(`Files with errors: ${totalErrors}`);
      console.log(`Files with valid links: ${totalFiles - totalErrors}`);
      
      if (this.processedFiles.length > 0) {
        console.log(`\nFiles with fixed links: ${this.processedFiles.length}`);
      }
      
      if (totalErrors > 0) {
        console.log('\n❌ Files with broken links:');
        filesWithErrors.forEach(file => console.log(`   - ${file}`));
        console.log('\n❌ Link fixing FAILED - Manual intervention required for remaining broken links');
        process.exit(1);
      } else {
        console.log('\n✅ All links are working correctly!');
        console.log('✅ Document graph is up to date with current file locations!');
      }
      
      if (this.errors.length > 0) {
        console.log('\n⚠️ Warnings encountered:');
        this.errors.forEach(error => console.log(`   - ${error}`));
      }
      
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
🔧 Document Link Fix Tool

Automatically fixes broken links and updates the document graph after file moves.

Purpose:
- Detects when documents have been moved to new locations
- Updates the document graph to reflect new file paths
- Automatically fixes broken relative path links using efficient regex
- Validates all markdown links using markdown-link-check
- Maintains all relationships while updating file locations

Usage:
  node docs-links-fix.js [options]

Options:
  --help, -h       Show this help message

Examples:
  node docs-links-fix.js              # Fix links and update graph (default action)

Workflow:
1. Move/rename any markdown files in the docs/ directory
2. Run this script
3. Script automatically:
   - Updates document-graph.json with new file paths
   - Fixes all broken relative path links throughout the documentation
   - Validates all links still work
   - Maintains all document relationships and metadata

What it fixes automatically:
  [Text](../old/path.md)     # Broken relative path → updated to new location
  [Text](../old/path#section) # Broken relative path with fragment → updated
  
What it updates:
  document-graph.json # Node paths updated to reflect file moves
  
What it validates:
  [Text](../file.md)  # All relative path links
  Graph consistency   # Ensures all IDs match between files and graph
  External links      # Validates URLs are accessible
  
The script uses efficient regex-based find/replace to handle large documentation 
sets quickly. Simply move files and run - everything gets fixed automatically!
`);
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    const fixer = new DocsLinkFixer();
    fixer.showHelp();
    process.exit(0);
  }
  
  const fixer = new DocsLinkFixer();
  fixer.execute();
}

module.exports = DocsLinkFixer;
