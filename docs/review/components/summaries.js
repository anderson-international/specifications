const path = require('path');
const { FILE_SIZE_LIMITS, getFileType } = require('./utils/filters');

function generateCompactSummary(results) {
  const totalFiles = results.length;
  const failedFiles = results.filter(r => 
    r.eslint.errors.length > 0 || r.eslint.warnings.length > 0 || 
    r.comments.status === 'FAIL' || 
    r.size.status === 'FAIL' || 
    r.typescript.status === 'FAIL' ||
    (r.typescriptCompiler && r.typescriptCompiler.status === 'FAIL') ||
    r.consoleErrors.status === 'FAIL' ||
    r.fallbackData.status === 'FAIL' ||
    (r.deadCode && r.deadCode.status === 'FAIL') ||
    (r.duplicates && r.duplicates.status === 'FAIL')
  );
  const passingFiles = totalFiles - failedFiles.length;
  
  let summary = `CODE REVIEW: ${totalFiles} files | ${passingFiles} passed | ${failedFiles.length} failed\n`;
  summary += `\n`;
  
  if (failedFiles.length > 0) {
    summary += `VIOLATIONS (blocking):\n`;
    
    failedFiles.forEach(file => {
      const fileName = path.basename(file.filePath);

      if (file.size.status === 'FAIL') {
        const fileType = getFileType(file.filePath);
        const limit = FILE_SIZE_LIMITS[fileType];
        summary += `${fileName}: File too large (${file.size.lines}/${limit}) - split into modules\n`;
      }
      
      if (file.comments.status === 'FAIL') {
        summary += `${fileName}: Remove ${file.comments.count} comments\n`;
      }
      
      if (file.typescript.status === 'FAIL') {
        summary += `${fileName}: Add ${file.typescript.missingReturnTypes} return types\n`;
        const details = file.typescript.details || [];
        details.forEach(d => {
          const fnName = d.name || '(anonymous)';
          summary += `${fileName}:${d.line} - Add return type to "${fnName}"\n`;
        });
      }
      if (file.typescriptCompiler && file.typescriptCompiler.errorCount > 0) {
        const count = file.typescriptCompiler.errorCount;
        summary += `${fileName}: ${count} TypeScript compiler error(s)\n`;
        const list = Array.isArray(file.typescriptCompiler.errors) ? file.typescriptCompiler.errors.slice(0, 5) : [];
        list.forEach(e => {
          const code = e.code || 'TS';
          const line = typeof e.line === 'number' ? e.line : 0;
          const col = typeof e.column === 'number' ? e.column : 0;
          const msg = (e.message || '').trim();
          summary += `${fileName}:${line}:${col} - ${code}: ${msg}\n`;
        });
        if ((file.typescriptCompiler.errors || []).length > 5) {
          summary += `${fileName}: ...and more\n`;
        }
      }
      
      if (file.consoleErrors.status === 'FAIL') {
        file.consoleErrors.violations.forEach(violation => {
          summary += `${fileName}:${violation.line} - FAIL-FAST VIOLATION: Replace console.${violation.method} with throw new Error()\n`;
        });
      }
      
      if (file.fallbackData.status === 'FAIL') {
        file.fallbackData.violations.forEach(violation => {
          summary += `${fileName}:${violation.line} - FALLBACK DATA VIOLATION: ${violation.advice}\n`;
        });
      }
      
      if (file.deadCode && file.deadCode.status === 'FAIL') {
        summary += `${fileName}: Dead code/unresolved imports detected\n`;
      }
      
      if (file.duplicates && file.duplicates.status === 'FAIL') {
        summary += `${fileName}: Duplicate code segments (${file.duplicates.count})\n`;
      }
      
      const allViolations = [...file.eslint.errors, ...file.eslint.warnings];
      if (allViolations.length > 0) {
        allViolations.forEach(violation => {
          let message = violation.message;
          if (message.includes('Unexpected any')) {
            message = 'Replace any type';
          } else if (message.includes('Missing semicolon')) {
            message = 'Add semicolon';
          } else if (message.includes('Unused variable')) {
            message = 'Remove unused variable';
          }
          summary += `${fileName}:${violation.line} - ${message}\n`;
        });
      }
    });
    summary += `\nACTION REQUIRED: Fix all violations above.\n`;
  } else {
    summary += `✅ All files passed code review standards.\n`;
  }
  
  return summary;
}

function generateBatchSummary(results) {
  const totalFiles = results.length;
  const passedFiles = results.filter(r => r.comments.status === 'PASS' && r.size.status === 'PASS' && r.typescript.status === 'PASS' && (!r.typescriptCompiler || r.typescriptCompiler.status === 'PASS') && r.eslint.errors.length === 0 && r.consoleErrors.status === 'PASS' && r.fallbackData.status === 'PASS' && (!r.deadCode || r.deadCode.status === 'PASS') && (!r.duplicates || r.duplicates.status === 'PASS'));
  const failedFiles = results.filter(r => r.comments.status === 'FAIL' || r.size.status === 'FAIL' || r.typescript.status === 'FAIL' || (r.typescriptCompiler && r.typescriptCompiler.status === 'FAIL') || r.eslint.errors.length > 0 || r.consoleErrors.status === 'FAIL' || r.fallbackData.status === 'FAIL' || (r.deadCode && r.deadCode.status === 'FAIL') || (r.duplicates && r.duplicates.status === 'FAIL'));
  
  let summary = `=== BATCH TEST SUMMARY ===\n`;
  summary += `Total Files: ${totalFiles} | Passed: ${passedFiles.length} | Failed: ${failedFiles.length}\n\n`;
  
  if (failedFiles.length > 0) {
    summary += `⚠️  FAILED FILES - ALL VIOLATIONS MUST BE FIXED:\n`;
    failedFiles.forEach(file => {
      const fileName = path.basename(file.filePath);
      const issues = [];
      if (file.comments.status === 'FAIL') issues.push('comments');
      if (file.size.status === 'FAIL') issues.push('size');
      if (file.typescript.status === 'FAIL') issues.push(`typescript (${file.typescript.missingReturnTypes} missing)`);
      if (file.typescriptCompiler && file.typescriptCompiler.status === 'FAIL') issues.push(`tsc (${file.typescriptCompiler.errorCount})`);
      if (file.consoleErrors.status === 'FAIL') issues.push(`console-errors (${file.consoleErrors.count} fail-fast violations)`);
      if (file.fallbackData.status === 'FAIL') issues.push(`fallback-data (${file.fallbackData.count} violations)`);
      if (file.eslint.errors.length > 0) issues.push(`eslint (${file.eslint.errors.length} errors)`);
      if (file.deadCode && file.deadCode.status === 'FAIL') issues.push('dead-code');
      if (file.duplicates && file.duplicates.status === 'FAIL') issues.push(`duplicates (${file.duplicates.count})`);
      summary += `- ${fileName}: ${issues.join(', ')}\n`;
    });
    summary += `\n`;
    summary += `🔧 ACTION REQUIRED: Every failed file must be corrected.\n`;
    summary += `   No violations are acceptable - fix all issues above.\n`;
    summary += `\n`;
  }
  
  if (passedFiles.length > 0) {
    summary += `✅ PASSED FILES:\n`;
    passedFiles.forEach(file => {
      const fileName = path.basename(file.filePath);
      summary += `- ${fileName}: All checks passed\n`;
    });
    summary += `\n`;
  }
  
  return summary;
}

module.exports = { generateCompactSummary, generateBatchSummary };
