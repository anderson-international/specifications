#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { resolveFiles } = require('./utils/file-discovery');

// Import extracted utilities
const { analyzeFallbackData } = require('./utils/violation-detectors/regex-based/fallback-data');
const { analyzeConsoleErrors } = require('./utils/violation-detectors/regex-based/console-errors');
const { analyzeComments } = require('./utils/violation-detectors/regex-based/comment-analysis');
const { analyzeTypeScript } = require('./utils/violation-detectors/hybrid/typescript-analysis');
const { getFileType, countLines } = require('./utils/file-analysis');
const { runEslint } = require('./utils/eslint-runner');

const OUTPUT_DIR = path.join(__dirname, 'output');
const ANALYSIS_FILE = path.join(OUTPUT_DIR, 'code_review_analysis.json');

const FILE_SIZE_LIMITS = {
  components: 150,
  hooks: 100,
  types: 100,
  utils: 50,
  routes: 100,
  services: 100,
  repositories: 100
};

function deleteStaleAnalysis() {
  try {
    if (fs.existsSync(ANALYSIS_FILE)) {
      fs.unlinkSync(ANALYSIS_FILE);
    }
  } catch (error) {
    console.error(`Warning: Could not delete stale analysis file: ${error.message}`);
  }
}

function analyzeReactPatterns(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const hasReactImport = content.includes('import React') || content.includes('import * as React');
    const hasUseCallback = content.includes('useCallback');
    const hasUseMemo = content.includes('useMemo');
    const hasUseEffect = content.includes('useEffect');
    const hasHooks = /use[A-Z]/.test(content);
    
    const issues = [];
    
    // Check for React import when using React types
    if (content.includes('React.') && !hasReactImport) {
      issues.push('Missing React import for React.* usage');
    }
    
    // Check for hook usage patterns
    if (hasHooks && !hasUseCallback && content.includes('const handle')) {
      issues.push('Event handlers should use useCallback');
    }
    
    if (hasHooks && !hasUseMemo && content.includes('const filtered')) {
      issues.push('Filtered/computed values should use useMemo');
    }
    
    return {
      hasReactImport,
      hasUseCallback,
      hasUseMemo,
      hasUseEffect,
      hasHooks,
      issues
    };
  } catch (error) {
    return { hasReactImport: false, hasUseCallback: false, hasUseMemo: false, hasUseEffect: false, hasHooks: false, issues: [] };
  }
}

function analyzeFile(filePath) {
  const fileType = getFileType(filePath);
  const lineCount = countLines(filePath);
  const sizeLimit = FILE_SIZE_LIMITS[fileType] || 100;
  
  // Size analysis
  const sizeAnalysis = {
    lines: lineCount,
    limit: sizeLimit,
    type: fileType,
    status: lineCount <= sizeLimit ? 'PASS' : 'FAIL',
    percentage: Math.round((lineCount / sizeLimit) * 100)
  };
  
  // Comment analysis
  const commentAnalysis = analyzeComments(filePath);
  const commentStatus = {
    violations: commentAnalysis,
    count: commentAnalysis.length,
    status: commentAnalysis.length === 0 ? 'PASS' : 'FAIL'
  };
  
  // React patterns analysis
  const reactAnalysis = analyzeReactPatterns(filePath);
  
  // Console errors analysis
  const consoleAnalysis = analyzeConsoleErrors(filePath);
  
  // ESLint analysis
  const eslintAnalysis = runEslint(filePath);
  
  // TypeScript analysis
  const typescriptAnalysis = analyzeTypeScript(filePath);
  
  // Fallback data analysis
  const fallbackAnalysis = analyzeFallbackData(filePath);
  
  return {
    filePath,
    timestamp: new Date().toISOString(),
    size: sizeAnalysis,
    comments: commentStatus,
    react: reactAnalysis,
    consoleErrors: consoleAnalysis,
    eslint: eslintAnalysis,
    typescript: typescriptAnalysis,
    fallbackData: fallbackAnalysis,
    overallStatus: determineOverallStatus(sizeAnalysis, commentStatus, consoleAnalysis, eslintAnalysis, typescriptAnalysis, fallbackAnalysis),
    contextGuidance: generateContextGuidance(sizeAnalysis, commentStatus, consoleAnalysis, eslintAnalysis, typescriptAnalysis, fallbackAnalysis, filePath)
  };
}

