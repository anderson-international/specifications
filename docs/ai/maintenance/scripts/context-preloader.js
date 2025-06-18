#!/usr/bin/env node

/**
 * Context Pre-loader - Proactive context loading based on file types and editing patterns
 * Integrates with the document graph to suggest and pre-load relevant documentation
 */

const fs = require('fs');
const path = require('path');

class ContextPreloader {
  constructor() {
    this.graphPath = path.join(process.cwd(), 'docs', 'document-graph.json');
    this.graph = this.loadGraph();
    this.contextMappings = this.buildContextMappings();
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
   * Build context mappings based on file patterns
   */
  buildContextMappings() {
    return {
      // React components
      component: {
        patterns: [/\.tsx$/, /components\//i, /\.jsx$/],
        documents: ['react-patterns', 'ui-ux-patterns', 'code-quality-standards'],
        priority: 'high'
      },
      
      // Pages (Next.js)
      page: {
        patterns: [/page\.tsx$/, /layout\.tsx$/, /app\//i],
        documents: ['react-patterns', 'ui-ux-design', 'api-design'],
        priority: 'high'
      },
      
      // API routes
      api: {
        patterns: [/\/api\//i, /route\.ts$/, /api\.ts$/],
        documents: ['api-design', 'database', 'authentication'],
        priority: 'critical'
      },
      
      // Forms
      form: {
        patterns: [/form/i, /Form/],
        documents: ['form-management', 'database-form-integration', 'react-patterns'],
        priority: 'high'
      },
      
      // Database
      database: {
        patterns: [/prisma/i, /schema/i, /\.sql$/, /migration/i],
        documents: ['database', 'database-form-integration'],
        priority: 'critical'
      },
      
      // Utilities
      utility: {
        patterns: [/utils\//i, /lib\//i, /helpers\//i],
        documents: ['code-quality-standards', 'technical-stack'],
        priority: 'medium'
      },
      
      // Styles
      style: {
        patterns: [/\.css$/, /\.scss$/, /styles\//i],
        documents: ['ui-ux-patterns', 'ui-ux-design'],
        priority: 'medium'
      },
      
      // Configuration
      config: {
        patterns: [/config/i, /\.config\./i, /package\.json$/, /tsconfig/i],
        documents: ['technical-stack', 'code-quality-standards'],
        priority: 'low'
      }
    };
  }

  /**
   * Detect file type based on path
   */
  detectFileType(filePath) {
    const matches = [];
    
    for (const [type, config] of Object.entries(this.contextMappings)) {
      for (const pattern of config.patterns) {
        if (pattern.test(filePath)) {
          matches.push({
            type,
            priority: config.priority,
            documents: config.documents
          });
        }
      }
    }
    
    // Sort by priority (critical > high > medium > low)
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    matches.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return matches;
  }

  /**
   * Get document suggestions for a file
   */
  getDocumentSuggestions(filePath) {
    const fileTypes = this.detectFileType(filePath);
    
    if (fileTypes.length === 0) {
      return {
        suggested: [],
        reason: 'No matching patterns found',
        priority: 'none'
      };
    }
    
    // Get unique documents from all matching types
    const allDocuments = new Set();
    fileTypes.forEach(type => {
      type.documents.forEach(doc => allDocuments.add(doc));
    });
    
    // Map to full document info
    const suggestedDocs = Array.from(allDocuments).map(docId => {
      const node = this.graph.nodes.find(n => n.id === docId);
      return node ? {
        id: docId,
        title: node.title,
        path: node.path,
        priority: node.priority || 'medium'
      } : null;
    }).filter(Boolean);
    
    return {
      suggested: suggestedDocs,
      reason: `Detected file types: ${fileTypes.map(t => t.type).join(', ')}`,
      priority: fileTypes[0].priority,
      fileTypes: fileTypes.map(t => t.type)
    };
  }

  /**
   * Generate pre-loading commands for a file
   */
  generatePreloadCommands(filePath) {
    const suggestions = this.getDocumentSuggestions(filePath);
    
    if (suggestions.suggested.length === 0) {
      return [];
    }
    
    return suggestions.suggested.map(doc => ({
      command: `view_line_range`,
      file: doc.path,
      description: `Pre-load: ${doc.title}`,
      priority: doc.priority
    }));
  }

  /**
   * CLI interface for file analysis
   */
  analyzeFile(filePath) {
    console.log(`🔍 Context Analysis: ${filePath}\n`);
    
    const suggestions = this.getDocumentSuggestions(filePath);
    
    console.log(`📊 Analysis Results:`);
    console.log(`   File Types: ${suggestions.fileTypes?.join(', ') || 'Unknown'}`);
    console.log(`   Priority: ${suggestions.priority}`);
    console.log(`   Reason: ${suggestions.reason}\n`);
    
    if (suggestions.suggested.length > 0) {
      console.log(`📚 Suggested Documents (${suggestions.suggested.length}):`);
      suggestions.suggested.forEach(doc => {
        console.log(`   • ${doc.title} (${doc.priority})`);
        console.log(`     Path: ${doc.path}`);
      });
      
      console.log(`\n🤖 Pre-load Commands:`);
      const commands = this.generatePreloadCommands(filePath);
      commands.forEach((cmd, index) => {
        console.log(`   ${index + 1}. ${cmd.description}`);
        console.log(`      ${cmd.command} ${cmd.file}`);
      });
    } else {
      console.log(`❌ No document suggestions found`);
    }
  }

  /**
   * Batch analyze multiple files
   */
  batchAnalyze(filePatterns) {
    console.log('📁 Batch Context Analysis\n');
    
    const files = [];
    filePatterns.forEach(pattern => {
      // Simple glob-like matching for demonstration
      if (fs.existsSync(pattern)) {
        files.push(pattern);
      }
    });
    
    if (files.length === 0) {
      console.log('❌ No files found matching patterns');
      return;
    }
    
    console.log(`📊 Analyzing ${files.length} files\n`);
    
    files.forEach((file, index) => {
      console.log(`\n--- File ${index + 1}/${files.length} ---`);
      this.analyzeFile(file);
    });
  }

  /**
   * CLI interface
   */
  handleCLI() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`Context Pre-loader - Proactive context loading for development

Usage:
  cmd /c node context-preloader.js [options] <file-path>

Options:
  --analyze <file>      Analyze a specific file for context suggestions
  --batch <pattern>     Batch analyze files matching pattern
  --help, -h           Show this help message

Examples:
  cmd /c node context-preloader.js --analyze src/components/ProductCard.tsx
  cmd /c node context-preloader.js --batch "src/pages/*.tsx"
  cmd /c node context-preloader.js --analyze app/api/products/route.ts`);
      return;
    }

    const analyzeIndex = args.indexOf('--analyze');
    if (analyzeIndex !== -1 && args[analyzeIndex + 1]) {
      this.analyzeFile(args[analyzeIndex + 1]);
      return;
    }

    const batchIndex = args.indexOf('--batch');
    if (batchIndex !== -1 && args[batchIndex + 1]) {
      this.batchAnalyze([args[batchIndex + 1]]);
      return;
    }

    // Default: show help
    this.handleCLI = () => console.log('Use --help for usage information');
    this.handleCLI();
  }
}

// CLI execution
if (require.main === module) {
  try {
    const preloader = new ContextPreloader();
    preloader.handleCLI();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = ContextPreloader;
