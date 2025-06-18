#!/usr/bin/env node

/**
 * Pareto-Optimal Cognitive Load Optimization Script
 * Implements the complete workflow for iteratively reducing CLS while preserving essential information
 * Based on: docs/ai/maintenance/Workflow Prompt for Pareto-Optimal CLS Reduction.md
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const CognitiveLoadAnalyzer = require('./cog-load-measure.js');
const CognitiveLoadImprover = require('./cog-load-improve.js');

class ParetoOptimalCLSOptimizer {
  constructor() {
    this.analyzer = new CognitiveLoadAnalyzer();
    this.improver = new CognitiveLoadImprover();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Main optimization workflow for a single document
   */
  async optimizeDocument(filePath) {
    console.log(`🎯 Starting Pareto-Optimal CLS Optimization`);
    console.log(`=====================================`);
    console.log(`📄 Document: ${path.basename(filePath)}`);
    console.log('');

    // Initialize tracking
    const optimizationJourney = {
      filePath: filePath,
      startTime: new Date().toISOString(),
      iterations: [],
      finalResult: null,
      stoppingReason: null
    };

    let currentFilePath = filePath;
    let iterationCount = 0;
    let previousCLS = null;
    let shouldContinue = true;

    // Create backup of original file
    const backupPath = this.createBackup(filePath);
    console.log(`💾 Original backed up to: ${backupPath}`);
    console.log('');

    try {
      while (shouldContinue) {
        iterationCount++;
        console.log(`🔄 Iteration ${iterationCount}`);
        console.log(`${'='.repeat(20)}`);

        // Step 1: Measure current CLS
        const currentAnalysis = this.analyzer.analyzeFile(currentFilePath);
        if (currentAnalysis.error) {
          throw new Error(`Failed to analyze file: ${currentAnalysis.error}`);
        }

        const currentCLS = currentAnalysis.cogLoad;
        console.log(`📊 Current CLS: ${currentCLS}/100`);
        console.log(`   Readability: ${currentAnalysis.components.readability}/100`);
        console.log(`   Lexical:     ${currentAnalysis.components.lexical}/100`);
        console.log(`   Coherence:   ${currentAnalysis.components.coherence}/100`);

        // Check if we've reached optimal range
        if (currentCLS >= 55 && currentCLS <= 60) {
          console.log(`✅ Document is in optimal CLS range (55-60). Consider stopping.`);
        }

        // Step 2: Get improvement recommendations
        const improvementResult = this.improver.analyzeFileForImprovement(currentFilePath);
        if (!improvementResult.success) {
          throw new Error(`Failed to get improvement recommendations: ${improvementResult.error}`);
        }

        // Check if we have actionable recommendations
        const actionableRecs = improvementResult.recommendations.filter(
          rec => rec.priority === 'critical' || rec.priority === 'high'
        );

        if (actionableRecs.length === 0) {
          console.log(`🏁 No further actionable recommendations available.`);
          optimizationJourney.stoppingReason = 'No actionable recommendations remaining';
          shouldContinue = false;
          break;
        }

        // Display recommendations
        console.log(`\n💡 Available Improvements:`);
        actionableRecs.forEach((rec, index) => {
          const emoji = rec.priority === 'critical' ? '🔴' : '🟡';
          console.log(`   ${emoji} ${rec.category}: ${rec.action}`);
        });

        // Step 3: Ask user if they want to apply recommendations
        console.log('');
        const shouldApply = await this.askUser(
          'Apply these recommendations? (y/n/view/stop): ',
          ['y', 'n', 'view', 'stop']
        );

        if (shouldApply === 'stop') {
          optimizationJourney.stoppingReason = 'User requested stop';
          shouldContinue = false;
          break;
        }

        if (shouldApply === 'view') {
          this.displayDetailedRecommendations(improvementResult);
          continue; // Show menu again
        }

        if (shouldApply !== 'y') {
          optimizationJourney.stoppingReason = 'User declined further optimization';
          shouldContinue = false;
          break;
        }

        // Step 4: Show current content and get optimized version
        console.log(`\n📄 Current document preview:`);
        console.log(`${'─'.repeat(50)}`);
        const currentContent = fs.readFileSync(currentFilePath, 'utf8');
        const previewLines = currentContent.split('\n').slice(0, 10);
        previewLines.forEach((line, index) => {
          console.log(`${(index + 1).toString().padStart(2)}: ${line.substring(0, 80)}${line.length > 80 ? '...' : ''}`);
        });
        if (currentContent.split('\n').length > 10) {
          console.log(`... (${currentContent.split('\n').length - 10} more lines)`);
        }
        console.log(`${'─'.repeat(50)}`);

        // Step 5: Get user's optimized version
        console.log(`\n✏️  Please create an optimized version based on the recommendations.`);
        console.log(`   Apply the suggested improvements while preserving all essential information.`);
        const continueWithOptimization = await this.askUser(
          'Have you created the optimized version? (y/n): ',
          ['y', 'n']
        );

        if (continueWithOptimization !== 'y') {
          optimizationJourney.stoppingReason = 'User did not provide optimized version';
          shouldContinue = false;
          break;
        }

        // Step 6: Measure new CLS
        const newAnalysis = this.analyzer.analyzeFile(currentFilePath);
        if (newAnalysis.error) {
          console.log(`⚠️  Warning: Could not analyze updated file: ${newAnalysis.error}`);
          continue;
        }

        const newCLS = newAnalysis.cogLoad;
        const clsImprovement = currentCLS - newCLS;

        console.log(`\n📈 Optimization Results:`);
        console.log(`   Previous CLS: ${currentCLS}/100`);
        console.log(`   New CLS:      ${newCLS}/100`);
        console.log(`   Improvement:  ${clsImprovement > 0 ? '-' : '+'}${Math.abs(clsImprovement).toFixed(2)} points`);

        // Step 7: Information retention validation
        console.log(`\n🔍 Information Retention Check:`);
        console.log(`   Compare the original and optimized versions carefully.`);
        console.log(`   • Has any essential information been lost?`);
        console.log(`   • Are all key concepts still present?`);
        console.log(`   • Is the technical accuracy maintained?`);
        console.log(`   • Does the document still serve its intended purpose?`);

        const retentionCheck = await this.askUser(
          'Has all essential information been retained? (y/n): ',
          ['y', 'n']
        );

        // Record this iteration
        optimizationJourney.iterations.push({
          iteration: iterationCount,
          startCLS: currentCLS,
          endCLS: newCLS,
          improvement: clsImprovement,
          recommendations: actionableRecs.length,
          informationRetained: retentionCheck === 'y'
        });

        if (retentionCheck !== 'y') {
          console.log(`⚠️  Information loss detected. Rolling back to previous version.`);
          optimizationJourney.stoppingReason = 'Information loss detected - Pareto frontier reached';
          shouldContinue = false;
          break;
        }

        // Step 8: Check if we should continue
        if (clsImprovement <= 0) {
          console.log(`📊 No CLS improvement achieved. May have reached optimization limit.`);
          const continueAnyway = await this.askUser(
            'Continue optimization anyway? (y/n): ',
            ['y', 'n']
          );
          if (continueAnyway !== 'y') {
            optimizationJourney.stoppingReason = 'No further CLS improvement possible';
            shouldContinue = false;
            break;
          }
        }

        // Check if we're in the optimal range
        if (newCLS >= 55 && newCLS <= 60) {
          console.log(`🎯 Document has reached optimal CLS range (55-60).`);
          const continueOptimal = await this.askUser(
            'Continue optimization beyond optimal range? (y/n): ',
            ['y', 'n']
          );
          if (continueOptimal !== 'y') {
            optimizationJourney.stoppingReason = 'Reached optimal CLS range (55-60)';
            shouldContinue = false;
            break;
          }
        }

        previousCLS = currentCLS;
        console.log(`\n✅ Iteration ${iterationCount} complete. Proceeding to next iteration...\n`);
      }

      // Final analysis
      const finalAnalysis = this.analyzer.analyzeFile(currentFilePath);
      optimizationJourney.finalResult = {
        finalCLS: finalAnalysis.cogLoad,
        components: finalAnalysis.components,
        totalIterations: iterationCount,
        endTime: new Date().toISOString()
      };

      // Generate final report
      this.generateOptimizationReport(optimizationJourney);

    } catch (error) {
      console.error(`❌ Error during optimization: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      this.rl.close();
    }

    return { success: true, journey: optimizationJourney };
  }

  /**
   * Create a backup of the original file
   */
  createBackup(filePath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup-${timestamp}`;
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  }

  /**
   * Ask user a question and wait for response
   */
  askUser(question, validAnswers = null) {
    return new Promise((resolve) => {
      const askQuestion = () => {
        this.rl.question(question, (answer) => {
          const cleanAnswer = answer.trim().toLowerCase();
          if (!validAnswers || validAnswers.includes(cleanAnswer)) {
            resolve(cleanAnswer);
          } else {
            console.log(`Please enter one of: ${validAnswers.join(', ')}`);
            askQuestion();
          }
        });
      };
      askQuestion();
    });
  }

  /**
   * Display detailed recommendations
   */
  displayDetailedRecommendations(improvementResult) {
    console.log(`\n📋 Detailed Recommendations:`);
    console.log(`${'='.repeat(40)}`);
    
    improvementResult.recommendations.forEach((rec, index) => {
      const priorityEmoji = rec.priority === 'critical' ? '🔴' : 
                           rec.priority === 'high' ? '🟡' : '🟢';
      console.log(`\n${priorityEmoji} ${rec.priority.toUpperCase()}: ${rec.category}`);
      console.log(`Issue: ${rec.issue}`);
      console.log(`Action: ${rec.action}`);
      
      if (rec.specifics && rec.specifics.length > 0) {
        console.log(`Specifics:`);
        rec.specifics.forEach(specific => {
          console.log(`  • ${specific}`);
        });
      }
    });

    if (improvementResult.strategies && improvementResult.strategies.length > 0) {
      console.log(`\n🛠️  Strategies:`);
      improvementResult.strategies.forEach((strategy, index) => {
        console.log(`${index + 1}. ${strategy.strategy}: ${strategy.description}`);
      });
    }
    console.log(`${'='.repeat(40)}\n`);
  }

  /**
   * Generate final optimization report
   */
  generateOptimizationReport(journey) {
    console.log(`\n📊 PARETO-OPTIMAL CLS OPTIMIZATION REPORT`);
    console.log(`${'='.repeat(50)}`);
    console.log(`📄 Document: ${path.basename(journey.filePath)}`);
    console.log(`⏱️  Duration: ${journey.startTime} - ${journey.finalResult.endTime}`);
    console.log(`🔄 Total Iterations: ${journey.finalResult.totalIterations}`);
    console.log('');

    if (journey.iterations.length > 0) {
      const startCLS = journey.iterations[0].startCLS;
      const endCLS = journey.finalResult.finalCLS;
      const totalImprovement = startCLS - endCLS;
      const percentImprovement = ((totalImprovement / startCLS) * 100).toFixed(1);

      console.log(`📈 CLS Improvement Summary:`);
      console.log(`   Initial CLS:  ${startCLS}/100`);
      console.log(`   Final CLS:    ${endCLS}/100`);
      console.log(`   Improvement:  ${totalImprovement.toFixed(2)} points (${percentImprovement}%)`);
      console.log('');

      console.log(`📋 Final Component Scores:`);
      console.log(`   Readability: ${journey.finalResult.components.readability}/100`);
      console.log(`   Lexical:     ${journey.finalResult.components.lexical}/100`);
      console.log(`   Coherence:   ${journey.finalResult.components.coherence}/100`);
      console.log('');

      console.log(`🔄 Iteration History:`);
      journey.iterations.forEach((iter, index) => {
        const improvement = iter.improvement.toFixed(2);
        const status = iter.informationRetained ? '✅' : '❌';
        console.log(`   ${iter.iteration}: ${iter.startCLS} → ${iter.endCLS} (${Math.sign(iter.improvement) >= 0 ? '+' : ''}${improvement}) ${status}`);
      });
      console.log('');
    }

    console.log(`🏁 Stopping Reason: ${journey.stoppingReason}`);
    
    // Assessment of final state
    const finalCLS = journey.finalResult.finalCLS;
    let assessment = '';
    if (finalCLS < 55) {
      assessment = '⚠️  RISK: Below optimal range - may be oversimplified';
    } else if (finalCLS >= 55 && finalCLS <= 60) {
      assessment = '🎯 OPTIMAL: Within target range (55-60)';
    } else if (finalCLS <= 65) {
      assessment = '🟡 MODERATE: Slightly above optimal but acceptable';
    } else {
      assessment = '🔴 HIGH: Still requires optimization';
    }
    
    console.log(`📊 Final Assessment: ${assessment}`);
    console.log('');

    // Pareto frontier analysis
    console.log(`🎯 Pareto Frontier Analysis:`);
    if (journey.stoppingReason.includes('Information loss')) {
      console.log(`   ✅ Successfully reached Pareto frontier`);
      console.log(`   🛡️  All essential information preserved`);
      console.log(`   📉 CLS optimized to maximum extent possible`);
    } else if (journey.stoppingReason.includes('optimal range')) {
      console.log(`   🎯 Stopped at research-recommended optimal range`);
      console.log(`   ⚖️  Balanced cognitive load and information retention`);
    } else {
      console.log(`   ⚠️  Optimization stopped before reaching Pareto frontier`);
      console.log(`   💡 Further optimization may be possible`);
    }

    console.log(`${'='.repeat(50)}`);
  }

  /**
   * CLI interface
   */
  async handleCLI() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`Pareto-Optimal Cognitive Load Optimization Tool

Usage:
  cmd /c node docs/ai/maintenance/scripts/cog-load-optimize.js [options]

Options:
  --file <path>        Optimize specific document using Pareto-optimal workflow
  --help, -h          Show this help message

Example:
  cmd /c node docs/ai/maintenance/scripts/cog-load-optimize.js --file docs/concerns/form-management.md

This tool implements the complete Pareto-optimal CLS reduction workflow:
1. Iteratively measures and improves cognitive load
2. Validates information retention at each step  
3. Stops when further reduction would sacrifice essential information
4. Generates comprehensive optimization report

The goal is to reach the Pareto frontier where no further CLS reduction
is possible without losing critical information or context.`);
      return;
    }

    const fileArg = args.find(arg => arg === '--file');
    const fileIndex = args.indexOf('--file');
    
    if (fileArg && fileIndex !== -1 && args[fileIndex + 1]) {
      const filePath = args[fileIndex + 1];
      
      if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
      }

      await this.optimizeDocument(filePath);
      return;
    }

    // Default: show help
    console.log('❌ Please specify a file to optimize.');
    console.log('Run with --help for usage information.');
    process.exit(1);
  }
}

// CLI execution
if (require.main === module) {
  const optimizer = new ParetoOptimalCLSOptimizer();
  optimizer.handleCLI().catch(error => {
    console.error(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = ParetoOptimalCLSOptimizer;
