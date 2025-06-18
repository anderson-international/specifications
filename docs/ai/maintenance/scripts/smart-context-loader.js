const fs = require('fs');
const path = require('path');

class SmartContextLoader {
  constructor() {
    this.graph = JSON.parse(fs.readFileSync('docs/document-graph.json'));
  }

  // Get dependencies for a given document ID
  getDependencies(documentId) {
    const edges = this.graph.edges.filter(edge => 
      edge.source === documentId || edge.target === documentId
    );
    return edges;
  }

  // Get workflow documents by workflow name
  getWorkflowDocuments(workflowName) {
    const workflow = this.graph.workflowIntegration.find(w => 
      w.workflow === workflowName
    );
    return workflow ? workflow.documents : [];
  }

  // Suggest documents based on file path
  suggestDocuments(filePath) {
    if (filePath.includes('/api/')) return this.getWorkflowDocuments('docs-api');
    if (filePath.includes('form') || filePath.includes('Form')) return this.getWorkflowDocuments('docs-forms');
    if (filePath.includes('.tsx') || filePath.includes('.css')) return this.getWorkflowDocuments('docs-ui');
    return [];
  }

  // CLI interface for testing
  handleCLI() {
    const args = process.argv.slice(2);
    const workflowArg = args.find(arg => arg.startsWith('--workflow='));
    
    if (workflowArg) {
      const workflowName = workflowArg.split('=')[1];
      const documents = this.getWorkflowDocuments(workflowName);
      console.log(`📋 Workflow: ${workflowName}`);
      console.log(`📄 Documents (${documents.length}):`);
      documents.forEach(docId => {
        const node = this.graph.nodes.find(n => n.id === docId);
        if (node) {
          console.log(`  - ${node.title} (${node.path})`);
        }
      });
      return;
    }

    const coreContextArg = args.includes('--core-context');
    if (coreContextArg) {
      const coreWorkflows = ['docs-ai-reboot'];
      console.log(`🔗 Loading core context documents:`);
      coreWorkflows.forEach(workflow => {
        const documents = this.getWorkflowDocuments(workflow);
        console.log(`\n📋 ${workflow}:`);
        documents.forEach(docId => {
          const node = this.graph.nodes.find(n => n.id === docId);
          if (node) {
            console.log(`  - ${node.title} (${node.path})`);
            // Load dependencies
            const deps = this.getDependencies(docId);
            if (deps.length > 0) {
              console.log(`    Dependencies:`);
              deps.forEach(edge => {
                const targetId = edge.source === docId ? edge.target : edge.source;
                const targetNode = this.graph.nodes.find(n => n.id === targetId);
                if (targetNode) {
                  console.log(`      → ${targetNode.title} (${edge.relationship})`);
                }
              });
            }
          }
        });
      });
      return;
    }

    // Default help
    console.log(`Smart Context Loader - Document Graph Intelligence

Usage:
  cmd /c node docs/ai/maintenance/scripts/smart-context-loader.js --workflow=<workflow-name>
  cmd /c node docs/ai/maintenance/scripts/smart-context-loader.js --core-context

Examples:
  cmd /c node docs/ai/maintenance/scripts/smart-context-loader.js --workflow=docs-forms
  cmd /c node docs/ai/maintenance/scripts/smart-context-loader.js --workflow=docs-api
  cmd /c node docs/ai/maintenance/scripts/smart-context-loader.js --core-context

Available workflows: ${this.graph.workflowIntegration.map(w => w.workflow).join(', ')}`);
  }
}

// CLI execution
if (require.main === module) {
  const loader = new SmartContextLoader();
  loader.handleCLI();
}

module.exports = SmartContextLoader;
