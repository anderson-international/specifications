const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Get files using git porcelain (recent changes)
 * @returns {string[]} Array of file paths
 */
function getRecentFiles() {
  try {
    // Get files that are modified/added/staged
    const output = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (!output.trim()) {
      return [];
    }
    
    const files = output
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        // Git status format: XY filename
        // Extract filename (skip first 3 characters)
        return line.substring(3).trim();
      })
      .filter(file => {
        // Only include JavaScript/TypeScript files that exist
        const ext = path.extname(file).toLowerCase();
        return ['.js', '.jsx', '.ts', '.tsx'].includes(ext) && fs.existsSync(file);
      });
    
    return files;
  } catch (error) {
    console.error(`Warning: Could not get git status: ${error.message}`);
    return [];
  }
}

/**
 * Get all source files for full review
 * @returns {string[]} Array of file paths
 */
function getFullReviewFiles() {
  const sourceDirectories = [
    'app',
    'components', 
    'lib',
    'hooks',
    'types',
    'utils',
    'src'
  ];
  
  const files = [];
  
  for (const dir of sourceDirectories) {
    if (fs.existsSync(dir)) {
      const dirFiles = getFilesRecursively(dir);
      files.push(...dirFiles);
    }
  }
  
  return files;
}

/**
 * Recursively get all JavaScript/TypeScript files in a directory
 * @param {string} dir - Directory path
 * @returns {string[]} Array of file paths
 */
function getFilesRecursively(dir) {
  const files = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and other common ignore directories
        if (!['node_modules', '.git', '.next', 'dist', 'build', '.turbo'].includes(entry.name)) {
          files.push(...getFilesRecursively(fullPath));
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Warning: Could not read directory ${dir}: ${error.message}`);
  }
  
  return files;
}

/**
 * Resolve files based on arguments and mode
 * @param {string[]} args - Command line arguments
 * @returns {Object} - { files: string[], mode: string, violations: string[] }
 */
function resolveFiles(args) {
  // Parse violation flags
  const violationFlags = ['--typescript', '--eslint', '--comments', '--console', '--fallback', '--size', '--duplication'];
  const selectedViolations = [];
  const nonFlagArgs = [];
  
  // Separate flags from file arguments
  for (const arg of args) {
    if (violationFlags.includes(arg)) {
      selectedViolations.push(arg.substring(2)); // Remove '--' prefix
    } else {
      nonFlagArgs.push(arg);
    }
  }
  
  // If no violation flags specified, run all checks
  const violations = selectedViolations.length > 0 ? selectedViolations : ['typescript', 'eslint', 'comments', 'console', 'fallback', 'size', 'duplication'];
  
  // Check for full-review mode
  if (nonFlagArgs.length > 0 && nonFlagArgs[0] === '--mode=full-review') {
    const files = getFullReviewFiles();
    return {
      files,
      mode: 'full-review',
      violations
    };
  }
  
  // If files provided explicitly, use them
  if (nonFlagArgs.length > 0) {
    // Validate that all provided files exist
    const validFiles = nonFlagArgs.filter(file => {
      if (!fs.existsSync(file)) {
        console.warn(`Warning: File not found: ${file}`);
        return false;
      }
      return true;
    });
    
    return {
      files: validFiles,
      mode: 'manual',
      violations
    };
  }
  
  // Default: use git porcelain (recent changes)
  const recentFiles = getRecentFiles();
  
  if (recentFiles.length === 0) {
    console.warn('No recent changes found. Use --mode=full-review or specify files explicitly.');
    return {
      files: [],
      mode: 'recent',
      violations
    };
  }
  
  return {
    files: recentFiles,
    mode: 'recent',
    violations
  };
}

module.exports = {
  getRecentFiles,
  getFullReviewFiles,
  resolveFiles
};
