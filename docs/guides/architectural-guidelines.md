# Architectural Guidelines

*Comprehensive patterns for scalable component architecture and system design.*

<!-- AI_NAVIGATION
Primary Focus: Component hierarchy, API design principles, Next.js App Router patterns
Key Compliance Points:
- Single responsibility principle (line 27-33)
- Composition over inheritance (line 29)
- Component organization patterns (line 42-68)
- API design principles (line 70-85)
- Next.js 15 App Router structure (line 156-185)
Critical for: Project structure, component design, API architecture
Cross-references: best-practices.md (file limits), api-design.md (API patterns), ui-ux-patterns.md (components)
Decision Framework: When to create new components vs extend existing
-->

> **📋 Quick Navigation:**
> - **Development Standards**: [Best Practices](best-practices.md) | [Code Quality Standards](code-quality-standards.md)
> - **React Implementation**: [React Development Patterns](react-patterns.md) | [Database-Form Integration](database-form-integration.md)
> - **UI/UX Design**: [UI/UX Design Decisions](../project/ui-ux-design.md) | [Component Patterns](../concerns/ui-ux-patterns.md)
> - **Technical Strategy**: [Form Management](../concerns/form-management.md) | [Authentication](../concerns/authentication.md)
> - **Project Context**: [Technical Stack](../project/technical-stack.md) | [Feature Requirements](../project/feature-requirements.md)

This document outlines the architectural principles and patterns for the specifications project - a snuff specification builder and CRUD admin application built with Next.js.

## Table of Contents

