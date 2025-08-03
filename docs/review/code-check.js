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

// Import context mapping system
const { generateContextInstructions } = require('./utils/violation-context-map');

const FILE_SIZE_LIMITS = {
  components: 150,
  hooks: 100,
  types: 100,
  utils: 50,
  routes: 100,
  services: 100,
  repositories: 100
};

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
    size: sizeAnalysis,
    comments: commentStatus,
    react: reactAnalysis,
    consoleErrors: consoleAnalysis,
    eslint: eslintAnalysis,
    typescript: typescriptAnalysis,
    fallbackData: fallbackAnalysis
  };
}

function groupViolationsByClass(results) {
  const violations = {
    fallbackData: [],
    consoleErrors: [],
    eslintErrors: [],
    typescriptTypes: [],
    fileSize: [],
    comments: []
  };
  
  results.forEach(result => {
    const fileName = path.basename(result.filePath);
    
    // Fallback data violations (blocking)
    if (result.fallbackData.status === 'FAIL') {
      violations.fallbackData.push({
        file: fileName,
        count: result.fallbackData.count,
        violations: result.fallbackData.violations
      });
    }
    
    // Console error violations (blocking)
    if (result.consoleErrors.status === 'FAIL') {
      violations.consoleErrors.push({
        file: fileName,
        count: result.consoleErrors.count,
        violations: result.consoleErrors.violations
      });
    }
    
    // ESLint errors
    if (result.eslint.errors.length > 0) {
      violations.eslintErrors.push({
        file: fileName,
        count: result.eslint.errors.length,
        errors: result.eslint.errors
      });
    }
    
    // TypeScript missing return types
    if (result.typescript.status === 'FAIL') {
      violations.typescriptTypes.push({
        file: fileName,
        count: result.typescript.missingReturnTypes,
        totalFunctions: result.typescript.totalFunctions
      });
    }
    
    // File size violations
    if (result.size.status === 'FAIL') {
      violations.fileSize.push({
        file: fileName,
        lines: result.size.lines,
        limit: result.size.limit,
        overage: result.size.lines - result.size.limit
      });
    }
    
    // Comment violations
    if (result.comments.status === 'FAIL') {
      violations.comments.push({
        file: fileName,
        count: result.comments.count
      });
    }
  });
  
  return violations;
}

// Import JSON output utility
const { writeViolationsToJSON, generateCriticalJSONInstructions } = require('./utils/json-output');

/**
 * Generate complete violation output without truncation
 * @param {Object} violations - Grouped violations by class
 * @returns {string} - Complete violation output
 */
function generateCompleteViolationOutput(violations) {
  let output = '';
  
  // ALL VIOLATIONS MUST BE FIXED
  output += `ALL VIOLATIONS MUST BE FIXED\n${'='.repeat(60)}\n\n`;
  
  // Generate context loading instructions based on detected violations
  const allViolations = [];
  
  // Collect all violations with their types for context mapping
  violations.fallbackData.forEach(item => {
    allViolations.push({ type: 'fallback-data', file: item.file, count: item.count });
  });
  
  violations.consoleErrors.forEach(item => {
    allViolations.push({ type: 'console-errors', file: item.file, count: item.count });
  });
  
  violations.eslintErrors.forEach(item => {
    allViolations.push({ type: 'eslint-violations', file: item.file, count: item.count });
  });
  
  violations.typescriptTypes.forEach(item => {
    allViolations.push({ type: 'typescript-violations', file: item.file, count: item.count });
  });
  
  violations.comments.forEach(item => {
    allViolations.push({ type: 'comment-violations', file: item.file, count: item.count });
  });
  
  // Generate context instructions if violations exist
  if (allViolations.length > 0) {
    const contextInstructions = generateContextInstructions(allViolations);
    output += `${contextInstructions.loadingInstructions}\n\n`;
    output += `${'='.repeat(60)}\n\n`;
  }
  
  // Fallback data violations
  if (violations.fallbackData.length > 0) {
    output += `🔧 FALLBACK DATA VIOLATIONS (${violations.fallbackData.length} files)\n`;
    output += `GUIDANCE: Replace ALL fallback patterns with composed error throwing.\n`;
    output += `Each violation masks error states. Use: throw new Error(context)\n\n`;
    
    violations.fallbackData.forEach(item => {
      output += `- ${item.file}: ${item.count} violations\n`;
    });
    
    output += '\n';
  }
  
  // Console error violations
  if (violations.consoleErrors.length > 0) {
    output += `🔧 CONSOLE ERROR VIOLATIONS (${violations.consoleErrors.length} files)\n`;
    output += `GUIDANCE: Replace console.error/warn with proper error throwing.\n`;
    output += `Logging without throwing violates fail-fast methodology.\n\n`;
    
    violations.consoleErrors.forEach(item => {
      output += `- ${item.file}: ${item.count} violations\n`;
    });
    
    output += '\n';
  }
  

  
  // ESLint errors
  if (violations.eslintErrors.length > 0) {
    output += `🔧 ESLINT VIOLATIONS (${violations.eslintErrors.length} files)\n`;
    output += `GUIDANCE: Fix ONE error at a time. Test compilation after each.\n`;
    output += `Use minimal changes - remove unused vars, don't refactor.\n\n`;
    
    violations.eslintErrors.forEach(item => {
      output += `- ${item.file}: ${item.count} errors\n`;
    });
    
    output += '\n';
  }
  
  // TypeScript missing return types
  if (violations.typescriptTypes.length > 0) {
    output += `🔧 TYPESCRIPT VIOLATIONS (${violations.typescriptTypes.length} files)\n`;
    output += `GUIDANCE: Add explicit return types. Check for type reuse opportunities.\n`;
    output += `Before creating new types, search existing type definitions.\n\n`;
    
    violations.typescriptTypes.forEach(item => {
      output += `- ${item.file}: ${item.count}/${item.totalFunctions} missing types\n`;
    });
    
    output += '\n';
  }
  

  
  // File size violations
  if (violations.fileSize.length > 0) {
    output += `🔧 FILE SIZE VIOLATIONS (${violations.fileSize.length} files)\n`;
    output += `GUIDANCE: Refactor large files into focused modules.\n\n`;
    
    violations.fileSize.forEach(item => {
      output += `- ${item.file}: ${item.lines}/${item.limit} lines (+${item.overage})\n`;
    });
    
    output += '\n';
  }
  
  // Comment violations
  if (violations.comments.length > 0) {
    output += `🔧 COMMENT VIOLATIONS (${violations.comments.length} files)\n`;
    output += `GUIDANCE: Remove or update outdated comments.\n\n`;
    
    violations.comments.forEach(item => {
      output += `- ${item.file}: ${item.count} comments\n`;
    });
  }
  
  return output;
}

