# Plan: Handle Deleted Files in Link Fix Script

## Problem Statement

The current `docs-links-fix.js` script detects deleted files but doesn't handle them automatically. When a markdown file is deleted:

1. ✅ **Detection works:** Script identifies orphaned graph nodes
2. ❌ **No cleanup:** Deleted files remain in `document-graph.json`
3. ❌ **Script fails:** Exits with errors instead of cleaning up
4. ❌ **Broken references:** Links to deleted files become permanently broken

## Current Behavior
```javascript
// File exists in graph but not on filesystem
if (!actualPath) {
  console.log(`❌ Graph node references missing file: ${expectedPath}`);
  hasErrors = true; // Script exits with failure
}
```

## Required Solution

### **Automatic Cleanup (No User Input Required)**
The script should automatically:
1. **Detect deleted files** (exist in graph, not on filesystem)
2. **Clean up document graph** (remove nodes, edges, workflow references)
3. **Report cleanup results** (what was removed)
4. **Continue normal validation** (don't exit with errors)

## Implementation Plan

### **Step 1: Enhance Detection Logic**
```javascript
// In validateAndUpdateGraphConsistency()
const deletedFiles = [];

for (const node of graph.nodes) {
  if (!fs.existsSync(fullExpectedPath) && !currentPaths.get(node.id)) {
    deletedFiles.push({
      id: node.id,
      path: node.path,
      workflows: node.workflows || []
    });
  }
}

// Clean up automatically if deletions found
if (deletedFiles.length > 0) {
  cleanupDeletedFiles(graph, deletedFiles);
  hasUpdates = true;
}
```

### **Step 2: Automatic Graph Cleanup**
```javascript
function cleanupDeletedFiles(graph, deletedFiles) {
  console.log(`🗑️ Cleaning up ${deletedFiles.length} deleted files from graph...\n`);
  
  const deletedIds = new Set(deletedFiles.map(f => f.id));
  
  // Report what's being cleaned up
  for (const file of deletedFiles) {
    console.log(`  🗑️ Removing: ${file.path} (ID: ${file.id})`);
  }
  
  // Remove nodes
  const originalNodeCount = graph.nodes.length;
  graph.nodes = graph.nodes.filter(n => !deletedIds.has(n.id));
  
  // Remove edges
  const originalEdgeCount = graph.edges.length;
  graph.edges = graph.edges.filter(e => 
    !deletedIds.has(e.source) && !deletedIds.has(e.target)
  );
  
  // Clean workflow references
  for (const workflow of graph.workflowIntegration) {
    workflow.documents = workflow.documents.filter(id => !deletedIds.has(id));
  }
  
  console.log(`\n🎉 Cleanup complete:`);
  console.log(`  - Removed ${originalNodeCount - graph.nodes.length} nodes`);
  console.log(`  - Removed ${originalEdgeCount - graph.edges.length} edges`);
  console.log(`  - Updated workflow references\n`);
}
```

### **Step 3: Update Main Logic**
```javascript
// Replace the error-causing logic:
if (!actualPath) {
  console.log(`❌ Graph node references missing file: ${expectedPath}`);
  hasErrors = true; // ❌ OLD: Causes script to fail
}

// With automatic cleanup:
if (!actualPath) {
  deletedFiles.push({
    id: node.id,
    path: expectedPath,
    workflows: node.workflows || []
  });
}
```

### **Step 4: Enhanced Reporting**
```javascript
// At the end of execution:
if (deletedFiles.length > 0) {
  console.log(`Files automatically cleaned up: ${deletedFiles.length}`);
}

console.log('✅ All file deletions handled automatically!');
console.log('✅ Document graph is synchronized with filesystem!');
```

## Expected Workflow

### **User Experience:**
1. **Delete a markdown file** from the filesystem
2. **Run the script:** `node docs\ai\maintenance\scripts\docs-links-fix.js`
3. **Automatic cleanup:**
   ```
   🗑️ Cleaning up 1 deleted files from graph...
     🗑️ Removing: docs/old/deprecated-guide.md (ID: 1050)
   
   🎉 Cleanup complete:
     - Removed 1 nodes
     - Removed 2 edges
     - Updated workflow references
   
   ✅ All file deletions handled automatically!
   ✅ Document graph is synchronized with filesystem!
   ```

### **No User Input Required:**
- No confirmation prompts
- No command-line flags
- No interactive mode
- Just automatic cleanup and reporting

## Success Criteria

1. ✅ **Detect deleted files** without failing the script
2. ✅ **Clean up graph automatically** (no user confirmation needed)
3. ✅ **Remove orphaned edges and workflow references**
4. ✅ **Continue normal validation** after cleanup
5. ✅ **Report cleanup results** clearly
6. ✅ **Match existing script simplicity** (no flags/prompts)

## Integration Points

The cleanup will be integrated into the existing `validateAndUpdateGraphConsistency()` method:
- **Before:** Detects moves, reports deletions as errors
- **After:** Detects moves, automatically cleans up deletions
- **Flow:** Move detection → Deletion cleanup → Edge validation → Workflow validation

## Estimated Effort

- **Detection logic:** 1 hour
- **Cleanup function:** 2 hours  
- **Integration & testing:** 2 hours
- **Total:** ~5 hours

## Next Steps

1. Modify the deletion detection logic
2. Add automatic cleanup function
3. Update error handling to not fail on deletions
4. Test with various deletion scenarios
5. Verify graph integrity after cleanup

---

**Status:** Ready for implementation
**Approach:** Fully automatic (no CLI complexity)
**Output:** Enhanced script with complete automatic file lifecycle management
