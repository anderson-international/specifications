const fs = require('fs');
const path = require('path');

/**
 * Write violations data to JSON file with timestamped filename
 * @param {Object} violations - Grouped violations by class
 * @param {string} summary - Summary text
 * @param {string} baseDir - Base directory for output (defaults to current working directory)
 * @returns {Object} - { filePath, fileName }
 */
function writeViolationsToJSON(violations, summary, baseDir = process.cwd()) {
  // Generate timestamped filename for uniqueness
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `code-violations-${timestamp}.json`;
  const filePath = path.join(baseDir, fileName);
  
  // Calculate total violation files
  const totalViolationFiles = Object.values(violations).reduce((sum, arr) => sum + arr.length, 0);
  
  const output = {
    timestamp: new Date().toISOString(),
    summary: summary,
    violations: violations,
    totalViolationFiles: totalViolationFiles,
    reviewComplete: true,
    allViolationsBlocking: true,
    message: "ALL violations must be fixed before review completion",
    metadata: {
      outputReason: "Violation data exceeds 8K stdout limit",
      instructionCompliance: "AI must read this JSON file for complete violation data",
      warningLevel: "CRITICAL"
    }
  };
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
    return { filePath, fileName };
  } catch (error) {
    throw new Error(`Failed to write violations JSON: ${error.message}`);
  }
}

/**
 * Generate critical instructions for AI when JSON fallback is used
 * @param {string} filePath - Full path to JSON file
 * @param {string} fileName - Just the filename for display
 * @returns {string} - Critical instruction message for stdout
 */
function generateCriticalJSONInstructions(filePath, fileName) {
  return `🚨 REVIEW COMPLETE - VIOLATION DATA EXCEEDS STDOUT LIMIT
${'='.repeat(70)}

✅ ANALYSIS STATUS: Complete - all files analyzed
✅ VIOLATIONS DETECTED: All violations captured and preserved  
❌ STDOUT CONSTRAINT: Violation data too large for 8K display limit

🔧 REQUIRED ACTION FOR AI:
${'='.repeat(70)}
1. READ COMPLETE VIOLATION DATA FROM: ${filePath}
2. The JSON file above contains the ONLY complete violation set
3. DO NOT proceed based on this stdout message alone
4. ALL violations in JSON file are BLOCKING and must be fixed
5. Review completion requires fixing ALL violations in JSON file

⚠️  CRITICAL WARNING:
${'='.repeat(70)}
- This stdout does NOT contain any violation details
- All violation data is exclusively in: ${fileName}  
- Ignoring JSON file will result in incomplete fixes
- NO violations may be skipped or deferred

🎯 NEXT STEP: Use view_file tool to read ${filePath}`;
}

module.exports = { 
  writeViolationsToJSON, 
  generateCriticalJSONInstructions 
};
