# Code Quality Standards

*ESLint, Prettier, and TypeScript configuration standards for consistent code quality.*

<!-- AI_NAVIGATION
Primary Focus: TypeScript ESLint rules, return type requirements, import organization
Key Compliance Points:
- @typescript-eslint/explicit-function-return-type: error (line 49)
- @typescript-eslint/no-explicit-any: error (line 50) 
- import/order configuration (line 62-72)
- File size limits referenced from best-practices.md
Critical for: All .ts/.tsx files, function definitions, import statements
Cross-references: best-practices.md (file limits), react-patterns.md (React-specific rules)
-->

> **📋 Quick Navigation:**
> - **Development Guidelines**: [Best Practices](best-practices.md) | [Architectural Guidelines](architectural-guidelines.md)
> - **React Implementation**: [React Development Patterns](react-patterns.md) | [Database-Form Integration](database-form-integration.md)
> - **UI/UX Standards**: [UI/UX Design Decisions](../project/ui-ux-design.md) | [Component Patterns](../concerns/ui-ux-patterns.md)
> - **Technical Strategy**: [Form Management](../concerns/form-management.md) | [API Design](../concerns/api-design.md)
> - **Project Setup**: [Technical Stack](../project/technical-stack.md) | [Deployment Environment](../concerns/deployment-environment.md)

This document outlines code quality standards for the specifications project.

## Table of Contents

1. [ESLint Configuration](#eslint-configuration)
2. [Prettier Formatting](#prettier-formatting)
3. [Naming Conventions](#naming-conventions)
4. [Code Structure](#code-structure)
5. [State Management](#state-management)
6. [TypeScript Return Types](#typescript-return-type-requirements)
7. [AI_VALIDATION](#ai-validation)

## 🔥 **HIGH**: ESLint Configuration

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

## ⚙️ **MEDIUM**: Naming Conventions

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

### Local State
- Use `useState` and `useReducer` for component state
- Extract complex state logic into custom hooks
- Prefer atomic state values when appropriate

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

## AI_VALIDATION

ESLint Validation Patterns:
- Function return types: Must include `: (void|Promise<\w+>|\w+)`
- No explicit any: Reject `: any` or `any[]`
- Console usage: Allow only `console.warn|error` not `console.log`
- Import organization: Require blank lines between import groups

Critical Enforcement Points:
1. Explicit return types on all functions
2. No usage of 'any' type
3. No console.log in production code
4. Proper import organization
5. File size limits
