const { execSync } = require('child_process');

function runEslint(filePath) {
  try {
    execSync(`npx eslint "${filePath}" --max-warnings=0 --no-ignore`, { stdio: 'pipe' });
    return { errors: [], warnings: [] };
  } catch (error) {
    const output = error.stdout?.toString() || error.stderr?.toString() || '';
    const errors = [];
    const warnings = [];

    output.split('\n').forEach(line => {
      if (line.includes('File ignored because of a matching ignore pattern')) {
        return;
      }
      if (line.includes('error')) {
        const match = line.match(/(\d+):(\d+)\s+error\s+(.+)/);
        if (match) {
          errors.push({ line: parseInt(match[1]), column: parseInt(match[2]), message: match[3].trim() });
        }
      } else if (line.includes('warning')) {
        const match = line.match(/(\d+):(\d+)\s+warning\s+(.+)/);
        if (match) {
          warnings.push({ line: parseInt(match[1]), column: parseInt(match[2]), message: match[3].trim() });
        }
      }
    });

    return { errors, warnings };
  }
}

module.exports = { runEslint };
