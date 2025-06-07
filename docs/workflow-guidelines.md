# Solo Development Workflow Guidelines

This document outlines a lightweight workflow for the specifications project - a snuff specification builder and CRUD admin application.

## Development Principles

1. **Simplicity First**: Choose the simplest solution that works
2. **Pragmatic Coding**: Focus on working code over perfect code
3. **Minimize Overhead**: Avoid unnecessary processes or documentation

## Version Control

### Basic Git Workflow

```bash
# Start work on a new feature
git add .
git commit -m "Descriptive message about what changed and why"
git push

# For experimental features that might break things
git checkout -b experimental/feature-name
# Work on the feature...
git add .
git commit -m "Describe experimental feature"

# When ready to integrate
git checkout main
git merge experimental/feature-name
git push
```

### Commit Messages

Keep commit messages clear but concise:

- "Add specification export feature"
- "Fix pagination bug when filter is applied"
- "Improve search performance by indexing titles"

## Project Organization

### File Structure

- Keep files small and focused on a single responsibility
- Group related functionality in the same directory
- Don't create deeply nested directory structures

Example structure:
```
/components      # UI components
/pages           # Page components/routes
/api             # API routes and handlers
/lib             # Shared utilities and helpers
/styles          # CSS/styling
```

## Development Workflow

1. **Plan**: Brief notes on what to build (can be comments or TODO in code)
2. **Build**: Implement the minimum viable solution first
3. **Test**: Manual testing for intended behavior
4. **Refine**: Improve or refactor if needed
5. **Commit**: Save changes with descriptive message

## Versioning

Use semantic versioning for releases:
- `0.1.0` → Initial implementation
- `0.1.1` → Bug fixes
- `0.2.0` → New features (non-breaking)
- `1.0.0` → First stable release
- `2.0.0` → Breaking changes

## Tools and Automation

Keep tooling minimal but effective:

- Use ESLint for code quality
- Use Prettier for formatting
- Consider GitHub Actions for basic CI/CD if helpful
- Avoid complex build processes when possible

## Testing Approach

For a solo project, focus on practical testing:

- Manual testing for critical user flows
- Simple unit tests for complex utility functions
- Console logging for debugging
- Test in the browser you actually use

## Backup Strategy

- Push to GitHub/remote repository regularly
- Consider occasional local backups of important data

Remember: These are guidelines, not strict rules. Adjust your workflow as needed to maintain productivity and enjoyment of the project.
