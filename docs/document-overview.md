# Documentation Overview

This document provides a guide to all documentation files in the specifications project, explaining their purpose and how they relate to each other. Use this as a starting point to navigate the project's documentation.

## Core Documentation Files

| Document | Purpose | When to Use |
|----------|---------|------------|
| [Project Blueprint](./project-blueprint.md) | High-level project vision, business context, and overall implementation roadmap | When you need to understand the project's purpose, target users, and execution timeline |
| [Architectural Guidelines](./architectural-guidelines.md) | Technical architecture decisions, patterns, and detailed implementation guidance | When implementing key components and need detailed technical guidance |
| [Project Standards](./project-standards.md) | Comprehensive overview of all project standards | When you need a broad understanding of the project's approach |
| [Best Practices](./best-practices.md) | Focused guidance on specific technical practices | When implementing specific features and need focused guidance |
| [Code Quality Standards](./code-quality-standards.md) | Code style, linting, and structural conventions | When writing or reviewing code to ensure consistency |
| [Documentation Standards](./documentation-standards.md) | How to maintain and update documentation | When adding new documentation or updating existing docs |
| [Testing Standards](./testing-standards.md) | Testing strategies and implementation | When implementing tests or quality assurance |
| [Workflow Guidelines](./workflow-guidelines.md) | Development workflow and processes | When you need to understand the development process |

## Documentation Relationships

- **Project Blueprint** is the top-level document, setting the overall direction
- **Project Standards** provides a comprehensive overview that references specialized documents
- **Architectural Guidelines** contains detailed patterns referenced by other specialized documents
- **Best Practices, Code Quality, Documentation, and Testing Standards** provide detailed guidance in specific areas

## Key Cross-References

- For **authentication**, see [Best Practices: Authentication](./best-practices.md#authentication-strategy)
- For **form handling**, see [Architectural Guidelines: Form Management](./architectural-guidelines.md#form-management)
- For **testing**, see [Testing Standards](./testing-standards.md)
- For **implementation timeline**, see [Project Blueprint: Implementation Roadmap](./project-blueprint.md#implementation-roadmap)

## How to Update Documentation

When updating documentation:

1. First, check this overview to find the appropriate document for your changes
2. Update the primary document for that topic
3. Add cross-references in other documents rather than duplicating content
4. Update this overview if you add new documents or change the relationship between documents

This approach ensures documentation remains consistent while minimizing duplication.
