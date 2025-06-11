# Specifications Project Standards

This document consolidates all project standards for the specifications project - a snuff specification builder and CRUD admin application built with Next.js.

## Introduction

This project standards document is designed for solo hobbyist development, emphasizing simplicity, brevity, and maintainability. These standards aim to provide sufficient guidance while avoiding unnecessary complexity or overhead.

### About This Project

The specifications project is a Next.js-based application for building and managing snuff specifications with CRUD functionality.

### Document Purpose

This document serves as a single reference point for all coding, documentation, architectural, and procedural standards. It's intended to maintain consistency and quality while keeping development enjoyable and efficient.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Code Quality Standards](#code-quality-standards)
3. [Documentation Standards](#documentation-standards)
4. [Workflow Guidelines](#workflow-guidelines)
5. [Testing Standards](#testing-standards)
6. [Architectural Guidelines](#architectural-guidelines)
7. [Revision History](#revision-history)

## Core Principles

### Simplicity and Brevity

As a solo hobbyist coder, I prioritize simplicity and brevity above all else in my code. This means:

- **Small Code Files**: Keep files small and focused on a single responsibility
- **Minimal Comments**: Rely on self-documenting code rather than extensive comments
- **Simple Solutions**: Choose the most straightforward implementation over complex patterns
- **Pragmatic Approach**: Avoid over-engineering and only build what's actually needed
- **Function Size**: Keep functions small and focused on a single task
- **Naming**: Use clear, descriptive names that make comments unnecessary

These principles guide all coding decisions in this project to maintain enjoyable and sustainable development as a solo developer.

### File Size and Separation of Concerns

To maintain clarity and simplicity in the Next.js project structure:

- **Component Files**: Each component should have its own file and not exceed 150 lines of code
- **Utility Functions**: Place in dedicated files or group by related functionality; keep under 50 lines per file
- **Page Files**: Limit to 250 lines maximum; refactor larger pages by extracting logic and subcomponents
- **File Organization**: Maintain a flat and intuitive folder structure to avoid deep nesting
- **Refactoring Threshold**: If any file exceeds these guidelines, refactor for clarity and maintainability

### API Strategy

- **Default to Next.js API Routes** for custom backend needs
- **Use direct GraphQL queries** to the Shopify Storefront API with a minimal client
- **Keep API integration code** simple, concise, and modular
- **Avoid unnecessary abstractions** or extra infrastructure

### CSS/Styling Strategy

- **Default to CSS Modules** for all component styling
- **Keep style files small** and scoped to individual components
- **Use clear, descriptive class names** that reflect the component's structure
- **Only use inline styles or CSS-in-JS** for rare, highly dynamic styling needs
- **Avoid global styles** and large, shared CSS files

### Authentication Strategy

> For detailed authentication implementation, see [Best Practices: Authentication](./best-practices.md#authentication-strategy)

- **Solution:** Auth.js (NextAuth) with email provider
- **Database Adapter:** NeonDB adapter for persistence
- **Error Handling:** Surface authentication errors immediately; avoid fallback or silent failure

## Code Quality Standards

### ESLint Configuration

ESLint enforces code quality and consistency across the codebase:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "next/core-web-vitals",
    "prettier"
  ],
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    // Error prevention
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "no-var": "error",
    "prefer-const": "error",
    
    // TypeScript specific
    "@typescript-eslint/explicit-function-return-type": ["error", { "allowExpressions": true }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/ban-ts-comment": "warn",
    
    // React specific
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "never" }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // Import organization
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }
    ],
    "import/no-duplicates": "error"
  }
}
```

### Prettier Formatting

Prettier ensures consistent code formatting:

```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "jsxSingleQuote": false,
  "jsxBracketSameLine": false,
  "endOfLine": "lf"
}
```

### Naming Conventions

#### Files and Directories

- **React Components**: PascalCase, `.tsx` or `.jsx` extensions (e.g., `UserProfile.tsx`)
- **Utility Files**: camelCase, `.ts` or `.js` extensions (e.g., `formatDate.ts`)
- **Styles**: Match component name with appropriate extension (e.g., `[ComponentName].module.css`)
- **API Routes**: camelCase for file names (e.g., `getUserData.ts`)
- **Test Files**: Same name as the file being tested with `.test` or `.spec` suffix (e.g., `UserProfile.test.tsx`)
- **Config Files**: kebab-case (e.g., `next-config.js`)

#### Variables and Functions

- **Variables**: camelCase (e.g., `userData`, `isLoading`)
- **Boolean Variables**: Prefix with "is", "has", "should", etc. (e.g., `isActive`, `hasPermission`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_RETRY_COUNT`)
- **Functions**: camelCase, use descriptive verbs (e.g., `fetchUserData`, `validateForm`)
- **Private Functions/Variables**: Prefix with underscore (e.g., `_privateHelper`)
- **React Hooks**: Prefix with "use" (e.g., `useFormState`, `useAuth`)