function determineOverallStatus(size, comments, console, eslint, typescript, fallback) {
  const hasFailures = 
    size.status === 'FAIL' ||
    comments.status === 'FAIL' ||
    console.status === 'FAIL' ||
    eslint.errors.length > 0 ||
    typescript.status === 'FAIL' ||
    fallback.status === 'FAIL';
    
  return hasFailures ? 'FAIL' : 'PASS';
}

function generateContextGuidance(size, comments, console, eslint, typescript, fallback, filePath) {
  const guidance = {
    riskLevel: calculateRiskLevel(size, comments, console, eslint, typescript, fallback),
    riskGuidance: {
      "1-3": "Safe for mechanical/batch fixes",
      "4-6": "Review carefully before fixing", 
      "7-8": "Analyze thoroughly, seek approval for complex changes",
      "9-10": "High complexity - require explicit approval before proceeding"
    },
    priorities: [],
    recommendations: [],
    contextDocs: []
  };
  
  // Risk level guides approach to fixing, not whether to fix
  
  // Fallback data violations - fail-fast methodology
  if (fallback.status === 'FAIL') {
    guidance.priorities.push({
      type: 'FALLBACK_DATA',
      count: fallback.count,
      recommendation: 'Replace all fallback patterns with composed error throwing. Each violation masks error states and prevents proper debugging.'
    });
    guidance.contextDocs.push('/tech-code-quality');
  }
  
  // Console error violations - fail-fast methodology
  if (console.status === 'FAIL') {
    guidance.priorities.push({
      type: 'CONSOLE_ERRORS', 
      count: console.count,
      recommendation: 'Replace console.error/warn with proper error throwing. Logging without throwing violates fail-fast methodology.'
    });
    guidance.contextDocs.push('/tech-code-quality');
  }
  
  // ESLint violations
  if (eslint.errors.length > 0) {
    guidance.priorities.push({
      type: 'ESLINT_ERRORS',
      count: eslint.errors.length,
      recommendation: 'Fix ESLint errors one at a time. Use minimal changes approach - fix single issue, test, repeat.'
    });
    guidance.contextDocs.push('/code-fix');
  }
  
  // TypeScript violations
  if (typescript.status === 'FAIL') {
    guidance.priorities.push({
      type: 'TYPESCRIPT_TYPES',
      count: typescript.missingReturnTypes,
      recommendation: 'Add explicit return type annotations. Consider type reuse opportunities before creating new types.'
    });
    guidance.contextDocs.push('/tech-code-quality');
  }
  
  // File size violations
  if (size.status === 'FAIL') {
    guidance.priorities.push({
      type: 'FILE_SIZE',
      overage: size.lines - size.limit,
      recommendation: `File exceeds ${size.limit} line limit by ${size.lines - size.limit} lines. Consider refactoring into smaller, focused modules.`
    });
  }
  
  return guidance;
}

function calculateRiskLevel(size, comments, console, eslint, typescript, fallback) {
  let risk = 1; // Base risk
  
  // Fail-fast violations are highest risk
  if (fallback.status === 'FAIL') risk += 4;
  if (console.status === 'FAIL') risk += 3;
  
  // ESLint errors add moderate risk
  if (eslint.errors.length > 0) risk += Math.min(eslint.errors.length * 0.5, 3);
  
  // Other violations add lower risk
  if (typescript.status === 'FAIL') risk += 1;
  if (size.status === 'FAIL') risk += 1;
  if (comments.status === 'FAIL') risk += 0.5;
  
  return Math.min(Math.round(risk), 10); // Cap at 10
}

