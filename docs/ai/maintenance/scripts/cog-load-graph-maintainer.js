#!/usr/bin/env node

/**
 * Cognitive Load Graph Maintainer - Maintenance and repair tools for the document graph
 * Provides utilities for updating, validating, and maintaining graph consistency with cognitive load metrics
 */

const fs = require('fs');
const path = require('path');

// Import CognitiveLoadAnalyzer for cog-load calculations
const CognitiveLoadAnalyzer = require('./cog-load-measure.js');

class CogLoadGraphMaintainer {
  constructor() {
    this.graphPath = path.join(process.cwd(), 'docs', 'document-graph.json');
    this.graph = this.loadGraph();
    this.backupDir = path.join(process.cwd(), 'docs', '.graph-backups');
  }

  /**
   * Load document graph
   */
  loadGraph() {
    if (!fs.existsSync(this.graphPath)) {
      throw new Error('Document graph not found: ' + this.graphPath);
    }
    return JSON.parse(fs.readFileSync(this.graphPath, 'utf8'));
  }

  /**
   * Save graph with backup
   */
  saveGraph(reason = 'Manual save') {
    // Create backup directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    // Create backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `graph-${timestamp}.json`);
    
    if (fs.existsSync(this.graphPath)) {
      fs.copyFileSync(this.graphPath, backupPath);
      console.log(`💾 Backup created: ${backupPath}`);
    }

    // Save updated graph
    fs.writeFileSync(this.graphPath, JSON.stringify(this.graph, null, 2));
    console.log(`✅ Graph updated: ${reason}`);
  }

  /**
   * Validate graph consistency
   */
  validateGraph() {
    console.log('🔍 Validating graph consistency...\n');
    
    const issues = [];
    const warnings = [];

    // Check node file existence
    console.log('📄 Checking node file existence...');
    this.graph.nodes.forEach(node => {
      if (!fs.existsSync(node.path)) {
        issues.push(`Missing file: ${node.id} -> ${node.path}`);
      }
    });

    // Check edge references
    console.log('🔗 Checking edge references...');
    this.graph.edges.forEach(edge => {
      const sourceExists = this.graph.nodes.some(n => n.id === edge.source);
      const targetExists = this.graph.nodes.some(n => n.id === edge.target);
      
      if (!sourceExists) {
        issues.push(`Edge references missing source: ${edge.source}`);
      }
      if (!targetExists) {
        issues.push(`Edge references missing target: ${edge.target}`);
      }
    });

    // Check workflow references
    console.log('⚙️  Checking workflow references...');
    this.graph.workflowIntegration.forEach(workflow => {
      workflow.documents.forEach(docId => {
        const docExists = this.graph.nodes.some(n => n.id === docId);
        if (!docExists) {
          issues.push(`Workflow ${workflow.workflow} references missing document: ${docId}`);
        }
      });
    });

    // Check for missing priorities
    const noPriority = this.graph.nodes.filter(node => !node.priority);
    if (noPriority.length > 0) {
      warnings.push(`${noPriority.length} nodes missing priority field`);
    }

    // Check for missing cognitive load scores
    const noCogLoad = this.graph.nodes.filter(node => node.cogLoad === undefined);
    if (noCogLoad.length > 0) {
      warnings.push(`${noCogLoad.length} nodes missing cognitive load scores`);
    }

    // Report results
    console.log('\n📊 Validation Results:');
    if (issues.length === 0 && warnings.length === 0) {
      console.log('✅ Graph is consistent - no issues found');
    } else {
      if (issues.length > 0) {
        console.log(`❌ Issues: ${issues.length}`);
        issues.forEach(issue => console.log(`   • ${issue}`));
      }
      
      if (warnings.length > 0) {
        console.log(`⚠️  Warnings: ${warnings.length}`);
        warnings.forEach(warning => console.log(`   • ${warning}`));
      }
    }

    return { issues, warnings };
  }

