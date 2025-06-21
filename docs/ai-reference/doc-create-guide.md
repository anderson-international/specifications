---
complianceLevel: critical
status: active
tags: [ai, navigation, templates, documentation, uuid]
id: rnjchi17
---

# AI Document Creation Guide

This guide provides comprehensive instructions for AI assistants creating new documentation files with proper structure, IDs, and navigation elements.

## Document Creation Workflow

### 1. Generate Collision-Proof Document ID

**Always generate a UUID using nanoid(8) for new documents:**

```javascript
const { nanoid } = require('nanoid');
const documentId = nanoid(8); // Generates: "K2mE9xR8"
```

**Key principles:**
- Use exactly 8 characters for optimal balance of uniqueness and readability
- Each ID is mathematically guaranteed to be collision-proof
- No need to check existing IDs - generate directly
- Never use sequential numeric IDs (1001, 1002...) - these are deprecated
- Never reuse existing IDs - always generate fresh UUIDs

### 2. Document Structure Template

```markdown
---
complianceLevel: [critical|high|medium|low]
status: [active|draft|deprecated]
tags: [category, subcategory, feature-specific-tags]
id: [8-character-nanoid-uuid]
---

# Document Title

<!-- AI_QUICK_REF
Overview: [One-line strategic summary of document purpose and key components]
Key Rules: [Rule/pattern] (line X), [Rule/pattern] (line Y), [Rule/pattern] (line Z)
Avoid: [Anti-pattern], [Anti-pattern], [Anti-pattern], [Anti-pattern]
-->

## Content Structure

[Document content follows here...]
```

### 3. Frontmatter Requirements

**Required Fields:**
- `id: [nanoid(8)]` - 8-character UUID (e.g., "K2mE9xR8")
- `complianceLevel: [level]` - Document importance level
- `status: [state]` - Current document state
- `tags: [array]` - Classification tags for AI context loading

**Compliance Levels:**
- `critical` - Core system rules, security, data integrity
- `high` - Important patterns, major features, architecture decisions
- `medium` - Standard guides, common patterns, workflow documentation  
- `low` - Examples, tutorials, supplementary information

**Status Values:**
- `active` - Current, authoritative documentation
- `draft` - In development, not yet finalized
- `deprecated` - Outdated, maintained for reference only

### 4. AI_QUICK_REF Block Template

```
<!-- AI_QUICK_REF
Overview: [Strategic summary capturing document purpose and key components]
Key Rules: [Critical rule] (line X), [Essential pattern] (line Y), [Must-follow requirement] (line Z)
Avoid: [Anti-pattern], [Common mistake], [Dangerous practice], [Performance issue]
-->
```

**Guidelines:**
- Place immediately after title, before main content
- Overview: Single line capturing strategic purpose
- Key Rules: Maximum 3-4 items with line references
- Avoid: Maximum 4 items focusing on critical anti-patterns
- Update line numbers when document changes

### 5. Document Linking

**Reference other documents using UUIDs:**
```markdown
For validation patterns, see [Code Validation Guide](@K2mE9xR8)
```

**Link format:** `[Link Text](@UUID)`
- Use meaningful link text describing the target content
- UUID references are automatically resolved by the link system
- No need to maintain relative paths - the system handles resolution

### 6. File Naming Conventions

**Structure:** `category/specific-purpose.md`

**Examples:**
- `docs/guides/react-patterns.md`
- `docs/concerns/authentication.md`
- `docs/pitfalls/prevent-react-loops.md`
- `docs/project/technical-stack.md`

**Rules:**
- Use lowercase with hyphens for readability
- Choose descriptive, specific names
- Group by logical categories (guides, concerns, pitfalls, project)
- Avoid generic names like "documentation.md" or "info.md"

### 7. Tag Classification System

**Primary Categories:**
- `ai` - AI system configuration and templates
- `guides` - How-to documentation and patterns
- `concerns` - Architectural decisions and domain-specific knowledge
- `pitfalls` - Common mistakes and anti-patterns
- `project` - Project-specific requirements and context

**Secondary Tags:**
- Technology-specific: `react`, `typescript`, `database`, `authentication`
- Feature-specific: `forms`, `validation`, `api`, `ui-ux`
- Process-specific: `testing`, `deployment`, `maintenance`

### 8. Content Quality Standards

**Structure Requirements:**
- Clear hierarchical headings (H1 → H2 → H3)
- Logical flow from general to specific
- Code examples with proper syntax highlighting
- Concrete examples over abstract descriptions

**Cognitive Load Optimization:**
- Target CLS ≤ 58 for optimal readability
- Break down complex sentences (≤25 words)
- Use simple vocabulary where possible
- Add clear transitions between sections
- Organize content with bullet points and tables

**Validation Patterns:**
- Include "what to do" and "what not to do" sections
- Provide before/after code examples
- Reference related documents for comprehensive coverage
- Update AI_QUICK_REF when making significant changes

## Implementation Checklist

When creating a new document:

- [ ] Generate UUID with `nanoid(8)`
- [ ] Add complete frontmatter with all required fields
- [ ] Include AI_QUICK_REF block with strategic overview
- [ ] Use clear, descriptive file naming
- [ ] Structure content hierarchically
- [ ] Add appropriate tags for AI context loading
- [ ] Link to related documents using UUID references
- [ ] Validate cognitive load score ≤ 58
- [ ] Test that all links resolve correctly

This systematic approach ensures all documentation integrates seamlessly with the AI ingestion and navigation systems while maintaining collision-proof identification and optimal readability.
