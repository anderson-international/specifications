#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ANALYSIS_FILE = path.join(__dirname, '..', 'review', 'code_review.json');
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

function getFileType(filePath) {
  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);
  
  if (dirName.includes('components')) return 'components';
  if (dirName.includes('hooks')) return 'hooks';
  if (dirName.includes('types')) return 'types';
  if (dirName.includes('services')) return 'services';
  if (dirName.includes('repositories')) return 'repositories';
  if (dirName.includes('app') && fileName.includes('route')) return 'routes';
  if (dirName.includes('lib') || dirName.includes('utils')) return 'utils';
  
  return 'components'; // default
}

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

function analyzeComments(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const violations = [];
    let inJsDoc = false;
    let inMultiLine = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;
      
      // JSDoc comments
      if (line.startsWith('/**')) {
        inJsDoc = true;
        violations.push({ type: 'jsdoc', line: lineNum, content: line });
        continue;
      }
      
      // Multi-line comments
      if (line.startsWith('/*') && !line.startsWith('/**')) {
        inMultiLine = true;
        violations.push({ type: 'multiline', line: lineNum, content: line });
        continue;
      }
      
      // End of comments
      if (line.endsWith('*/')) {
        inJsDoc = false;
        inMultiLine = false;
        continue;
      }
      
      // Inside comments
      if (inJsDoc || inMultiLine) {
        violations.push({ type: inJsDoc ? 'jsdoc' : 'multiline', line: lineNum, content: line });
        continue;
      }
      
      // Single-line comments
      if (line.startsWith('//')) {
        violations.push({ type: 'inline', line: lineNum, content: line });
      }
    }
    
    return violations;
  } catch (error) {
    return [];
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

function analyzeConsoleErrors(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const violations = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;
      
      // Check for console.error and console.warn patterns
      const consoleErrorMatch = line.match(/console\.(error|warn)\s*\(/);
      if (consoleErrorMatch) {
        const method = consoleErrorMatch[1];
        violations.push({
          line: lineNum,
          method: method,
          content: line.trim(),
          guidance: `Replace console.${method} with proper error throwing. Use 'throw new Error(message)' instead of logging and continuing execution.`
        });
      }
    }
    
    return {
      violations,
      count: violations.length,
      status: violations.length === 0 ? 'PASS' : 'FAIL'
    };
  } catch (error) {
    return {
      violations: [],
      count: 0,
      status: 'PASS'
    };
  }
}

function runEslint(filePath) {
  try {
    execSync(`npx eslint "${filePath}" --max-warnings=0`, { stdio: 'pipe' });
    return { errors: [], warnings: [] };
  } catch (error) {
    const output = error.stdout?.toString() || error.stderr?.toString() || '';
    const errors = [];
    const warnings = [];
    
    output.split('\n').forEach(line => {
      if (line.includes('error')) {
        const match = line.match(/(\d+):(\d+)\s+error\s+(.+)/);
        if (match) {
          errors.push({
            line: parseInt(match[1]),
            column: parseInt(match[2]),
            message: match[3].trim()
          });
        }
      } else if (line.includes('warning')) {
        const match = line.match(/(\d+):(\d+)\s+warning\s+(.+)/);
        if (match) {
          warnings.push({
            line: parseInt(match[1]),
            column: parseInt(match[2]),
            message: match[3].trim()
          });
        }
      }
    });
    
    return { errors, warnings };
  }
}

