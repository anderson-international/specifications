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
    // Include primary source and explicit test/scripts
    'app/**/*.{ts,tsx,js}',
    'components/**/*.{ts,tsx,js}',
    'lib/**/*.{ts,tsx,js}',
    'hooks/**/*.{ts,tsx,js}',
    'types/**/*.{ts,tsx,js}',

    // Excludes
    '!node_modules/**',
    '!.next/**',
    '!dist/**',
    '!build/**',
    '!docs/**',
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
