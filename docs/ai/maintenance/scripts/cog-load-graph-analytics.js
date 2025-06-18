#!/usr/bin/env node

/**
 * Cognitive Load Graph Analytics - Analysis and reporting tools for the document graph
 * Provides insights into document relationships, workflow coverage, and cognitive load metrics
 */

const fs = require('fs');
const path = require('path');

class CogLoadGraphAnalytics {
  constructor() {
    this.graphPath = path.join(process.cwd(), 'docs', 'document-graph.json');
    this.graph = this.loadGraph();
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
   * Generate comprehensive analytics report
   */
  generateReport() {
    console.log('📊 Document Graph Analytics Report\n');
    
    this.analyzeNodes();
    this.analyzeEdges();
    this.analyzeWorkflows();
    this.analyzeCognitiveLoad();
    this.analyzeCoverage();
    this.analyzeHealth();
  }

  /**
   * Analyze nodes (documents)
   */
  analyzeNodes() {
    console.log('📄 Node Analysis');
    console.log('================');
    
    const nodes = this.graph.nodes;
    console.log(`Total Documents: ${nodes.length}`);
    
    // Priority distribution
    const priorityCount = {};
    nodes.forEach(node => {
      const priority = node.priority || 'unspecified';
      priorityCount[priority] = (priorityCount[priority] || 0) + 1;
    });
    
    console.log('\nPriority Distribution:');
    Object.entries(priorityCount).forEach(([priority, count]) => {
      console.log(`  ${priority}: ${count} documents`);
    });
    
    // Category analysis
    const categories = {};
    nodes.forEach(node => {
      const category = this.getDocumentCategory(node.path);
      categories[category] = (categories[category] || 0) + 1;
    });
    
    console.log('\nCategory Distribution:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} documents`);
    });
    
    // File existence check
    const missingFiles = nodes.filter(node => !fs.existsSync(node.path));
    if (missingFiles.length > 0) {
      console.log(`\n⚠️  Missing Files: ${missingFiles.length}`);
      missingFiles.forEach(node => {
        console.log(`    • ${node.id}: ${node.path}`);
      });
    } else {
      console.log('\n✅ All document files exist');
    }
    
    console.log('\n');
  }

