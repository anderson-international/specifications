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

      // Use primary analysis (with smart code exclusion) for recommendations
      const cogLoad = result.primary.cogLoad;
      const components = result.primary.components;
      
      // Identify primary driver of cognitive load
      const primaryDriver = this.identifyPrimaryDriver(components);
      
      // Generate specific recommendations
      const recommendations = this.generateRecommendations(components, primaryDriver, cogLoad);
      
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
          cogLoad: result.primary.cogLoad,
          components: result.primary.components,
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
          'Replace complex phrases and idioms with simpler, direct alternatives',
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
        priority: 'critical',
        category: 'coherence',
        issue: `Extremely poor topic coherence (${coherence}/100)`,
        action: 'Complete structural reorganization required to improve logical flow and thematic consistency',
        specifics: [
          'Create a clear outline to organize ideas in logical sequence',
          'Use predictable paragraph organization with topic sentences at the beginning',
          'Ensure each paragraph focuses on a single main idea or theme',
          'Add transition words and phrases to show relationships between sections',
          'Repeat key terms throughout to reinforce main threads',
          'Maintain consistent tone and style throughout the document',
          'Use headings and subheadings to organize content visually',
          'Review the entire document focusing on logical connections and flow'
        ]
      });
    } else if (coherence >= 20) {
      recommendations.push({
        priority: 'high',
        category: 'coherence',
        issue: `Very poor topic coherence (${coherence}/100)`,
        action: 'Major structural improvements needed to enhance document flow and organization',
        specifics: [
          'Establish clear structure with logical paragraph sequence',
          'Add effective transition words (however, therefore, furthermore, in addition)',
          'Start paragraphs with clear, concise topic sentences',
          'Repeat important concepts and terms to reinforce main threads',
          'Use synonyms thoughtfully to maintain connection between ideas',
          'Break text into smaller paragraphs with clear headings',
          'Avoid abrupt topic shifts by adding bridging sentences'
        ]
      });
    } else if (coherence >= 15) {
      recommendations.push({
        priority: 'medium',
        category: 'coherence',
        issue: `Poor topic coherence (${coherence}/100)`,
        action: 'Strengthen topic consistency and improve paragraph flow',
        specifics: [
          'Use clear topic sentences at paragraph starts',
          'Add transitional phrases between sections (e.g., "for example," "therefore")',
          'Group related concepts together more effectively',
          'Use consistent terminology to reduce reader confusion',
          'Place modifiers close to words they modify to avoid confusion',
          'Review for logical connections between ideas'
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
            '1. Identify sentences longer than 20 words (reduced threshold for greater impact)',
            '2. Break compound and complex sentences at conjunctions and relative clauses',
            '3. Convert passive voice to active voice consistently',
            '4. Replace complex phrases and idioms with simpler, direct alternatives',
            '5. Use bullet points or numbered lists for enumerations and complex sequences',
            '6. Limit use of nested clauses and parentheses to reduce parsing difficulty'
          ],
          expectedImpact: 'High - Primary driver of current cognitive load'
        });
        break;

      case 'lexical':
        strategies.push({
          strategy: 'Comprehensive Lexical Complexity Reduction',
          description: 'Focus on systematically reducing vocabulary difficulty and complexity',
          steps: [
            '1. Replace advanced, rare, or technical words with common, everyday alternatives',
            '2. Prefer high-frequency words familiar to a broad audience (e.g., "utilize" → "use")',
            '3. Avoid jargon, idioms, and specialized terminology unless absolutely necessary',
            '4. Use consistent, familiar terms throughout - avoid unnecessary synonyms',
            '5. Prefer concrete nouns and verbs over abstract or nominalized forms',
            '6. Use base or root forms rather than complex morphological variants',
            '7. Avoid complex collocations and phrasal verbs - use straightforward combinations',
            '8. Maintain uniform terms for concepts to reduce confusion and cognitive effort',
            '9. Test vocabulary using readability tools and replace complex words systematically',
            '10. Conduct user testing focused on lexical simplicity and clarity'
          ],
          expectedImpact: 'High - Primary driver of current cognitive load'
        });
        break;

      case 'coherence':
        strategies.push({
          strategy: 'Coherence Enhancement',
          description: 'Complete structural reorganization to improve logical flow and thematic consistency',
          steps: [
            '• Create a clear outline to organize ideas in logical sequence',
            '• Use predictable paragraph organization with topic sentences at the beginning',
            '• Ensure each paragraph focuses on a single main idea or theme',
            '• Add effective transition words (however, therefore, furthermore, in addition)',
            '• Repeat important concepts and terms to reinforce main threads',
            '• Use synonyms thoughtfully to maintain connection between ideas',
            '• Build lexical chains by grouping related words for semantic cohesion',
            '• Avoid abrupt topic shifts by adding bridging sentences between paragraphs',
            '• Place modifiers close to words they modify to avoid confusion',
            '• Maintain consistent tone and style throughout the document',
            '• Use headings and subheadings to organize content visually',
            '• Break text into smaller paragraphs for better readability',
            '• Review entire document focusing on logical connections and flow'
          ],
          expectedImpact: 'Critical - Essential for extremely low coherence scores (<20)'
        });
        break;
    }

    // Enhanced Quick Wins strategy
    strategies.push({
      strategy: 'Quick Wins',
      description: 'Immediate, low-effort improvements with measurable impact',
      steps: [
        '• Replace "which" with "that" where restrictive clauses apply',
        '• Break paragraphs longer than 3 sentences to improve visual clarity',
        '• Increase white space and use formatting (bold, italics) to emphasize key points',
        '• Use active voice consistently ("We recommend" vs. "It is recommended")',
        '• Replace nominalizations with verbs ("make a decision" → "decide")',
        '• Avoid double negatives and ambiguous phrasing',
        '• Use consistent terminology to reduce reader confusion'
      ],
      expectedImpact: 'Medium - Easy to implement improvements'
    });

    // Add vocabulary simplification if not primary driver but still high
    if (primaryDriver.primary.name !== 'lexical' && components.lexical >= 60) {
      strategies.push({
        strategy: 'Lexical Complexity Reduction',
        description: 'Decrease lexical complexity to make text simpler and more accessible',
        steps: [
          '• Replace advanced, rare, or technical words with common, everyday alternatives',
          '• Prefer high-frequency words that are familiar to a broad audience',
          '• Avoid jargon, idioms, and specialized terminology unless absolutely necessary',
          '• Use consistent, familiar terms throughout (avoid unnecessary synonyms)',
          '• Prefer concrete nouns and verbs over abstract or nominalized forms',
          '• Use base or root forms of words rather than complex morphological variants',
          '• Use straightforward word combinations rather than idiomatic collocations',
          '• Maintain uniform terms for concepts to reduce confusion and cognitive effort',
          '• Test vocabulary using readability tools and replace complex words with simpler alternatives'
        ],
        expectedImpact: 'Medium to High - Supporting strategy for cognitive load reduction'
      });
    }

    // Add structural improvements if coherence is problematic but not primary
    if (primaryDriver.primary.name !== 'coherence' && components.coherence >= 25) {
      strategies.push({
        strategy: 'Structural Enhancement',
        description: 'Improve document organization and flow',
        steps: [
          '• Use clear topic sentences at paragraph starts',
          '• Add transitional phrases between sections',
          '• Group related concepts together',
          '• Create consistent heading hierarchy'
        ],
        expectedImpact: 'Medium - Supporting strategy'
      });
    }

    // Visual and Formatting Enhancements
    strategies.push({
      strategy: 'Visual and Formatting Enhancements',
      description: 'Support text comprehension through design and layout',
      steps: [
        '• Use headings and subheadings to break content into manageable sections',
        '• Employ bullet points, numbered lists, and tables for clarity',
        '• Highlight key terms or concepts with consistent formatting',
        '• Avoid dense blocks of text; use spacing to reduce visual fatigue',
        '• Use consistent formatting patterns throughout the document'
      ],
      expectedImpact: 'Medium - Supports comprehension and reduces visual fatigue'
    });

    // Readability Testing and Iteration
    if (components.readability > 60 || components.lexical > 60 || components.coherence > 25) {
      strategies.push({
        strategy: 'Readability Testing and Iteration',
        description: 'Continuous improvement based on measurable feedback',
        steps: [
          '• Regularly measure cognitive load metrics after revisions',
          '• Focus revisions on sections with highest cognitive load scores',
          '• Track changes over iterations to monitor progress',
          '• Test one strategy at a time to measure effectiveness',
          '• Stop optimization when reaching 55-60 CLS target range'
        ],
        expectedImpact: 'High - Ensures systematic and effective optimization'
      });
    }

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
  --file <path>           Generate improvement recommendations for a specific file
  --batch-high-cls        Analyze all documents >58 CLS and generate recommendations
  --help, -h             Show this help message

