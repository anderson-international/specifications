/**
 * Cognitive Load Measurement Script
 * Implements the Cognitive Load Score (cog-load) framework for document analysis
 * 
 * Formula: cog-load = (0.4 * Readability) + (0.3 * Lexical) + (0.3 * Coherence)
 * Scale: 0-100 (higher = more cognitive load)
 */

const fs = require('fs');
const path = require('path');

class CognitiveLoadAnalyzer {
  constructor() {
    this.weights = {
      readability: 0.4,
      lexical: 0.3,
      coherence: 0.3
    };
  }

  /**
   * Calculate readability score (0-100, higher = more cognitive load)
   * Based on inverted Flesch Reading Ease
   */
  calculateReadabilityScore(text) {
    // Basic text statistics
    const sentences = this.countSentences(text);
    const words = this.countWords(text);
    const syllables = this.countSyllables(text);

    if (sentences === 0 || words === 0) return 0;

    // Flesch Reading Ease formula
    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;
    
    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    // Invert and normalize to 0-100 (higher = more cognitive load)
    // Flesch typically ranges from 0-100, so we invert it
    const readabilityLoad = Math.max(0, Math.min(100, 100 - fleschScore));

    // Adjust for technical content markers
    const technicalAdjustment = this.calculateTechnicalAdjustment(text);
    
    return Math.min(100, readabilityLoad + technicalAdjustment);
  }

  /**
   * Calculate lexical complexity score (0-100, higher = more cognitive load)
   * Based on vocabulary sophistication and technical term density
   */
  calculateLexicalComplexityScore(text) {
    const words = this.getWords(text);
    if (words.length === 0) return 0;

    // Calculate vocabulary richness (Type-Token Ratio)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const typeTokenRatio = uniqueWords.size / words.length;

    // Calculate average word length
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;

    // Calculate technical term density
    const technicalTerms = this.countTechnicalTerms(words);
    const technicalDensity = technicalTerms / words.length;

    // Calculate complex word percentage (words > 6 characters)
    const complexWords = words.filter(word => word.length > 6).length;
    const complexWordRatio = complexWords / words.length;

    // Combine metrics into lexical complexity score (0-100)
    const lexicalScore = 
      (typeTokenRatio * 30) +           // Vocabulary richness (0-30)
      (Math.min(avgWordLength, 10) * 4) + // Average word length (0-40)
      (technicalDensity * 100) +        // Technical density (0-100, capped)
      (complexWordRatio * 30);          // Complex word ratio (0-30)

    return Math.min(100, lexicalScore);
  }

  /**
   * Calculate topic coherence score (0-100, higher = more cognitive load)
   * Based on topic variance and structural consistency
   */
  calculateTopicCoherenceScore(text) {
    // Simple coherence analysis based on:
    // 1. Section consistency (headers, structure)
    // 2. Keyword distribution
    // 3. Transition consistency

    const lines = text.split('\n');
    const sections = this.identifySections(lines);
    const keywords = this.extractKeywords(text);

    // Calculate section variance
    const sectionVariance = this.calculateSectionVariance(sections);
    
    // Calculate keyword distribution variance
    const keywordVariance = this.calculateKeywordVariance(keywords, sections);
    
    // Calculate structural inconsistency
    const structuralInconsistency = this.calculateStructuralInconsistency(lines);

    // Combine into coherence score (0-100, higher = more drift/less coherence)
    const coherenceScore = 
      (sectionVariance * 0.4) +
      (keywordVariance * 0.3) +
      (structuralInconsistency * 0.3);

    return Math.min(100, coherenceScore);
  }

  /**
   * Calculate the final cog-load score
   */
  calculateCogLoad(text) {
    const readabilityScore = this.calculateReadabilityScore(text);
    const lexicalScore = this.calculateLexicalComplexityScore(text);
    const coherenceScore = this.calculateTopicCoherenceScore(text);

    const cogLoad = 
      (this.weights.readability * readabilityScore) +
      (this.weights.lexical * lexicalScore) +
      (this.weights.coherence * coherenceScore);

    return {
      cogLoad: Math.round(cogLoad * 100) / 100, // Round to 2 decimal places
      components: {
        readability: Math.round(readabilityScore * 100) / 100,
        lexical: Math.round(lexicalScore * 100) / 100,
        coherence: Math.round(coherenceScore * 100) / 100
      }
    };
  }

  // Helper methods for text analysis
  countSentences(text) {
    // Count sentences by periods, exclamation marks, and question marks
    // But exclude common abbreviations and code examples
    const sentenceEnders = text.match(/[.!?]+(?=\s|$)/g);
    return sentenceEnders ? sentenceEnders.length : 0;
  }

  countWords(text) {
    // Remove code blocks and count words
    const cleanText = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
    const words = cleanText.match(/\b\w+\b/g);
    return words ? words.length : 0;
  }

  getWords(text) {
    // Extract words for analysis
    const cleanText = text.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
    const words = cleanText.match(/\b\w+\b/g);
    return words || [];
  }

