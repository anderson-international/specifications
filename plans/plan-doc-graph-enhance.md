# Document Graph Enhancement Implementation Plan

## Background Context

**Current State:**
- `docs/document-graph.json` exists with 19 documents mapped
- Contains nodes, edges, workflowIntegration, and suggestedReadingPaths
- Currently only used manually in `/docs-read` workflow
- Sophisticated AI workflow system exists with 5 specialized workflows
- Proactive context suggestion system is already implemented

**Problem:**
The document graph is underutilized - it serves as documentation inventory rather than active AI routing system.

## Objectives

1. **Auto-Context Loading**: Smart document selection based on editing patterns
2. **Workflow Enhancement**: Graph-driven dependency loading in existing workflows  
3. **Proactive Intelligence**: Enhanced suggestions using relationship mapping
4. **Dependency Management**: Automatic loading of related documents

## Implementation Steps

### Phase 1: Foundation (Week 1)

#### Step 1.1: Create Smart Context Loader
**File**: `scripts/smart-context-loader.js`

```javascript
const fs = require('fs');
const path = require('path');

class SmartContextLoader {
  constructor() {
    this.graph = JSON.parse(fs.readFileSync('docs/document-graph.json'));
  }

  // Get dependencies for a given document ID
  getDependencies(documentId) {
    const edges = this.graph.edges.filter(edge => 
      edge.source === documentId || edge.target === documentId
    );
    return edges;
  }

  // Get workflow documents by workflow name
  getWorkflowDocuments(workflowName) {
    const workflow = this.graph.workflowIntegration.find(w => 
      w.workflow === workflowName
    );
    return workflow ? workflow.documents : [];
  }

  // Suggest documents based on file path
  suggestDocuments(filePath) {
    if (filePath.includes('/api/')) return this.getWorkflowDocuments('docs-api');
    if (filePath.includes('form') || filePath.includes('Form')) return this.getWorkflowDocuments('docs-forms');
    if (filePath.includes('.tsx') || filePath.includes('.css')) return this.getWorkflowDocuments('docs-ui');
    return [];
  }
}

module.exports = SmartContextLoader;
```

#### Step 1.2: Update Existing Workflows
**Target Files**: `.windsurf/workflows/docs-*.md`

**Enhancement Pattern for ALL workflows:**
```markdown
## Pre-Workflow: Load Document Dependencies

// turbo
**Load primary documents from graph:**
```
node scripts/smart-context-loader.js --workflow=<workflow-name>
```

**Load dependency chain:**
- Primary documents: [auto-loaded from workflowIntegration]
- Related documents: [auto-loaded from edges relationships]
- Cross-references: [validated against graph structure]
```

#### Step 1.3: Enhance `/docs-ai-reboot` Workflow
**File**: `.windsurf/workflows/docs-ai-reboot.md`

Add graph-based loading:
```markdown
## Pre-Workflow: Smart Context Loading

// turbo
**Load core documents with dependencies:**
```
node scripts/smart-context-loader.js --core-context
```

**Documents loaded:**
- ai-coding-handbook.md + validation-registry dependencies
- business-context.md + feature-requirements dependencies  
- Technical stack + react-patterns dependencies
```

### Phase 2: Workflow Integration (Week 2)

#### Step 2.1: Create Workflow Integration Script
**File**: `scripts/workflow-enhancer.js`

```javascript
const SmartContextLoader = require('./smart-context-loader');

class WorkflowEnhancer {
  constructor() {
    this.loader = new SmartContextLoader();
  }

  // Execute workflow with graph intelligence
  async executeWorkflow(workflowName, options = {}) {
    const documents = this.loader.getWorkflowDocuments(workflowName);
    
    console.log(`🔗 Loading ${workflowName} workflow with ${documents.length} documents`);
    
    // Load primary documents
    for (const docId of documents) {
      await this.loadDocument(docId);
    }
    
    // Load dependencies if requested
    if (options.includeDependencies) {
      await this.loadDependencies(documents);
    }
  }

  async loadDocument(documentId) {
    const node = this.loader.graph.nodes.find(n => n.id === documentId);
    if (node) {
      console.log(`📄 Loading: ${node.title} (${node.path})`);
      // Implement actual document loading logic here
    }
  }
}

module.exports = WorkflowEnhancer;
```

#### Step 2.2: Update Proactive Context System
**Context**: User already has proactive suggestions implemented

**Enhancement**: Add graph intelligence to existing system

**Integration Point**: Update existing proactive suggestion logic to use:
```javascript
const loader = new SmartContextLoader();
const suggestions = loader.suggestDocuments(currentFile);
// Enhance existing "I see you're working on..." messages
```