Examples:
  cmd /c node docs/ai/maintenance/scripts/cog-load-improve.js --file docs/concerns/ui-ux-patterns.md
  cmd /c node docs/ai/maintenance/scripts/cog-load-improve.js --batch-high-cls`);
      return;
    }

    const fileArg = args.find(arg => arg === '--file');
    const fileIndex = args.indexOf('--file');
    
    if (fileArg && fileIndex !== -1 && args[fileIndex + 1]) {
      const filePath = args[fileIndex + 1];
      this.analyzeFile(filePath);
      return;
    }

    if (args.includes('--batch-high-cls')) {
      this.batchAnalyzeHighCLS();
      return;
    }

    // Default: show help
    console.log('❌ Please specify a file to analyze or use --batch-high-cls flag.');
    console.log('Run with --help for usage information.');
  }

  /**
   * Batch analyze all documents that exceed 58 CLS threshold
   */
  batchAnalyzeHighCLS() {
    try {
      // Read document graph
      const graphPath = 'docs/document-graph.json';
      if (!fs.existsSync(graphPath)) {
        throw new Error(`Document graph not found: ${graphPath}`);
      }

      const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
      const documents = graph.nodes || [];

      if (documents.length === 0) {
        throw new Error('No documents found in document graph');
      }

      console.log(`🔍 Scanning ${documents.length} documents for high cognitive load (>58 CLS)...`);
      console.log('');

      // First pass: measure all documents and identify high CLS ones
      const highClsDocuments = [];
      
      documents.forEach((doc, index) => {
        process.stdout.write(`\r📊 Scanning: ${index + 1}/${documents.length} - ${doc.title || doc.path}`);
        
        try {
          if (fs.existsSync(doc.path)) {
            const content = fs.readFileSync(doc.path, 'utf8');
            const result = this.analyzer.calculateCogLoadWithSmartExclusion(content, doc.path);
            
            if (result.primary.cogLoad > 58) {
              highClsDocuments.push({
                ...doc,
                cogLoad: result.primary.cogLoad,
                components: result.primary.components,
                codeExcluded: result.codeExcluded
              });
            }
          }
        } catch (error) {
          // Silently skip files with errors during scanning
        }
      });

      console.log('\n'); // New line after progress

      if (highClsDocuments.length === 0) {
        console.log('🎉 Excellent! No documents exceed 58 CLS threshold');
        console.log('📊 All documents are within the optimal cognitive load range');
        return;
      }

      // Sort by highest CLS first
      highClsDocuments.sort((a, b) => b.cogLoad - a.cogLoad);

      console.log(`🔴 Found ${highClsDocuments.length} documents exceeding 58 CLS threshold:`);
      console.log('');

      // Second pass: generate improvement recommendations for each high CLS document
      highClsDocuments.forEach((doc, index) => {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`📄 Document ${index + 1}/${highClsDocuments.length}: ${doc.title || path.basename(doc.path)}`);
        console.log(`🏷️  Path: ${doc.path}`);
        console.log(`🧠 Current CLS: ${doc.cogLoad}/100 ${doc.codeExcluded ? '(code excluded)' : ''}`);
        console.log(`${'='.repeat(80)}`);

        // Generate detailed recommendations for this document
        const result = this.analyzeFileForImprovement(doc.path);
        if (result.success) {
          this.displayDetailedRecommendations(result);
        } else {
          console.log(`❌ Failed to analyze ${doc.path}: ${result.error}`);
        }
      });

      // Summary
      console.log(`\n${'='.repeat(80)}`);
      console.log(`📊 BATCH ANALYSIS SUMMARY`);
      console.log(`${'='.repeat(80)}`);
      console.log(`🔴 High CLS Documents: ${highClsDocuments.length}`);
      console.log(`📈 Average CLS: ${Math.round(highClsDocuments.reduce((sum, doc) => sum + doc.cogLoad, 0) / highClsDocuments.length * 100) / 100}/100`);
      console.log(`🎯 Target: Reduce all documents to ≤58 CLS`);
      
      const criticalDocs = highClsDocuments.filter(doc => doc.cogLoad > 65).length;
      if (criticalDocs > 0) {
        console.log(`⚠️  Critical Priority: ${criticalDocs} documents >65 CLS need immediate attention`);
      }

    } catch (error) {
      console.error(`❌ Error during batch analysis: ${error.message}`);
      process.exit(1);
    }
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
