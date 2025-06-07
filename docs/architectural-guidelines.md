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

## API Design Principles

### API Routes Structure

Use Next.js API Routes for backend functionality:

```
/pages/api
  /specifications
    index.js         # GET (list), POST (create)
    [id].js          # GET, PUT, DELETE for a specific specification
  /auth
    login.js         # Authentication endpoints
    logout.js
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

   Standardize API responses:

   ```javascript
   // Success response
   {
     data: {...},      // The response data
     meta: {...}       // Optional metadata (pagination, etc.)
   }

   // Error response
   {
     error: {
       message: "Error message",
       code: "ERROR_CODE"
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

   Validate data before saving to the database:

   ```javascript
   function validateSpecification(spec) {
     const errors = {};
     
     if (!spec.title) errors.title = 'Title is required';
     if (spec.title && spec.title.length > 100) errors.title = 'Title too long';
     if (!spec.category) errors.category = 'Category is required';
     
     return Object.keys(errors).length ? { errors } : { isValid: true };
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
   export default async function handler(req, res) {
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

4. **Client-Side Error Handling**

   Manage errors in component data fetching:

   ```javascript
   const SpecificationDetail = ({ id }) => {
     const [specification, setSpecification] = useState(null);
     const [error, setError] = useState(null);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       const fetchData = async () => {
         try {
           setLoading(true);
           setError(null);
           const data = await fetchSpecification(id);
           setSpecification(data);
         } catch (error) {
           setError(error.message);
         } finally {
           setLoading(false);
         }
       };
       
       fetchData();
     }, [id]);
     
     if (loading) return <LoadingSpinner />;
     if (error) return <ErrorDisplay message={error} />;
     if (!specification) return <NotFound />;
     
     return (/* render specification */);
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
