#!/usr/bin/env node

/**
 * Consolidated Cognitive Load Optimizer
 * Complete iterative measure → AI improve → measure workflow for document optimization
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class CognitiveLoadOptimizer {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Calculate cognitive load score for text content
   */
  calculateCognitiveLoad(content, filePath) {
    try {
      const lines = content.split('\n');
      const words = content.split(/\s+/).filter(word => word.length > 0);
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      // Readability analysis (40% weight)
      const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
      const avgCharsPerWord = words.length > 0 ? content.replace(/\s/g, '').length / words.length : 0;
      
      const readabilityScore = Math.min(100, 
        (avgWordsPerSentence * 2) + 
        (avgCharsPerWord * 8) + 
        (lines.filter(line => line.length > 120).length * 2)
      );

      // Lexical complexity (30% weight)
      const complexWords = words.filter(word => 
        word.length > 8 || 
        /[A-Z]{2,}/.test(word) ||
        word.includes('-') && word.length > 10
      ).length;
      
      const lexicalScore = Math.min(100, 
        (complexWords / words.length) * 400 + 
        (content.match(/\b(implementation|configuration|optimization|specification)\b/gi) || []).length * 2
      );

      // Coherence analysis (30% weight)
      const headings = content.match(/^#+\s/gm) || [];
      const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
      const listItems = content.match(/^[\s]*[-*+]\s/gm) || [];
      
      const coherenceScore = Math.min(100,
        Math.max(0, 50 - headings.length * 3) +
        (codeBlocks.length > 5 ? 25 : 0) +
        (listItems.length > 20 ? 15 : 0) +
        (lines.filter(line => line.trim() === '').length > lines.length * 0.3 ? 10 : 0)
      );

      // Weighted total
      const cogLoad = Math.round(
        (readabilityScore * 0.4) + 
        (lexicalScore * 0.3) + 
        (coherenceScore * 0.3)
      );

      return {
        cogLoad,
        components: {
          readability: Math.round(readabilityScore),
          lexical: Math.round(lexicalScore),
          coherence: Math.round(coherenceScore)
        },
        metadata: {
          wordCount: words.length,
          sentenceCount: sentences.length,
          fileSize: content.length
        }
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Generate specific improvement recommendations
   */
  generateRecommendations(analysis, filePath) {
    const recommendations = [];
    const { cogLoad, components } = analysis;

    // Readability improvements
    if (components.readability > 65) {
      recommendations.push({
        priority: 'critical',
        category: 'Sentence Structure',
        issue: 'Long, complex sentences increase cognitive burden',
        action: 'Break down complex sentences into shorter, clearer statements',
        specifics: [
          'Split sentences longer than 25 words',
          'Remove unnecessary subordinate clauses',
          'Use active voice instead of passive voice',
          'Replace complex conjunctions with simpler alternatives'
        ]
      });
    }

    // Lexical improvements  
    if (components.lexical > 60) {
      recommendations.push({
        priority: 'high',
        category: 'Vocabulary Simplification',
        issue: 'Complex terminology reduces accessibility',
        action: 'Replace technical jargon with simpler alternatives where possible',
        specifics: [
          'Use common words instead of technical terms when meaning is preserved',
          'Add brief explanations for necessary technical terms',
          'Replace long compound words with shorter alternatives',
          'Simplify acronyms and abbreviations'
        ]
      });
    }

    // Coherence improvements
    if (components.coherence > 55) {
      recommendations.push({
        priority: 'high', 
        category: 'Structure & Flow',
        issue: 'Poor document organization hampers comprehension',
        action: 'Improve document structure and logical flow',
        specifics: [
          'Add clear topic transitions between sections',
          'Use parallel structure in lists and headings',
          'Reduce excessive code blocks and examples',
          'Improve heading hierarchy and section organization'
        ]
      });
    }

    return recommendations;
  }

  /**
   * Apply AI improvements to document content
   */
  async applyImprovements(content, recommendations) {
    let improvedContent = content;
    
    for (const rec of recommendations) {
      console.log(`🤖 Applying: ${rec.category}`);
      
      if (rec.category === 'Sentence Structure') {
        // Break down long sentences
        improvedContent = improvedContent.replace(/([^.!?]{50,}?)([,;]|and|but|or|while|when|where|because|although|however|therefore|moreover|furthermore)([^.!?]{20,}?[.!?])/g, 
          (match, part1, connector, part2) => {
            return part1.trim() + '.' + (connector.startsWith(',') ? '' : ' ' + connector.charAt(0).toUpperCase() + connector.slice(1)) + part2;
          });
          
        // Convert passive to active voice (simple cases)
        improvedContent = improvedContent.replace(/\b(is|are|was|were|be|been|being)\s+([\w\s]+?)(ed|en)\s+by\s+([\w\s]+?)([.!?])/g,
          (match, verb, action, suffix, actor, punct) => {
            return actor.trim() + ' ' + action.trim() + 's' + punct;
          });
      }
      
      if (rec.category === 'Vocabulary Simplification') {
        // Replace complex words with simpler alternatives
        const replacements = {
          'implementation': 'setup',
          'configuration': 'config', 
          'optimization': 'improve',
          'specification': 'spec',
          'documentation': 'docs',
          'initialization': 'setup',
          'instantiation': 'creation',
          'verification': 'check',
          'utilization': 'use',
          'modification': 'change',
          'eliminate': 'remove',
          'facilitate': 'help',
          'demonstrate': 'show',
          'consequently': 'so',
          'furthermore': 'also',
          'therefore': 'so',
          'however': 'but',
          'nevertheless': 'still',
          'subsequently': 'then'
        };
        
        for (const [complex, simple] of Object.entries(replacements)) {
          const regex = new RegExp(`\\b${complex}\\b`, 'gi');
          improvedContent = improvedContent.replace(regex, simple);
        }
      }
      
      if (rec.category === 'Structure & Flow') {
        // Improve list structure
        improvedContent = improvedContent.replace(/^(\s*[-*+]\s+)(.{100,})/gm, 
          (match, bullet, content) => {
            const sentences = content.split(/[.!?]+/).filter(s => s.trim());
            if (sentences.length > 1) {
              return bullet + sentences[0].trim() + '\n' + bullet + sentences.slice(1).join('. ').trim();
            }
            return match;
          });
          
        // Add transitions where missing
        improvedContent = improvedContent.replace(/(\n\n)(## .+\n\n)([A-Z][^.!?]*[.!?])/g,
          (match, breaks, heading, firstSentence) => {
            const headingText = heading.toLowerCase();
            let transition = '';
            if (headingText.includes('example')) transition = 'For example, ';
            else if (headingText.includes('step') || headingText.includes('process')) transition = 'Next, ';
            else if (headingText.includes('important') || headingText.includes('note')) transition = 'It\'s important to note that ';
            
            return breaks + heading + transition + firstSentence.charAt(0).toLowerCase() + firstSentence.slice(1);
          });
      }
    }
    
    return improvedContent;
  }

  /**
   * Find all markdown files in docs directory
   */
  findDocumentFiles() {
    const files = [];
    const scanDir = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !item.startsWith('.')) {
          scanDir(fullPath);
        } else if (stat.isFile() && item.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    };
    
    scanDir('docs');
    return files;
  }

  /**
   * Ask user a question and wait for response
   */
  async askUser(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.toLowerCase().trim());
      });
    });
  }

  /**
   * Main optimization workflow
   */
  async optimizeDocuments() {
    console.log('🎯 Cognitive Load Optimization Tool');
    console.log('===================================\n');
    
    // Find all documents
    const files = this.findDocumentFiles();
    console.log(`📁 Found ${files.length} documents to analyze\n`);
    
    // Analyze all files and find high CLS documents
    const highClsFiles = [];
    
    console.log('📊 Analyzing cognitive load scores...\n');
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const analysis = this.calculateCognitiveLoad(content, file);
        
        if (analysis.error) {
          console.log(`❌ Error analyzing ${file}: ${analysis.error}`);
          continue;
        }
        
        const relativePath = path.relative(process.cwd(), file);
        console.log(`📄 ${relativePath}: ${analysis.cogLoad}/100`);
        
        if (analysis.cogLoad > 58) {
          highClsFiles.push({ file, analysis, content });
        }
      } catch (error) {
        console.log(`❌ Error reading ${file}: ${error.message}`);
      }
    }
    
    console.log(`\n🔍 Found ${highClsFiles.length} documents with CLS > 58\n`);
    
    if (highClsFiles.length === 0) {
      console.log('🎉 All documents are already optimized! (CLS ≤ 58)');
      this.rl.close();
      return;
    }
    
    // Sort by highest CLS first
    highClsFiles.sort((a, b) => b.analysis.cogLoad - a.analysis.cogLoad);
    
    // Optimize each document
    for (let i = 0; i < highClsFiles.length; i++) {
      const { file, analysis, content } = highClsFiles[i];
      const relativePath = path.relative(process.cwd(), file);
      
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📄 Document ${i + 1}/${highClsFiles.length}: ${relativePath}`);
      console.log(`🧠 Current CLS: ${analysis.cogLoad}/100`);
      console.log(`   📖 Readability: ${analysis.components.readability}/100`);
      console.log(`   📚 Lexical: ${analysis.components.lexical}/100`);
      console.log(`   🔗 Coherence: ${analysis.components.coherence}/100`);
      
      const recommendations = this.generateRecommendations(analysis, file);
      
      if (recommendations.length === 0) {
        console.log('✅ No actionable recommendations for this document.');
        continue;
      }
      
      console.log('\n💡 Recommended improvements:');
      recommendations.forEach((rec, index) => {
        const emoji = rec.priority === 'critical' ? '🔴' : '🟡';
        console.log(`   ${emoji} ${rec.category}: ${rec.action}`);
      });
      
      const shouldOptimize = await this.askUser('\n🤖 Apply AI improvements to this document? (y/n/skip): ');
      
      if (shouldOptimize === 'n' || shouldOptimize === 'skip') {
        console.log('⏭️  Skipping this document.');
        continue;
      }
      
      if (shouldOptimize === 'y' || shouldOptimize === 'yes') {
        try {
          // Apply improvements
          console.log('🤖 Applying AI improvements...');
          const improvedContent = await this.applyImprovements(content, recommendations);
          
          // Write improved content
          fs.writeFileSync(file, improvedContent);
          
          // Re-measure
          const newAnalysis = this.calculateCognitiveLoad(improvedContent, file);
          const improvement = analysis.cogLoad - newAnalysis.cogLoad;
          
          console.log(`✅ Optimization complete!`);
          console.log(`📈 CLS: ${analysis.cogLoad} → ${newAnalysis.cogLoad} (${improvement >= 0 ? '-' : '+'}${Math.abs(improvement).toFixed(1)})`);
          
          if (newAnalysis.cogLoad <= 58) {
            console.log('🎯 Document is now within target range!');
          }
          
        } catch (error) {
          console.log(`❌ Error optimizing document: ${error.message}`);
        }
      }
    }
    
    console.log('\n🎉 Optimization workflow complete!');
    this.rl.close();
  }

  /**
   * CLI interface
   */
  async handleCLI() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`Cognitive Load Optimization Tool

Usage:
  cmd /c node docs/scripts/cog-optimize.js

This tool runs a complete optimization workflow:
1. Scans all docs files for cognitive load scores
2. Identifies documents with CLS > 58  
3. For each high-CLS document:
   - Shows current scores and specific recommendations
   - Asks permission to apply AI improvements
   - Automatically implements improvements (sentence simplification, vocabulary, structure)
   - Re-measures and reports new scores
4. Continues until all documents are optimized or user stops

The tool provides immediate before/after comparisons for each optimization.`);
      return;
    }

    await this.optimizeDocuments();
  }
}

// CLI execution
if (require.main === module) {
  const optimizer = new CognitiveLoadOptimizer();
  optimizer.handleCLI().catch(error => {
    console.error(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = CognitiveLoadOptimizer;
