# Documentation Standards

This document outlines the minimalist documentation standards for the specifications project - a snuff specification builder and CRUD admin application. As a solo hobbyist coder, these standards focus on simplicity and practicality.

## Table of Contents

1. [Code Comments Philosophy](#code-comments-philosophy)
2. [Minimal README Structure](#minimal-readme-structure)
3. [API Documentation](#api-documentation)
4. [Change Tracking](#change-tracking)

## Code Comments Philosophy

I value self-documenting code with minimal comments. Comments should explain "why" not "what."

### When to Comment

- **Non-obvious Logic**: Only add comments when the code doesn't clearly express intent
- **Workarounds**: Document any workarounds for bugs or odd behavior
- **Public API**: Add minimal documentation for public API endpoints/functions
- **TODOs**: Mark areas that need future improvement

### Example Comment Style

```javascript
// HACK: Using custom sorting due to unexpected behavior in standard sort
const sortedItems = customSort(items);

// TODO: Replace this with proper error handling
try {
  // code...
} catch (e) {
  console.error(e);
}

/**
 * Fetches a specification by ID
 * @param {string} id 
 * @returns {Promise<Object>}
 */
async function fetchSpecification(id, options = {}) {
  // Implementation
}
```

Keep TypeScript types clear and self-documenting to reduce need for explicit JSDoc.

## Minimal README Structure

As a solo developer, maintain a simple README that provides essential information without overhead.

### Project README Structure

```markdown
# Specifications Builder

A snuff specification builder and CRUD admin application.

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Features

Brief bullet points of key functionality.

## Notes

Any important information for future reference.
```

### README Tips

- Keep README short and focused
- Include only what you'll need to remember later
- Use code examples for common operations
- Document any non-obvious configuration needs

## API Documentation

For a solo project, lightweight API documentation is sufficient.

### Simple API Documentation

Create a simple `api.md` file that lists endpoints with brief descriptions:

```markdown
# API Reference

## Specifications

### GET /api/specifications
- Returns list of specifications
- Query params: `limit`, `offset`, `search`

### GET /api/specifications/:id
- Returns single specification

### POST /api/specifications
- Creates new specification
- Required fields: `name`, `description`

### PUT /api/specifications/:id
- Updates specification

### DELETE /api/specifications/:id
- Removes specification
```

## Change Tracking

Simple change tracking for solo development.

### Basic Changelog

Keep a simple `CHANGELOG.md` for tracking major changes:

```markdown
# Changelog

## v0.3.0 (2025-06-01)
- Added export functionality
- Fixed pagination bug
- Improved search performance

## v0.2.0 (2025-05-15)
- Initial CRUD operations
- Basic UI implementation

## v0.1.0 (2025-05-01)
- Project setup
- Initial commit
```

### Version Bumping

As a solo developer, use a simple versioning approach:

- Increment the patch version (0.1.x) for small fixes
- Increment the minor version (0.x.0) when adding features
- Increment the major version (x.0.0) for breaking changes
