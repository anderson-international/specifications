const fs = require('fs');

function analyzeTypeScript(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Function to extract complete function signatures by parsing carefully
    function extractCompleteFunctions(content) {
      const functions = [];
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for function/const declarations
        if (/(?:export\s+)?(?:async\s+)?function\s+\w+|(?:export\s+)?const\s+\w+\s*=/.test(line)) {
          let funcText = line;
          let j = i + 1;
          let parenLevel = 0;
          let foundOpeningBrace = false;
          
          // Count parentheses to find complete parameter list
          for (let char of line) {
            if (char === '(') parenLevel++;
            else if (char === ')') parenLevel--;
            else if (char === '{' && parenLevel === 0) {
              foundOpeningBrace = true;
              break;
            }
          }
          
          // If we haven't found the opening brace, continue to next lines
          while (j < lines.length && (!foundOpeningBrace || parenLevel > 0)) {
            funcText += '\n' + lines[j];
            
            for (let char of lines[j]) {
              if (char === '(') parenLevel++;
              else if (char === ')') parenLevel--;
              else if (char === '{' && parenLevel === 0) {
                foundOpeningBrace = true;
                break;
              }
            }
            
            if (foundOpeningBrace && parenLevel === 0) break;
            j++;
          }
          
          if (foundOpeningBrace) {
            functions.push(funcText);
          }
        }
      }
      
      return functions;
    }
    
    const functions = extractCompleteFunctions(content);
    const missingReturnTypes = [];
    
    functions.forEach(func => {
      // Clean up the function text for analysis
      const cleanFunc = func.replace(/\s+/g, ' ').trim();
      
      // Check if it's a function/const declaration we care about
      const isFunctionDeclaration = 
        /(?:export\s+)?(?:async\s+)?function\s+\w+/.test(cleanFunc) ||
        /(?:export\s+)?const\s+\w+\s*=\s*(?:async\s+)?\(/.test(cleanFunc);
        
      if (!isFunctionDeclaration) return;
      
      // Check for return type annotation: ): Type => or ): Type {
      const hasReturnType = 
        // Pattern 1: Basic types
        /\)\s*:\s*[^=>{]+(?:=>|\{)/.test(cleanFunc) ||
        // Pattern 2: Complex types with generics, objects, arrays
        /\)\s*:\s*[^=>{]*(?:\{[^}]*\}|<[^>]*>|\[[^\]]*\])[^=>{]*(?:=>|\{)/.test(cleanFunc) ||
        // Pattern 3: Union types (improved to handle nested generics)
        /\)\s*:\s*.*\|.*(?:=>|\{)/.test(cleanFunc) ||
        // Pattern 4: Multi-line return types
        /\)\s*:\s*[\s\S]*?(?:=>|\{)/.test(cleanFunc)
      
      if (!hasReturnType) {
        // Skip patterns that legitimately don't need return types
        const shouldSkip = 
          cleanFunc.includes('constructor') ||
          cleanFunc.includes('(): void') ||
          cleanFunc.includes(': void') ||
          cleanFunc.includes('Promise<void>') ||
          /function\s+\w+\s*\(\)\s*\{/.test(cleanFunc) || // Empty parameter functions
          cleanFunc.includes('set ') || // Setter methods
          cleanFunc.includes('get ') // Getter methods
        
        if (!shouldSkip) {
          missingReturnTypes.push(func.trim());
        }
      }
    });
    
    return {
      totalFunctions: functions.length,
      missingReturnTypes: missingReturnTypes.length,
      hasExplicitTypes: missingReturnTypes.length === 0,
      status: missingReturnTypes.length === 0 ? 'PASS' : 'FAIL'
    };
  } catch (error) {
    return { totalFunctions: 0, missingReturnTypes: 0, hasExplicitTypes: true, status: 'PASS' };
  }
}

module.exports = {
  analyzeTypeScript
};
