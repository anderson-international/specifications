/**
 * Code Duplication Violation Detector
 * 
 * Uses jscpd (JavaScript Copy/Paste Detector) to identify duplicated code blocks
 * and formats them as violations for the code review system.
 * 
 * Integration approach:
 * - Runs jscpd with JSON output format
 * - Parses results to extract duplication details
 * - Formats as standard violation objects with file locations and guidance
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Analyze code duplication in specified files using jscpd
 * @param {Array<string>} filePaths - Array of file paths to analyze
 * @returns {Array} Array of duplication violation objects
 */
function analyzeDuplication(filePaths) {
  if (!filePaths || filePaths.length === 0) {
    return [];
  }

  const violations = [];

  try {
    // Create temporary file list for jscpd to process
    const tempDir = path.join(process.cwd(), 'temp-jscpd');
    const tempListFile = path.join(tempDir, 'file-list.txt');
    
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Filter files to only include TypeScript/TSX files that exist
    const validFiles = filePaths.filter(filePath => {
      const fullPath = path.resolve(filePath);
      return fs.existsSync(fullPath) && 
             (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) &&
             !filePath.includes('node_modules') &&
             !filePath.includes('.next') &&
             !filePath.includes('dist');
    });

    if (validFiles.length < 2) {
      // Need at least 2 files to detect duplication
      return [];
    }

    // Run jscpd with JSON reporter and inline configuration (no .jscpd.json dependency)
    const jscpdCommand = [
      'npx jscpd',
      '--min-lines 3',
      '--min-tokens 15',
      '--threshold 0.1', 
      '--format typescript,tsx',
      '--reporters json',
      `--output "${tempDir}"`,
      '--ignore "**/node_modules/**,**/dist/**,**/.next/**,**/build/**,**/coverage/**,**/.git/**,**/docs/**,**/__tests__/**,**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx"',
      validFiles.join(' ')
    ].join(' ');
    
    try {
      execSync(jscpdCommand, { 
        cwd: process.cwd(),
        stdio: 'pipe' // Suppress stdout to avoid noise
      });
    } catch (error) {
      // jscpd returns non-zero exit code when duplications are found
      // This is expected behavior, not an actual error
    }

    // Read and parse jscpd JSON output
    const jsonReportPath = path.join(tempDir, 'jscpd-report.json');
    
    if (fs.existsSync(jsonReportPath)) {
      const reportData = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
      
      if (reportData.duplicates && reportData.duplicates.length > 0) {
        violations.push(...formatDuplicationViolations(reportData.duplicates));
      }
    }

    // Cleanup temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

  } catch (error) {
    console.error('Error running jscpd analysis:', error.message);
    // Return empty array on error - don't fail the entire review process
    return [];
  }

  return violations;
}

/**
 * Format jscpd duplication results as violation objects
 * @param {Array} duplicates - Raw jscpd duplicate results
 * @returns {Array} Formatted violation objects
 */
function formatDuplicationViolations(duplicates) {
  const violations = [];

  duplicates.forEach((duplicate, index) => {
    if (!duplicate.firstFile || !duplicate.secondFile) {
      return; // Skip invalid entries
    }

    const violation = {
      type: 'code-duplication',
      severity: 'warning',
      line: duplicate.firstFile.start || 1,
      column: 1,
      message: `Duplicated code block detected (${duplicate.lines || 'N/A'} lines, ${duplicate.tokens || 'N/A'} tokens)`,
      details: {
        duplicateId: `dup-${index + 1}`,
        linesCount: duplicate.lines || 0,
        tokensCount: duplicate.tokens || 0,
        firstLocation: {
          file: duplicate.firstFile.name,
          startLine: duplicate.firstFile.start,
          endLine: duplicate.firstFile.end
        },
        secondLocation: {
          file: duplicate.secondFile.name,
          startLine: duplicate.secondFile.start,
          endLine: duplicate.secondFile.end
        },
        fragment: duplicate.fragment ? duplicate.fragment.substring(0, 200) : 'N/A'
      },
      guidance: [
        'Extract duplicated code into a reusable function or component',
        'Consider creating a shared utility function in lib/ directory',
        'For React components, extract common patterns into custom hooks',
        'Ensure the extracted code has proper TypeScript types',
        'Add appropriate tests for the extracted functionality'
      ],
      analysisQuestions: [
        'What is the business logic being duplicated?',
        'Can this be extracted into a pure function?',
        'Are there subtle differences that need to be preserved?',
        'Where should the extracted code be located for maximum reusability?',
        'What parameters and return types are needed for the extracted function?'
      ]
    };

    violations.push(violation);
  });

  return violations;
}

/**
 * Generate summary of duplication analysis results
 * @param {Array} violations - Array of duplication violations
 * @returns {Object} Summary statistics
 */
function generateDuplicationSummary(violations) {
  if (violations.length === 0) {
    return {
      totalDuplications: 0,
      totalLinesAffected: 0,
      averageDuplicationSize: 0,
      message: 'No code duplications detected'
    };
  }

  const totalLines = violations.reduce((sum, violation) => {
    return sum + (violation.details.linesCount || 0);
  }, 0);

  const averageSize = Math.round(totalLines / violations.length);

  return {
    totalDuplications: violations.length,
    totalLinesAffected: totalLines,
    averageDuplicationSize: averageSize,
    message: `Found ${violations.length} code duplication(s) affecting ${totalLines} lines`
  };
}

module.exports = {
  analyzeDuplication,
  formatDuplicationViolations,
  generateDuplicationSummary
};