  /**
   * Analyze edges (relationships)
   */
  analyzeEdges() {
    console.log('🔗 Edge Analysis');
    console.log('================');
    
    const edges = this.graph.edges;
    console.log(`Total Relationships: ${edges.length}`);
    
    // Relationship type distribution
    const relationshipTypes = {};
    edges.forEach(edge => {
      const type = edge.relationship || 'unspecified';
      relationshipTypes[type] = (relationshipTypes[type] || 0) + 1;
    });
    
    console.log('\nRelationship Types:');
    Object.entries(relationshipTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} relationships`);
    });
    
    // Node connectivity analysis
    const connectivity = {};
    edges.forEach(edge => {
      connectivity[edge.source] = (connectivity[edge.source] || 0) + 1;
      connectivity[edge.target] = (connectivity[edge.target] || 0) + 1;
    });
    
    const sortedConnectivity = Object.entries(connectivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    console.log('\nMost Connected Documents:');
    sortedConnectivity.forEach(([nodeId, count]) => {
      const node = this.graph.nodes.find(n => n.id === nodeId);
      console.log(`  ${node?.title || nodeId}: ${count} connections`);
    });
    
    // Isolated nodes
    const connectedNodes = new Set();
    edges.forEach(edge => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });
    
    const isolatedNodes = this.graph.nodes.filter(node => !connectedNodes.has(node.id));
    if (isolatedNodes.length > 0) {
      console.log(`\n⚠️  Isolated Documents: ${isolatedNodes.length}`);
      isolatedNodes.forEach(node => {
        console.log(`    • ${node.title || node.id}`);
      });
    } else {
      console.log('\n✅ All documents are connected');
    }
    
    console.log('\n');
  }

  /**
   * Analyze workflow integrations
   */
  analyzeWorkflows() {
    console.log('⚙️  Workflow Analysis');
    console.log('====================');
    
    // Dynamically discover docs-* workflows
    const workflowsDir = path.join(process.cwd(), '.windsurf', 'workflows');
    const docsWorkflows = this.discoverDocsWorkflows(workflowsDir);
    
    console.log(`Total Workflows: ${docsWorkflows.length}`);
    
    // Analyze each workflow for document coverage
    const totalDocuments = this.graph.nodes.length;
    const documentsInWorkflows = new Set();
    const workflowCoverage = {};
    
    docsWorkflows.forEach(workflow => {
      const documents = this.getWorkflowDocuments(workflow.path);
      workflowCoverage[workflow.name] = documents.length;
      documents.forEach(docId => {
        documentsInWorkflows.add(docId);
      });
    });
    
    const coveragePercent = Math.round((documentsInWorkflows.size / totalDocuments) * 100);
    console.log(`Workflow Coverage: ${documentsInWorkflows.size}/${totalDocuments} documents (${coveragePercent}%)`);
    
    // Workflow sizes
    console.log('\nWorkflow Document Counts:');
    Object.entries(workflowCoverage).forEach(([workflow, count]) => {
      console.log(`  ${workflow}: ${count} documents`);
    });
    
    // Documents not in any workflow
    const orphanedDocs = this.graph.nodes.filter(node => !documentsInWorkflows.has(node.id));
    if (orphanedDocs.length > 0) {
      console.log(`\n⚠️  Documents not in workflows: ${orphanedDocs.length}`);
      orphanedDocs.forEach(node => {
        console.log(`    • ${node.title || node.id}`);
      });
    } else {
      console.log('\n✅ All documents integrated into workflows');
    }
    
    console.log('\n');
  }

  /**
   * Dynamically discover docs-* workflows from .windsurf/workflows directory
   */
  discoverDocsWorkflows(workflowsDir) {
    const workflows = [];
    
    if (!fs.existsSync(workflowsDir)) {
      console.log('⚠️  Workflows directory not found:', workflowsDir);
      return workflows;
    }
    
    const files = fs.readdirSync(workflowsDir);
    const docsWorkflowFiles = files.filter(file => 
      file.startsWith('docs-') && file.endsWith('.md')
    );
    
    docsWorkflowFiles.forEach(file => {
      const workflowPath = path.join(workflowsDir, file);
      const workflowName = path.basename(file, '.md');
      
      workflows.push({
        name: workflowName,
        path: workflowPath,
        file: file
      });
    });
    
    return workflows.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Extract documents referenced in a workflow file
   */
  getWorkflowDocuments(workflowPath) {
    const documents = new Set();
    
    try {
      const content = fs.readFileSync(workflowPath, 'utf8');
      
      // Pattern 1: Direct document references (Load: docs/path/file.md)
      const directLoadPattern = /Load:\s+docs\/[^.\s]+\.md/g;
      const directMatches = content.matchAll(directLoadPattern);
      for (const match of directMatches) {
        const docPath = match[0].replace('Load: ', '');
        const docId = this.pathToDocId(docPath);
        if (docId && this.graph.nodes.find(n => n.id === docId)) {
          documents.add(docId);
        }
      }
      
      // Pattern 2: Smart context loader workflows - lookup from document graph
      const workflowMatch = content.match(/--workflow=([\w-]+)/);
      if (workflowMatch) {
        const workflowType = workflowMatch[1]; // e.g., 'docs-forms', 'core-standards', etc.
        // Remove 'docs-' prefix if present
        const cleanWorkflowType = workflowType.replace(/^docs-/, '');
        const workflowDocs = this.getWorkflowFromGraph(cleanWorkflowType);
        workflowDocs.forEach(docId => documents.add(docId));
      }
      
      // Pattern 3: Traditional markdown links and tool calls (fallback)
      const documentPatterns = [
        /docs\/[^)]+\.md/g,  // Markdown links to docs
        /AbsolutePath['"]\s*:\s*['"](.*?docs\/[^'"]+\.md)['"]/g, // view_line_range tool calls
        /TargetFile['"]\s*:\s*['"](.*?docs\/[^'"]+\.md)['"]/g // edit_file tool calls
      ];
      
      documentPatterns.forEach(pattern => {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
          const docPath = match[1] || match[0];
          const docId = this.pathToDocId(docPath);
          if (docId && this.graph.nodes.find(n => n.id === docId)) {
            documents.add(docId);
          }
        }
      });
      
    } catch (error) {
      console.log(`⚠️  Error reading workflow ${workflowPath}:`, error.message);
    }
    
    return Array.from(documents);
  }

  /**
   * Get documents associated with a workflow type from the document graph
   */
  getWorkflowFromGraph(workflowType) {
    const documents = [];
    
    // Map workflow types to document graph suggested reading paths
    const workflowMapping = {
      'forms': 'form-development',
      'api': 'api-development', 
      'ui': 'ui-development',
      'debug': 'debug-development',
      'core-context': 'core-context'
    };
    
    const graphWorkflowName = workflowMapping[workflowType];
    if (!graphWorkflowName) {
      return documents;
    }
    
    // Look for the workflow in suggestedReadingPaths
    const suggestedPaths = this.graph.suggestedReadingPaths || [];
    const workflowPath = suggestedPaths.find(path => path.name === graphWorkflowName);
    
    if (workflowPath && workflowPath.path) {
      // Convert document IDs from the path
      return workflowPath.path.filter(docId => 
        this.graph.nodes.find(node => node.id === docId)
      );
    }
    
    return documents;
  }

  /**
   * Convert file path to document ID format used in graph
   */
  pathToDocId(filePath) {
    // Remove leading paths and file extension, convert to kebab-case
    const relativePath = filePath.replace(/^.*docs\//, '').replace(/\.md$/, '');
    const parts = relativePath.split('/');
    const filename = parts[parts.length - 1];
    
    // Convert filename to ID format (kebab-case)
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Analyze cognitive load
   */
  analyzeCognitiveLoad() {
    console.log('🧠 Cognitive Load Analysis');
    console.log('==========================');
    
    const nodes = this.graph.nodes;
    const cogLoadScores = nodes
      .filter(node => node.cogLoad !== undefined)
      .map(node => ({
        id: node.id,
        title: node.title,
        cogLoad: node.cogLoad,
        path: node.path
      }));
    
    if (cogLoadScores.length === 0) {
      console.log('⚠️  No cognitive load scores found in document graph');
      console.log('   Run cog-load-graph-maintainer.js --update-cog-load to populate scores');
      console.log('\n');
      return;
    }
    
    console.log(`Documents with CogLoad Scores: ${cogLoadScores.length}/${nodes.length}`);
    
    // Calculate statistics
    const scores = cogLoadScores.map(doc => doc.cogLoad);
    const totalCogLoad = scores.reduce((sum, score) => sum + score, 0);
    const avgCogLoad = totalCogLoad / scores.length;
    const minCogLoad = Math.min(...scores);
    const maxCogLoad = Math.max(...scores);
    
    console.log(`\nCognitive Load Statistics:`);
    console.log(`  Average CLS: ${avgCogLoad.toFixed(1)}`);
    console.log(`  Range: ${minCogLoad.toFixed(1)} - ${maxCogLoad.toFixed(1)}`);
    console.log(`  Total System CLS: ${totalCogLoad.toFixed(1)}`);
    
    // CLS categories based on research thresholds
    const optimal = cogLoadScores.filter(doc => doc.cogLoad >= 55 && doc.cogLoad <= 60);
    const lowRisk = cogLoadScores.filter(doc => doc.cogLoad > 60 && doc.cogLoad <= 65);
    const moderate = cogLoadScores.filter(doc => doc.cogLoad > 65 && doc.cogLoad <= 70);
    const high = cogLoadScores.filter(doc => doc.cogLoad > 70);
    const tooLow = cogLoadScores.filter(doc => doc.cogLoad < 55);
    
    console.log(`\nCognitive Load Distribution:`);
    console.log(`  🎯 Optimal (55-60): ${optimal.length} documents`);
    console.log(`  ✅ Low Risk (60-65): ${lowRisk.length} documents`);
    console.log(`  ⚠️  Moderate (65-70): ${moderate.length} documents`);
    console.log(`  ❌ High Risk (>70): ${high.length} documents`);
    console.log(`  🔻 Too Low (<55): ${tooLow.length} documents`);
    
    // Show problematic documents
    if (high.length > 0) {
      console.log(`\n❌ High Cognitive Load Documents (>70):`);
      high.sort((a, b) => b.cogLoad - a.cogLoad).forEach(doc => {
        console.log(`   • ${doc.title || doc.id}: ${doc.cogLoad.toFixed(1)} CLS`);
      });
    }
    
    if (moderate.length > 0) {
      console.log(`\n⚠️  Moderate Cognitive Load Documents (65-70):`);
      moderate.sort((a, b) => b.cogLoad - a.cogLoad).forEach(doc => {
        console.log(`   • ${doc.title || doc.id}: ${doc.cogLoad.toFixed(1)} CLS`);
      });
    }
    
    if (tooLow.length > 0) {
      console.log(`\n🔻 Potentially Over-Simplified Documents (<55):`);
      tooLow.sort((a, b) => a.cogLoad - b.cogLoad).forEach(doc => {
        console.log(`   • ${doc.title || doc.id}: ${doc.cogLoad.toFixed(1)} CLS`);
      });
    }
    
    // System health assessment
    const healthyDocs = optimal.length + lowRisk.length;
    const healthPercent = Math.round((healthyDocs / cogLoadScores.length) * 100);
    
    console.log(`\nSystem Cognitive Health: ${healthPercent}% (${healthyDocs}/${cogLoadScores.length} documents optimal/low-risk)`);
    
    if (healthPercent >= 80) {
      console.log('🎯 Excellent cognitive load management');
    } else if (healthPercent >= 60) {
      console.log('✅ Good cognitive load management');
    } else if (healthPercent >= 40) {
      console.log('⚠️  Moderate cognitive load issues - optimization recommended');
    } else {
      console.log('❌ Significant cognitive load issues - immediate optimization required');
    }
    
    console.log('\n');
  }

  /**
   * Analyze system coverage and gaps
   */
  analyzeCoverage() {
    console.log('📋 Coverage Analysis');
    console.log('===================');
    
    const nodes = this.graph.nodes;
    
    // Required documentation areas
    const requiredAreas = [
      'AI Documentation',
      'Project',
      'Guides',
      'Concerns',
      'Pitfalls'
    ];
    
    const coverage = {};
    requiredAreas.forEach(area => {
      coverage[area] = nodes.filter(node => this.getDocumentCategory(node.path) === area).length;
    });
    
    console.log('Documentation Coverage by Area:');
    Object.entries(coverage).forEach(([area, count]) => {
      const status = count > 0 ? '✅' : '❌';
      console.log(`  ${status} ${area}: ${count} documents`);
    });
    
    // Gap analysis
    const gaps = requiredAreas.filter(area => coverage[area] === 0);
    if (gaps.length > 0) {
      console.log(`\n⚠️  Missing Coverage Areas: ${gaps.join(', ')}`);
    } else {
      console.log('\n✅ All required areas have documentation');
    }
    
    console.log('\n');
  }

  /**
   * Analyze graph health and identify issues
   */
  analyzeHealth() {
    console.log('🔍 Health Analysis');
    console.log('==================');
    
    const issues = [];
    const warnings = [];
    
    // Check for missing files
    const missingFiles = this.graph.nodes.filter(node => !fs.existsSync(node.path));
    if (missingFiles.length > 0) {
      issues.push(`${missingFiles.length} referenced files do not exist`);
    }
    
    // Check for broken references in workflows
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
      warnings.push(`${noPriority.length} documents missing priority`);
    }
    
    // Check for missing cognitive load scores
    const noCogLoad = this.graph.nodes.filter(node => node.cogLoad === undefined);
    if (noCogLoad.length > 0) {
      warnings.push(`${noCogLoad.length} documents missing cognitive load scores`);
    }
    
    // Report health status
    if (issues.length === 0 && warnings.length === 0) {
      console.log('✅ Graph health: EXCELLENT');
      console.log('   No issues or warnings detected');
    } else {
      if (issues.length > 0) {
        console.log(`❌ Issues found: ${issues.length}`);
        issues.forEach(issue => console.log(`   • ${issue}`));
      }
      
      if (warnings.length > 0) {
        console.log(`⚠️  Warnings: ${warnings.length}`);
        warnings.forEach(warning => console.log(`   • ${warning}`));
      }
    }
    
    console.log('\n');
  }

  /**
   * Get document category from path
   */
  getDocumentCategory(filePath) {
    if (filePath.includes('/ai/')) return 'AI Documentation';
    if (filePath.includes('/project/')) return 'Project';
    if (filePath.includes('/concerns/')) return 'Concerns';
    if (filePath.includes('/guides/')) return 'Guides';
    if (filePath.includes('/pitfalls/')) return 'Pitfalls';
    return 'Other';
  }

  /**
   * Export analytics data as JSON
   */
  exportAnalytics() {
    const analytics = {
      timestamp: new Date().toISOString(),
      nodes: {
        total: this.graph.nodes.length,
        categories: {},
        priorities: {},
        cogLoadStats: null
      },
      edges: {
        total: this.graph.edges.length,
        relationships: {}
      },
      workflows: {
        total: 0,
        coverage: {}
      }
    };

    // Populate analytics data
    this.graph.nodes.forEach(node => {
      const category = this.getDocumentCategory(node.path);
      const priority = node.priority || 'unspecified';
      
      analytics.nodes.categories[category] = (analytics.nodes.categories[category] || 0) + 1;
      analytics.nodes.priorities[priority] = (analytics.nodes.priorities[priority] || 0) + 1;
    });

    // Cognitive load statistics
    const cogLoadScores = this.graph.nodes
      .filter(node => node.cogLoad !== undefined)
      .map(node => node.cogLoad);
    
    if (cogLoadScores.length > 0) {
      analytics.nodes.cogLoadStats = {
        total: cogLoadScores.reduce((sum, score) => sum + score, 0),
        average: cogLoadScores.reduce((sum, score) => sum + score, 0) / cogLoadScores.length,
        min: Math.min(...cogLoadScores),
        max: Math.max(...cogLoadScores),
        count: cogLoadScores.length
      };
    }

    this.graph.edges.forEach(edge => {
      const relationship = edge.relationship || 'unspecified';
      analytics.edges.relationships[relationship] = (analytics.edges.relationships[relationship] || 0) + 1;
    });

    // Dynamic workflow analysis
    const workflowsDir = path.join(process.cwd(), '.windsurf', 'workflows');
    const docsWorkflows = this.discoverDocsWorkflows(workflowsDir);
    
    analytics.workflows.total = docsWorkflows.length;
    
    docsWorkflows.forEach(workflow => {
      const documents = this.getWorkflowDocuments(workflow.path);
      analytics.workflows.coverage[workflow.name] = documents.length;
    });

    const outputPath = path.join(process.cwd(), 'docs', 'cog-load-graph-analytics.json');
    fs.writeFileSync(outputPath, JSON.stringify(analytics, null, 2));
    console.log(`📊 Analytics exported to: ${outputPath}`);
  }

  /**
   * CLI interface
   */
  handleCLI() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`Cognitive Load Graph Analytics - Document graph analysis and reporting

Usage:
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-analytics.js [options]

Options:
  --report         Generate comprehensive analytics report
  --export         Export analytics data as JSON
  --health         Check graph health only
  --cog-load       Analyze cognitive load metrics only
  --help, -h       Show this help message

Examples:
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-analytics.js --report
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-analytics.js --export
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-analytics.js --health
  cmd /c node docs/ai/maintenance/scripts/cog-load-graph-analytics.js --cog-load`);
      return;
    }

    if (args.includes('--export')) {
      this.exportAnalytics();
      return;
    }

    if (args.includes('--health')) {
      this.analyzeHealth();
      return;
    }

    if (args.includes('--cog-load')) {
      this.analyzeCognitiveLoad();
      return;
    }

    // Default: generate full report
    this.generateReport();
  }
}

// CLI execution
if (require.main === module) {
  try {
    const analytics = new CogLoadGraphAnalytics();
    analytics.handleCLI();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = CogLoadGraphAnalytics;
