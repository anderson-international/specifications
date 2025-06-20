---
complianceLevel: critical
status: active
tags: [ai, navigation, templates, documentation]
id: 1004
---

# AI Quick Reference Block Template

This document defines the standardized format for AI_QUICK_REF blocks used throughout the documentation.

## Consolidated Template

```
<!-- AI_QUICK_REF
Overview: [One-line strategic summary of document purpose and key components]
Key Rules: [Rule/pattern] (line X), [Rule/pattern] (line Y), [Rule/pattern] (line Z)
Avoid: [Anti-pattern], [Anti-pattern], [Anti-pattern], [Anti-pattern]
-->
```

## Field Descriptions

1. **Overview**: A single line that captures the document's strategic purpose and main components. Replaces the lengthy AI_SUMMARY while providing essential context.

2. **Key Rules**: The most critical rules, patterns, or requirements with specific line numbers. Maximum 3-4 items focusing on the most essential compliance points.

3. **Avoid**: The most critical anti-patterns or mistakes to avoid. Maximum 4 items focusing on the most common or dangerous pitfalls.

## Design Philosophy

The consolidated AI_QUICK_REF format achieves **maximum efficiency** by:

- **Strategic Context**: Overview line provides document purpose without lengthy summaries
- **Navigation Speed**: Line references enable instant location of critical rules
- **Compliance Focus**: Essential rules and anti-patterns for automated checking
- **Reduced Duplication**: Eliminates AI_SUMMARY redundancy while maintaining functionality
- **Maintenance**: Single block to update instead of two separate blocks

## Usage Guidelines

1. Every major technical document should include a consolidated AI_QUICK_REF block near the top.
2. Place after the frontmatter and document title, before main content.
3. Overview line should be concise but capture the document's strategic purpose.
4. Always include line number references for key points.
5. Update when making significant changes to the document.
6. Keep content focused - only the most critical rules and anti-patterns.
7. Limit Key Rules to 3-4 items maximum.
8. Limit Avoid items to 4 items maximum.

## Migration Strategy

When updating existing documents:
1. Extract key strategic context from AI_SUMMARY into Overview line
2. Keep existing Key Rules and Avoid content from AI_QUICK_REF
3. Remove AI_SUMMARY block entirely
4. Verify line numbers are still accurate