function generateDetailedAnalysis(results) {
  const analysis = {
    metadata: {
      timestamp: new Date().toISOString(),
      totalFiles: results.length,
      passedFiles: results.filter(r => r.overallStatus === 'PASS').length,
      failedFiles: results.filter(r => r.overallStatus === 'FAIL').length,
      averageRisk: Math.round(results.reduce((sum, r) => sum + r.contextGuidance.riskLevel, 0) / results.length)
    },
    summary: {
      blockingViolations: results.reduce((sum, r) => {
        return sum + 
          (r.fallbackData.status === 'FAIL' ? r.fallbackData.count : 0) +
          (r.consoleErrors.status === 'FAIL' ? r.consoleErrors.count : 0);
      }, 0),
      eslintErrors: results.reduce((sum, r) => sum + r.eslint.errors.length, 0),
      typescriptIssues: results.reduce((sum, r) => r.typescript.status === 'FAIL' ? sum + r.typescript.missingReturnTypes : sum, 0),
      oversizedFiles: results.filter(r => r.size.status === 'FAIL').length
    },
    fileResults: results.reduce((acc, result) => {
      acc[result.filePath] = result;
      return acc;
    }, {}),
    batchGuidance: generateBatchGuidance(results)
  };
  
  return analysis;
}

function generateBatchGuidance(results) {
  const guidance = {
    recommendedOrder: [],
    contextLoading: [],
    riskThresholds: {
      lowRisk: results.filter(r => r.contextGuidance.riskLevel <= 3),
      mediumRisk: results.filter(r => r.contextGuidance.riskLevel >= 4 && r.contextGuidance.riskLevel <= 6),
      highRisk: results.filter(r => r.contextGuidance.riskLevel >= 7)
    }
  };
  
  // Recommend fix order: blocking first, then by risk level
  // All failed files must be fixed - no tiers, unified treatment
  const failedFiles = results.filter(r => r.overallStatus === 'FAIL');
  
  if (failedFiles.length > 0) {
    // Sort by: fail-fast violations first, then by risk level
    const sortedFiles = failedFiles.sort((a, b) => {
      // Prioritize fail-fast violations (fallback data, console errors)
      const aFailFast = (a.fallbackData.status === 'FAIL' || a.consoleErrors.status === 'FAIL') ? 1 : 0;
      const bFailFast = (b.fallbackData.status === 'FAIL' || b.consoleErrors.status === 'FAIL') ? 1 : 0;
      
      if (aFailFast !== bFailFast) {
        return bFailFast - aFailFast; // Fail-fast first
      }
      
      // Then sort by risk level
      return b.contextGuidance.riskLevel - a.contextGuidance.riskLevel;
    });
    
    guidance.recommendedOrder.push({
      phase: 'ALL_VIOLATIONS',
      files: sortedFiles.map(f => f.filePath),
      guidance: 'Fix ALL violations. Start with fail-fast issues (fallback data, console errors) as they mask errors and prevent proper debugging. Then address remaining violations by risk level.'
    });
  }
  
  return guidance;
}

function main() {
  const args = process.argv.slice(2);
  
  // Resolve files based on arguments and mode
  const { files, mode } = resolveFiles(args);
  
  if (files.length === 0) {
    console.error('No files to analyze.');
    console.error('Usage: node code-review.js <file1> <file2> ...');
    console.error('   or: node code-review.js --mode=full-review');
    console.error('   or: (no args) = analyze recent git changes');
    process.exit(1);
  }
  
  console.log(`Mode: ${mode}, Files: ${files.length}`);
  if (mode === 'full-review') {
    console.log('Running full codebase review...');
  } else if (mode === 'recent') {
    console.log('Analyzing recent git changes...');
  } else {
    console.log('Analyzing specified files...');
  }
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Delete stale analysis
  deleteStaleAnalysis();
  
  // Analyze all files
  const results = files.map(analyzeFile);
  
  // Generate detailed analysis
  const detailedAnalysis = generateDetailedAnalysis(results);
  
  // Write JSON output to file
  try {
    fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(detailedAnalysis, null, 2));
    console.log(`Analysis complete. Results written to: ${ANALYSIS_FILE}`);
    console.log(`Total files: ${results.length}, Failed: ${detailedAnalysis.metadata.failedFiles}, Average risk: ${detailedAnalysis.metadata.averageRisk}/10`);
  } catch (error) {
    console.error(`Error writing analysis file: ${error.message}`);
    process.exit(1);
  }
  
  // Exit with error code if any files failed
  const hasFailures = detailedAnalysis.metadata.failedFiles > 0;
  if (hasFailures) {
    process.exit(1);
  }
}

main();