function analyzeTypeScript(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const lines = content.split('\n');
    
    // Extract function-like constructs with metadata (name, line, kind, wrapper)
    function extractFunctions(lines) {
      const functions = [];
      for (let i = 0; i < lines.length; i++) {
        const firstLine = lines[i];
        let name = '';
        let kind = '';
        let wrapperName = null;
        
        const fnDeclMatch = firstLine.match(/(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+(\w+)/);
        const constMatch = firstLine.match(/(?:export\s+)?const\s+(\w+)\s*=\s*/);
        
        if (!fnDeclMatch && !constMatch) continue;
        
        if (fnDeclMatch) {
          name = fnDeclMatch[1];
          kind = 'function-declaration';
        } else if (constMatch) {
          name = constMatch[1];
          kind = 'const';
        }
        
        let text = firstLine;
        let j = i + 1;
        let parenLevel = 0;
        let seenArrow = /=>/.test(firstLine);
        let foundBrace = false;
        let everSawParen = false;
        
        function scan(s) {
          for (let ch of s) {
            if (ch === '(') { parenLevel++; everSawParen = true; }
            else if (ch === ')') { parenLevel = Math.max(0, parenLevel - 1); }
            else if (ch === '{' && parenLevel === 0) { foundBrace = true; break; }
          }
          if (/=>/.test(s)) seenArrow = true;
        }
        
        scan(firstLine);
        // Capture header lines conservatively.
        if (kind === 'const') {
          // For const assignments, only scan ahead while inside parentheses or to catch an immediate multi-line parameter start.
          while (!foundBrace && j < lines.length && (parenLevel > 0 || (!seenArrow && !everSawParen && (j - i) < 3))) {
            text += '\n' + lines[j];
            scan(lines[j]);
            j++;
          }
          // Do not greedily read more lines for consts; avoid inheriting arrows from later unrelated lines.
        } else {
          // For function declarations, allow scanning until we see the body start or the arrow.
          while (!foundBrace && j < lines.length && (parenLevel > 0 || !seenArrow)) {
            text += '\n' + lines[j];
            scan(lines[j]);
            j++;
          }
          // Read a few more lines to include the '{' if it appears shortly
          while (!foundBrace && j < lines.length && j - i < 8) {
            text += '\n' + lines[j];
            scan(lines[j]);
            j++;
          }
        }
        
        // Determine wrapper name (if any) for const assignments
        if (kind === 'const') {
          const wrapperMatch = text.match(/=\s*([A-Za-z_$][\w$]*)\s*(?:<|\()/);
          if (wrapperMatch) {
            wrapperName = wrapperMatch[1];
            // Distinguish between direct arrow and wrapped
            if (/=\s*\(/.test(text)) {
              kind = 'const-arrow';
            } else {
              kind = 'wrapped-arrow';
            }
          } else {
            kind = 'const-arrow';
          }
        }
        
        // Only keep const assignments that are function-like
        if (kind !== 'function-declaration') {
          const isArrow = /=\s*(?:async\s+)?[\s\S]*?\)\s*=>/.test(text);
          const isFunctionKeyword = /function\s*\(/.test(text);
          const isTypedFunctionVar = /const\s+\w+\s*:\s*[^=]*=>/.test(text);
          // Wrapper call where the first argument is an arrow (optionally typed): wrapper((args): Type => ...)
          const isWrapperWithArrowArg = /=\s*[A-Za-z_$][\w$]*\s*(?:<[^>]*>)?\s*\(\s*(?:async\s+)?\([^)]*\)\s*(?::\s*[^)]+)?\s*=>/.test(text);
          const functionLike = isArrow || isFunctionKeyword || isTypedFunctionVar || isWrapperWithArrowArg;
          if (!functionLike) {
            continue; // skip non-function consts (e.g., useRouter(), strings, numbers, objects)
          }
        }
        
        const signaturePreview = text.split('\n')[0].trim();
        
        functions.push({
          text,
          startLine: i + 1,
          name: name || '(anonymous)',
          kind,
          wrapperName,
          signaturePreview,
        });
      }
      return functions;
    }
    
    const functions = extractFunctions(lines);
    const missingDetails = [];
    
    function hasExplicitReturnType(func) {
      const clean = func.text.replace(/\s+/g, ' ').trim();
      
      function headerBeforeBody(text) {
        let paren = 0;
        for (let idx = 0; idx < text.length; idx++) {
          const ch = text[idx];
          if (ch === '(') paren++;
          else if (ch === ')') paren = Math.max(0, paren - 1);
          else if (ch === '{' && paren === 0) {
            return text.slice(0, idx);
          }
        }
        return text;
      }
      
      // Prefer a structural check on function declarations: any return type token after ) and before body {
      if (func.kind === 'function-declaration') {
        const header = headerBeforeBody(func.text).replace(/\s+/g, ' ');
        if (/\)\s*:\s*\S/.test(header)) {
          return true;
        }
      }
      
      // 1) function declaration annotated: function name(args): Type {
      if (/function\s+\w+\s*\([^)]*\)\s*:\s*[^\{]+\{/.test(clean)) {
        return true;
      }
      
      // 2) variable type annotation: const x: (args) => Type = (...)
      if (/const\s+\w+\s*:\s*[^=]+=\s*/.test(clean)) {
        return true;
      }
      
      // 3) direct arrow annotation: = (args): Type => (across multiline/nested parens)
      if (/=\s*(?:async\s+)?[\s\S]*?\)\s*:\s*[^=]+=>/.test(clean)) {
        return true;
      }
      
      // 4) wrapper generic annotation: = useCallback<(args) => Type>(...)
      if (func.kind === 'wrapped-arrow' && func.wrapperName === 'useCallback') {
        const m = clean.match(/=\s*useCallback\s*<([^>]+)>/);
        if (m && /\([^)]*\)\s*=>\s*[^)]+/.test(m[1])) {
          return true;
        }
      }

      // 4.5) any wrapper call with explicit arrow return type in its argument: = wrapper((args): Type => ...)
      if (/=\s*[A-Za-z_$][\w$]*\s*(?:<[^>]+>)?\s*\(\s*(?:async\s+)?\([^)]*\)\s*:\s*[^)]+=>/.test(clean)) {
        return true;
      }
      
      return false;
    }
    
    functions.forEach(func => {
      const clean = func.text.replace(/\s+/g, ' ').trim();
      
      const shouldSkip = 
        clean.includes('constructor') ||
        clean.includes('set ') ||
        clean.includes('get ') ||
        /function\s+\w+\s*\(\)\s*\{/.test(clean) ||
        clean.includes('(): void') ||
        clean.includes(': void') ||
        clean.includes('Promise<void>');
      
      if (shouldSkip) return;
      
      if (!hasExplicitReturnType(func)) {
        missingDetails.push({
          name: func.name,
          line: func.startLine,
          kind: func.kind,
          signaturePreview: func.signaturePreview,
        });
      }
    });
    
    return {
      totalFunctions: functions.length,
      missingReturnTypes: missingDetails.length,
      hasExplicitTypes: missingDetails.length === 0,
      status: missingDetails.length === 0 ? 'PASS' : 'FAIL',
      details: missingDetails,
    };
  } catch (error) {
    return { totalFunctions: 0, missingReturnTypes: 0, hasExplicitTypes: true, status: 'PASS', details: [] };
  }
}