#### Components and Interfaces

- **React Components**: PascalCase (e.g., `UserProfile`, `NavigationBar`)
- **TypeScript Interfaces**: PascalCase without prefix (e.g., `User`, `FormProps`) to match modern TypeScript best practices
- **Type Aliases**: PascalCase, descriptive of the type (e.g., `ButtonSize`, `ThemeColors`)

### Code Structure and Organization

#### Project Structure

Follow this general structure for the Next.js project:

```
/app                   # Next.js App Router pages and layouts
  /api                 # API routes
  /[routes]            # Application routes with page.tsx files
/components            # React components
  /common              # Shared components
  /layout              # Layout components
  /[feature]           # Feature-specific components
/hooks                 # Custom React hooks
/lib                   # Core utilities and services
  /api                 # API utilities
  /utils               # Helper functions
  /validations         # Zod schemas and validation
/public                # Static assets
/styles                # Global styles
```

#### Component Organization

Use this pattern for organizing React component files:

```javascript
// Imports - organized by groups with a blank line between
import React, { useState, useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/common/Button';

// Types
interface Props {
  title: string;
  isActive?: boolean;
  onSubmit: (data: FormData) => void;
}

// Component definition
export const ExampleComponent: React.FC<Props> = ({ title, isActive = false, onSubmit }) => {
  // Hook calls first
  const [data, setData] = useState(null);
  
  // Effect hooks next
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleSubmit = (): void => {
    // Handler logic
  };
  
  // Helper functions
  const formatTitle = (title: string): string => {
    return title.toUpperCase();
  };
  
  // Main render
  return (
    <div className="example-component">
      <h1>{formatTitle(title)}</h1>
      {/* Component content */}
    </div>
  );
};
```

### State Management

- Use React's built-in `useState` and `useReducer` hooks for component-level state
- Use Context API sparingly for truly global state (auth, theme, etc.)
- Extract complex state logic into custom hooks for reusability
- For data fetching, use simple fetch/axios calls, only introducing SWR if needed
- Avoid external state management libraries unless absolutely necessary

## Documentation Standards

### Code Comments Philosophy

I value self-documenting code with minimal comments. Comments should explain "why" not "what."

#### When to Comment

- **Non-obvious Logic**: Only add comments when the code doesn't clearly express intent
- **Workarounds**: Document any workarounds for bugs or odd behavior
- **Public API**: Add minimal documentation for public API endpoints/functions
- **TODOs**: Mark areas that need future improvement

#### Example Comment Style

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

### Minimal README Structure

As a solo developer, maintain a simple README that provides essential information without overhead.

#### Project README Structure

```markdown
# Specifications Builder

A snuff specification builder and CRUD admin application.

## Setup

```cmd
:: Install dependencies
npm install

:: Start development server
npm run dev

:: Build for production
npm run build

