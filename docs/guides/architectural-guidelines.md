---
title: Architectural Guidelines
description: Component hierarchy, API design principles, and system architecture patterns
version: 2.0.0
status: stable
lastUpdated: 2025-06-17
author: Development Team
complianceLevel: required
readingTime: 15 minutes
tags: [architecture, components, next.js, patterns, api-design, security]
---

# Architectural Guidelines

*Comprehensive patterns for scalable component architecture and system design.*

<!-- AI_NAVIGATION
Reading Priority: 1 (Essential document for overall project architecture)
Primary Focus: Component hierarchy, API design principles, Next.js App Router patterns, architectural philosophy
Key Compliance Points:
- Single responsibility principle (line 39-41)
- Component structure requirements (line 47-52)
- API routes structure (line 82-92)
- Error handling principles (line 117-130)
- Next.js App Router patterns (line 142-172)
- Security patterns (line 174-182)
Critical Cross-references:
- Best Practices (best-practices.md): File size limits and code organization standards
- API Design (../concerns/api-design.md): Detailed API implementation patterns
- UI/UX Patterns (../concerns/ui-ux-patterns.md): Component design and organization
- React Development Patterns (react-patterns.md): React-specific architecture for components
Anti-patterns:
- Large, multi-purpose components exceeding 150 lines
- Deeply nested component hierarchies
- Using external state libraries when built-in solutions suffice
- Unnecessary abstractions and over-engineering
Additional Context: This document defines the architectural philosophy and structure for the entire application
Decision Framework: When to create new components vs extend existing
-->

<!-- AI_SUMMARY
This document defines the architectural foundations for the Next.js-based application. Key points:

• CRITICAL: Use functional components exclusively with strict 150-line limit
• CRITICAL: Follow single responsibility principle for all files and components
• CRITICAL: Use built-in React state management (useState, useReducer, Context) over external libraries
• CRITICAL: Implement container/presentation pattern for component organization
• CRITICAL: Use Next.js App Router with specific route structure for both UI and API
• CRITICAL: Type safety required with TypeScript interfaces and Zod validation
• CRITICAL: Never hide errors or use fallback data; surface errors immediately
• CRITICAL: Implement server components for data fetching, client components for interaction
• CRITICAL: Ensure robust authentication checks on all protected routes

The architecture prioritizes simplicity, minimal dependencies, small focused files, and pragmatic patterns instead of over-engineering. All architectural decisions must facilitate these principles.
-->

> **📋 Quick Navigation:**
> - **Development Standards**: [Best Practices](best-practices.md "Priority: HIGH - File organization and component splitting rules") | [Code Quality Standards](code-quality-standards.md "Priority: CRITICAL - Mandatory code formatting and style rules")
> - **React Implementation**: [React Development Patterns](react-patterns.md "Priority: HIGH - Component patterns and React hooks usage") | [Database-Form Integration](database-form-integration.md "Priority: MEDIUM - Data binding patterns")
> - **UI/UX Design**: [UI/UX Design Decisions](../project/ui-ux-design.md "Context: Visual consistency guidelines") | [Component Patterns](../concerns/ui-ux-patterns.md "Priority: HIGH - Component organization and structure")
> - **Technical Strategy**: [Form Management](../concerns/form-management.md "Priority: HIGH - Form validation and state management") | [Authentication](../concerns/authentication.md "Priority: CRITICAL - Security implementation")
> - **Project Context**: [Technical Stack](../project/technical-stack.md "Context: Tools and libraries used") | [Feature Requirements](../project/feature-requirements.md "Context: Business requirements")

This document outlines the architectural principles for the specifications project - a snuff specification builder and CRUD admin application built with Next.js.

## Executive Summary

