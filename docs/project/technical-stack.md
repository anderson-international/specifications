# Technical Stack Decisions

> **📋 For comprehensive UI/UX strategy and styling philosophy, see [UI/UX Design Decisions](ui-ux-design.md).**

## Frontend Framework

### Next.js 15 (App Router)
- **Decision**: Next.js 15 with App Router
- **Rationale**: 
  - React-based with strong ecosystem
  - Excellent mobile performance
  - Server-side rendering for fast initial loads
  - Built-in API routes
  - Image optimization for product images
- **Framework Architecture:**
  - **App Router**: File-system based routing with `app/` directory structure
  - **Server Components**: Default rendering mode for optimal performance
  - **Client Components**: Explicit `'use client'` directive for interactivity
  - **Server Actions**: Built-in form handling with `'use server'` functions

- **Key App Router Benefits:**
  - **Performance**: Server Components reduce client bundle size
  - **SEO**: Server-side rendering improves search engine optimization  
  - **Developer Experience**: Simplified data fetching with async/await
  - **Type Safety**: Full TypeScript integration with route parameters

- **Component Boundary Strategy:**
```typescript
// Server Component (default) - for data fetching and static content
export default async function ProductsPage(): Promise<JSX.Element> {
  const products = await prisma.product.findMany(); // Direct DB access
  return <ProductList products={products} />;
}

// Client Component - for interactivity and state management
'use client';
export default function ProductFilters(): JSX.Element {
  const [search, setSearch] = useState('');
  // Browser APIs and event handlers
}
```

- **File Structure Patterns:**
```
app/
├── layout.tsx          # Root layout (Server Component)
├── page.tsx           # Home page
├── products/
│   ├── layout.tsx     # Products layout  
│   └── page.tsx       # Products listing (Server Component)
└── create-specification/
    └── page.tsx       # Form wizard (Client Component)
```

## CSS/Styling Implementation

### CSS Modules
- **Decision**: CSS Modules
- **Technical Benefits**:
  - Built into Next.js (no dependencies)
  - Automatic style scoping
  - Zero runtime overhead
- **Implementation Details**:
  - Global CSS variables for theme colors
  - Component-specific `.module.css` files
  - Mobile-first responsive design patterns

*For comprehensive styling strategy and design philosophy, see [UI/UX Design Decisions](ui-ux-design.md).*

## Database ORM

### Prisma
- **Decision**: Prisma
- **Rationale**:
  - Type-safe database access
  - Auto-generated types from schema
  - Excellent developer experience
  - Powerful migration system
  - Already established in architectural guidelines

## UI Component Library

### Headless UI + Custom Components
- **Decision**: Headless UI for complex components + custom for simple ones
- **Use Headless UI for**:
  - Combobox (product search with autocomplete)
  - Listbox (dropdowns like brand filter)

## Form State Management

### React Hook Form with Zod
- **Library**: React Hook Form with Zod schemas
- **Implementation**:
  - Multi-step wizard with controlled progression
  - Custom hook for form state across steps
  - Step validation before progression
  - Draft saving capabilities via status field

## API Design

### RESTful with Next.js App Router
- **Pattern**: RESTful endpoints with Next.js App Router
- **Key Routes**:
  - `/api/specifications` - Specification management
  - `/api/enum/[table]` - Enum table CRUD operations
  - `/api/auth/*` - Authentication endpoints
  - `/api/admin/refresh-products` - Manual product refresh trigger

## Data Validation

### Zod Schema Validation
- **Strategy**: Single source of truth with Zod schemas
- **Implementation**:
  - Shared schemas between client and server
  - Type-safe validation with TypeScript
  - Integration with React Hook Form
  - Consistent error messaging

## Product Data Management

### Database-Driven Sync Strategy
- **Approach**: Database-driven with scheduled and manual refresh
- **Implementation**: See [Architectural Guidelines - Database-Driven Product Sync](../guides/architectural-guidelines.md#database-driven-product-sync) for complete implementation details including table structure, sync procedures, and API endpoints

## Deployment

### Netlify
- **Platform**: Netlify via Windsurf IDE integration
- **Configuration**: netlify.toml with environment variables
- **Benefits**: Seamless deployment, preview environments, excellent Next.js support