:: Run production build
npm start
```

## Features

Brief bullet points of key functionality.

## Notes

Any important information for future reference.
```

#### README Tips

- Keep README short and focused
- Include only what you'll need to remember later
- Use code examples for common operations
- Document any non-obvious configuration needs

### API Documentation

For a solo project, lightweight API documentation is sufficient.

#### Simple API Documentation

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

### Change Tracking

Simple change tracking for solo development.

#### Basic Changelog

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

#### Version Bumping

As a solo developer, use a simple versioning approach:

- Increment the patch version (0.1.x) for small fixes
- Increment the minor version (0.x.0) when adding features
- Increment the major version (x.0.0) for breaking changes

## Workflow Guidelines

### Development Principles

1. **Simplicity First**: Choose the simplest solution that works
2. **Pragmatic Coding**: Focus on working code over perfect code
3. **Minimize Overhead**: Avoid unnecessary processes or documentation

### Version Control

#### Basic Git Workflow

```cmd
:: Start work on a new feature
git add .
git commit -m "Descriptive message about what changed and why"
git push

:: For experimental features that might break things
git checkout -b experimental/feature-name
:: Work on the feature...
git add .
git commit -m "Describe experimental feature"

:: When ready to integrate
git checkout main
git merge experimental/feature-name
git push
```

#### Commit Messages

Keep commit messages clear but concise:

- "Add specification export feature"
- "Fix pagination bug when filter is applied"
- "Improve search performance by indexing titles"

### Project Organization

#### File Structure

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

### Development Workflow

1. **Plan**: Brief notes on what to build (can be comments or TODO in code)
2. **Build**: Implement the minimum viable solution first
3. **Test**: Manual testing for intended behavior
4. **Refine**: Improve or refactor if needed
5. **Commit**: Save changes with descriptive message

### Versioning

Use semantic versioning for releases:
- `0.1.0` → Initial implementation
- `0.1.1` → Bug fixes
- `0.2.0` → New features (non-breaking)
- `1.0.0` → First stable release
- `2.0.0` → Breaking changes

### Tools and Automation

Keep tooling minimal but effective:

- Use ESLint for code quality
- Use Prettier for formatting
- Consider GitHub Actions for basic CI/CD if helpful
- Avoid complex build processes when possible

### Backup Strategy

- Push to GitHub/remote repository regularly
- Consider occasional local backups of important data

### File Operations Best Practices

#### Always Create Destination Folders Before Writing Files

When working with files:

1. Always check if destination directories exist before writing files
2. Create necessary directories with appropriate commands
3. Handle errors properly if file operations fail

This prevents errors when trying to write files to non-existent directories.

## Testing Standards

> For comprehensive testing guidance, see [Testing Standards](./testing-standards.md)

### Core Testing Philosophy

As a solo hobbyist developer, I follow these testing principles:

1. **Test What Matters**: Focus testing efforts on critical functionality
2. **Practical Coverage**: Aim for quality over quantity in test coverage
3. **Simple Setup**: Keep testing infrastructure lightweight
4. **Manual + Automated**: Combine strategic manual testing with minimal automation

### Testing Approaches

#### Critical Path Testing (Manual)

For a solo project, start with thorough manual testing of critical user flows:

- **User Authentication**: Login, logout, password reset
- **CRUD Operations**: Create, read, update, delete specification data
- **Data Import/Export**: File uploads, data exports
- **Access Control**: Permission-based feature access

Document manual test cases in simple markdown files when they become complex enough to need documentation:

```markdown
# Authentication Tests

## Login Flow
1. Navigate to /login
2. Enter valid credentials → Should redirect to dashboard
3. Enter invalid credentials → Should display error message
4. Test "Remember me" functionality
5. Test password reset flow
```

#### Automated Testing Strategy

##### Unit Testing

For critical utility functions and business logic:

