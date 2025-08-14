const fs = require('fs');
const path = require('path');
const { ensureDir, OUTPUT_DIR, OLD_ANALYSIS_FILE, LEGACY_ANALYSIS_FILE } = require('./paths');

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content) return 0;
    // Normalize newlines for consistent counting
    return content.split(/\r?\n/).length;
  } catch (e) {
    return 0;
  }
}

function readJson(filePath, fallback = null) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function deleteFileIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (_) {}
}

function deleteStaleReports() {
  // Remove legacy report outputs to avoid confusion
  deleteFileIfExists(OLD_ANALYSIS_FILE);
  deleteFileIfExists(LEGACY_ANALYSIS_FILE);
}

module.exports = {
  countLines,
  readJson,
  writeJson,
  deleteFileIfExists,
  deleteStaleReports,
};
