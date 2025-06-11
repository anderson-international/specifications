# Project Guides

This folder contains comprehensive guides and standards that govern the development, architecture, and maintenance of the specifications project. These documents establish the foundational principles and practices for consistent, high-quality software development.

## Document Overview

### Core Development Standards

| Document | Purpose | Key Content |
|----------|---------|-------------|
| **[project-standards.md](./project-standards.md)** | Consolidated project standards | Core principles, code quality, documentation, workflow, testing, architectural guidelines |
| **[code-quality-standards.md](./code-quality-standards.md)** | Code formatting and structure standards | ESLint/Prettier configurations, naming conventions, component structure, state management |
| **[best-practices.md](./best-practices.md)** | Solo development best practices | Simplicity principles, file size guidelines, API strategy, CSS/styling approaches |

### Architecture & Implementation

| Document | Purpose | Key Content |
|----------|---------|-------------|
| **[architectural-guidelines.md](./architectural-guidelines.md)** | System architecture and design patterns | Component hierarchy, API design, data modeling, error handling, performance optimization |
| **[workflow-guidelines.md](./workflow-guidelines.md)** | Development workflow and processes | Git usage, commit messages, project organization, versioning, backup strategy |

### Documentation & Testing

| Document | Purpose | Key Content |
|----------|---------|-------------|
| **[documentation-standards.md](./documentation-standards.md)** | Documentation philosophy and structure | Minimalist approach, code comments, README structure, API documentation |
| **[testing-standards.md](./testing-standards.md)** | Testing approach and methodologies | Manual vs automated testing, naming conventions, tooling, bug reporting |

## How to Use These Guides

### For New Developers
1. Start with **project-standards.md** for overall project philosophy
2. Review **code-quality-standards.md** for coding conventions
3. Study **architectural-guidelines.md** for system design principles
4. Follow **workflow-guidelines.md** for development processes

### For Code Reviews
- **code-quality-standards.md** - Formatting and structure validation
- **best-practices.md** - Simplicity and maintainability checks
- **architectural-guidelines.md** - Design pattern compliance

### For Documentation
- **documentation-standards.md** - Writing style and structure guidelines
- **project-standards.md** - Overall documentation philosophy

### For Testing
- **testing-standards.md** - Testing strategy and implementation
- **workflow-guidelines.md** - Integration with development process

## Document Relationships

```
project-standards.md (Master Document)
├── Consolidates principles from all other guides
├── References → code-quality-standards.md (detailed code rules)
├── References → architectural-guidelines.md (design patterns)
├── References → best-practices.md (development philosophy)
│
Individual Guides
├── code-quality-standards.md ← Practical implementation rules
├── architectural-guidelines.md ← System design patterns
├── best-practices.md ← Development philosophy
├── workflow-guidelines.md ← Process and tooling
├── documentation-standards.md ← Writing guidelines
└── testing-standards.md ← Quality assurance
```

## Maintenance Notes

### Document Hierarchy
- **project-standards.md** serves as the master consolidation document
- Individual guides provide detailed, focused guidance on specific domains
- All guides should remain aligned with the core principles in project-standards.md

### Update Guidelines
- Changes to core principles should be reflected across all relevant guides
- Each guide should maintain its specific focus while supporting overall project coherence
- Regular review ensures consistency between consolidated and detailed standards

## Related Documentation

### Project Documentation (../project/)
- Current project-specific requirements and implementation plans
- Business context and feature specifications

### Technical Concerns (../concerns/)
- Detailed solutions to specific technical challenges
- Performance, security, and scalability considerations

### Design Discussions (../discussions/)
- Evolution of architectural decisions
- Historical context for current standards
