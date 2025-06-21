const fs = require('fs');
const path = require('path');

// Test the exact graph update logic
const graphPath = path.join(process.cwd(), 'docs', 'scripts', 'docs-graph.json');
const graph = JSON.parse(fs.readFileSync(graphPath));

console.log('Original graph metadata:', graph.metadata);

// Find the form node
const formNode = graph.nodes.find(n => n.id === 'IJ1Ls6zf');
console.log('Form node before update:', formNode);

// Update it
formNode.path = 'docs/guides/form-patterns-validation.md';
console.log('Form node after update:', formNode);

// Update metadata
graph.metadata = graph.metadata || {};
graph.metadata.lastUpdated = new Date().toISOString();
console.log('New metadata:', graph.metadata);

// Try to save it
try {
  fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2), 'utf8');
  console.log('✅ Graph saved successfully');
  
  // Verify it was saved
  const reloadedGraph = JSON.parse(fs.readFileSync(graphPath));
  const reloadedFormNode = reloadedGraph.nodes.find(n => n.id === 'IJ1Ls6zf');
  console.log('Reloaded form node:', reloadedFormNode);
  console.log('Reloaded metadata:', reloadedGraph.metadata);
  
} catch (error) {
  console.error('❌ Failed to save graph:', error.message);
}
