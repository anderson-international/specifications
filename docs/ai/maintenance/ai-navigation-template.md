# AI Navigation Block Template

This document defines the standardized format for AI_NAVIGATION blocks used throughout the documentation.

## Standard Template

```
<!-- AI_NAVIGATION
Reading Priority: [1-5] (1 = highest priority, must read first)
Primary Focus: [Brief description of the main topics covered]
Key Compliance Points:
- [Rule/Pattern] (line X-Y)
- [Rule/Pattern] (line X-Y)
- [Rule/Pattern] (line X-Y)
Critical Cross-references:
- [Document name] (relative/path/to/document.md): [Brief context]
- [Document name] (relative/path/to/document.md): [Brief context]
Anti-patterns:
- [Brief description of what to avoid]
- [Brief description of what to avoid]
Additional Context: [Optional additional information relevant for AI]
-->
```

## Field Descriptions

1. **Reading Priority**: A numeric value from 1-5 indicating the document's importance:
   - 1: Essential, must read first (core architectural documents, critical guidelines)
   - 2: Very important, read early (key implementation patterns)
   - 3: Important reference (implementation details, specific guidance)
   - 4: Supporting information (additional context, examples)
   - 5: Optional/specialized (niche topics, advanced details)

2. **Primary Focus**: A concise (1-3 sentences) description of what the document primarily covers.

3. **Key Compliance Points**: A bulleted list of critical rules, patterns, or requirements referenced in the document, with specific line numbers.

4. **Critical Cross-references**: A bulleted list of the most important related documents with brief context about why they're related.

5. **Anti-patterns**: Common mistakes or approaches to avoid related to the document's topic.

6. **Additional Context**: Optional field for any additional information that would help AI understand or apply the document's content.

## Usage Guidelines

1. Every major technical document should include an AI_NAVIGATION block near the top of the file.
2. Place the AI_NAVIGATION block after the document title and brief introduction, but before the main content.
3. Always include line number references for key points to help AI quickly locate important information.
4. Update the AI_NAVIGATION block when making significant changes to the document.
5. Ensure cross-references use relative paths and remain accurate after file moves/renames.
