---
complianceLevel: critical
status: active  
tags: [ai, workflows, documentation, ingestion]
id: Kp3mX9Qz
---

# Workflow Doc Ingestion System - How To

## Quick Reference

**Create workflow → Add to graph → Execute with @[/workflow-name]**

## 1. Create Workflow File

**Location:** `.windsurf/workflows/[name].md`

**Template:**
```markdown
---
description: Brief description of what docs this loads
---

// turbo
cmd /c node docs/scripts/docs-ingestion-engine.js [workflow-name]
```

**Key points:**
- `// turbo` enables auto-execution
- Command must match workflow filename

## 2. Add to Document Graph

**File:** `docs/scripts/docs-graph.json`

**Find document IDs in nodes array:**
```json
"nodes": [
  {
    "id": "AYkT71Xe",
    "path": "docs/guides/database-patterns-core.md",
    ...
  }
]
```

**Add workflow integration:**
```json
"workflowIntegration": [
  {
    "workflow": "docs-[name]",
    "documents": [
      "DocumentId1",
      "DocumentId2"
    ],
    "description": "Brief description"
  }
]
```

## 3. Execute Workflow

**Usage:** `@[/docs-[name]]`

## Example: docs-db Workflow

**File:** `.windsurf/workflows/docs-db.md`
```markdown
---  
description: Load database-specific documentation for schema and ORM development
---

// turbo
cmd /c node docs/scripts/docs-ingestion-engine.js docs-db
```

**Graph entry:**
```json
{
  "workflow": "docs-db",
  "documents": [
    "AYkT71Xe",  // database-patterns-core.md
    "vmydbw09",  // database-patterns-forms.md  
    "SfA_v5_k"   // db-schema.md
  ],
  "description": "Database development with schema, ORM patterns, and form integration"
}
```

**Usage:** `@[/docs-db]`

## File Locations Summary

- **Workflows:** `.windsurf/workflows/[name].md`
- **Graph:** `docs/scripts/docs-graph.json`  
- **Engine:** `docs/scripts/docs-ingestion-engine.js`
- **Usage:** `@[/workflow-name]`