- **Test Library**: Jest (comes pre-configured with Next.js)
- **Coverage Goal**: Focus on quality over arbitrary coverage percentages
- **Key Areas**: Test complex calculations, data transformations, and business rules
- **File Location**: Co-locate tests with implementation in `/src` directory with `.test.js` or `.test.ts` suffix

Example unit test structure:
```javascript
// utils/formatters.test.js
import { formatCurrency, formatDate } from './formatters';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });
  
  it('handles zero values', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });
});
```

##### Component Testing

For key UI components:

- **Library**: React Testing Library (simple, focused on user behavior)
- **Coverage Strategy**: Test complex interactive components only
- **Test Aspects**: Rendering, basic interactions, accessibility

Example component test:
```javascript
// components/SpecificationCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import SpecificationCard from './SpecificationCard';

describe('SpecificationCard', () => {
  it('displays specification details', () => {
    render(<SpecificationCard title="Test Spec" description="Test Description" />);
    expect(screen.getByText('Test Spec')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = jest.fn();
    render(<SpecificationCard title="Test" onEdit={handleEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });
});
```

##### Integration Testing

Minimal integration tests for critical user flows:

- **Scope**: Test key workflows end-to-end
- **Count**: Create just 2-5 integration tests for the most critical paths
- **Tool**: Cypress (minimal configuration) or Playwright

Example integration test:
```javascript
// cypress/integration/create-specification.spec.js
describe('Create Specification', () => {
  it('allows a user to create a new specification', () => {
    cy.login(); // Custom command for authentication
    cy.visit('/specifications/new');
    cy.get('#title').type('New Test Specification');
    cy.get('#description').type('This is a test specification');
    cy.get('#submit').click();
    cy.url().should('include', '/specifications/');
    cy.contains('New Test Specification');
  });
});
```

### Mock Data & Fixtures

Keep mocking simple and focused:

- **Mock Data Location**: `/mocks` directory or co-located with tests
- **Structure**: Simple JSON files for mock data
- **Usage**: Default to static data for tests unless dynamic data is necessary

Example:
```javascript
// mocks/specificationData.js
export const sampleSpecifications = [
  {
    id: '1',
    title: 'Sample Specification',
    description: 'A sample specification for testing',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    status: 'active'
  },
  // Add more as needed
];
```

### Test Naming Conventions

Follow simple, descriptive naming:

- **Unit test files**: `[filename].test.js`
- **Component test files**: `[ComponentName].test.jsx`
- **Integration tests**: `[feature-name].spec.js`
- **Test descriptions**: Use clear, action-oriented descriptions

Example naming pattern:
```
describe('[Unit/Component Name]', () => {
  it('should [expected behavior] when [condition]', () => {
    // test code
  });
});
```

### Testing Tools

Minimal, effective tooling:

- **Jest**: Unit and component testing
- **React Testing Library**: Component testing
- **Cypress/Playwright**: Limited integration tests (only if needed)
- **Browser DevTools**: For manual testing and debugging

### Bug Reporting Process

For solo development, maintain a simple bug tracking system:

1. Record bugs in a central location (GitHub Issues, Trello, or simple TODO.md file)
2. Include steps to reproduce, expected vs. actual behavior
3. Prioritize based on impact
4. Create regression tests for critical bugs once fixed

### Continuous Integration

Optional lightweight CI setup:

- GitHub Actions for simple test runs on push
- Basic workflow that runs linting and tests

