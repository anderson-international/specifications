---
id: K9mX2wR7
title: Database Schema Document ID Persistence
created: 2025-06-21
status: ready-to-implement
tags: [documentation, database, schema, nanoid, document-graph, automation]
---

# Plan: Database Schema Document ID Persistence

## Problem Statement

The auto-generated `docs/project/db-schema.md` file needs a stable nanoid(8) ID to participate in the document ingestion workflow, but currently:

- File is regenerated frequently during DB development via `docs/scripts/docs-db-schema.js`
- Has no ID in frontmatter (unlike other docs)
- Cannot be added to `docs/scripts/docs-graph.json` workflows
- Generating new ID each time would break document graph references

## Solution: ID Persistence Pattern

Implement a solution that:
1. **Preserves existing ID** when file exists and has valid ID
2. **Generates new stable ID** when file doesn't exist (first run)
3. **Self-heals** when file exists but has no/invalid ID
4. **Integrates cleanly** with existing code structure

## Technical Implementation

### Files to Modify

**1. `docs/scripts/docs-db-schema.js`**
- Add ID persistence helper function
- Modify main function to get/preserve ID
- Update `generateDocumentation()` signature to accept ID
- Add ID to frontmatter generation

### Code Changes Required

**Step 1: Add Helper Function**
```javascript
// Add before existing functions
function getOrCreateDocumentId(outputPath) {
  if (fs.existsSync(outputPath)) {
    try {
      const content = fs.readFileSync(outputPath, 'utf8');
      const idMatch = content.match(/^id:\s*(.+)$/m);
      if (idMatch) {
        console.log(`🔄 Preserving existing document ID: ${idMatch[1].trim()}`);
        return idMatch[1].trim();
      }
    } catch (error) { /* ignore parsing errors */ }
  }
  const { nanoid } = require('nanoid');
  const newId = nanoid(8);
  console.log(`🆕 Generated new document ID: ${newId}`);
  return newId;
}
```

**Step 2: Modify generateSchemaDocumentation()**
```javascript
// In generateSchemaDocumentation(), before calling generateDocumentation:
const outputPath = path.join(__dirname, '..', 'docs', 'project', 'db-schema.md');
const documentId = getOrCreateDocumentId(outputPath);
const documentation = generateDocumentation(tables, columns, constraints, indexes, enumValues, documentId);
```

**Step 3: Update generateDocumentation() Signature**
```javascript
// Change function signature to accept documentId
function generateDocumentation(tables, columns, constraints, indexes, enumValues, documentId) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Add id to frontmatter
  let doc = `---
title: AI-Optimized Database Schema Documentation
date: ${timestamp}
id: ${documentId}
description: Provide structured database information for AI models to plan interactions and generate CRUD forms
---`;
  // ... rest of function unchanged
```

## Validation Steps

### After Implementation

1. **Test First Run (No File Exists)**
   ```bash
   # Delete existing file
   cmd /c del docs\project\db-schema.md
   # Run script - should generate new ID
   npm run sync-schema
   # Verify ID exists in frontmatter
   ```

2. **Test ID Preservation (File Exists)**
   ```bash
   # Run script again - should preserve same ID
   npm run sync-schema
   # Verify same ID retained
   ```

3. **Test Self-Healing (File Without ID)**
   ```bash
   # Manually remove id from frontmatter
   # Run script - should add new ID
   npm run sync-schema
   ```

### Integration with Document Graph

4. **Add to docs-graph.json**
   - Manually add node with the stable ID
   - Test workflow integration via `docs-ingestion-engine.js`

## Benefits

- ✅ **Stable ID across regenerations** - Document graph references never break
- ✅ **Follows existing patterns** - Uses nanoid(8) like other docs
- ✅ **Minimal code changes** - Clean integration with existing structure
- ✅ **Self-healing** - Handles edge cases gracefully
- ✅ **Document workflow ready** - Can be added to AI ingestion workflows

## Next Steps

1. Implement the three code changes in `docs/scripts/docs-db-schema.js`
2. Add schema document to appropriate workflows in `docs/scripts/docs-graph.json`
3. Verify AI ingestion works correctly

## Dependencies

- `nanoid` package (already installed: "^5.1.5")
- No new dependencies required

---

**Status:** Ready to implement  
**Estimated effort:** 15 minutes  
**Risk level:** Low (minimal changes, existing patterns)
