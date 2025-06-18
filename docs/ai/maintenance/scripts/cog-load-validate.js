/**
 * Cognitive Load Validation Script
 * Quality gate to prevent cognitive load increases in documents
 * 
 * Compares current document cog-load against stored values in the graph
 * Fails if cognitive load has increased, preventing regression
 */

const fs = require('fs');
const path = require('path');
const CognitiveLoadAnalyzer = require('./cog-load-measure.js');

class CognitiveLoadValidator {
  constructor() {
    this.graphPath = path.join(process.cwd(), 'docs', 'document-graph.json');
    this.graph = this.loadGraph();
    this.analyzer = new CognitiveLoadAnalyzer();
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
   * Find document node by file path
   */
  findDocumentByPath(filePath) {
    // Normalize path to match graph format
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    return this.graph.nodes.find(node => {
      const nodePath = node.path.replace(/\\/g, '/');
      return nodePath === normalizedPath || nodePath.endsWith(normalizedPath);
    });
  }

  /**
   * Validate cognitive load for a specific file
   */
  validateFile(filePath) {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
          file: filePath
        };
      }

      // Find document in graph
      const document = this.findDocumentByPath(filePath);
      if (!document) {
        return {
          success: false,
          error: `Document not found in graph: ${filePath}`,
          file: filePath,
          suggestion: 'Run: cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --update-cog-load'
        };
      }

      // Check if document has stored cog-load
      if (typeof document.cogLoad !== 'number') {
        return {
          success: false,
          error: `No stored cog-load found for document: ${document.title}`,
          file: filePath,
          suggestion: 'Run: cmd /c node docs/ai/maintenance/scripts/cog-load-graph-maintainer.js --update-cog-load'
        };
      }

      // Calculate current cognitive load
      const result = this.analyzer.analyzeFile(filePath);
      if (result.error) {
        return {
          success: false,
          error: `Failed to analyze file: ${result.error}`,
          file: filePath
        };
      }

      const currentCogLoad = Math.round(result.cogLoad * 100) / 100;
      const storedCogLoad = document.cogLoad;
      const difference = currentCogLoad - storedCogLoad;
      const percentageChange = ((currentCogLoad - storedCogLoad) / storedCogLoad) * 100;

      // Define tolerance (allow minor fluctuations)
      const tolerance = 2.0; // 2 point tolerance
      const isWithinTolerance = Math.abs(difference) <= tolerance;

      // Validation logic
      const hasIncreased = difference > tolerance;
      const hasDecreased = difference < -tolerance;

