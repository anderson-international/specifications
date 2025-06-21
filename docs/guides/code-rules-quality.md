---
complianceLevel: required
status: stable
tags: [eslint, typescript, prettier, code-quality, standards, linting]
id: 1011
---

# Code Rules Quality

*ESLint, Prettier, and TypeScript configuration standards for consistent code quality.*

<!-- AI_QUICK_REF
Overview: This document establishes mandatory Code Rules Quality for TypeScript development. Key points
Key Rules: Explicit function return types (line 69), No 'any' type (line 70), Import organization (line 82)
Avoid: Missing return types, Using 'any' type, Inconsistent imports, console.log in production
-->

> **📋 Quick Navigation:**
> - **Core Standards**: 
>   - [🔥 React Patterns](react-patterns.md "Context: React-specific TypeScript patterns") 
>   - [Database-Form Integration](database-form-integration.md "Context: Type-safe data handling")
> - **UI/UX Standards**: 
>   - [UI/UX Design Decisions](../project/ui-ux-design.md "Context: Component styling guidelines") 
>   - [UI/UX Patterns](../concerns/ui-ux-patterns.md "Context: Component implementation patterns")
> - **Project Context**: 
>   - [Technical Stack](../project/technical-stack.md "Context: Technology choices and constraints") 
>   - [Feature Requirements](../project/feature-requirements.md "Context: Technical compliance for features")
>   - [⚠️ API Design](../concerns/api-design.md "Context: Type definitions for API contracts")
> - **Implementation**: 
>   - [Form Management](../concerns/form-management.md "Context: Type-safe form handling")
>   - [⚠️ API Design](../concerns/api-design.md "Context: API implementation guidelines")

## Executive Summary

This document establishes mandatory Code Rules Quality for all TypeScript development in the project. It defines strict ESLint and Prettier configurations that are enforced at both development time and build time. The standards focus on type safety, consistent code formatting, organized imports, clear naming conventions, and maintainable code structure. All functions must have explicit return types, use of 'any' type is prohibited, and specific patterns must be followed for imports, error handling, and file organization. These standards are non-negotiable and ensure consistent, maintainable, and bug-resistant code across the codebase.

## Key Principles

1. **Type Safety First**: All code must be properly typed with explicit return types and no use of 'any'.

2. **Consistent Formatting**: Prettier enforces standardized code formatting across the project.

3. **Organized Imports**: Imports must follow a specific organization pattern for consistency and readability.

4. **Explicit Error Handling**: Error conditions must be handled explicitly and consistently.

5. **Clear Naming Conventions**: All variables, functions, and types must follow established naming patterns.

6. **Maintainable Structure**: Files must adhere to size limits and code organization patterns.

7. **No Debug Artifacts**: Console statements and commented code are prohibited in production.

