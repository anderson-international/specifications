---
description: Mandatory code quality for all file operations
---

# Code Quality Validation

## FIRST: Understand your core validation tools
// turbo

```bash
cmd /c node docs/scripts/code-review-analyzer.js --help
cmd /c node docs/scripts/code-fix.js --help
```

## File Scope
**Review Only**: Production files in `app/`, `components/`, `lib/`, `types/`, `hooks/`, `types/` 
**Exclude**: `*.md`, `*.js`, `*.prisma`, `docs/`, `test/`, `.windsurf/`, `.gitignore` files

## Enforcement
- **Zero tolerance** for skipping validation
- **BLOCKING**: Script failures must be fixed before proceeding
- **No workarounds** - address violations, don't ignore them
- **Stop all work** until analyzer reports clean results

## Why No Exceptions?
- Ensures consistent code quality standards
- Prevents accumulation of technical debt
- Catches issues early before they compound
- Maintains project quality baseline