  /**
   * Repair common graph issues
   */
  repairGraph() {
    console.log('🔧 Repairing graph issues...\n');
    
    let repairCount = 0;

    // Remove edges with missing node references
    const validEdges = this.graph.edges.filter(edge => {
      const sourceExists = this.graph.nodes.some(n => n.id === edge.source);
      const targetExists = this.graph.nodes.some(n => n.id === edge.target);
      
      if (!sourceExists || !targetExists) {
        console.log(`🗑️  Removing invalid edge: ${edge.source} -> ${edge.target}`);
        repairCount++;
        return false;
      }
      return true;
    });
    
    this.graph.edges = validEdges;

    // Remove workflow references to missing documents
    this.graph.workflowIntegration.forEach(workflow => {
      const originalCount = workflow.documents.length;
      workflow.documents = workflow.documents.filter(docId => {
        const exists = this.graph.nodes.some(n => n.id === docId);
        if (!exists) {
          console.log(`🗑️  Removing missing document from workflow ${workflow.workflow}: ${docId}`);
          repairCount++;
        }
        return exists;
      });
    });

    // Remove nodes for missing files
    const originalNodeCount = this.graph.nodes.length;
    this.graph.nodes = this.graph.nodes.filter(node => {
      if (!fs.existsSync(node.path)) {
        console.log(`🗑️  Removing node for missing file: ${node.id}`);
        repairCount++;
        return false;
      }
      return true;
    });

    console.log(`\n✅ Repair completed: ${repairCount} issues fixed`);
    
    if (repairCount > 0) {
      this.saveGraph('Graph repair completed');
    }
  }

  /**
   * Add new document to graph
   */
  addDocument(docInfo) {
    // Check if document already exists
    const existingNode = this.graph.nodes.find(n => n.id === docInfo.id);
    if (existingNode) {
      console.log(`⚠️  Document already exists: ${docInfo.id}`);
      return;
    }

    // Check if file exists
    if (!fs.existsSync(docInfo.path)) {
      console.log(`❌ File does not exist: ${docInfo.path}`);
      return;
    }

    // Create new node
    const newNode = {
      id: docInfo.id,
      title: docInfo.title,
      path: docInfo.path,
      priority: docInfo.priority || 'medium'
    };

    this.graph.nodes.push(newNode);
    console.log(`✅ Added document: ${docInfo.title}`);
    
    this.saveGraph(`Added document: ${docInfo.title}`);
  }

  /**
   * Remove document from graph
   */
  removeDocument(docId) {
    const nodeIndex = this.graph.nodes.findIndex(n => n.id === docId);
    if (nodeIndex === -1) {
      console.log(`❌ Document not found: ${docId}`);
      return;
    }

    const node = this.graph.nodes[nodeIndex];
    
    // Remove node
    this.graph.nodes.splice(nodeIndex, 1);
    
    // Remove associated edges
    this.graph.edges = this.graph.edges.filter(edge => 
      edge.source !== docId && edge.target !== docId
    );
    
    // Remove from workflows
    this.graph.workflowIntegration.forEach(workflow => {
      workflow.documents = workflow.documents.filter(id => id !== docId);
    });
    
    console.log(`✅ Removed document: ${node.title}`);
    this.saveGraph(`Removed document: ${node.title}`);
  }

  /**
   * Update document information
   */
  updateDocument(docId, updates) {
    const node = this.graph.nodes.find(n => n.id === docId);
    if (!node) {
      console.log(`❌ Document not found: ${docId}`);
      return;
    }

    Object.assign(node, updates);
    console.log(`✅ Updated document: ${node.title}`);
    
    this.saveGraph(`Updated document: ${node.title}`);
  }

