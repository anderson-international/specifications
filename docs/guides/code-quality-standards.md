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

This document outlines the code quality standards for the specifications project - a snuff specification builder and CRUD admin application.

## Table of Contents

1. [ESLint Configuration](#eslint-configuration)
2. [Prettier Formatting](#prettier-formatting)
3. [Naming Conventions](#naming-conventions)
4. [Code Structure and Organization](#code-structure-and-organization)
5. [State Management](#state-management)
6. [⚠️ **CRITICAL**: TypeScript Return Type Requirements](#typescript-return-type-requirements)
7. [AI_VALIDATION](#ai-validation)

## 🔥 **HIGH**: ESLint Configuration

We use ESLint to enforce code quality and consistency across the codebase.

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

We use Prettier to ensure consistent code formatting across the codebase.

### Base Configuration

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

### Integration with ESLint

To integrate Prettier with ESLint, we use:
- `eslint-config-prettier`: Disables ESLint rules that might conflict with Prettier
- `eslint-plugin-prettier`: Runs Prettier as an ESLint rule

## ⚙️ **MEDIUM**: Naming Conventions

### Files and Directories

- **React Components**: PascalCase, either `.tsx` or `.jsx` extensions (e.g., `UserProfile.tsx`)
- **Utility Files**: camelCase, `.ts` or `.js` extensions (e.g., `formatDate.ts`)
- **Styles**: Match the component name with appropriate extension:
  - CSS Modules: `[ComponentName].module.css`
  - Styled Components: `[ComponentName].styles.ts`
- **API Routes**: camelCase for file names (e.g., `getUserData.ts`)
- **Test Files**: Same name as the file being tested with `.test` or `.spec` suffix (e.g., `UserProfile.test.tsx`)
- **Config Files**: kebab-case (e.g., `next-config.js`)

### Variables and Functions

- **Variables**: camelCase (e.g., `userData`, `isLoading`)
- **Boolean Variables**: Prefix with "is", "has", "should", etc. (e.g., `isActive`, `hasPermission`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_RETRY_COUNT`)
- **Functions**: camelCase, use descriptive verbs (e.g., `fetchUserData`, `validateForm`)
- **Private Functions/Variables**: Prefix with underscore (e.g., `_privateHelper`)
- **React Hooks**: Prefix with "use" (e.g., `useFormState`, `useAuth`)

### Components and Interfaces

- **React Components**: PascalCase (e.g., `UserProfile`, `NavigationBar`)
- **TypeScript Interfaces**: PascalCase without prefix (e.g., `User`, `FormProps`) to match modern TypeScript best practices
- **TypeScript Types**: PascalCase, descriptive (e.g., `UserRole`, `FormState`)
- **Enums**: PascalCase, singular naming (e.g., `ButtonType`, `NotificationType`)

## ⚙️ **MEDIUM**: Code Structure and Organization

### Project Structure

```
specifications/
├── docs/                   # Project documentation
├── .next/                  # Next.js build output
├── app/                    # Next.js App Router pages and layouts
│   ├── api/                # API routes
│   └── [routes]/           # Application routes with page.tsx files
├── components/             # Reusable UI components
│   ├── common/             # Shared components across features
│   ├── layout/             # Layout components
│   └── [feature]/          # Feature-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Core utilities and services
│   ├── api/                # API utilities
│   ├── utils/              # Helper functions
│   └── validations/        # Zod schemas and validation
├── public/                 # Static assets
├── styles/                 # Global styles
├── types/                  # TypeScript type definitions
└── tests/                  # Test utilities and mocks
```

### Component Structure

Components should follow this general structure:

```tsx
// Imports - organized by groups with a blank line between
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/common/Button';
import { formatDate } from '@/lib/utils/formatDate';

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
  const { user } = useAuth();
  
  // Effect hooks
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
  
  // Conditional rendering if needed
  if (!user) {
    return <div>Not authenticated</div>;
  }
  
  // Main render
  return (
    <div className="example-component">
      <h1>{formatTitle(title)}</h1>
      {/* Rest of the component */}
    </div>
  );
};

// PropTypes for non-TypeScript components
ExampleComponent.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};
```

## 🔥 **HIGH**: State Management

### Local State

- Use React's `useState` and `useReducer` hooks for component-level state management
- Extract complex state logic into custom hooks for reusability
- Prefer multiple atomic state values over large state objects when appropriate

### Global State

For application-wide state management, we use [React Context API](https://reactjs.org/docs/context.html) with [SWR](https://swr.vercel.app/) for data fetching and caching.

### State Management Patterns

1. **Feature-based State Organization**:
   - State should be organized by feature or domain
   - Each feature may have its own context provider

2. **State Access Patterns**:
   - Create custom hooks to access state (e.g., `useUserSettings`, `useSpecifications`)
   - Never access context directly in components

3. **State Update Patterns**:
   - Use immutable update patterns with spread operators or libraries like Immer
   - Document state mutations clearly, particularly for complex state structures

4. **Asynchronous State Management**:
   - Use SWR for remote data fetching and caching
   - Handle loading, error, and success states explicitly for async operations
   - Implement proper optimistic UI updates where appropriate

### Example Context Structure

```tsx
// UserContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'expert' | 'public';
}

interface UserContext {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContext | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Login logic
      const userData = await loginService(email);
      setUser(userData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    // Logout logic
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): IUserContext => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
```

## ⚠️ **CRITICAL - MANDATORY COMPLIANCE**: TypeScript Return Type Requirements

All functions must have explicit return types as enforced by ESLint configuration:

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

ESLint Rule Patterns:
- Function return types: ": (void|Promise<\w+>|\w+)" required after function parameters
- No explicit any: Reject patterns containing ": any" or "any[]"
- Console usage: Only allow "console\.(warn|error)" not "console\.log"
- Import organization: Require blank lines between import groups

Validation Regex:
- Missing return types: /^[\s]*const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{/ (without return type)
- Explicit any usage: /:\s*any\b/
- Console.log usage: /console\.log\(/
- Import violations: /^import.*from.*\n^import/ (missing blank line)

File Size Validation:
- Component files: Line count <= 150
- Page files: Line count <= 200  
- Utility files: Line count <= 100

Critical Patterns to Enforce:
1. All functions have explicit return types
2. No usage of 'any' type
3. No console.log in production code
4. Proper import organization with blank lines
5. File size limits strictly enforced
