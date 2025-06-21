const fs = require('fs');
const path = require('path');

/**
 * Simplified Document Ingestion Engine
 * Loads documents and outputs content to stdout for AI ingestion
 */
class DocsIngestionEngine {
  constructor() {
    this.graphPath = 'docs/document-graph.json';
    this.loadDocumentGraph();
  }

  /**
   * Load and parse document graph
   */
  loadDocumentGraph() {
    try {
      this.graph = JSON.parse(fs.readFileSync(this.graphPath, 'utf8'));
    } catch (error) {
      throw new Error(`Failed to load document graph: ${error.message}`);
    }
  }

  /**
   * Load documents for a workflow
   */
  async loadWorkflowDocuments(workflowName) {
    const workflowConfig = this.graph.workflowIntegration.find(w => w.workflow === workflowName);
    
    if (!workflowConfig) {
      throw new Error(`Workflow '${workflowName}' not found in document graph`);
    }

    console.log(`📄 Loading workflow: ${workflowName}`);
    
    const loadedFiles = [];
    
    for (const docId of workflowConfig.documents) {
      const node = this.graph.nodes.find(n => n.id === docId);
      
      if (!node) {
        console.warn(`⚠️ Document ${docId} not found in graph`);
        continue;
      }

      const filePath = path.resolve(node.path);
      
      try {
        console.log(`📄 Loading: ${node.path}`);
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        console.log(`✅ Loaded: ${node.path} (${content.length} chars)`);
        
        // Track loaded file
        loadedFiles.push({
          path: node.path,
          size: content.length
        });
        
        // Output content for AI ingestion
        console.log(`\n=== DOCUMENT CONTENT: ${node.path} ===`);
        console.log(content);
        console.log(`=== END DOCUMENT: ${node.path} ===\n`);
        
      } catch (error) {
        console.error(`❌ Failed to load ${filePath}: ${error.message}`);
        throw error;
      }
    }

    // Enhanced success message with file enumeration
    console.log(`\n🎉 Workflow '${workflowName}' completed successfully.`);
    console.log(`📊 Loaded ${loadedFiles.length} document${loadedFiles.length !== 1 ? 's' : ''}:`);
    loadedFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.path} (${file.size} chars)`);
    });
  }

  /**
   * Main workflow execution
   */
  async executeWorkflow(workflowName) {
    try {
      await this.loadWorkflowDocuments(workflowName);
    } catch (error) {
      console.error(`\n💥 Workflow '${workflowName}' failed: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * CLI interface
   */
  handleCLI() {
    const workflowName = process.argv[2];
    
    if (!workflowName || workflowName === '--help' || workflowName === '-h') {
      console.log(`Simplified Document Ingestion Engine

Usage:
  cmd /c node docs/ai/ingestion/scripts/docs-ingestion-engine.js <workflow-name>

Available workflows: ${this.graph.workflowIntegration.map(w => w.workflow).join(', ')}

Examples:
  cmd /c node docs/ai/ingestion/scripts/docs-ingestion-engine.js docs-ai-context
  cmd /c node docs/ai/ingestion/scripts/docs-ingestion-engine.js docs-forms
  cmd /c node docs/ai/ingestion/scripts/docs-ingestion-engine.js docs-api`);
      return;
    }

    this.executeWorkflow(workflowName);
  }
}

// CLI execution
if (require.main === module) {
  const engine = new DocsIngestionEngine();
  engine.handleCLI();
}

module.exports = DocsIngestionEngine;
