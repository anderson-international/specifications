module.exports = {
  entry: [
    // Main application entry points
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    
    // Scripts and utilities (this is the key addition!)
    'docs/scripts/**/*.js',
  ],
  
  project: [
    // Include all source files for dependency analysis
    '**/*.{js,ts,tsx}',
    '!node_modules/**',
    '!.next/**',
    '!dist/**',
    '!build/**',
    // Ignore documentation test/fixture sources to reduce noise
    '!docs/**',
    '!scripts/**',
  ],
  
  // Include script-specific dependencies
  ignore: [
    // Ignore dependencies that might be development-only
    // but don't ignore script dependencies
  ],
  
  // Include dependencies used by scripts
  ignoreDependencies: [
    // Only ignore truly unused dependencies, not script dependencies
  ]
}
