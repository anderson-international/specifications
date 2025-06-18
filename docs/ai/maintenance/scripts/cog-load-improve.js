#!/usr/bin/env node

/**
 * Cognitive Load Improvement Script
 * Analyzes documents and provides specific, actionable recommendations
 * to reduce cognitive load based on component analysis
 */

const fs = require('fs');
const path = require('path');
const CognitiveLoadAnalyzer = require('./cog-load-measure.js');

class CognitiveLoadImprover {
  constructor() {
    this.analyzer = new CognitiveLoadAnalyzer();
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
   * Analyze a file and provide improvement recommendations
   */
  analyzeFileForImprovement(filePath) {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
          file: filePath
        };
      }

      // Get current analysis
      const result = this.analyzer.analyzeFile(filePath);
      if (result.error) {
        return {
          success: false,
          error: `Failed to analyze file: ${result.error}`,
          file: filePath
        };
      }

      // Find document in graph for context
      const normalizedPath = filePath.replace(/\\/g, '/');
      const document = this.graph.nodes.find(node => {
        const nodePath = node.path.replace(/\\/g, '/');
        return nodePath === normalizedPath || nodePath.endsWith(normalizedPath);
      });

      // Identify primary driver of cognitive load
      const components = result.components;
      const primaryDriver = this.identifyPrimaryDriver(components);
      
      // Generate specific recommendations
      const recommendations = this.generateRecommendations(components, primaryDriver, result.cogLoad);
      
      // Generate improvement strategies
      const strategies = this.generateImprovementStrategies(primaryDriver, components);