Example GitHub Actions workflow:
```yaml
name: Basic Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

## Architectural Guidelines

### Core Architectural Principles

The architecture follows these guiding principles aligned with our solo development workflow:

1. **Simplicity First**: Choose the simplest possible solution that meets requirements
2. **Minimize Dependencies**: Avoid unnecessary libraries or abstractions
3. **Small, Focused Files**: Keep components and modules compact and single-purpose
4. **Pragmatic Patterns**: Use established patterns where they add value, avoid overengineering
5. **Progressive Enhancement**: Start simple, enhance as needed, refactor when beneficial

### Component Hierarchy & Organization

#### Component Structure

- Use functional components with hooks exclusively (no class components)
- Keep components small and focused on a single responsibility
- Limit component files to 150 lines maximum

#### Component Organization

```
/components
  /common            # Reusable components across multiple features
    Button.jsx
    Modal.jsx
    TextField.jsx
  /layout            # Layout components
    Header.jsx
    Footer.jsx
    Sidebar.jsx  
  /specifications    # Feature-specific components
    SpecificationList.jsx
    SpecificationDetail.jsx
    SpecificationForm.jsx
```

#### Component Composition Patterns

1. **Container/Presentation Pattern**

   Separate data fetching from presentation:

   ```typescript
// app/specifications/[id]/page.tsx
import { notFound } from 'next/navigation';

async function getSpecification(id: string) {
  try {
    const specification = await getSpecificationById(id);
    if (!specification) {
      return null;
    }
    return specification;
  } catch (error) {
    console.error('Failed to fetch specification:', error);
    return null;
  }
}

export default async function SpecificationPage({ params }: { params: { id: string } }) {
  const specification = await getSpecification(params.id);
  
  if (!specification) {
    notFound();
  }
  
  return <SpecificationDetails specification={specification} />;
}
```
   // Presentation component
   const SpecificationList = ({ specifications }) => (
     <div>
       {specifications.map(spec => (
         <SpecificationItem key={spec.id} specification={spec} />
       ))}
     </div>
   );
   ```

2. **Composition Over Inheritance**

   Build complex components by composing smaller ones:

   ```javascript
   const SpecificationDetail = ({ specification }) => (
     <Card>
       <CardHeader title={specification.title} />
       <CardBody>
         <SpecificationProperties properties={specification.properties} />
         <SpecificationMetadata metadata={specification.metadata} />
       </CardBody>
       <CardFooter>
         <ActionButtons specification={specification} />
       </CardFooter>
     </Card>
   );
   ```

### API Design Principles

#### API Routes Structure

Use Next.js API Routes for backend functionality:

```
/app/api
  /specifications
    route.ts         # GET (list), POST (create)
    [id]/
      route.ts      # GET, PUT, DELETE for a specific specification
  /auth
    login/
      route.ts      # Authentication endpoints
    logout/
      route.ts
```

#### API Patterns

1. **RESTful Endpoints**

   Follow REST principles for CRUD operations:
   
   - `GET /api/specifications` - List specifications
   - `POST /api/specifications` - Create a specification
   - `GET /api/specifications/[id]` - Get a specific specification
   - `PUT /api/specifications/[id]` - Update a specification
   - `DELETE /api/specifications/[id]` - Delete a specification