#### Step 2.3: Add Graph Validation to Link Checker
**File**: `scripts/validate-links.js`

Add graph consistency validation:
```javascript
function validateGraphConsistency() {
  const graph = JSON.parse(fs.readFileSync('docs/document-graph.json'));
  
  // Validate all node paths exist
  for (const node of graph.nodes) {
    const fullPath = path.join('docs', node.path);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Graph node references missing file: ${fullPath}`);
    }
  }
  
  // Validate all edges reference valid nodes
  for (const edge of graph.edges) {
    const sourceExists = graph.nodes.some(n => n.id === edge.source);
    const targetExists = graph.nodes.some(n => n.id === edge.target);
    if (!sourceExists || !targetExists) {
      console.log(`❌ Invalid edge: ${edge.source} -> ${edge.target}`);
    }
  }
}
```

### Phase 3: Advanced Features (Week 3)

#### Step 3.1: Automatic Graph Updates
**File**: `scripts/graph-maintainer.js`

```javascript
// Auto-detect new documents and suggest graph updates
// Scan docs/ directory and compare with graph.nodes
// Suggest new edges based on cross-reference analysis
```

#### Step 3.2: Context Pre-loading
**Integration**: Enhance existing file type detection

```javascript
// When user opens a file, pre-load likely dependencies
// Use graph relationships to predict needed context
// Background load while user is reading/editing
```

#### Step 3.3: Workflow Analytics
**File**: `scripts/graph-analytics.js`

```javascript
// Track which documents are loaded together
// Identify missing relationships in graph
// Suggest workflow optimizations
```

## Testing Strategy

### Unit Tests
**File**: `tests/smart-context-loader.test.js`
- Test document dependency resolution
- Test workflow document mapping
- Test file path suggestion logic

### Integration Tests
**File**: `tests/workflow-integration.test.js`
- Test enhanced workflows execute correctly
- Test graph validation catches errors
- Test proactive suggestions work with graph

### Manual Testing Checklist
1. **Workflow Enhancement Testing**:
   - [ ] `/docs-ai-reboot` loads dependencies correctly
   - [ ] `/docs-forms` includes business context
   - [ ] `/docs-api` loads role-based access patterns
   - [ ] `/docs-ui` includes technical stack patterns

2. **Proactive Context Testing**:
   - [ ] Form file editing suggests forms workflow + dependencies
   - [ ] API file editing suggests API workflow + business context
   - [ ] Component editing suggests UI workflow + design patterns

3. **Graph Validation Testing**:
   - [ ] Link checker validates graph consistency
   - [ ] Missing files are detected and reported
   - [ ] Invalid edges are caught and flagged

## Success Criteria

### Immediate (Week 1)
- [ ] All workflows reference graph for document loading
- [ ] Smart context loader script functional
- [ ] Enhanced `/docs-ai-reboot` workflow working

### Medium-term (Week 2)  
- [ ] Proactive suggestions use graph intelligence
- [ ] Workflow integration script operational
- [ ] Graph validation integrated into link checking

### Long-term (Week 3)
- [ ] Context pre-loading reduces manual workflow selection by 50%
- [ ] Graph automatically maintains consistency
- [ ] Analytics provide workflow optimization insights

## Implementation Notes

### Dependencies
- Existing sophisticated AI workflow system
- Current proactive context suggestion system  
- Existing link validation infrastructure
- Node.js environment for scripts

### Integration Points
- **DO NOT** replace existing workflow system
- **ENHANCE** current proactive suggestions with graph intelligence
- **BUILD ON** existing `/docs-ai-reboot` workflow
- **INTEGRATE** with current link validation process

### Rollback Plan
- All enhancements are additive
- Graph file can be temporarily ignored if issues arise
- Existing workflows continue to function without graph
- Scripts are standalone and can be disabled individually

## File Structure After Implementation

```
/scripts/
  smart-context-loader.js     # Core graph intelligence
  workflow-enhancer.js        # Enhanced workflow execution
  graph-maintainer.js         # Automatic graph updates
  graph-analytics.js          # Usage analytics
  validate-links.js           # Enhanced with graph validation

/.windsurf/workflows/
  docs-ai-reboot.md           # Enhanced with graph loading
  docs-forms.md               # Enhanced with dependencies
  docs-api.md                 # Enhanced with business context
  docs-ui.md                  # Enhanced with technical patterns
  docs-debug.md               # Enhanced with related patterns

/tests/
  smart-context-loader.test.js
  workflow-integration.test.js
```

This plan transforms the document graph from passive inventory to active AI routing system while preserving and enhancing the existing sophisticated workflow infrastructure.
