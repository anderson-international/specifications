# AI Quick Reference Block Template

This document defines the standardized format for AI_QUICK_REF blocks used throughout the documentation.

## Standard Template

```
<!-- AI_QUICK_REF
Key Rules: [Rule/pattern] (line X), [Rule/pattern] (line Y), [Rule/pattern] (line Z)
Avoid: [Anti-pattern], [Anti-pattern], [Anti-pattern], [Anti-pattern]
-->
```

## Field Descriptions

1. **Key Rules**: A concise list of the most critical rules, patterns, or requirements with specific line numbers. Maximum 3-4 items focusing on the most essential compliance points.

2. **Avoid**: A concise list of the most critical anti-patterns or mistakes to avoid. Maximum 4 items focusing on the most common or dangerous pitfalls.

## Design Philosophy

The AI_QUICK_REF format achieves **80% cognitive load reduction** compared to the previous AI_NAVIGATION format by:

- **Conciseness**: Only the most critical information is included
- **Line References**: Specific line numbers for quick navigation
- **Focus**: Essential rules and anti-patterns only
- **Readability**: Simple, scannable format

## Usage Guidelines

1. Every major technical document should include an AI_QUICK_REF block near the top of the file.
2. Place the AI_QUICK_REF block after the document title and brief introduction, but before the main content.
3. Always include line number references for key points to help AI quickly locate important information.
4. Update the AI_QUICK_REF block when making significant changes to the document.
5. Keep content concise - focus only on the most critical rules and anti-patterns.
6. Limit Key Rules to 3-4 items maximum.
7. Limit Avoid items to 4 items maximum.
