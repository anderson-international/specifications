const { execSync } = require('child_process');
const { ROOT_DIR } = require('../utils/paths');

async function runKnip() {
  try {
    const output = execSync('npx knip --reporter json --no-progress', {
      cwd: ROOT_DIR,
      stdio: 'pipe'
    }).toString();
    return JSON.parse(output);
  } catch (error) {
    const out = (error && (error.stdout?.toString() || error.stderr?.toString())) || '';
    try {
      return JSON.parse(out);
    } catch (e) {
      return { error: `Failed to run knip: ${error.message}`, raw: out };
    }
  }
}

module.exports = { runKnip };