      return {
        success: !hasIncreased, // Fail if cognitive load increased beyond tolerance
        file: filePath,
        document: {
          id: document.id,
          title: document.title,
          type: document.type,
          priority: document.priority
        },
        cogLoad: {
          current: currentCogLoad,
          stored: storedCogLoad,
          difference: Math.round(difference * 100) / 100,
          percentageChange: Math.round(percentageChange * 100) / 100,
          withinTolerance: isWithinTolerance
        },
        status: hasIncreased ? 'INCREASED' : hasDecreased ? 'DECREASED' : 'STABLE',
        components: result.components
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        file: filePath
      };
    }
  }

  /**
   * Validate all documents in the graph
   */
  validateAllDocuments() {
    console.log('🔍 Validating cognitive load for all documents...\n');

    const results = [];
    let passedCount = 0;
    let failedCount = 0;
    let totalImprovement = 0;

    this.graph.nodes.forEach((node, index) => {
      process.stdout.write(`\r📊 Progress: ${index + 1}/${this.graph.nodes.length} - ${node.title}`);
      
      const result = this.validateFile(node.path);
      results.push(result);

      if (result.success) {
        passedCount++;
        if (result.cogLoad && result.cogLoad.difference < 0) {
          totalImprovement += Math.abs(result.cogLoad.difference);
        }
      } else {
        failedCount++;
      }
    });

    console.log('\n'); // New line after progress

    // Generate summary report
    this.generateValidationReport(results, passedCount, failedCount, totalImprovement);

    return {
      results,
      summary: {
        total: results.length,
        passed: passedCount,
        failed: failedCount,
        success: failedCount === 0
      }
    };
  }

  /**
   * Generate validation report
   */
  generateValidationReport(results, passedCount, failedCount, totalImprovement) {
    console.log(`📊 Cognitive Load Validation Report`);
    console.log(`==================================`);
    console.log(`📄 Documents validated: ${results.length}`);
    console.log(`✅ Passed validation: ${passedCount}`);
    console.log(`❌ Failed validation: ${failedCount}`);
    
    if (totalImprovement > 0) {
      console.log(`📈 Total improvement: ${Math.round(totalImprovement * 100) / 100} points`);
    }
    console.log('');

    // Show failures
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      console.log(`❌ Validation Failures:`);
      failures.forEach(failure => {
        if (failure.status === 'INCREASED') {
          console.log(`   ${failure.document.title}: +${failure.cogLoad.difference} points (${failure.cogLoad.percentageChange}% increase)`);
        } else {
          console.log(`   ${failure.document?.title || path.basename(failure.file)}: ${failure.error}`);
        }
      });
      console.log('');
    }

    // Show improvements
    const improvements = results.filter(r => r.success && r.cogLoad && r.cogLoad.difference < -2);
    if (improvements.length > 0) {
      console.log(`📈 Significant Improvements:`);
      improvements.forEach(improvement => {
        console.log(`   ${improvement.document.title}: ${improvement.cogLoad.difference} points (${improvement.cogLoad.percentageChange}% decrease)`);
      });
      console.log('');
    }

    // Show stable documents
    const stable = results.filter(r => r.success && r.cogLoad && r.cogLoad.withinTolerance);
    if (stable.length > 0) {
      console.log(`✅ Stable documents (within tolerance): ${stable.length}`);
    }
  }

  /**
   * CLI interface
   */
  handleCLI() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`Cognitive Load Validation Tool

Usage:
  cmd /c node docs/ai/maintenance/scripts/cog-load-validate.js [options]

Options:
  --file <path>        Validate cognitive load for a specific file
  --all               Validate cognitive load for all documents in the graph
  --help, -h          Show this help message

Examples:
  cmd /c node docs/ai/maintenance/scripts/cog-load-validate.js --file docs/concerns/form-management.md
  cmd /c node docs/ai/maintenance/scripts/cog-load-validate.js --all

Exit Codes:
  0                   All validations passed
  1                   One or more validations failed (cognitive load increased)
  2                   System error (file not found, etc.)`);
      return;
    }

    const fileArg = args.find(arg => arg === '--file');
    const fileIndex = args.indexOf('--file');
    
    if (fileArg && fileIndex !== -1 && args[fileIndex + 1]) {
      const filePath = args[fileIndex + 1];
      const result = this.validateFile(filePath);
      
      if (result.error) {
        console.error(`❌ Validation Error: ${result.error}`);
        if (result.suggestion) {
          console.error(`💡 Suggestion: ${result.suggestion}`);
        }
        process.exit(2);
      }

      console.log(`🔍 Cognitive Load Validation: ${result.file}`);
      console.log(`==========================================`);
      console.log(`📄 Document: ${result.document.title} (${result.document.id})`);
      console.log(`🏷️  Type: ${result.document.type} | Priority: ${result.document.priority}`);
      console.log('');
      console.log(`🧠 Cognitive Load Comparison:`);
      console.log(`   Current:  ${result.cogLoad.current}/100`);
      console.log(`   Stored:   ${result.cogLoad.stored}/100`);
      console.log(`   Change:   ${result.cogLoad.difference > 0 ? '+' : ''}${result.cogLoad.difference} points (${result.cogLoad.percentageChange}%)`);
      console.log(`   Status:   ${result.status}`);
      console.log('');

      if (result.success) {
        if (result.status === 'DECREASED') {
          console.log(`✅ PASSED: Cognitive load improved by ${Math.abs(result.cogLoad.difference)} points`);
        } else {
          console.log(`✅ PASSED: Cognitive load is stable (within tolerance)`);
        }
        process.exit(0);
      } else {
        console.log(`❌ FAILED: Cognitive load increased beyond tolerance (+2 points)`);
        console.log(`💡 Consider simplifying the document or breaking it into smaller sections`);
        process.exit(1);
      }
    }

    if (args.includes('--all')) {
      const validation = this.validateAllDocuments();
      
      if (validation.summary.success) {
        console.log(`✅ All documents passed cognitive load validation`);
        process.exit(0);
      } else {
        console.log(`❌ ${validation.summary.failed} documents failed cognitive load validation`);
        console.log(`💡 Run individual validations to see specific issues`);
        process.exit(1);
      }
    }

    // Default: show help
    console.log('❌ Please specify a file to validate or use --all flag.');
    console.log('Run with --help for usage information.');
    process.exit(2);
  }
}

// CLI execution
if (require.main === module) {
  const validator = new CognitiveLoadValidator();
  validator.handleCLI();
}

module.exports = CognitiveLoadValidator;
