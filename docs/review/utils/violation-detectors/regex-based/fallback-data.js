const fs = require('fs');

// Helper functions to identify legitimate patterns vs fallback violations
function isValidBooleanLogic(line) {
  return /&&|\|\|/.test(line) && !/(['\"`].*?['\"`]|\\[.*?\\]|\\{.*?\\})/.test(line.split('||')[1]?.trim() || '');
}

function isValidHtmlAttribute(line) {
  return /className|aria-|data-/.test(line);
}

function isValidCssClass(line) {
  return /class.*=.*/.test(line);
}

function isValidAriaAttribute(line) {
  return /aria-[a-z]/.test(line);
}

function isCommentLine(line) {
  return line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*');
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
      
      // Pattern 1: Return null/undefined
      if (/return\s+(null|undefined);?$/.test(trimmedLine)) {
        violations.push({
          type: 'return_null',
          line: lineNum,
          content: trimmedLine,
          advice: 'Throw composed error instead of null return. Null returns mask invalid states and prevent proper error handling. Consider: What upstream validation failed? Why is this data missing?'
        });
      }
      
      // Pattern 2: Logical OR fallbacks with literals (exclude boolean logic)
      const orFallbackMatch = /\|\|\s*(['\"`].*?['\"`]|\[.*?\]|\{.*?\})/.exec(trimmedLine);
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
      const ternaryFallbackMatch = /\?\s*\w+\s*:\s*(['\"`].*?['\"`]|\[.*?\]|\{.*?\})/.exec(trimmedLine);
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

module.exports = {
  analyzeFallbackData,
  isValidBooleanLogic,
  isValidHtmlAttribute,
  isValidCssClass,
  isValidAriaAttribute,
  isCommentLine
};
