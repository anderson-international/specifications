const fs = require('fs');
const path = require('path');

// Simulate what the script does
const docsDir = path.join(process.cwd(), 'docs');
const graphPath = path.join(process.cwd(), 'docs', 'scripts', 'docs-graph.json');

console.log('Current working directory:', process.cwd());
console.log('Docs directory:', docsDir);
console.log('Graph path:', graphPath);

// Check if the file actually exists
const testFile = path.join(process.cwd(), 'docs', 'guides', 'form-patterns-validation.md');
console.log('\nTest file path:', testFile);
console.log('File exists:', fs.existsSync(testFile));

// Check relative path conversion
const relativePath = path.relative(process.cwd(), testFile);
const normalizedPath = relativePath.replace(/\\/g, '/');
console.log('Relative path:', relativePath);
console.log('Normalized path:', normalizedPath);

// Read the graph and check what path it has
const graph = JSON.parse(fs.readFileSync(graphPath));
const formNode = graph.nodes.find(n => n.id === 'IJ1Ls6zf');
console.log('\nForm node in graph:', formNode);

// Check if the graph path exists
if (formNode) {
  const graphFilePath = path.join(process.cwd(), formNode.path);
  console.log('Graph expects file at:', graphFilePath);
  console.log('Graph path exists:', fs.existsSync(graphFilePath));
}