This document establishes the non-negotiable architectural foundation for the specifications application. It mandates a component-based architecture with strict file size limits (150 lines max for components), emphasizing simplicity and pragmatism over complexity. The architecture follows Next.js App Router patterns with a clear separation between server and client components. All data interactions require TypeScript interfaces and Zod validation to ensure type safety. The architecture prioritizes explicit error handling, minimal dependencies, and robust security patterns to create a maintainable application optimized for a solo developer.

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Architectural Principles](#core-architectural-principles)
3. [Component Hierarchy](#component-hierarchy)
4. [API Design Principles](#api-design-principles)
5. [Data Modeling](#data-modeling)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Next.js App Router Patterns](#nextjs-app-router-patterns)

## ⚠️ **CRITICAL**: Core Architectural Principles

1. **⚠️ CRITICAL: Simplicity First**: Choose the simplest solution that meets requirements
2. **🔥 HIGH: Minimize Dependencies**: Avoid unnecessary libraries or abstractions
3. **⚠️ CRITICAL: Small, Focused Files**: Keep components and modules compact and single-purpose
4. **⚙️ MEDIUM: Pragmatic Patterns**: Use established patterns where they add value
5. **✨ ENHANCE: Progressive Enhancement**: Start simple, enhance as needed

## 🔥 **HIGH**: Component Hierarchy

### ⚠️ **CRITICAL**: Component Structure

- **⚠️ CRITICAL**: Use functional components with hooks exclusively
- **⚠️ CRITICAL**: Keep components small and focused (single responsibility)
- **⚠️ CRITICAL**: Limit component files to **150 lines maximum**

### ⚙️ **MEDIUM**: Component Organization

```
/components
  /common            # Reusable components across features
  /layout            # Layout components  
  /specifications    # Feature-specific components
```

### 🔥 **HIGH**: Component Composition Patterns

1. **🔥 HIGH: Container/Presentation Pattern**
   - Separate data fetching from presentation
   - Container components handle data/logic
   - Presentation components handle rendering

2. **⚙️ MEDIUM: Composition Over Inheritance**
   - Build complex components by composing smaller ones
   - Use props to pass data and behavior down

### 🔥 **HIGH**: State Management

- **🔥 HIGH**: Use React's built-in `useState` for component-local state
- **🔥 HIGH**: Use `useReducer` for more complex component state
- **⚠️ CRITICAL**: Use Context API sparingly for truly global state
- **🔥 HIGH**: Avoid external state management libraries unless necessary

## 🔥 **HIGH**: API Design Principles

### ⚠️ **CRITICAL**: API Routes Structure

Use Next.js App Router for backend functionality:

```
/app/api
  /specifications
    route.ts              # GET (list), POST (create)
    [id]/
      route.ts            # GET, PUT, DELETE for specific item
```

## 🔥 **HIGH**: Data Modeling

### ⚠️ **CRITICAL**: Type Safety

Define TypeScript interfaces for all data models:

```typescript
interface Specification {
  id: string;
  title: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
```

### ⚠️ **CRITICAL**: Database Interaction

1. **⚠️ CRITICAL**: Use Prisma ORM for all database operations
2. **⚠️ CRITICAL**: Use Zod schemas for type-safe validation

## ⚠️ **CRITICAL**: Error Handling

### ⚠️ **CRITICAL**: Error Handling Principles

1. **⚠️ CRITICAL: Explicit Error Surfacing**
   - Never hide errors or use fallback/substitute data
   - Surface errors immediately to user

2. **🔥 HIGH: Error Boundaries**
   - Use React Error Boundaries for UI error handling
   - Provide useful error messages and recovery options

3. **🔥 HIGH: API Error Handling**
   - Return appropriate status codes
   - Include error codes, messages, and retryability info

## 🔥 **HIGH**: Performance Optimization

1. **⚠️ CRITICAL: Component Memoization**
   - Use React.memo for pure functional components
   - Use useCallback for event handlers passed to child components
   - Use useMemo for expensive calculations

2. **🔥 HIGH: Code Splitting**
   - Use dynamic imports for large components/pages
   - Lazy load routes and heavy components

## ⚠️ **CRITICAL**: Next.js App Router Patterns

### 🔥 **HIGH**: Routing Structure

```
/app
  /page.tsx             # Home page
  /specifications
    /page.tsx           # Specifications list
    /[id]/page.tsx      # Specification detail
    /create/page.tsx    # Create specification
  /api
    /specifications
      /route.ts         # API endpoints
```

### ⚠️ **CRITICAL**: Server vs Client Components

- **⚠️ CRITICAL**: Use Server Components for data fetching and initial render
- **🔥 HIGH**: Use Client Components for interactive UI elements
- **⚙️ MEDIUM**: Keep client bundle size minimal by leveraging server components

### ⚙️ **MEDIUM**: Data Fetching Strategies

1. **🔥 HIGH: Server-Side Data Fetching**
   - Use in Server Components for initial page load
   - Provides better SEO and initial page load performance

2. **⚙️ MEDIUM: Client-Side Data Fetching**
   - Use for interactive features that need fresh data
   - Implement loading states and error handling

## ⚠️ **CRITICAL**: Security Patterns

1. **⚠️ CRITICAL: Authentication & Authorization**
   - Implement robust auth checks on all protected routes
   - Use [NextAuth.js](https://next-auth.js.org/ "Priority: CRITICAL - Authentication provider") for authentication

2. **⚙️ MEDIUM: Validation**
   - Validate all inputs on both client and server
   - Use [Zod](https://github.com/colinhacks/zod "Priority: HIGH - Schema validation library") for schema validation

## EXAMPLES

### Component Structure Example

#### ✅ Correct: Single Responsibility Component

```tsx
// ProductCard.tsx - Single responsibility, under 150 lines
import React from 'react';
import { Card, Typography, Button } from '@mui/material';
import { usePrice } from '@/hooks/usePrice';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  onSelect: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  description,
  basePrice,
  imageUrl,
  onSelect
}: ProductCardProps): JSX.Element {
  const { formattedPrice } = usePrice(basePrice);
  
  return (
    <Card className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <div className="product-content">
        <Typography variant="h5">{name}</Typography>
        <Typography variant="body2">{description}</Typography>
        <Typography variant="h6">{formattedPrice}</Typography>
        <Button onClick={() => onSelect(id)}>View Details</Button>
      </div>
    </Card>
  );
}
```

#### ❌ Incorrect: Mixed Concerns in Component

```tsx
// ProductCardBad.tsx - Mixed responsibilities (UI, state, API calls)
import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

interface ProductCardProps {
  productId: string;
}

export function ProductCardBad({ productId }: ProductCardProps): JSX.Element {
  // Mixed responsibility: UI + Data fetching
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inCart, setInCart] = useState(false);
  
  // Data fetching in UI component
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  // Cart state management mixed with UI
  const addToCart = async () => {
    try {
      await axios.post('/api/cart', { productId });
      setInCart(true);
    } catch (err) {
      console.error('Failed to add to cart');
    }
  };
  
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return null;
  
  return (
    <Card className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <div className="product-content">
        <Typography variant="h5">{product.name}</Typography>
        <Typography variant="body2">{product.description}</Typography>
        <Typography variant="h6">${product.price.toFixed(2)}</Typography>
        <Button onClick={addToCart} disabled={inCart}>
          {inCart ? 'In Cart' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  );
}
```

### Next.js App Router Pattern Example

#### ✅ Correct: Server/Client Component Separation

```tsx
// app/products/[id]/page.tsx (Server Component)
import { ProductDetails } from '@/components/products/ProductDetails';
import { getProductById } from '@/lib/products';

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Server-side data fetching
  const product = await getProductById(params.id);
  
  return (
    <main>
      <h1>Product Details</h1>
      <ProductDetails product={product} />
    </main>
  );
}
```

```tsx
// components/products/ProductDetails.tsx (Client Component)
'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  
  // Client-side interactivity
  return (
    <div className="product-details">
      <img src={selectedVariant.imageUrl} alt={product.name} />
      
      <div className="variant-selector">
        {product.variants.map(variant => (
          <button 
            key={variant.id}
            onClick={() => setSelectedVariant(variant)}
            className={selectedVariant.id === variant.id ? 'selected' : ''}
          >
            {variant.name}
          </button>
        ))}
      </div>
      
      <AddToCartButton productId={product.id} variantId={selectedVariant.id} />
    </div>
  );
}
```

### API Design Example

#### ✅ Correct: Well-Structured API Route

```typescript
// app/api/specifications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { specificationSchema } from '@/schemas/specification';

// GET a specific specification
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const specification = await prisma.specification.findUnique({
      where: { id: params.id },
    });
    
    if (!specification) {
      return NextResponse.json(
        { error: 'Specification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(specification);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch specification' },
      { status: 500 }
    );
  }
}

// UPDATE a specification
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validation using Zod
    const validatedData = specificationSchema.parse(body);
    
    const updatedSpecification = await prisma.specification.update({
      where: { id: params.id },
      data: validatedData,
    });
    
    return NextResponse.json(updatedSpecification);
  } catch (error: any) {
    // Type safety for errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Specification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update specification', details: error.message },
      { status: 400 }
    );
  }
}
```

### Error Handling Example

#### ✅ Correct: Explicit Error Handling

```tsx
import { useState } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Alert, Button } from '@mui/material';

export function SpecificationForm({ onSubmit }) {
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleSubmit = async (data) => {
    try {
      setFormError(null);
      await onSubmit(data);
    } catch (error) {
      // Explicit error surfacing, no fallbacks
      setFormError(error.message || 'Failed to submit specification');
      // Re-throw to propagate to error boundary if needed
      throw error;
    }
  };
  
  return (
    <ErrorBoundary
      fallback={({error, resetError}) => (
        <div className="error-container">
          <Alert severity="error">
            Critical error: {error.message}
          </Alert>
          <Button onClick={resetError}>Try Again</Button>
        </div>
      )}
    >
      {formError && (
        <Alert severity="error" onClose={() => setFormError(null)}>
          {formError}
        </Alert>
      )}
      
      {/* Form elements */}
    </ErrorBoundary>
  );
}
```

## 📋 References & Tools

- **Documentation**: [Next.js App Router](https://nextjs.org/docs/app)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Form Validation**: [Zod](https://github.com/colinhacks/zod)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
