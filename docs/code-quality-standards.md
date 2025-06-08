# Code Quality Standards

This document outlines the code quality standards for the specifications project - a snuff specification builder and CRUD admin application.

## Table of Contents

1. [ESLint Configuration](#eslint-configuration)
2. [Prettier Formatting](#prettier-formatting)
3. [Naming Conventions](#naming-conventions)
4. [Code Structure and Organization](#code-structure-and-organization)
5. [State Management](#state-management)

## ESLint Configuration

We use ESLint to enforce code quality and consistency across the codebase.

### Base Configuration

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

## Prettier Formatting

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

## Naming Conventions

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

## Code Structure and Organization

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

## State Management

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
  role: 'admin' | 'user';
}

interface UserContext {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContext | undefined>(undefined);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Login logic
      const userData = await loginService(email, password);
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