/**
 * Smart output handling - uses stdout for small outputs, JSON fallback for large
 * @param {Object} violations - Grouped violations by class
 * @param {string} summary - Summary text
 * @returns {Object} - { type: 'stdout'|'json_fallback', content: string, jsonPath?: string }
 */
function generateOutput(violations, summary) {
  // Generate COMPLETE violation output (no truncation)
  const fullOutput = generateCompleteViolationOutput(violations);
  
  // Check if output fits within stdout constraint (7.5K with buffer)
  if (fullOutput.length <= 7500) {
    // Standard stdout output - backward compatible
    return {
      type: 'stdout',
      content: fullOutput
    };
  } else {
    // JSON fallback: complete data preserved with critical instructions
    const outputDir = require('path').join(__dirname, 'output');
    const { filePath, fileName } = writeViolationsToJSON(violations, summary, outputDir);
    
    return {
      type: 'json_fallback',
      content: generateCriticalJSONInstructions(filePath, fileName),
      jsonPath: filePath
    };
  }
}

function generateSummary(results, violations) {
  const totalFiles = results.length;
  const passedFiles = results.filter(r => 
    r.size.status === 'PASS' && 
    r.comments.status === 'PASS' && 
    r.typescript.status === 'PASS' && 
    r.eslint.errors.length === 0 && 
    r.consoleErrors.status === 'PASS' && 
    r.fallbackData.status === 'PASS'
  ).length;
  const failedFiles = totalFiles - passedFiles;
  
  const totalViolationFiles = violations.fallbackData.length + violations.consoleErrors.length + 
    violations.eslintErrors.length + violations.typescriptTypes.length + 
    violations.fileSize.length + violations.comments.length;
  
  let summary = `=== CODE CHECK SUMMARY ===\n`;
  summary += `Files: ${totalFiles} | Passed: ${passedFiles} | Failed: ${failedFiles}\n\n`;
  
  if (totalViolationFiles > 0) {
    summary += `🔧 VIOLATIONS: ${totalViolationFiles} files require fixes before review completion\n`;
  }
  
  if (failedFiles === 0) {
    summary += `✅ All files passed validation!\n`;
  } else {
    summary += `\n🔧 REQUIRED: Fix all violations above.\n`;
  }
  
  return summary;
}

function main() {
  const args = process.argv.slice(2);
  
  // Resolve files based on arguments and mode
  const { files, mode } = resolveFiles(args);
  
  if (files.length === 0) {
    console.error('No files to analyze.');
    console.error('Usage: node code-check.js <file1> <file2> ...');
    console.error('   or: node code-check.js --mode=full-review');
    console.error('   or: (no args) = analyze recent git changes');
    process.exit(1);
  }
  
  console.log(`Mode: ${mode}, Files: ${files.length}`);
  if (mode === 'full-review') {
    console.log('Running full codebase analysis...');
  } else if (mode === 'recent') {
    console.log('Analyzing recent git changes...');
  } else {
    console.log('Analyzing specified files...');
  }
  
  // Analyze all files
  const results = files.map(analyzeFile);
  
  // Group violations by class for batched output
  const violations = groupViolationsByClass(results);
  
  // Generate summary
  const summary = generateSummary(results, violations);
  
  // NEW: Smart output handling with JSON fallback
  const output = generateOutput(violations, summary);
  
  // Always show summary first
  console.log(summary);
  
  // Handle output based on type
  if (output.type === 'stdout') {
    // Standard case: violations fit in stdout
    if (output.content.trim()) {
      console.log(output.content);
    }
  } else if (output.type === 'json_fallback') {
    // Large case: violations written to JSON, show critical instructions
    console.log(output.content);
  }
  
  // Exit with error code if any violations found
  const hasViolations = Object.values(violations).some(v => v.length > 0);
  if (hasViolations) {
    process.exit(1);
  }
}

main();