1. [Core Architectural Principles](#core-architectural-principles)
2. [Component Hierarchy & Organization](#component-hierarchy--organization)
3. [API Design Principles](#api-design-principles)
4. [Data Modeling Conventions](#data-modeling-conventions)
5. [Error Handling Patterns](#error-handling-patterns)
6. [Performance Optimization](#performance-optimization)
7. [Next.js 15 App Router Patterns](#nextjs-15-app-router-patterns)

## ⚠️ **CRITICAL**: Core Architectural Principles

The architecture follows these guiding principles aligned with our solo development workflow:

1. **⚠️ CRITICAL: Simplicity First**: Choose the simplest possible solution that meets requirements
2. **🔥 HIGH: Minimize Dependencies**: Avoid unnecessary libraries or abstractions
3. **⚠️ CRITICAL: Small, Focused Files**: Keep components and modules compact and single-purpose
4. **⚙️ MEDIUM: Pragmatic Patterns**: Use established patterns where they add value, avoid overengineering
5. **✨ ENHANCE: Progressive Enhancement**: Start simple, enhance as needed, refactor when beneficial

## 🔥 **HIGH**: Component Hierarchy & Organization

### ⚠️ **CRITICAL**: Component Structure

- **⚠️ CRITICAL**: Use functional components with hooks exclusively (no class components)
- **⚠️ CRITICAL**: Keep components small and focused on a single responsibility
- **⚠️ CRITICAL**: Limit component files to **150 lines maximum**

### ⚙️ **MEDIUM**: Component Organization

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

### 🔥 **HIGH**: Component Composition Patterns

1. **🔥 **HIGH**: Container/Presentation Pattern**

   Separate data fetching from presentation:

   ```javascript
   // Container component
   const SpecificationListContainer = () => {
     const [specifications, setSpecifications] = useState([]);
     
     useEffect(() => {
       const fetchData = async () => {
         const data = await fetchSpecifications();
         setSpecifications(data);
       };
       fetchData();
     }, []);
     
     return <SpecificationList specifications={specifications} />;
   };

   // Presentation component
   const SpecificationList = ({ specifications }) => (
     <div>
       {specifications.map(spec => (
         <SpecificationItem key={spec.id} specification={spec} />
       ))}
     </div>
   );
   ```

2. **⚙️ **MEDIUM**: Composition Over Inheritance**

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

### 🔥 **HIGH**: State Management

- **🔥 HIGH**: Use React's built-in `useState` for component-local state
- **🔥 HIGH**: Use `useReducer` for more complex component state
- **⚠️ CRITICAL**: Use Context API sparingly for truly global state (e.g., auth, theme)
- **🔥 HIGH**: Avoid external state management libraries unless absolutely necessary

Example Context usage:

```javascript
// ⚠️ **CRITICAL**: contexts/AuthContext.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Auth logic here
  
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## 🔥 **HIGH**: API Design Principles

For complete API design patterns, see [API Design Documentation](../concerns/api-design.md), which covers:

- RESTful endpoint patterns and URL structures
- Error handling and response format standards
- External API integration (Shopify GraphQL)
- Validation strategies and performance guidelines

### ⚠️ **CRITICAL**: API Routes Structure

Use Next.js App Router for backend functionality:

```
/app/api
  /specifications
    route.ts              # GET (list), POST (create)
    [id]/
      route.ts            # GET, PUT, DELETE for a specific specification
  /auth
    login/
      route.ts            # POST for authentication
  /admin
    refresh-products/
      route.ts            # POST for manual Shopify sync
```

### 🔥 **HIGH**: Data Modeling Conventions

1. **⚠️ **CRITICAL**: Type Safety**

   Define TypeScript interfaces for all data models:

   ```typescript
   // ⚠️ **CRITICAL**: TypeScript example
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

2. **⚙️ **MEDIUM**: Consistent Naming**

   - Use camelCase for JavaScript/TypeScript
   - Use snake_case for database columns
   - Use PascalCase for TypeScript interfaces and React components

3. **⚙️ **MEDIUM**: Normalization**

   For complex data with relationships, normalize in memory:

   ```javascript
   // Normalized data
   const specifications = {
     byId: {
       'spec1': { id: 'spec1', title: 'First Spec', categoryId: 'cat1' },
       'spec2': { id: 'spec2', title: 'Second Spec', categoryId: 'cat2' }
     },
     allIds: ['spec1', 'spec2']
   };
   
   const categories = {
     byId: {
       'cat1': { id: 'cat1', name: 'Category 1' },
       'cat2': { id: 'cat2', name: 'Category 2' },
     },
     allIds: ['cat1', 'cat2']
   };
   ```

### ⚠️ **CRITICAL**: Database Interaction

1. **⚠️ **CRITICAL**: Use Prisma ORM as Data Access Layer**

   Use Prisma ORM for all database operations to simplify CRUD operations, reduce boilerplate, and provide type safety:

   ```javascript
   // lib/db.js
   import { PrismaClient } from '@prisma/client';
   
   const globalForPrisma = globalThis;
   
   export const prisma = globalForPrisma.prisma || new PrismaClient();
   
   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
   ```

   Benefits of using Prisma:
   - Provides full TypeScript support and autocompletion
   - Streamlines schema changes and migrations
   - Reduces boilerplate code and potential SQL errors
   - Offers powerful relation handling with minimal code

2. **⚠️ **CRITICAL**: Data Validation**

   Use Zod schemas for type-safe validation across client and server:

   ```typescript
   // ⚠️ **CRITICAL**: lib/validations/specification.ts
   import { z } from 'zod';

   export const specificationSchema = z.object({
     shopifyHandle: z.string().min(1),
     productTypeId: z.number(),
     experienceLevelId: z.number(),
     grindId: z.number(),
     nicotineLevelId: z.number(),
     moistureLevelId: z.number(),
     productBrandId: z.number(),
     isFermented: z.boolean().default(false),
     isOralTobacco: z.boolean().default(false),
     isArtisan: z.boolean().default(false),
     review: z.string().optional(),
     starRating: z.number().min(0).max(5).default(0),
     ratingBoost: z.number().min(0).max(5).default(0)
   });

   // ⚠️ **CRITICAL**: Use with React Hook Form
   import { zodResolver } from '@hookform/resolvers/zod';

   const form = useForm({
     resolver: zodResolver(specificationSchema)
   });

   // ⚠️ **CRITICAL**: Reuse on API routes
   export async function POST(request: Request) {
     const body = await request.json();
     
     try {
       const validated = specificationSchema.parse(body);
       // Process validated data
     } catch (error) {
       if (error instanceof z.ZodError) {
         return NextResponse.json(
           { error: error.errors },
           { status: 400 }
         );
       }
     }
   }
   ```

## ⚠️ **CRITICAL**: Error Handling Patterns

### ⚠️ **CRITICAL**: Error Handling Principles

1. **⚠️ **CRITICAL**: Explicit Error Surfacing**

   Never hide errors or use fallback/substitute data:

   ```javascript
   // ❌ **BLOCKS DEPLOYMENT**: DO NOT DO THIS
   async function fetchData() {
     try {
       const result = await api.getData();
       return result;
     } catch (error) {
       return []; // WRONG: Hiding the error with empty fallback
     }
   }

   // ✅ **REQUIRED**: DO THIS
   async function fetchData() {
     try {
       const result = await api.getData();
       return result;
     } catch (error) {
       // ⚠️ **CRITICAL**: Surface the error immediately
       throw new Error(`Failed to fetch data: ${error.message}`);
     }
   }
   ```

2. **🔥 **HIGH**: Error Boundaries**

   Use React Error Boundaries for UI error handling:

   ```javascript
   // ⚠️ **CRITICAL**: components/ErrorBoundary.jsx
   import { Component } from 'react';

   class ErrorBoundary extends Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false, error: null };
     }

     static getDerivedStateFromError(error) {
       return { hasError: true, error };
     }

     render() {
       if (this.state.hasError) {
         return (
           <div className="error-boundary">
             <h2>Something went wrong</h2>
             <details>
               <summary>Error details</summary>
               <pre>{this.state.error?.message}</pre>
             </details>
             <button onClick={() => window.location.reload()}>
               Reload page
             </button>
           </div>
         );
       }
       
       return this.props.children;
     }
   }
   
   export default ErrorBoundary;
   ```

3. **🔥 **HIGH**: API Error Handling**

   Implement comprehensive error resilience combining thoughtful retry mechanisms with fail-fast principles:

   ```javascript
   // pages/api/specifications/[id].js
   export async function handler(req, res) {
     const { id } = req.query;
     
     try {
       const specification = await prisma.specification.findUnique({
         where: { id: parseInt(id) }
       });
       
       if (!specification) {
         // FAIL-FAST: Client error (404) - no retry needed
         return res.status(404).json({ 
           error: 'Specification not found',
           code: 'SPEC_NOT_FOUND',
           retryable: false,
           timestamp: new Date().toISOString()
         });
       }
       
       res.status(200).json(specification);
     } catch (error) {
       console.error('Database error:', error);
       
       // RETRY WITH BACKOFF: Server error (500) - retryable
       res.status(500).json({ 
         error: 'Internal server error',
         code: 'INTERNAL_ERROR',
         retryable: true,
         retryAfter: 2, // seconds
         timestamp: new Date().toISOString()
       });
     }
   }
   ```

   **Key Principles:**
   - **Client Errors (4xx)**: Fail-fast, immediate response, no retries
   - **Server Errors (5xx)**: Retry with exponential backoff and circuit breaker
   - **Rate Limiting (429)**: Retry with respect for retry-after headers
   - **Consistent Response Format**: Include retryable flag and timestamp
   - **Idempotency**: Ensure safe retry operations

For comprehensive error handling and external API integration patterns, see [API Design Documentation](../concerns/api-design.md), which covers:

- Shopify GraphQL API error handling and retry logic
- Rate limiting strategies and error response patterns
- Stored procedure implementation and scheduling
- Admin API endpoints and application integration
- Development strategy and error handling approach

## 🔥 **HIGH**: Performance Optimization

### ⚙️ **MEDIUM**: Client-Side Optimization

{{ ... }}

## ⚠️ **CRITICAL**: Next.js 15 App Router Patterns

### ⚠️ **CRITICAL**: App Router Architecture

Follow Next.js 15 App Router conventions:

**⚠️ **CRITICAL**: Directory Structure:**
- **⚠️ CRITICAL: Components**: React components (Server by default, Client when marked)
- **🔥 HIGH: Pages**: Route endpoints (can be Server or Client components)
- **⚙️ MEDIUM: Loading/Error**: Special files for loading states and error boundaries
- **⚙️ MEDIUM: Metadata**: Export metadata objects for SEO optimization

### 🔥 **HIGH**: Performance Optimization

**⚠️ **CRITICAL**: Server-First Approach:**
1. **⚠️ CRITICAL**: Start with Server Components by default
2. **🔥 HIGH**: Move to Client Components only when interactivity is needed
3. **🔥 HIGH**: Keep Client Components as small and focused as possible
4. **🔥 HIGH**: Use Server Components for data fetching and static content

**🔥 **HIGH**: Component Composition:**
```typescript
// ✅ **PREFERRED**: Server Component wraps Client Component
export default function ProductPage() {
  const product = await getProduct(); // Server-side data fetching
  return (
    <div>
      <ProductDetails product={product} /> {/* Server Component */}
      <InteractiveForm productId={product.id} /> {/* Client Component */}
    </div>
  );
}
```

## ⚙️ **MEDIUM**: Mobile-First Implementation

### Core Mobile Design Principles

1. **Touch-Optimized UI**
   - Use minimum tap target size of 44×44px
   - Implement swipe gestures for wizard navigation
   - Avoid hover-dependent interactions
   - Use bottom navigation for primary actions

2. **Responsive Layout Strategy**
   
   ```css
   /* Base mobile styles (up to 640px) */
   .container {
     padding: 1rem;
   }
   
   /* Small tablets (641px to 768px) */
   @media (min-width: 641px) {
     .container {
       padding: 1.5rem;
     }
   }
   
   /* Desktop (769px and above) */
   @media (min-width: 769px) {
     .container {
       padding: 2rem;
       max-width: 1200px;
       margin: 0 auto;
     }
   }
   ```

3. **Touch-First Form Components**

   ```tsx
   // components/TouchSelect.tsx
   import { Listbox } from '@headlessui/react'
   
   export function TouchSelect({ options, value, onChange }) {
     return (
       <Listbox value={value} onChange={onChange}>
         <div className="touch-select">
           <Listbox.Button className="touch-select-button">
             {value?.label || 'Select option...'}
           </Listbox.Button>
           <Listbox.Options className="touch-select-options">
             {options.map((option) => (
               <Listbox.Option
                 key={option.id}
                 value={option}
                 className="touch-select-option"
               >
                 {option.label}
               </Listbox.Option>
             ))}
           </Listbox.Options>
         </div>
       </Listbox>
     );
   }
   ```

4. **Gesture Handling**

   Implement swipe navigation for the form wizard:

   ```tsx
   // hooks/useSwipeNavigation.ts
   import { useSwipeable } from 'react-swipeable';
   
   export function useSwipeNavigation({ onNext, onPrev, validationFn }) {
     const handlers = useSwipeable({
       onSwipedLeft: () => {
         // Validate current step before allowing progression
         if (validationFn && !validationFn()) return;
         onNext();
       },
       onSwipedRight: () => onPrev(),
       preventDefaultTouchmoveEvent: true,
       trackMouse: false
     });
     
     return handlers;
   }
   ```

## ⚙️ **MEDIUM**: Deployment Strategy

### Netlify Platform

Deploy the application to Netlify:

```javascript
// netlify.toml
[build]
  command = "cmd /c npm run build"
  publish = ".next"
  
[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"
  NODE_VERSION = "18"
  
[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
  
[dev]
  command = "cmd /c npm run dev"
  port = 3000
  publish = ".next"
```

### Deployment Workflow

Use Windsurf's native Netlify integration for IDE-based deployments:

1. **Development**: Local development with `cmd /c npm run dev`
2. **Preview**: One-click Netlify deployments directly from Windsurf IDE
3. **Production**: Automatic deploys from main branch

### Environment Configuration

Store sensitive credentials in Netlify environment variables:

- Database credentials
- Auth secrets
- Shopify API keys
- Email service credentials

Remember, these are never committed to the repository, always use `.env.example` as a template.
