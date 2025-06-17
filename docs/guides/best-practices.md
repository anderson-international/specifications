---
title: Development Best Practices
description: Component organization, file size limits, and code organization principles
version: 2.1.0
status: stable
lastUpdated: 2025-06-17
author: Development Team
complianceLevel: required
readingTime: 10 minutes
tags: [best-practices, file-size, components, organization, simplicity]
---

# Development Best Practices

*Guidelines for component organization, file size limits, and code structure principles.*

<!-- AI_NAVIGATION
Reading Priority: 1 (Essential document for all TypeScript/React development)
Primary Focus: File size limits, separation of concerns, simplicity principles
Key Compliance Points:
- Component files: 150 line limit (line 30)
- Page files: 200 line limit (line 31)
- Utility files: 100 line limit (line 32)
- Simplicity and brevity principles (line 12-23)
- Single responsibility per file (line 16)
Critical Cross-references:
- Code Quality Standards (code-quality-standards.md): ESLint enforcement of practices
- Architectural Guidelines (architectural-guidelines.md): Project structure context
- React Development Patterns (react-patterns.md): Component organization
Anti-patterns:
- Large monolithic components exceeding line limits
- Files with multiple responsibilities
- Complex nested component hierarchies
- Over-engineered solutions for simple problems
- Unclear component naming or organization
Additional Context: This document defines non-negotiable guidelines for code organization that must be followed when developing components
-->

<!-- AI_SUMMARY
This document establishes mandatory constraints for component organization and file structure. Key points:

• STRICT LINE LIMITS: Components (150), Pages (200), Utilities (100) - No exceptions
• Files exceeding limits block development until refactored
• Each file must have a single responsibility
• Components must be split when approaching line limits
• Extract logic into custom hooks, separate UI from business logic
• Feature-based file organization with minimal directory nesting
• Self-documenting code with clear naming over extensive comments
• CSS Modules for component-scoped styling
• Simple, practical implementations over complex design patterns
• File naming must match component purpose

These constraints ensure maintainability for a solo hobbyist developer, focusing on readability and simplicity rather than architectural complexity.
-->

> **📋 Quick Navigation:**
> - **Architecture & Organization**: 
>   - [⚠️ Architectural Guidelines](architectural-guidelines.md "Context: Project structure fundamentals") 
>   - [🔥 Code Quality Standards](code-quality-standards.md "Context: ESLint enforcement of practices")
> - **React Patterns**: 
>   - [🔥 React Development Patterns](react-patterns.md "Context: Component implementation details") 
>   - [Form Management](../concerns/form-management.md "Context: Form organization principles")
> - **UI/UX Implementation**: 
>   - [UI/UX Design Decisions](../project/ui-ux-design.md "Context: Visual appearance guidelines") 
>   - [Component Patterns](../concerns/ui-ux-patterns.md "Context: Reusable UI component structure")
> - **Database Integration**: 
>   - [Database-Form Integration](database-form-integration.md "Context: Type-safe data handling") 
>   - [Database Schema](../db-schema.txt "Context: Data structure reference")
> - **Deployment & Environment**: 
>   - [Deployment Environment](../concerns/deployment-environment.md "Context: Build configuration") 
>   - [Technical Stack](../project/technical-stack.md "Context: Technology selection justification")

## Executive Summary

This document establishes non-negotiable file organization principles optimized for a solo hobbyist developer. It defines strict file size limits - component files (150 lines), page files (200 lines), and utility files (100 lines) - that cannot be exceeded under any circumstances. Files must adhere to the single responsibility principle, with specific refactoring strategies required when approaching size limits. The document prioritizes simplicity, readability, and maintainability over architectural sophistication, enforcing flat directory structures, clear naming conventions, and consistent component splitting patterns.

## Key Principles

1. **Strict Size Limits**: All files have non-negotiable maximum line counts that must never be exceeded.

2. **Single Responsibility**: Every file must have exactly one clear purpose and responsibility.

3. **Proactive Refactoring**: Components approaching size limits must be split before they exceed them.

