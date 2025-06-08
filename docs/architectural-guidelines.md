# Architectural Guidelines

This document outlines the architectural principles and patterns for the specifications project - a snuff specification builder and CRUD admin application built with Next.js.

## Table of Contents

1. [Core Architectural Principles](#core-architectural-principles)
2. [Component Hierarchy & Organization](#component-hierarchy--organization)
3. [API Design Principles](#api-design-principles)
4. [Data Modeling Conventions](#data-modeling-conventions)
5. [Error Handling Patterns](#error-handling-patterns)
6. [Performance Optimization](#performance-optimization)

## Core Architectural Principles

The architecture follows these guiding principles aligned with our solo development workflow:

1. **Simplicity First**: Choose the simplest possible solution that meets requirements
2. **Minimize Dependencies**: Avoid unnecessary libraries or abstractions
3. **Small, Focused Files**: Keep components and modules compact and single-purpose
4. **Pragmatic Patterns**: Use established patterns where they add value, avoid overengineering
5. **Progressive Enhancement**: Start simple, enhance as needed, refactor when beneficial

## Component Hierarchy & Organization

### Component Structure

- Use functional components with hooks exclusively (no class components)
- Keep components small and focused on a single responsibility
- Limit component files to 150 lines maximum

### Component Organization

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

### Component Composition Patterns

1. **Container/Presentation Pattern**

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

### State Management

- Use React's built-in `useState` for component-local state
- Use `useReducer` for more complex component state
- Use Context API sparingly for truly global state (e.g., auth, theme)
- Avoid external state management libraries unless absolutely necessary

Example Context usage:

```javascript
// contexts/AuthContext.js
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // Simple authentication methods
  const login = async (email) => {/* ... */};
  const logout = async () => {/* ... */};
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Form Management

#### Form Implementation Decision Tree

```
Is this a multi-step wizard or complex form?
├── Yes → Use Full React Hook Form with Multi-step Pattern
│         (See Multi-step Wizard Implementation below)
│
└── No → Is validation required beyond simple required fields?
    ├── Yes → Use Standard React Hook Form with Zod
    │         (See Standard Form Implementation below)
    │
    └── No → Use Simplified React Hook Form
            (See Simplified Pattern below)
```

- Use **React Hook Form** for all form handling, especially multi-step forms
- Leverage its built-in validation, performance optimization, and state persistence
- Keep form logic separate from UI components for better testability

Example multi-step form pattern:

```javascript
// hooks/useSpecificationForm.js
import { useForm } from 'react-hook-form';

export const useSpecificationForm = () => {
  const form = useForm({
    defaultValues: {
      product: null,
      characteristics: {},
      sensoryProfile: {},
      rating: null
    },
    mode: 'onChange' // Validate on change for better UX
  });

  const nextStep = async (currentStep) => {
    // Validate current step before proceeding
    const isValid = await form.trigger(getFieldsForStep(currentStep));
    if (!isValid) return false;
    
    return true;
  };

  return { form, nextStep };
};

// components/SpecificationWizard.jsx
const SpecificationWizard = () => {
  const { form, nextStep } = useSpecificationForm();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = async () => {
    if (await nextStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <FormProvider {...form}>
      {currentStep === 0 && <ProductSelectionStep />}
      {currentStep === 1 && <CharacteristicsStep />}
      {currentStep === 2 && <SensoryProfileStep />}
      {currentStep === 3 && <ReviewStep />}
    </FormProvider>
  );
};

## API Design Principles

### API Routes Structure

Use Next.js App Router for backend functionality:

```
/app/api
  /specifications
    route.ts              # GET (list), POST (create)
    [id]/
      route.ts            # GET, PUT, DELETE for a specific specification
  /auth
    login/
      route.ts            # Authentication endpoints
    logout/
      route.ts
  /enum/[table]
    route.ts              # Generic CRUD for enum tables
    [id]/
      route.ts            # Individual enum operations
```

### API Patterns

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

## Data Modeling Conventions

### Data Structure Principles

1. **Flat Data Structures**

   Prefer flat data structures where possible:

   ```javascript
   // Instead of deeply nested objects:
   const specification = {
     id: '123',
     title: 'Sample Spec',
     category: 'tobacco',
     properties: {
       nicotineContent: '5%',
       packagingType: 'can',
     },
     metadata: {
       createdAt: '2025-01-01',
       createdBy: 'user123',
     }
   };
   ```

2. **Type Definitions**

   Use TypeScript or PropTypes for type safety:

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

   For complex data with relationships, normalize in memory:

   ```javascript
   // Normalized data
   const specifications = {
     byId: {
       'spec1': { id: 'spec1', title: 'First Spec', categoryId: 'cat1' },
       'spec2': { id: 'spec2', title: 'Second Spec', categoryId: 'cat2' },
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

### Database Interaction

1. **Use Prisma ORM as Data Access Layer**

   Use Prisma ORM for all database operations to simplify CRUD operations, reduce boilerplate, and provide type safety:

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
   
   Prisma is preferred because it:
   - Simplifies CRUD operations with auto-generated methods
   - Provides full TypeScript support and autocompletion
   - Streamlines schema changes and migrations
   - Reduces boilerplate code and potential SQL errors
   - Offers powerful relation handling with minimal code

2. **Data Validation**

   Use Zod schemas for type-safe validation across client and server:

   ```typescript
   // lib/validations/specification.ts
   import { z } from 'zod';

   export const specificationSchema = z.object({
     shopifyHandle: z.string().min(1),
     productTypeId: z.number().int().positive(),
     isFermented: z.boolean().default(false),
     isOralTobacco: z.boolean().default(false),
     isArtisan: z.boolean().default(false),
     grindId: z.number().int().positive(),
     nicotineLevelId: z.number().int().positive(),
     experienceLevelId: z.number().int().positive(),
     review: z.string().optional(),
     starRating: z.number().int().min(0).max(5).default(0),
     ratingBoost: z.number().int().default(0),
     moistureLevelId: z.number().int().positive(),
     productBrandId: z.number().int().positive(),
     statusId: z.number().int().default(1), // 1 = draft
     
     // Junction table relations (arrays of IDs)
     tastingNoteIds: z.array(z.number().int()).optional(),
     cureIds: z.array(z.number().int()).optional(),
     tobaccoTypeIds: z.array(z.number().int()).optional()
   });

   // Use with React Hook Form
   import { zodResolver } from '@hookform/resolvers/zod';

   const form = useForm({
     resolver: zodResolver(specificationSchema)
   });

   // Reuse on API routes
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

## Error Handling Patterns

### Error Handling Principles

1. **Explicit Error Surfacing**

   Never hide errors or use fallback/substitute data:

   ```javascript
   // DO NOT DO THIS
   async function fetchData() {
     try {
       const result = await api.getData();
       return result;
     } catch (error) {
       console.error(error);
       return []; // Returning empty array hides the error
     }
   }

   // DO THIS INSTEAD
   async function fetchData() {
     try {
       const result = await api.getData();
       return result;
     } catch (error) {
       // Surface the error immediately
       throw new Error(`Failed to fetch data: ${error.message}`);
     }
   }
   ```

2. **Error Boundaries**

   Use React Error Boundaries for UI error handling:

   ```javascript
   // components/ErrorBoundary.jsx
   import { Component } from 'react';

   class ErrorBoundary extends Component {
     state = { hasError: false, error: null };
     
     static getDerivedStateFromError(error) {
       return { hasError: true, error };
     }
     
     render() {
       if (this.state.hasError) {
         return (
           <div className="error-container">
             <h2>Something went wrong</h2>
             <details>
               <summary>Error details</summary>
               {this.state.error.toString()}
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

3. **API Error Handling**

   Standardize API error handling:

   ```javascript
   // pages/api/specifications/[id].js
   export async function handler(req, res) {
     const { id } = req.query;
     
     try {
       const specification = await getSpecificationById(id);
       
       if (!specification) {
         return res.status(404).json({
           error: {
             message: `Specification with ID ${id} not found`,
             code: 'SPECIFICATION_NOT_FOUND'
           }
         });
       }
       
       return res.status(200).json({ data: specification });
     } catch (error) {
       // Log error for server-side debugging
       console.error(`Error fetching specification ${id}:`, error);
       
       // Send appropriate response to client
       return res.status(500).json({
         error: {
           message: 'Internal server error occurred',
           code: 'INTERNAL_SERVER_ERROR'
         }
       });
     }
   }
   ```

### Shopify Data Caching

Use Incremental Static Regeneration (ISR) with cache for Shopify product data:

```typescript
// app/api/shopify/products/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Fetch minimal product data from Shopify
    const products = await fetchShopifyProducts({
      fields: ['handle', 'title', 'images', 'vendor'],
      limit: 1000 // Fetch all ~600 products
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Shopify fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// Client-side usage with SWR for additional caching
// components/ProductSelector.tsx
import useSWR from 'swr';
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // API submission logic here
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...register("name")} />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>
      
      <div>
        <label htmlFor="age">Age (Optional)</label>
        <input id="age" type="number" {...register("age", { valueAsNumber: true })} />
        {errors.age && <p className="error">{errors.age.message}</p>}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Simplified Pattern (For Simple Forms)

```tsx
import { useForm } from 'react-hook-form';

type SimpleFormValues = {
  searchQuery: string;
};

export function SimpleSearchForm() {
  const { register, handleSubmit } = useForm<SimpleFormValues>();

  const onSubmit = (data: SimpleFormValues) => {
    console.log(data);
    // Search logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register("searchQuery", { required: true })} 
        placeholder="Search..." 
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

#### Multi-step Wizard Implementation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { z } from 'zod';

// Step 1 Schema
const step1Schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

// Step 2 Schema
const step2Schema = z.object({
  category: z.string().min(1, "Category is required"),
  tags: z.string().array().min(1, "At least one tag is required"),
});

// Combined schema
const formSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
});

type FormValues = z.infer<typeof formSchema>;

// Custom hook for multi-step form
export function useMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      tags: [],
    },
  });
  
  // Get current step schema for validation
  const getCurrentStepSchema = () => {
    return currentStep === 0 ? step1Schema : step2Schema;
  };
  
  // Validate current step fields only
  const validateStep = async () => {
    const currentSchema = getCurrentStepSchema();
    const currentFields = Object.keys(currentSchema.shape);
    
    const result = await form.trigger(currentFields as any);
    return result;
  };
  
  // Go to next step with validation
  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) setCurrentStep(prev => prev + 1);
    return isValid;
  };
  
  // Go to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  
  return {
    currentStep,
    form,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === 1, // Adjust based on total steps
  };
};
```

## Performance Optimization

### Client-Side Optimization

1. **Component Optimization**

   Use React optimization techniques judiciously:

   ```javascript
   // Memoize expensive components
   const MemoizedComponent = React.memo(ExpensiveComponent);
   
   // Memoize expensive calculations
   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
   
   // Memoize callbacks
   const memoizedCallback = useCallback(() => {
     doSomething(a, b);
   }, [a, b]);
   ```

2. **Code Splitting**

   Use Next.js dynamic imports for code splitting:

   ```javascript
   import dynamic from 'next/dynamic';

   // Dynamically import large components
   const DynamicSpecificationEditor = dynamic(
     () => import('../components/SpecificationEditor'),
     { loading: () => <p>Loading editor...</p> }
   );
   ```

3. **Image Optimization**

   Use Next.js Image component:

   ```javascript
   import Image from 'next/image';
   
   function ProductImage({ product }) {
     return (
       <Image
         src={product.imageUrl}
         alt={product.name}
         width={500}
         height={300}
         priority={product.featured}
       />
     );
   }
   ```

### Server-Side Optimization

1. **Static Site Generation (SSG)**

   Use SSG for pages that don't need frequent updates:

   ```javascript
   // pages/specifications/index.js
   export async function getStaticProps() {
     const specifications = await getSpecifications();
     
     return {
       props: { specifications },
       // Revalidate every hour
       revalidate: 3600,
     };
   }
   ```

2. **Server-Side Rendering (SSR)**

   Use SSR for pages that need fresh data:

   ```javascript
   // pages/specifications/[id].js
   export async function getServerSideProps({ params }) {
     try {
       const specification = await getSpecificationById(params.id);
       
       if (!specification) {
         return { notFound: true };
       }
       
       return { props: { specification } };
     } catch (error) {
       return { props: { error: error.message } };
     }
   }
   ```

3. **API Route Optimization**

   Keep API routes lightweight and efficient using Prisma:

   ```javascript
   // Efficient database queries with Prisma
   async function getFilteredSpecifications(filters) {
     // Use Prisma's query capabilities for efficient filtering
     return prisma.specification.findMany({
       where: {
         category: filters.category,
         createdAt: { gt: filters.startDate }
       },
       take: filters.limit,
       skip: filters.offset,
       orderBy: { createdAt: 'desc' }
     });
   }
   ```

4. **Database Query Optimization with Prisma**

   Use Prisma's features for efficient database access:
   
   - Use Prisma's `select` to retrieve only needed fields: `prisma.specification.findMany({ select: { id: true, title: true } })`
   - Implement pagination with `skip` and `take`: `prisma.specification.findMany({ skip: 10, take: 20 })`
   - Use appropriate indexes in your Prisma schema for frequently queried fields
   - Optimize relation fetching with `include` for needed relations only
   - Consider using Prisma's transaction API for operations that need to be atomic

Remember, these architectural guidelines are focused on simplicity and maintainability for a solo developer while ensuring the application remains scalable and performant.

## Mobile-First Implementation

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

## Deployment Strategy

### Netlify Platform

Deploy the application to Netlify:

```javascript
// netlify.toml
[build]
  command = "npm run build"
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
  command = "npm run dev"
  port = 3000
  publish = ".next"
```

### Deployment Workflow

Use Windsurf's native Netlify integration for IDE-based deployments:

1. **Development**: Local development with `npm run dev`
2. **Preview**: One-click Netlify deployments directly from Windsurf IDE
3. **Production**: Automatic deploys from main branch

### Environment Configuration

Store sensitive credentials in Netlify environment variables:

- Database credentials
- Auth secrets
- Shopify API keys
- Email service credentials

Remember, these are never committed to the repository, always use `.env.example` as a template.