// Helper functions to identify legitimate patterns vs fallback violations
function isValidBooleanLogic(line) {
  // Boolean logic operations (not fallback data)
  return /\|\|\s*(true|false|\w+\.\w+|\w+\(\)|\w+)\s*$/.test(line) ||
         /const\s+\w+\s*=\s*\w+\s*\|\|\s*\w+/.test(line);
}

function isValidHtmlAttribute(line) {
  // HTML attributes: disabled={condition ? true : false}
  return /(disabled|checked|selected|required|readOnly|autoFocus)\s*=\s*\{.*?\?.*?:.*?(true|false|undefined)\s*\}/.test(line);
}

function isValidCssClass(line) {
  // CSS class selection: className={variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
  return /(className|class)\s*=\s*\{.*?\?\s*['`"].*?['`"]\s*:\s*['`"]/.test(line);
}

function isValidAriaAttribute(line) {
  // Aria attributes: aria-expanded={isOpen ? 'true' : 'false'}
  return /aria-\w+\s*=\s*\{.*?\?\s*['`"](true|false|menu)['`"]\s*:\s*['`"](true|false)['`"]/.test(line) ||
         /\{\.\.\.\(.*?&&.*?\{\s*['"]aria-/.test(line); // Conditional aria spreading
}

function isCommentLine(line) {
  // Comments and strings containing patterns
  return /^\s*\/\//.test(line) || /^\s*\/\*/.test(line) || /^\s*\*/.test(line);
}

// Context validation functions for fallback data analysis
function isExplicitNullableReturnType(content, lineNum) {
  // Look backwards for function signature with | null return type
  const lines = content.split('\n');
  const currentLineIndex = lineNum - 1;
  
  // Search backwards up to 10 lines for function signature
  for (let i = Math.max(0, currentLineIndex - 10); i <= currentLineIndex; i++) {
    const line = lines[i];
    // Match function signatures with explicit | null return types
    if (/:\s*[^=]*\|\s*null/.test(line) || 
        /JSX\.Element\s*\|\s*null/.test(line) ||
        /ReactNode\s*\|\s*null/.test(line)) {
      return true;
    }
  }
  return false;
}

function isReactConditionalRender(content, lineNum) {
  // Check if this is a React component with EXPLICIT null return type
  const lines = content.split('\n');
  const currentLineIndex = lineNum - 1;
  
  // Look for React imports
  const hasReactImports = content.includes('import React') || 
                         content.includes('import * as React') ||
                         content.includes('JSX.Element');
  
  if (!hasReactImports) return false;
  
  // CRITICAL: Only allow if function has EXPLICIT | null return type
  for (let i = Math.max(0, currentLineIndex - 15); i <= currentLineIndex; i++) {
    const line = lines[i];
    // Match React component patterns WITH explicit null return type
    if (/const\s+\w+\s*=\s*\([^)]*\)\s*:\s*JSX\.Element\s*\|\s*null/.test(line) ||
        /function\s+\w+\s*\([^)]*\)\s*:\s*JSX\.Element\s*\|\s*null/.test(line)) {
      return true;
    }
  }
  
  // Do NOT allow components without explicit null typing
  return false;
}

function isValidApiNotFoundPattern(content, lineNum) {
  // Check if this is a legitimate API "not found" pattern
  const lines = content.split('\n');
  const currentLineIndex = lineNum - 1;
  
  // Look for function signature that explicitly returns T | null
  for (let i = Math.max(0, currentLineIndex - 10); i <= currentLineIndex; i++) {
    const line = lines[i];
    // Match utility function patterns that legitimately return null
    if (/function\s+\w+.*?:\s*\w+\s*\|\s*null/.test(line) ||
        /export\s+function\s+\w+.*?:\s*\w+\s*\|\s*null/.test(line)) {
      return true;
    }
  }
  
  // Check for legitimate "not found" contexts (expand context window)
  const contextLines = lines.slice(Math.max(0, currentLineIndex - 5), currentLineIndex + 1).join(' ');
  
  // localStorage, cache, data loading, or expiration scenarios
  if (/localStorage\.getItem|cache\.get|stored|expired/.test(contextLines) ||
      /if\s*\(!\w+\)|if\s*\(.*expired.*\)|Date\.now\(\).*>.*maxAge/.test(contextLines) ||
      /deleteDraft|removeItem|clear/.test(contextLines)) {
    return true;
  }
  
  // Check for data validation patterns
  if (/if\s*\([^)]*\)\s*{[^}]*return\s+null/.test(contextLines)) {
    return true;
  }
  
  return false;
}

function analyzeFallbackData(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const violations = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;
      const trimmedLine = line.trim();
      
      // Pattern 1: Return null/undefined (with context validation)
      if (/return\s+(null|undefined);?$/.test(trimmedLine)) {
        // Skip if this is a legitimate null return pattern
        if (isExplicitNullableReturnType(content, lineNum) ||
            isReactConditionalRender(content, lineNum) ||
            isValidApiNotFoundPattern(content, lineNum)) {
          // This is a legitimate null return, not a fallback violation
          continue;
        }
        
        violations.push({
          type: 'return_null',
          line: lineNum,
          content: trimmedLine,
          advice: 'Throw composed error instead of null return. Null returns mask invalid states and prevent proper error handling. Consider: What upstream validation failed? Why is this data missing?'
        });
      }
      
      // Pattern 2: Logical OR fallbacks with literals (exclude boolean logic)
      const orFallbackMatch = /\|\|\s*(['"`].*?['"`]|\[.*?\]|\{.*?\})/.exec(trimmedLine);
      if (orFallbackMatch && 
          !isValidBooleanLogic(trimmedLine) && 
          !isCommentLine(trimmedLine)) {
        violations.push({
          type: 'or_fallback',
          line: lineNum,
          content: trimmedLine,
          advice: 'Throw composed error instead of silent fallback. This pattern hides missing required data. Recommend deeper analysis: Is this data truly optional, or should upstream validation catch this?'
        });
      }
      
      // Pattern 3: Optional chaining with fallbacks  
      if (/\?\.\w+.*?\|\|/.test(trimmedLine)) {
        violations.push({
          type: 'optional_chaining_fallback',
          line: lineNum,
          content: trimmedLine,
          advice: 'Throw composed error instead of defensive fallback. Optional chaining with fallbacks suggests unclear data contracts. Recommend deeper analysis: Should this property be guaranteed? Is validation missing?'
        });
      }
      
      // Pattern 4: Ternary with default values (exclude HTML attributes and CSS classes)
      const ternaryFallbackMatch = /\?\s*\w+\s*:\s*(['"`].*?['"`]|\[.*?\]|\{.*?\})/.exec(trimmedLine);
      if (ternaryFallbackMatch && 
          !isValidHtmlAttribute(trimmedLine) && 
          !isValidCssClass(trimmedLine) && 
          !isValidAriaAttribute(trimmedLine) &&
          !isCommentLine(trimmedLine)) {
        violations.push({
          type: 'ternary_fallback',
          line: lineNum,
          content: trimmedLine,
          advice: 'Throw composed error instead of default value. Ternary fallbacks mask validation failures. Consider: What makes this condition invalid? Should upstream code prevent this state?'
        });
      }
      
      // Pattern 5: Empty catch blocks with returns (multi-line detection)
      if (trimmedLine.includes('catch')) {
        // Look ahead for empty catch blocks with returns
        let catchContent = '';
        let j = i;
        let braceCount = 0;
        let inCatch = false;
        
        while (j < lines.length) {
          const currentLine = lines[j].trim();
          if (currentLine.includes('catch')) inCatch = true;
          if (inCatch) {
            catchContent += currentLine + ' ';
            braceCount += (currentLine.match(/\{/g) || []).length;
            braceCount -= (currentLine.match(/\}/g) || []).length;
            if (braceCount === 0 && inCatch) break;
          }
          j++;
        }
        
        if (/catch\s*\([^)]*\)\s*\{[^}]*return\s+[^;]+;?\s*\}/.test(catchContent.replace(/\s+/g, ' '))) {
          violations.push({
            type: 'empty_catch_return',
            line: lineNum,
            content: trimmedLine,
            advice: 'Throw composed error instead of swallowing exceptions. Silent error suppression violates fail-fast methodology. Consider: Should this error propagate up? What context should be preserved?'
          });
        }
      }
    }
    
    return {
      violations,
      count: violations.length,
      status: violations.length === 0 ? 'PASS' : 'FAIL'
    };
  } catch (error) {
    return {
      violations: [],
      count: 0,
      status: 'PASS'
    };
  }
}

function analyzeFile(filePath) {
  // Skip all analysis for non-TypeScript files - analyzer processes TypeScript files only
  if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
    return {
      filePath,
      size: { lines: 0, limit: 0, type: 'skipped', status: 'PASS', percentage: 0 },
      comments: { violations: [], count: 0, status: 'PASS' },
      react: { issues: [] },
      consoleErrors: { violations: [], count: 0, status: 'PASS' },
      eslint: { errors: [], warnings: [] },
      typescript: { totalFunctions: 0, missingReturnTypes: 0, hasExplicitTypes: true, status: 'PASS' },
      fallbackData: { violations: [], count: 0, status: 'PASS' }
    };
  }
  
  const fileType = getFileType(filePath);
  const lines = countLines(filePath);
  const limit = FILE_SIZE_LIMITS[fileType];
  
  const sizeAnalysis = {
    lines,
    limit,
    type: fileType,
    status: lines <= limit ? 'PASS' : 'FAIL',
    percentage: Math.round((lines / limit) * 100)
  };
  
  const commentViolations = analyzeComments(filePath);
  const commentAnalysis = {
    violations: commentViolations,
    count: commentViolations.length,
    status: commentViolations.length === 0 ? 'PASS' : 'FAIL'
  };
  
  const reactAnalysis = analyzeReactPatterns(filePath);
  const consoleErrorAnalysis = analyzeConsoleErrors(filePath);
  const eslintAnalysis = runEslint(filePath);
  const typeScriptAnalysis = analyzeTypeScript(filePath);
  const fallbackDataAnalysis = analyzeFallbackData(filePath);
  
  return {
    filePath,
    size: sizeAnalysis,
    comments: commentAnalysis,
    react: reactAnalysis,
    consoleErrors: consoleErrorAnalysis,
    eslint: eslintAnalysis,
    typescript: typeScriptAnalysis,
    fallbackData: fallbackDataAnalysis
  };
}

function generateCompactSummary(results) {
  const totalFiles = results.length;
  const failedFiles = results.filter(r => 
    r.eslint.errors.length > 0 || r.eslint.warnings.length > 0 || 
    r.comments.status === 'FAIL' || 
    r.size.status === 'FAIL' || 
    r.typescript.status === 'FAIL' ||
    r.consoleErrors.status === 'FAIL' ||
    r.fallbackData.status === 'FAIL'
  );
  const passingFiles = totalFiles - failedFiles.length;
  
  let summary = `CODE REVIEW: ${totalFiles} files | ${passingFiles} passed | ${failedFiles.length} failed\n`;
  summary += `\n`;
  
  // All violations are blocking and must be fixed
  if (failedFiles.length > 0) {
    summary += `VIOLATIONS (blocking):\n`;
    
    failedFiles.forEach(file => {
      const fileName = path.basename(file.filePath);

      
      // File size violations  
      if (file.size.status === 'FAIL') {
        const fileType = getFileType(file.filePath);
        const limit = FILE_SIZE_LIMITS[fileType];
        summary += `${fileName}: File too large (${file.size.lines}/${limit}) - split into modules\n`;
      }
      
      // Comment violations
      if (file.comments.status === 'FAIL') {
        summary += `${fileName}: Remove ${file.comments.count} comments\n`;
      }
      
      // TypeScript violations
      if (file.typescript.status === 'FAIL') {
        summary += `${fileName}: Add ${file.typescript.missingReturnTypes} return types\n`;
        const details = file.typescript.details || [];
        details.forEach(d => {
          const fnName = d.name || '(anonymous)';
          summary += `${fileName}:${d.line} - Add return type to "${fnName}"\n`;
        });
      }
      
      // Console error violations (blocking - violates fail-fast principle)
      if (file.consoleErrors.status === 'FAIL') {
        file.consoleErrors.violations.forEach(violation => {
          summary += `${fileName}:${violation.line} - FAIL-FAST VIOLATION: Replace console.${violation.method} with throw new Error()\n`;
        });
      }
      
      // Fallback data violations (blocking - violates fail-fast principle)
      if (file.fallbackData.status === 'FAIL') {
        file.fallbackData.violations.forEach(violation => {
          summary += `${fileName}:${violation.line} - FALLBACK DATA VIOLATION: ${violation.advice}\n`;
        });
      }
      
      // ESLint violations (all blocking)
      const allViolations = [...file.eslint.errors, ...file.eslint.warnings];
      if (allViolations.length > 0) {
        allViolations.forEach(violation => {
          // Terse message for common violations
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
  const passedFiles = results.filter(r => r.comments.status === 'PASS' && r.size.status === 'PASS' && r.typescript.status === 'PASS' && r.eslint.errors.length === 0 && r.consoleErrors.status === 'PASS' && r.fallbackData.status === 'PASS');
  const failedFiles = results.filter(r => r.comments.status === 'FAIL' || r.size.status === 'FAIL' || r.typescript.status === 'FAIL' || r.eslint.errors.length > 0 || r.consoleErrors.status === 'FAIL' || r.fallbackData.status === 'FAIL');
  
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
      if (file.consoleErrors.status === 'FAIL') issues.push(`console-errors (${file.consoleErrors.count} fail-fast violations)`);
      if (file.fallbackData.status === 'FAIL') issues.push(`fallback-data (${file.fallbackData.count} violations)`);
      if (file.eslint.errors.length > 0) issues.push(`eslint (${file.eslint.errors.length} errors)`);
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

function main() {
  const files = process.argv.slice(2);
  
  if (files.length === 0) {
    console.error('Usage: node code-review-analyzer.js <file1> <file2> ...');
    process.exit(1);
  }
  
  // Check if this is a batch test (multiple files with test patterns)
  const isBatchTest = files.length > 1 && files.some(f => f.includes('test/typescript-analyzer/'));
  
  // FAIL-SAFE: Delete stale analysis file
  deleteStaleAnalysis();
  
  // Analyze all files
  const results = files.map(analyzeFile);
  
  // Generate appropriate summary
  let summary;
  if (isBatchTest) {
    summary = generateBatchSummary(results);
  } else {
    summary = generateCompactSummary(results);
  }
  
  console.log(summary);
  
  // Check if any files failed and exit with appropriate code
  const hasFailures = results.some(r => 
    r.eslint.errors.length > 0 || r.eslint.warnings.length > 0 || 
    r.comments.status === 'FAIL' || 
    r.size.status === 'FAIL' || 
    r.typescript.status === 'FAIL' ||
    r.consoleErrors.status === 'FAIL' ||
    r.fallbackData.status === 'FAIL'
  );
  
  // Write detailed analysis to file
  const detailedAnalysis = {
    timestamp: new Date().toISOString(),
    totalFiles: results.length,
    results: results.reduce((acc, result) => {
      acc[result.filePath] = result;
      return acc;
    }, {})
  };
  
  try {
    // Ensure directory exists
    const analysisDir = path.dirname(ANALYSIS_FILE);
    if (!fs.existsSync(analysisDir)) {
      fs.mkdirSync(analysisDir, { recursive: true });
    }
    
    fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(detailedAnalysis, null, 2));
  } catch (error) {
    console.error(`Error writing analysis file: ${error.message}`);
    process.exit(1);
  }
  
  // Exit with error code if any violations found
  if (hasFailures) {
    process.exit(1);
  }
}

main();