      return {
        success: true,
        file: filePath,
        document: document ? {
          id: document.id,
          title: document.title,
          type: document.type,
          priority: document.priority
        } : null,
        analysis: {
          cogLoad: result.cogLoad,
          components: components,
          primaryDriver: primaryDriver
        },
        recommendations: recommendations,
        strategies: strategies
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
   * Identify the primary driver of cognitive load
   */
  identifyPrimaryDriver(components) {
    const { readability, lexical, coherence } = components;
    
    // Determine which component contributes most to cognitive load
    const drivers = [
      { name: 'readability', score: readability, weight: 0.4 },
      { name: 'lexical', score: lexical, weight: 0.3 },
      { name: 'coherence', score: coherence, weight: 0.3 }
    ];

    // Calculate weighted contribution
    const weightedDrivers = drivers.map(driver => ({
      ...driver,
      weightedScore: driver.score * driver.weight,
      severity: this.getScoreSeverity(driver.score)
    }));

    // Sort by weighted contribution (highest first)
    weightedDrivers.sort((a, b) => b.weightedScore - a.weightedScore);

    return {
      primary: weightedDrivers[0],
      secondary: weightedDrivers[1],
      tertiary: weightedDrivers[2],
      breakdown: weightedDrivers
    };
  }

  /**
   * Get severity level for a score based on empirical research
   */
  getScoreSeverity(score) {
    if (score >= 65) return 'critical';    // Significantly increased mental effort
    if (score >= 60) return 'high';       // Still cognitively taxing
    if (score >= 55) return 'moderate';    // Slightly above average but manageable
    if (score >= 50) return 'normal';      // Average/baseline mental effort
    return 'low';                          // Risk of oversimplification
  }

  /**
   * Generate specific recommendations based on component analysis
   */
  generateRecommendations(components, primaryDriver, cogLoad) {
    const recommendations = [];
    const { readability, lexical, coherence } = components;

    // Overall cognitive load assessment with research-based targets
    if (cogLoad > 60) {
      recommendations.push({
        priority: 'critical',
        category: 'overall',
        issue: `High cognitive load (${cogLoad}/100) - requires ${Math.round((cogLoad - 50) * 0.38)}% more mental effort than baseline`,
        action: 'Reduce to target range of 55-60 CLS for optimal comprehension',
        specifics: [
          'Target CLS 55-60: Only 5-10% extra mental effort above baseline',
          'Maintains comprehension while reducing cognitive burden',
          'Stop optimization at 55-60 to avoid oversimplification'
        ]
      });
    } else if (cogLoad > 55) {
      recommendations.push({
        priority: 'moderate',
        category: 'overall',
        issue: `Moderate cognitive load (${cogLoad}/100) - approaching optimal range`,
        action: 'Minor optimization needed to reach target range of 55-60 CLS',
        specifics: [
          'Close to optimal 55-60 CLS range',
          'Focus on quick wins to reduce cognitive burden',
          'Monitor information retention during optimization'
        ]
      });
    } else if (cogLoad < 55) {
      recommendations.push({
        priority: 'low',
        category: 'overall',
        issue: `Low cognitive load (${cogLoad}/100) - risk of oversimplification`,
        action: 'Consider adding necessary complexity or detail',
        specifics: [
          'CLS below 55 may indicate information loss',
          'Review for missing context or detail',
          'Ensure technical accuracy is maintained'
        ]
      });
    } else {
      recommendations.push({
        priority: 'optimal',
        category: 'overall',
        issue: `Optimal cognitive load (${cogLoad}/100) - within target range`,
        action: 'Maintain current cognitive load level',
        specifics: [
          'CLS 55-60: Optimal balance of complexity and accessibility',
          'No further optimization recommended',
          'Monitor during future edits to prevent cognitive load creep'
        ]
      });
    }

    // Readability-specific recommendations
    if (readability >= 65) {
      recommendations.push({
        priority: 'critical',
        category: 'readability',
        issue: `Very complex sentence structure (${readability}/100)`,
        action: 'Break down long, complex sentences into shorter, simpler ones',
        specifics: [
          'Target 15-20 words per sentence maximum',
          'Use active voice instead of passive voice',
          'Replace complex conjunctions with periods',
          'Eliminate nested clauses where possible'
        ]
      });
    } else if (readability >= 60) {
      recommendations.push({
        priority: 'high',
        category: 'readability',
        issue: `Complex sentence structure (${readability}/100)`,
        action: 'Simplify sentence construction and reduce average sentence length',
        specifics: [
          'Break compound sentences into simple sentences',
          'Use bullet points for lists instead of comma-separated items',
          'Replace semicolons with periods where appropriate'
        ]
      });
    }

    // Lexical complexity recommendations
    if (lexical >= 65) {
      recommendations.push({
        priority: 'high',
        category: 'lexical',
        issue: `High vocabulary complexity (${lexical}/100)`,
        action: 'Reduce technical jargon and complex terminology',
        specifics: [
          'Create a glossary for technical terms',
          'Replace complex words with simpler alternatives',
          'Define acronyms on first use',
          'Use everyday language where technical terms aren\'t necessary'
        ]
      });
    } else if (lexical >= 60) {
      recommendations.push({
        priority: 'medium',
        category: 'lexical',
        issue: `Moderate vocabulary complexity (${lexical}/100)`,
        action: 'Consider simplifying some technical terminology',
        specifics: [
          'Review technical terms for necessity',
          'Provide brief explanations for complex concepts'
        ]
      });
    }

    // Coherence recommendations
    if (coherence >= 30) {
      recommendations.push({
        priority: 'high',
        category: 'coherence',
        issue: `Poor topic coherence (${coherence}/100)`,
        action: 'Improve document structure and topic flow',
        specifics: [
          'Group related concepts together',
          'Use clear section headings',
          'Add transition sentences between topics',
          'Consider splitting unrelated topics into separate documents'
        ]
      });
    } else if (coherence >= 20) {
      recommendations.push({
        priority: 'medium',
        category: 'coherence',
        issue: `Moderate topic drift (${coherence}/100)`,
        action: 'Strengthen topic consistency and flow',
        specifics: [
          'Review section organization',
          'Add connecting sentences between paragraphs'
        ]
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Generate improvement strategies
   */
  generateImprovementStrategies(primaryDriver, components) {
    const strategies = [];

    // Strategy based on primary driver
    switch (primaryDriver.primary.name) {
      case 'readability':
        strategies.push({
          strategy: 'Sentence Simplification',
          description: 'Focus on reducing sentence complexity as the primary driver',
          steps: [
            '1. Identify sentences longer than 25 words',
            '2. Break compound sentences at conjunctions (and, but, or)',
            '3. Convert passive voice to active voice',
            '4. Replace complex phrases with simpler alternatives',
            '5. Use bullet points for complex lists'
          ],
          expectedImpact: 'High - Primary driver of current cognitive load'
        });
        break;

      case 'lexical':
        strategies.push({
          strategy: 'Vocabulary Simplification',
          description: 'Focus on reducing technical terminology density',
          steps: [
            '1. Identify technical terms and jargon',
            '2. Replace with everyday language where possible',
            '3. Create definitions for necessary technical terms',
            '4. Use consistent terminology throughout',
            '5. Add a glossary section'
          ],
          expectedImpact: 'High - Primary driver of current cognitive load'
        });
        break;

      case 'coherence':
        strategies.push({
          strategy: 'Structure Optimization',
          description: 'Focus on improving topic flow and organization',
          steps: [
            '1. Group related concepts together',
            '2. Create clear section hierarchies',
            '3. Add transition sentences',
            '4. Remove or relocate off-topic content',
            '5. Use consistent formatting and headings'
          ],
          expectedImpact: 'High - Primary driver of current cognitive load'
        });
        break;
    }

    // Quick wins strategy
    strategies.push({
      strategy: 'Quick Wins',
      description: 'Immediate improvements with minimal effort',
      steps: [
        '• Replace "which" with "that" where appropriate',
        '• Break up paragraphs longer than 4 sentences',
        '• Add more white space and formatting',
        '• Use active voice: "We recommend" vs "It is recommended"',
        '• Replace nominalizations: "make a decision" vs "decide"'
      ],
      expectedImpact: 'Medium - Easy to implement improvements'
    });

    return strategies;
  }

  /**
   * Analyze all high cognitive load documents
   */
  analyzeHighCogLoadDocuments() {
    console.log('🔍 Analyzing high cognitive load documents for improvements...\n');

    const results = [];
    let processedCount = 0;

    this.graph.nodes.forEach((node, index) => {
      if (typeof node.cogLoad === 'number' && node.cogLoad > 60) {
        process.stdout.write(`\r📊 Progress: ${processedCount + 1} high cog-load docs - ${node.title}`);
        
        const result = this.analyzeFileForImprovement(node.path);
        results.push(result);
        processedCount++;
      }
    });

    if (processedCount === 0) {
      console.log('✅ No documents with high cognitive load (>60) found.');
      return;
    }

    console.log('\n'); // New line after progress

    // Generate summary
    this.generateHighCogLoadSummary(results);

    return results;
  }

  /**
   * Generate summary for high cognitive load documents
   */
  generateHighCogLoadSummary(results) {
    const successfulResults = results.filter(r => r.success);
    
    console.log(`📊 High Cognitive Load Analysis Summary`);
    console.log(`=====================================`);
    console.log(`📄 Documents analyzed: ${results.length}`);
    console.log(`✅ Successful analyses: ${successfulResults.length}`);
    console.log('');

    // Primary driver analysis
    const driverCounts = { readability: 0, lexical: 0, coherence: 0 };
    successfulResults.forEach(result => {
      driverCounts[result.analysis.primaryDriver.primary.name]++;
    });

    console.log(`🎯 Primary Cognitive Load Drivers:`);
    Object.entries(driverCounts).forEach(([driver, count]) => {
      if (count > 0) {
        const percentage = Math.round((count / successfulResults.length) * 100);
        console.log(`   ${driver}: ${count} documents (${percentage}%)`);
      }
    });
    console.log('');

    // Show top recommendations by document
    successfulResults.forEach(result => {
      console.log(`📄 ${result.document?.title || path.basename(result.file)}`);
      console.log(`   Cog-load: ${result.analysis.cogLoad}/100`);
      console.log(`   Primary driver: ${result.analysis.primaryDriver.primary.name} (${result.analysis.primaryDriver.primary.score}/100)`);
      
      const criticalRecs = result.recommendations.filter(r => r.priority === 'critical');
      const highRecs = result.recommendations.filter(r => r.priority === 'high');
      
      if (criticalRecs.length > 0) {
        console.log(`   🔴 Critical: ${criticalRecs[0].action}`);
      } else if (highRecs.length > 0) {
        console.log(`   🟡 High: ${highRecs[0].action}`);
      }
      console.log('');
    });
  }

  /**
   * CLI interface
   */
  handleCLI() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`Cognitive Load Improvement Tool

Usage:
  cmd /c node docs/ai/maintenance/scripts/cog-load-improve.js [options]

Options:
  --file <path>        Analyze specific file and provide improvement recommendations
  --high-load         Analyze all documents with high cognitive load (>60)
  --help, -h          Show this help message

Examples:
  cmd /c node docs/ai/maintenance/scripts/cog-load-improve.js --file docs/concerns/form-management.md
  cmd /c node docs/ai/maintenance/scripts/cog-load-improve.js --high-load

The tool identifies the primary driver of cognitive load (readability, lexical complexity, 
or topic coherence) and provides specific, actionable recommendations for improvement.`);
      return;
    }

    const fileArg = args.find(arg => arg === '--file');
    const fileIndex = args.indexOf('--file');
    
    if (fileArg && fileIndex !== -1 && args[fileIndex + 1]) {
      const filePath = args[fileIndex + 1];
      const result = this.analyzeFileForImprovement(filePath);
      
      if (result.error) {
        console.error(`❌ Analysis Error: ${result.error}`);
        process.exit(1);
      }

      this.displayDetailedRecommendations(result);
      return;
    }

    if (args.includes('--high-load')) {
      this.analyzeHighCogLoadDocuments();
      return;
    }

    // Default: show help
    console.log('❌ Please specify a file to analyze or use --high-load flag.');
    console.log('Run with --help for usage information.');
    process.exit(1);
  }

  /**
   * Display detailed recommendations for a single file
   */
  displayDetailedRecommendations(result) {
    console.log(`🔍 Cognitive Load Improvement Analysis`);
    console.log(`=====================================`);
    
    if (result.document) {
      console.log(`📄 Document: ${result.document.title} (${result.document.id})`);
      console.log(`🏷️  Type: ${result.document.type} | Priority: ${result.document.priority}`);
    } else {
      console.log(`📄 File: ${path.basename(result.file)}`);
    }
    console.log('');

    // Current analysis
    console.log(`🧠 Current Cognitive Load Analysis:`);
    console.log(`   Total cog-load: ${result.analysis.cogLoad}/100`);
    console.log(`   Readability:    ${result.analysis.components.readability}/100`);
    console.log(`   Lexical:        ${result.analysis.components.lexical}/100`);
    console.log(`   Coherence:      ${result.analysis.components.coherence}/100`);
    console.log('');

    // Primary driver
    const primary = result.analysis.primaryDriver.primary;
    console.log(`🎯 Primary Driver: ${primary.name.toUpperCase()}`);
    console.log(`   Score: ${primary.score}/100 (${primary.severity} severity)`);
    console.log(`   Weighted contribution: ${Math.round(primary.weightedScore * 100) / 100}`);
    console.log('');

    // Recommendations
    if (result.recommendations.length > 0) {
      console.log(`💡 Specific Recommendations:`);
      result.recommendations.forEach((rec, index) => {
        const priorityEmoji = rec.priority === 'critical' ? '🔴' : rec.priority === 'high' ? '🟡' : '🟢';
        console.log(`\n   ${priorityEmoji} ${rec.priority.toUpperCase()}: ${rec.category}`);
        console.log(`   Issue: ${rec.issue}`);
        console.log(`   Action: ${rec.action}`);
        
        if (rec.specifics && rec.specifics.length > 0) {
          console.log(`   Specifics:`);
          rec.specifics.forEach(specific => {
            console.log(`     • ${specific}`);
          });
        }
      });
      console.log('');
    }

    // Strategies
    if (result.strategies.length > 0) {
      console.log(`🛠️  Improvement Strategies:`);
      result.strategies.forEach((strategy, index) => {
        console.log(`\n   ${index + 1}. ${strategy.strategy}`);
        console.log(`   ${strategy.description}`);
        console.log(`   Expected Impact: ${strategy.expectedImpact}`);
        console.log(`   Steps:`);
        strategy.steps.forEach(step => {
          console.log(`     ${step}`);
        });
      });
    }
  }
}

// CLI execution
if (require.main === module) {
  const improver = new CognitiveLoadImprover();
  improver.handleCLI();
}

module.exports = CognitiveLoadImprover;