  /**
   * Scan directory for new documents
   */
  scanForNewDocuments(scanDir = 'docs') {
    console.log(`🔍 Scanning for new documents in: ${scanDir}\n`);
    
    const existingPaths = new Set(this.graph.nodes.map(n => n.path));
    const newDocuments = [];

    const scanRecursive = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.')) {
          scanRecursive(fullPath);
        } else if (stat.isFile() && item.endsWith('.md')) {
          if (!existingPaths.has(fullPath)) {
            newDocuments.push(fullPath);
          }
        }
      });
    };

    scanRecursive(scanDir);
    
    if (newDocuments.length === 0) {
      console.log('✅ No new documents found');
      return;
    }

    console.log(`📄 Found ${newDocuments.length} new documents:`);
    newDocuments.forEach(docPath => {
      const filename = path.basename(docPath, '.md');
      const id = filename.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const title = filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      console.log(`   • ${title} (${docPath})`);
      
      this.addDocument({
        id,
        title,
        path: docPath,
        priority: 'medium'
      });
    });
  }

  /**
   * Update cognitive load for all documents
   */
  updateCognitiveLoad() {
    console.log('🧠 Updating cognitive load for all documents...\n');
    
    const analyzer = new CognitiveLoadAnalyzer();
    let updatedCount = 0;
    let errorCount = 0;
    
    this.graph.nodes.forEach((node, index) => {
      // Show progress
      process.stdout.write(`\r📊 Progress: ${index + 1}/${this.graph.nodes.length} - ${node.title}`);
      
      const result = analyzer.analyzeFile(node.path);
      
      if (result.error) {
        console.log(`\n❌ Error analyzing ${node.title}: ${result.error}`);
        errorCount++;
      } else {
        node.cogLoad = Math.round(result.cogLoad * 100) / 100; // Store rounded cog-load score
        updatedCount++;
      }
    });
    
    console.log('\n'); // New line after progress
    console.log(`✅ Updated cognitive load for ${updatedCount} documents`);
    if (errorCount > 0) {
      console.log(`❌ Failed to update ${errorCount} documents`);
    }
    
    // Update graph metadata
    if (!this.graph.metadata) {
      this.graph.metadata = {};
    }
    this.graph.metadata.lastCogLoadUpdate = new Date().toISOString();
    this.graph.metadata.version = this.graph.metadata.version || "2.0";
    
    this.saveGraph('Updated cognitive load for all documents');
  }

  /**
   * CLI interface
   */
  handleCLI() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`Cognitive Load Graph Maintainer - Document graph maintenance and repair tools

Usage:
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js [options]

Options:
  --validate           Validate graph consistency
  --repair             Repair common graph issues  
  --scan [dir]         Scan for new documents (default: docs)
  --add-doc <id> <title> <path> [priority]    Add new document
  --remove-doc <id>    Remove document from graph
  --update-doc <id> <field> <value>           Update document field
  --update-cog-load    Update cognitive load for all documents
  --help, -h           Show this help message

Examples:
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --validate
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --repair
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --scan
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --add-doc new-guide "New Guide" docs/guides/new-guide.md high
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --update-cog-load`);
      return;
    }

    if (args.includes('--validate')) {
      this.validateGraph();
      return;
    }

    if (args.includes('--repair')) {
      this.repairGraph();
      return;
    }

    if (args.includes('--scan')) {
      const scanIndex = args.indexOf('--scan');
      const scanDir = args[scanIndex + 1] || 'docs';
      this.scanForNewDocuments(scanDir);
      return;
    }

    const addIndex = args.indexOf('--add-doc');
    if (addIndex !== -1) {
      const id = args[addIndex + 1];
      const title = args[addIndex + 2];
      const docPath = args[addIndex + 3];
      const priority = args[addIndex + 4] || 'medium';
      
      if (!id || !title || !docPath) {
        console.log('❌ Missing required arguments for --add-doc');
        return;
      }
      
      this.addDocument({ id, title, path: docPath, priority });
      return;
    }

    const removeIndex = args.indexOf('--remove-doc');
    if (removeIndex !== -1) {
      const docId = args[removeIndex + 1];
      if (!docId) {
        console.log('❌ Missing document ID for --remove-doc');
        return;
      }
      this.removeDocument(docId);
      return;
    }

    const updateIndex = args.indexOf('--update-doc');
    if (updateIndex !== -1) {
      const docId = args[updateIndex + 1];
      const field = args[updateIndex + 2];
      const value = args[updateIndex + 3];
      
      if (!docId || !field || !value) {
        console.log('❌ Missing required arguments for --update-doc');
        return;
      }
      
      this.updateDocument(docId, { [field]: value });
      return;
    }

    const updateCogLoadIndex = args.indexOf('--update-cog-load');
    if (updateCogLoadIndex !== -1) {
      this.updateCognitiveLoad();
      return;
    }

    // Default: validate
    this.validateGraph();
  }
}

// CLI execution
if (require.main === module) {
  try {
    const maintainer = new CogLoadGraphMaintainer();
    maintainer.handleCLI();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = CogLoadGraphMaintainer;