4. **Simplicity First**: Choose straightforward implementations over complex patterns.

5. **Self-Documentation**: Use clear naming and structure over extensive comments.

6. **Flat Organization**: Minimize directory nesting and group by feature.

7. **Consistent Patterns**: Follow established splitting patterns for components.

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Key Principles](#key-principles)
3. [Detailed Guidance](#detailed-guidance)
   - [Simplicity and Brevity](#simplicity-and-brevity)
   - [File Size and Separation of Concerns](#️-critical-file-size-and-separation-of-concerns)
   - [When to Split Components](#-high-when-to-split-components)
   - [File Organization](#️-medium-file-organization)
   - [API Strategy](#️-medium-api-strategy)
   - [Form Management Strategy](#-high-form-management-strategy)
   - [CSS/Styling Strategy](#️-medium-cssstyling-strategy)
   - [Authentication Strategy](#-high-authentication-strategy)
4. [Examples](#examples)

## Detailed Guidance

### Simplicity and Brevity

As a solo hobbyist coder, I prioritize:

- **Small, Focused Files**: Single responsibility per file
- **Self-documenting Code**: Clear code over extensive comments
- **Straightforward Solutions**: Simple implementations over complex patterns
- **Pragmatic Development**: Build only what's needed
- **Concise Functions**: Small, single-purpose functions
- **Clear Naming**: Names that make comments unnecessary

### ⚠️ **CRITICAL**: File Size and Separation of Concerns

#### ⚠️ **CRITICAL - NON-NEGOTIABLE LIMITS**: File Size Limits
- **Component Files**: 150 lines maximum
- **Page Files**: 200 lines maximum  
- **Utility Files**: 100 line maximum

**VIOLATION CONSEQUENCES**: 
- Immediate refactoring required
- Development blocked until compliance

**MANDATORY ACTIONS when approaching limits**:
- **Extract Custom Hooks**: Move complex state logic
- **Separate Concerns**: Split UI, business logic, and state management
- **Create Container Components**: For data flow management
- **Extract Utility Components**: Create reusable UI elements
- **Move Constants**: Large data to separate files

#### 🔥 **HIGH**: When to Split Components

**Splitting Triggers:**
- Component approaching 150-line limit
- Multiple responsibilities in one component
- Complex state management
- Unclear component purpose

#### ✨ **SUCCESSFUL PATTERN**: Splitting Examples

**Example: SpecificationWizard (328 lines → Multiple Components)**
- **Split Into**:
  - `WizardContainer` (navigation, progress)
  - `DraftManager` (draft functionality)  
  - `ValidationProvider` (validation logic)
  - `SpecificationWizard` (main component <150 lines)

**Form Component Patterns**:
- Extract step logic into custom hooks
- Separate form UI from form logic
- Move validation schemas to separate files

#### ⚙️ **MEDIUM**: File Organization

- **Flat Structure**: Minimal directory nesting
- **Feature-Based Grouping**: Group by functionality
- **Co-location**: Related files kept together
- **Clear Naming**: Match filenames to component names

### ⚙️ **MEDIUM**: API Strategy

- **Use Next.js API Routes** for backend needs
- **Direct GraphQL queries** to Shopify API
- **Simple integration code**: Modular and concise
- **Minimal abstractions**: No unnecessary complexity

### 🔥 **HIGH**: Form Management Strategy

See [Form Management Documentation](../concerns/form-management.md "Priority: HIGH - Form validation and state management") for complete form handling approach.

### ⚙️ **MEDIUM**: CSS/Styling Strategy

- **CSS Modules**: Default for all components
- **Component-scoped styles**: Small, focused files
- **Descriptive class names**: Reflect component structure
- **Inline styles**: Only for highly dynamic styling
- **Avoid global styles**: Prevent style conflicts

### 🔥 **HIGH**: Authentication Strategy

See [Authentication Documentation](../concerns/authentication.md "Priority: HIGH - User authentication implementation standards") for comprehensive authentication approach.

## EXAMPLES

### Component Splitting Example

#### ✅ Correct: Proper Component Separation

**Before: Large ProductConfigurator Component (190 lines)**

```tsx
// ProductConfigurator.tsx - TOO LARGE at 190 lines
import React, { useState, useEffect } from 'react';
import { Typography, Button, Grid } from '@mui/material';
import { Product, Option, Configuration } from '@/types';
import { validateConfiguration } from '@/utils/validation';
import { calculatePrice } from '@/utils/pricing';
import { saveConfiguration } from '@/api/configurator';
import styles from './ProductConfigurator.module.css';

interface ProductConfiguratorProps {
  product: Product;
  initialConfig?: Configuration;
  onSave: (config: Configuration) => void;
}

export function ProductConfigurator({ product, initialConfig, onSave }: ProductConfiguratorProps): JSX.Element {
  const [configuration, setConfiguration] = useState<Configuration>(initialConfig || {});
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Load initial configuration
  useEffect(() => {
    if (initialConfig) {
      setConfiguration(initialConfig);
      // More initialization logic...
    }
  }, [initialConfig, product]);

  // Calculate price whenever options change
  useEffect(() => {
    const newPrice = calculatePrice(product, selectedOptions);
    setPrice(newPrice);
  }, [product, selectedOptions]);

  // Handle option selection
  const handleOptionChange = (optionId: string, value: string): void => {
    // Option change logic...
  };

  // Validate configuration
  const validateForm = (): boolean => {
    // Validation logic...
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async (): Promise<void> => {
    // Save logic with API calls...
  };

  return (
    <div className={styles.configurator}>
      <Typography variant="h4">{product.name} Configurator</Typography>
      
      {/* Product details section */}
      <section className={styles.productDetails}>
        {/* Product image and description */}
      </section>
      
      {/* Options selection */}
      <section className={styles.optionsSelection}>
        {/* Multiple option groups rendering */}
      </section>
      
      {/* Price calculation */}
      <section className={styles.priceCalculation}>
        {/* Price breakdown and total */}
      </section>
      
      {/* Validation messages */}
      <section className={styles.validationErrors}>
        {/* Error messages */}
      </section>
      
      {/* Save and submission controls */}
      <section className={styles.controls}>
        {/* Buttons and save status */}
      </section>
    </div>
  );
}
```

**After: Split into Multiple Components**

```tsx
// ProductConfiguratorContainer.tsx - 75 lines
import React, { useState } from 'react';
import { Product, Configuration } from '@/types';
import { useConfigurationState } from './hooks/useConfigurationState';
import { ProductDetails } from './components/ProductDetails';
import { OptionsSelector } from './components/OptionsSelector';
import { PricingSummary } from './components/PricingSummary';
import { ConfigurationControls } from './components/ConfigurationControls';
import styles from './ProductConfiguratorContainer.module.css';

interface ProductConfiguratorContainerProps {
  product: Product;
  initialConfig?: Configuration;
  onSave: (config: Configuration) => void;
}

export function ProductConfiguratorContainer({ 
  product, 
  initialConfig, 
  onSave 
}: ProductConfiguratorContainerProps): JSX.Element {
  // Main container now handles only state orchestration
  const {
    configuration,
    selectedOptions,
    price,
    errors,
    saveStatus,
    handleOptionChange,
    handleSave
  } = useConfigurationState(product, initialConfig, onSave);

  return (
    <div className={styles.configurator}>
      <ProductDetails product={product} />
      
      <OptionsSelector 
        productOptions={product.options}
        selectedOptions={selectedOptions}
        errors={errors}
        onChange={handleOptionChange}
      />
      
      <PricingSummary 
        basePrice={product.basePrice}
        selectedOptions={selectedOptions}
        totalPrice={price}
      />
      
      <ConfigurationControls 
        onSave={handleSave}
        saveStatus={saveStatus}
        isValid={Object.keys(errors).length === 0}
      />
    </div>
  );
}
```

```tsx
// hooks/useConfigurationState.ts - 70 lines
import { useState, useEffect } from 'react';
import { Product, Option, Configuration } from '@/types';
import { validateConfiguration } from '@/utils/validation';
import { calculatePrice } from '@/utils/pricing';
import { saveConfiguration } from '@/api/configurator';

export function useConfigurationState(
  product: Product, 
  initialConfig?: Configuration,
  onSave?: (config: Configuration) => void
) {
  // Hook contains all the state management and business logic
  // Implementation of state and handlers...
  
  return {
    configuration,
    selectedOptions,
    price,
    errors,
    saveStatus,
    handleOptionChange,
    handleSave
  };
}
```

### File Size Compliance Example

#### ✅ Correct: Keeping Files Under Size Limits

```bash
# File sizes comply with limits
wc -l src/components/*.tsx
  42 src/components/Button.tsx          # ✓ Under 150 line limit
  76 src/components/DataTable.tsx        # ✓ Under 150 line limit
 149 src/components/FormBuilder.tsx      # ✓ Just under 150 line limit
  94 src/components/Modal.tsx            # ✓ Under 150 line limit
 128 src/components/UserProfile.tsx      # ✓ Under 150 line limit

wc -l src/pages/*.tsx  
 184 src/pages/Dashboard.tsx             # ✓ Under 200 line limit
  95 src/pages/Login.tsx                 # ✓ Under 200 line limit
 197 src/pages/ProductDetail.tsx         # ✓ Under 200 line limit
 142 src/pages/UserSettings.tsx          # ✓ Under 200 line limit
```

#### ❌ Incorrect: Files Exceeding Size Limits

```bash
# Files exceeding limits
wc -l src/components/*.tsx
  42 src/components/Button.tsx          
  76 src/components/DataTable.tsx        
 172 src/components/FormBuilder.tsx      # ❌ Exceeds 150 line limit
  94 src/components/Modal.tsx            
 205 src/components/UserProfile.tsx      # ❌ Exceeds 150 line limit

wc -l src/pages/*.tsx  
 252 src/pages/Dashboard.tsx             # ❌ Exceeds 200 line limit
  95 src/pages/Login.tsx                 
 197 src/pages/ProductDetail.tsx         
 142 src/pages/UserSettings.tsx          
```

### Single Responsibility Example

#### ✅ Correct: Single Responsibility Files

```tsx
// UserAuthentication.tsx - Only handles authentication
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export function UserAuthentication({ children }: { children: React.ReactNode }): JSX.Element {
  const { user, login, logout, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading authentication...</div>;
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

```tsx
// UserPreferences.tsx - Only handles user preferences
import React from 'react';
import { usePreferences } from '@/hooks/usePreferences';

export function UserPreferences({ children }: { children: React.ReactNode }): JSX.Element {
  const { preferences, updatePreference } = usePreferences();
  
  return (
    <PreferencesContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </PreferencesContext.Provider>
  );
}
```

#### ❌ Incorrect: Multiple Responsibilities in One File

```tsx
// UserManager.tsx - Mixed responsibilities
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePreferences } from '@/hooks/usePreferences';
import { useNotifications } from '@/hooks/useNotifications';
import { useProfile } from '@/hooks/useProfile';

export function UserManager({ children }: { children: React.ReactNode }): JSX.Element {
  // Authentication logic
  const { user, login, logout, isLoading: authLoading } = useAuth();
  
  // Preferences logic
  const { preferences, updatePreference } = usePreferences();
  
  // Notification logic
  const { notifications, markAsRead } = useNotifications();
  
  // Profile management logic
  const { profile, updateProfile, profileLoading } = useProfile();
  
  // Loading states for multiple concerns
  if (authLoading || profileLoading) {
    return <div>Loading user data...</div>;
  }
  
  // Combined provider for multiple concerns
  return (
    <UserContext.Provider value={{ 
      // Auth related
      user, 
      login, 
      logout,
      
      // Preferences related
      preferences, 
      updatePreference,
      
      // Notification related
      notifications,
      markAsRead,
      
      // Profile related
      profile,
      updateProfile
    }}>
      {children}
    </UserContext.Provider>
  );
}
```