These seven principles work together to create a consistent, maintainable codebase. Each principle supports the others to ensure high code quality throughout the project.

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Key Principles](#key-principles)
3. [Examples](#examples)
   - [TypeScript Return Type Examples](#typescript-return-type-examples)
   - [Import Organization Examples](#import-organization-examples)
   - [Type Safety Examples](#type-safety-examples)
   - [Naming Convention Examples](#naming-convention-examples)

The sections that follow provide detailed configuration and implementation guidance for these principles.

## 🔥 **HIGH**: ESLint Configuration

ESLint enforces our Code Rules Quality automatically during development. The configuration consists of base rules and project-specific customizations.

### ⚠️ **CRITICAL**: Base Configuration

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
    // ⚠️ **CRITICAL**: Error prevention
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "no-var": "error",
    "prefer-const": "error",
    
    // ⚠️ **CRITICAL**: TypeScript specific
    "@typescript-eslint/explicit-function-return-type": ["error", { "allowExpressions": true }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/ban-ts-comment": "warn",
    
    // 🔥 **HIGH**: React specific
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "never" }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // ⚙️ **MEDIUM**: Import organization
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

While ESLint ensures code quality through linting rules, Prettier handles consistent code formatting across the entire project.

## ⚙️ **MEDIUM**: Prettier Formatting

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

Beyond automated formatting, consistent naming conventions provide human-readable code organization.

## ⚙️ **MEDIUM**: Naming Conventions

Our naming conventions create predictable patterns that make the codebase easier to navigate. The conventions vary by file type and purpose:

### Files and Directories

- **Components**: PascalCase (`.tsx` or `.jsx`) - `UserProfile.tsx`
- **Utilities**: camelCase (`.ts` or `.js`) - `formatDate.ts`
- **Styles**: Match component name - `UserProfile.module.css`
- **Tests**: Add `.test` or `.spec` suffix - `UserProfile.test.tsx`
- **Config**: kebab-case - `next-config.js`

### Variables and Functions

- **Variables**: camelCase - `userData`, `isLoading`
- **Booleans**: Prefix with "is/has/should" - `isActive`
- **Constants**: UPPER_SNAKE_CASE - `API_URL`
- **Functions**: camelCase, descriptive verbs - `fetchUserData`
- **Private**: Prefix with underscore - `_privateHelper`
- **Hooks**: Prefix with "use" - `useFormState`

### Components and Types

- **React Components**: PascalCase - `NavigationBar`
- **Interfaces/Types**: PascalCase - `User`, `FormProps`
- **Enums**: PascalCase, singular - `ButtonType`

## ⚙️ **MEDIUM**: Code Structure

### Project Structure

```
specifications/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   └── [routes]/           # Application routes
├── components/             # UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and services
├── public/                 # Static assets
├── styles/                 # Global styles
└── types/                  # Type definitions
```

### Component Structure

```tsx
// Imports - organized by groups
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
export const ExampleComponent = ({ title, isActive = false, onSubmit }: Props): JSX.Element => {
  // Hook calls
  const [data, setData] = useState(null);
  const { user } = useAuth();
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleSubmit = (): void => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="example-component">
      <h1>{title}</h1>
      {/* Component content */}
    </div>
  );
};
```

## 🔥 **HIGH**: State Management

### Local State.
- Use `useState` and `useReducer` for component state.
- Extract complex state logic into custom hooks.
- Prefer atomic state values when appropriate.

### Global State
- Use React Context API with SWR for data fetching
- Organize state by feature/domain
- Create custom hooks to access state
- Use immutable update patterns
- Handle async states explicitly (loading/error/success)

## ⚠️ **CRITICAL**: TypeScript Return Type Requirements

All functions must have explicit return types:

```typescript
// ❌ FORBIDDEN - No return type
const MyComponent = () => {
  return <div>Hello</div>;
};

// ✅ MANDATORY - Explicit return type
const MyComponent = (): JSX.Element => {
  return <div>Hello</div>;
};

// ❌ FORBIDDEN - No return type
function handleSubmit(data) {
  console.log(data);
}

// ✅ MANDATORY - Explicit return type
function handleSubmit(data: FormData): void {
  console.log(data);
}
```

## EXAMPLES

### TypeScript Return Type Examples

#### ✅ Correct: Explicit Return Types

```typescript
// Function declaration with explicit return type
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Arrow function with explicit return type
const getFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`;
};

// Async function with explicit Promise return type
async function fetchUserData(userId: string): Promise<UserData> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

// React component with explicit JSX.Element return type
const UserProfile = ({ user }: UserProfileProps): JSX.Element => {
  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

// Function that doesn't return a value
function logError(message: string): void {
  console.error(`Error: ${message}`);
}

// Generic function with explicit return type
function getFirstItem<T>(items: T[]): T | undefined {
  return items.length > 0 ? items[0] : undefined;
}
```

#### ❌ Incorrect: Missing Return Types

```typescript
// ❌ Missing return type on function declaration
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Missing return type on arrow function
const getFullName = (user) => {
  return `${user.firstName} ${user.lastName}`;
};

// ❌ Missing Promise return type on async function
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

// ❌ Missing JSX.Element return type on React component
const UserProfile = ({ user }) => {
  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
```

### Import Organization Examples

#### ✅ Correct: Properly Organized Imports

```typescript
// External dependencies - first group
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, Button, Box } from '@mui/material';

// Internal modules - second group
import { UserContext } from '@/context/UserContext';
import { fetchUserData } from '@/api/userService';

// Local imports - third group
import UserAvatar from './UserAvatar';
import styles from './UserProfile.module.css';
import { formatUserName } from '../utils/formatting';

// Types - fourth group
import type { User, UserPreferences } from '@/types';
```

#### ❌ Incorrect: Disorganized Imports

```typescript
// ❌ All imports mixed together with no logical grouping
import styles from './UserProfile.module.css';
import { useRouter } from 'next/router';
import UserAvatar from './UserAvatar';
import React, { useState, useEffect } from 'react';
import { fetchUserData } from '@/api/userService';
import type { User, UserPreferences } from '@/types';
import { formatUserName } from '../utils/formatting';
import { Typography, Button, Box } from '@mui/material';
import { UserContext } from '@/context/UserContext';

// ❌ Missing separating line between import groups
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, Button, Box } from '@mui/material';
import { UserContext } from '@/context/UserContext';
import { fetchUserData } from '@/api/userService';
```

### Type Safety Examples

#### ✅ Correct: Proper Type Definitions

```typescript
// Specific type instead of 'any'
function processUserData(user: User): ProcessedUser {
  return {
    id: user.id,
    name: user.name,
    formattedEmail: formatEmail(user.email)
  };
}

// Union types instead of 'any'
function handleResponse(data: SuccessResponse | ErrorResponse): void {
  if ('error' in data) {
    console.error(`Error: ${data.error.message}`);
  } else {
    processData(data.result);
  }
}

// Unknown with type guards instead of 'any'
function parseApiResponse(response: unknown): ParsedData {
  if (typeof response !== 'object' || response === null) {
    throw new Error('Invalid response format');
  }
  
  const data = response as Record<string, unknown>;
  
  if (!('id' in data) || typeof data.id !== 'string') {
    throw new Error('Missing or invalid ID');
  }
  
  // Additional validation...
  
  return {
    id: data.id,
    // Other properties after validation
  };
}
```

#### ❌ Incorrect: Using 'any' Type

```typescript
// ❌ Using 'any' instead of proper typing
function processUserData(user: any): any {
  return {
    id: user.id,
    name: user.name,
    formattedEmail: formatEmail(user.email)
  };
}

// ❌ Using 'any[]' instead of typed arrays
function sortItems(items: any[]): any[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

// ❌ Using any for convenience with third-party libraries
function parseApiResponse(response: any): ParsedData {
  return {
    id: response.id,
    // Other properties without validation
  };
}
```

### Naming Convention Examples

#### ✅ Correct: Consistent Naming

```typescript
// PascalCase for interfaces, types, classes, and components
interface UserProfileProps {
  user: User;
  isEditable?: boolean;
}

type FilterOptions = 'active' | 'archived' | 'all';

class UserRepository {
  // Implementation
}

function UserProfileCard({ user }: UserProfileProps): JSX.Element {
  // Implementation
}

// camelCase for variables, functions, and methods
const userSettings = getUserSettings();

function calculateTotalPrice(items: CartItem[]): number {
  // Implementation
}

// UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_ENDPOINTS = {
  USERS: '/api/users',
  PRODUCTS: '/api/products',
} as const;
```

#### ❌ Incorrect: Inconsistent Naming

```typescript
// ❌ lowercase for interfaces
interface userProfileProps {
  user: User;
  isEditable?: boolean;
}

// ❌ camelCase for types
type filterOptions = 'active' | 'archived' | 'all';

// ❌ camelCase for classes
class userRepository {
  // Implementation
}

// ❌ lowercase for component functions 
function userProfileCard({ user }: userProfileProps): JSX.Element {
  // Implementation
}

// ❌ PascalCase for regular variables
const UserSettings = getUserSettings();

// ❌ lowercase for constants
const max_retry_attempts = 3

```