  countSyllables(text) {
    // Simple syllable counting algorithm
    const words = this.getWords(text);
    return words.reduce((total, word) => {
      return total + this.countSyllablesInWord(word.toLowerCase());
    }, 0);
  }

  countSyllablesInWord(word) {
    // Simple syllable counting
    word = word.replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? Math.max(1, syllables.length) : 1;
  }

  calculateTechnicalAdjustment(text) {
    // Adjust readability based on technical content markers
    let adjustment = 0;
    
    // Code blocks increase cognitive load
    const codeBlocks = (text.match(/```[\s\S]*?```/g) || []).length;
    adjustment += codeBlocks * 2;

    // Inline code increases cognitive load
    const inlineCode = (text.match(/`[^`]*`/g) || []).length;
    adjustment += inlineCode * 0.5;

    // Technical abbreviations
    const abbreviations = (text.match(/\b[A-Z]{2,}\b/g) || []).length;
    adjustment += abbreviations * 0.3;

    // URLs and paths
    const urlsAndPaths = (text.match(/https?:\/\/|\.\/|\/[a-zA-Z]/g) || []).length;
    adjustment += urlsAndPaths * 0.5;

    return Math.min(20, adjustment); // Cap technical adjustment at 20 points
  }

  countTechnicalTerms(words) {
    // Count words that are likely technical terms
    const technicalPatterns = [
      /^[A-Z][a-z]*[A-Z]/,  // CamelCase
      /^[a-z]+[A-Z]/,       // camelCase
      /^[A-Z_]+$/,          // CONSTANT_CASE
      /\d+/,                // Contains numbers
      /-/                   // Hyphenated terms
    ];

    return words.filter(word => {
      return technicalPatterns.some(pattern => pattern.test(word));
    }).length;
  }

  identifySections(lines) {
    // Identify document sections based on headers
    const sections = [];
    let currentSection = { type: 'content', lines: [] };

    lines.forEach(line => {
      if (line.match(/^#{1,6}\s/)) {
        if (currentSection.lines.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { type: 'header', level: line.match(/^(#{1,6})/)[1].length, lines: [line] };
      } else {
        currentSection.lines.push(line);
      }
    });

    if (currentSection.lines.length > 0) {
      sections.push(currentSection);
    }

    return sections;
  }

  extractKeywords(text) {
    // Simple keyword extraction (most frequent non-common words)
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'this', 'that', 'these', 'those', 'a', 'an']);
    
    const words = this.getWords(text).map(w => w.toLowerCase());
    const wordCounts = {};
    
    words.forEach(word => {
      if (!commonWords.has(word) && word.length > 3) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });

    return Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  calculateSectionVariance(sections) {
    // Calculate variance in section types and lengths
    if (sections.length === 0) return 0;

    const sectionLengths = sections.map(s => s.lines.length);
    const avgLength = sectionLengths.reduce((a, b) => a + b, 0) / sectionLengths.length;
    const variance = sectionLengths.reduce((sum, length) => sum + Math.pow(length - avgLength, 2), 0) / sectionLengths.length;
    
    return Math.min(100, variance / 10); // Normalize variance
  }

  calculateKeywordVariance(keywords, sections) {
    // Simple keyword distribution analysis
    if (keywords.length === 0 || sections.length === 0) return 0;
    
    // For now, return a moderate score
    // In a full implementation, this would analyze keyword distribution across sections
    return 30;
  }

  calculateStructuralInconsistency(lines) {
    // Analyze structural consistency (headers, lists, formatting)
    let inconsistencyScore = 0;
    
    // Check header level consistency
    const headerLevels = lines
      .filter(line => line.match(/^#{1,6}\s/))
      .map(line => line.match(/^(#{1,6})/)[1].length);
    
    if (headerLevels.length > 1) {
      const levelJumps = headerLevels.slice(1).map((level, i) => Math.abs(level - headerLevels[i]));
      const avgJump = levelJumps.reduce((a, b) => a + b, 0) / levelJumps.length;
      inconsistencyScore += Math.min(30, avgJump * 5);
    }

    return inconsistencyScore;
  }

  /**
   * Analyze a file and return cog-load metrics
   */
  analyzeFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const result = this.calculateCogLoad(content);
      
      return {
        file: filePath,
        ...result,
        metadata: {
          wordCount: this.countWords(content),
          sentenceCount: this.countSentences(content),
          fileSize: content.length
        }
      };
    } catch (error) {
      return {
        file: filePath,
        error: error.message,
        cogLoad: null
      };
    }
  }

  /**
   * Analyze all documents in the graph
   */
  analyzeAllDocuments() {
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

      console.log(`🔄 Analyzing ${documents.length} documents from graph...`);
      console.log('');

      const results = [];
      let totalCogLoad = 0;
      let successCount = 0;

      // Analyze each document
      documents.forEach((doc, index) => {
        process.stdout.write(`\r📊 Progress: ${index + 1}/${documents.length} - ${doc.title}`);
        
        const result = this.analyzeFile(doc.path);
        results.push(result);

        if (!result.error) {
          totalCogLoad += result.cogLoad;
          successCount++;
        }
      });

      console.log('\n'); // New line after progress

      // Generate summary report
      this.generateSummaryReport(results, totalCogLoad, successCount);

      return results;

    } catch (error) {
      console.error(`❌ Error analyzing documents: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Generate a summary report for all documents
   */
  generateSummaryReport(results, totalCogLoad, successCount) {
    console.log(`📊 Cognitive Load Analysis Summary`);
    console.log(`=================================`);
    console.log(`📄 Documents analyzed: ${results.length}`);
    console.log(`✅ Successful analyses: ${successCount}`);
    console.log(`❌ Failed analyses: ${results.length - successCount}`);
    
    if (successCount > 0) {
      const avgCogLoad = Math.round((totalCogLoad / successCount) * 100) / 100;
      console.log(`🧠 Average cog-load: ${avgCogLoad}/100`);
    }
    console.log('');

    // Sort results by cognitive load (highest first)
    const validResults = results.filter(r => !r.error).sort((a, b) => b.cogLoad - a.cogLoad);

    console.log(`🔴 Highest Cognitive Load Documents:`);
    validResults.slice(0, 5).forEach((result, index) => {
      const filename = path.basename(result.file);
      console.log(`   ${index + 1}. ${filename}: ${result.cogLoad}/100`);
    });
    console.log('');

    console.log(`🟢 Lowest Cognitive Load Documents:`);
    validResults.slice(-5).reverse().forEach((result, index) => {
      const filename = path.basename(result.file);
      console.log(`   ${index + 1}. ${filename}: ${result.cogLoad}/100`);
    });
    console.log('');

    // Show any errors
    const errorResults = results.filter(r => r.error);
    if (errorResults.length > 0) {
      console.log(`❌ Documents with errors:`);
      errorResults.forEach(result => {
        console.log(`   ${result.file}: ${result.error}`);
      });
      console.log('');
    }

    // Component breakdown summary
    if (successCount > 0) {
      const avgReadability = validResults.reduce((sum, r) => sum + r.components.readability, 0) / successCount;
      const avgLexical = validResults.reduce((sum, r) => sum + r.components.lexical, 0) / successCount;
      const avgCoherence = validResults.reduce((sum, r) => sum + r.components.coherence, 0) / successCount;

      console.log(`📚 Average Component Breakdown:`);
      console.log(`   Readability:  ${Math.round(avgReadability * 100) / 100}/100`);
      console.log(`   Lexical:      ${Math.round(avgLexical * 100) / 100}/100`);
      console.log(`   Coherence:    ${Math.round(avgCoherence * 100) / 100}/100`);
    }
  }

  /**
   * CLI interface
   */
  handleCLI() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`Cognitive Load Measurement Tool

Usage:
  cmd /c node docs/ai/maintenance/scripts/cog-load-measure.js [options]

Options:
  --file <path>        Measure cognitive load for a specific file
  --all               Measure cognitive load for all documents in the graph
  --help, -h          Show this help message

Examples:
  cmd /c node docs/ai/maintenance/scripts/cog-load-measure.js --file docs/concerns/form-management.md
  cmd /c node docs/ai/maintenance/scripts/cog-load-measure.js --all`);
      return;
    }