2. **Response Format**

   Standardize API responses using the following format:

   ```typescript
   // Success response
   {
     data: {...},      // The response data
     meta?: {...}      // Optional metadata (pagination, etc.)
   }

   // Error response
   {
     error: {
       message: string,  // Human-readable error message
       code: string,     // Error code (e.g., "INVALID_INPUT", "NOT_FOUND")
       details?: any     // Optional additional error details
     }
   }
   ```
   
   Standard error status codes:
   - `400` - Bad Request (validation errors, malformed inputs)
   - `401` - Unauthorized (authentication required)
   - `403` - Forbidden (authenticated but not authorized)
   - `404` - Not Found (resource doesn't exist)
   - `409` - Conflict (e.g., duplicate entry)
   - `422` - Unprocessable Entity (semantic validation errors)
   - `500` - Internal Server Error (unexpected server errors)

   Example implementation:
   
   ```typescript
   // app/api/specifications/[id]/route.ts
   import { NextResponse } from 'next/server';
   import { prisma } from '@/lib/db';
   
   export async function GET(request: Request, { params }: { params: { id: string } }) {
     try {
       const specification = await prisma.specification.findUnique({
         where: { id: params.id }
       });
       
       if (!specification) {
         return NextResponse.json(
           { error: { message: 'Specification not found', code: 'NOT_FOUND' } },
           { status: 404 }
         );
       }
       
       return NextResponse.json({ data: specification });
     } catch (error) {
       console.error('Failed to fetch specification:', error);
       return NextResponse.json(
         { error: { message: 'Failed to fetch specification', code: 'SERVER_ERROR' } },
         { status: 500 }
       );
     }
   }
   ```

3. **Shopify GraphQL Integration**

   For Shopify interactions, use direct GraphQL queries:

   ```javascript
   // lib/shopify.js - Simple wrapper for Shopify GraphQL queries
   export async function shopifyQuery(query, variables = {}) {
     const response = await fetch(SHOPIFY_API_URL, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
       },
       body: JSON.stringify({ query, variables }),
     });

     const { data, errors } = await response.json();
     if (errors) throw new Error(errors[0].message);
     return data;
   }
   ```

### Data Modeling Conventions

#### Data Structure Principles

1. **Flat Data Structures**

   Prefer flat data structures where possible

2. **Type Definitions**

   Use TypeScript for type safety:

   ```typescript
   // TypeScript example
   interface Specification {
     id: string;
     title: string;
     description: string;
     category: string;
     properties: Record<string, string>;
     createdAt: string;
     updatedAt: string;
   }
   ```

3. **Normalization**

   For complex data with relationships, normalize in memory when needed

#### Database Interaction

1. **Use Prisma ORM as Data Access Layer**

   Use Prisma ORM for all database operations:

   ```javascript
   // lib/db.js
   import { PrismaClient } from '@prisma/client';
   
   // Create a singleton instance
   const globalForPrisma = global as { prisma?: PrismaClient };
   export const prisma = globalForPrisma.prisma || new PrismaClient();
   
   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
   
   export async function getSpecifications() {
     return prisma.specification.findMany();
   }
   
   export async function getSpecificationById(id) {
     return prisma.specification.findUnique({
       where: { id }
     });
   }
   ```

2. **Data Validation**

   Always validate data before saving to the database

### Error Handling Patterns

#### Error Handling Principles

1. **Explicit Error Surfacing**

   Never hide errors or use fallback/substitute data

2. **Error Boundaries**

   Use React Error Boundaries for UI error handling

3. **Standardized API Error Handling**

   Follow consistent patterns for error responses from API endpoints

4. **Client-Side Error Handling**

   Handle loading states, errors, and empty states explicitly in components

### Performance Optimization

#### Client-Side Optimization

1. **Component Optimization**

   Use React optimization techniques like `memo`, `useMemo`, and `useCallback` judiciously

2. **Code Splitting**

   Use Next.js dynamic imports for code splitting large components

3. **Image Optimization**

   Use Next.js Image component for optimized image loading

#### Server-Side Optimization

1. **Static Site Generation (SSG)**

   Use SSG for pages that don't need frequent updates

2. **Server-Side Rendering (SSR)**

   Use SSR for pages that need fresh data

3. **API Route Optimization**

   Keep API routes lightweight and efficient using Prisma

4. **Database Query Optimization with Prisma**

   Use Prisma's features for efficient database access:
   
   - Use `select` to retrieve only needed fields
   - Implement pagination with `skip` and `take`
   - Use appropriate indexes for frequently queried fields
   - Optimize relation fetching with `include`
   - Use Prisma's transaction API for atomic operations

## Revision History

| Version | Date       | Description                                       | Author |
|---------|------------|---------------------------------------------------|--------|
| 1.0     | 2023-05-01 | Initial project standards document                | Jonny  |
| 1.1     | 2023-05-15 | Added architectural guidelines and testing section| Jonny  |
| 1.2     | 2023-05-23 | Updated API strategy and Prisma ORM integration   | Jonny  |
