const { execSync } = require('child_process');

function runEslint(filePath) {
  try {
    // Run ESLint on the specific file
    const eslintOutput = execSync(`npx eslint "${filePath}" --format=json`, {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    const eslintResults = JSON.parse(eslintOutput);
    
    if (eslintResults.length === 0) {
      return { errors: [], warnings: [] };
    }
    
    const result = eslintResults[0];
    const errors = result.messages.filter(msg => msg.severity === 2);
    const warnings = result.messages.filter(msg => msg.severity === 1);
    
    return {
      errors: errors.map(err => ({
        line: err.line,
        column: err.column,
        message: err.message,
        ruleId: err.ruleId
      })),
      warnings: warnings.map(warn => ({
        line: warn.line,
        column: warn.column,
        message: warn.message,
        ruleId: warn.ruleId
      }))
    };
  } catch (error) {
    // ESLint returns non-zero exit code when there are errors
    if (error.stdout) {
      try {
        const eslintResults = JSON.parse(error.stdout);
        if (eslintResults.length > 0) {
          const result = eslintResults[0];
          const errors = result.messages.filter(msg => msg.severity === 2);
          const warnings = result.messages.filter(msg => msg.severity === 1);
          
          return {
            errors: errors.map(err => ({
              line: err.line,
              column: err.column,
              message: err.message,
              ruleId: err.ruleId
            })),
            warnings: warnings.map(warn => ({
              line: warn.line,
              column: warn.column,
              message: warn.message,
              ruleId: warn.ruleId
            }))
          };
        }
      } catch (parseError) {
        // Fall through to return empty result
      }
    }
    
    return { errors: [], warnings: [] };
  }
}

module.exports = {
  runEslint
};