    const fileArg = args.find(arg => arg === '--file');
    const fileIndex = args.indexOf('--file');
    
    if (fileArg && fileIndex !== -1 && args[fileIndex + 1]) {
      const filePath = args[fileIndex + 1];
      const result = this.analyzeFile(filePath);
      
      if (result.error) {
        console.error(`❌ Error analyzing ${result.file}: ${result.error}`);
        process.exit(1);
      }

      console.log(`📊 Cognitive Load Analysis: ${result.file}`);
      console.log(`==========================================`);
      console.log(`🧠 Overall cog-load: ${result.cogLoad}/100`);
      console.log(``);
      console.log(`📚 Component Breakdown:`);
      console.log(`   Readability:     ${result.components.readability}/100 (weight: 40%)`);
      console.log(`   Lexical:         ${result.components.lexical}/100 (weight: 30%)`);
      console.log(`   Coherence:       ${result.components.coherence}/100 (weight: 30%)`);
      console.log(``);
      console.log(`📈 Metadata:`);
      console.log(`   Word count:      ${result.metadata.wordCount}`);
      console.log(`   Sentence count:  ${result.metadata.sentenceCount}`);
      console.log(`   File size:       ${result.metadata.fileSize} characters`);
      return;
    }

    if (args.includes('--all')) {
      console.log('🔄 Analyzing all documents in graph...');
      this.analyzeAllDocuments();
      return;
    }

    // Default: show help
    console.log('❌ Please specify a file to analyze or use --all flag.');
    console.log('Run with --help for usage information.');
  }
}

// CLI execution
if (require.main === module) {
  const analyzer = new CognitiveLoadAnalyzer();
  analyzer.handleCLI();
}

module.exports = CognitiveLoadAnalyzer;
