---
complianceLevel: critical
status: active
tags: [technical-stack, nextjs, prisma, css-modules, deployment, architecture]
id: culNx_Ga
---

# Technical Stack Decisions

<!-- AI_QUICK_REF
Overview: This document establishes the technical stack decisions for the Specification Builder project with these key components
Key Rules: Next.js App Router architecture (line 8), CSS Modules mobile-first (line 49), Prisma type-safe patterns (line 62)
Avoid: Mixing App/Pages Router, Using client when server suffices, Ignoring mobile-first strategy
-->

> **📋 For comprehensive UI/UX strategy and styling philosophy, see [Design Patterns Ui Ux](../guides/design-patterns-ui-ux.md).**

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
  - **App Router**: File-system based routing with `app/` directory
  - **Server Components**: Default rendering mode
  - **Client Components**: Explicit `'use client'` directive
  - **Server Actions**: Built-in form handling with `'use server'`

- **Component Boundary Strategy:**
```typescript
// Server Component (default)
export default async function ProductsPage(): Promise<JSX.Element> {
  const products = await prisma.product.findMany();
  return <ProductList products={products} />;
}

// Client Component
'use client';
export default function ProductFilters(): JSX.Element {
  const [search, setSearch] = useState('');
  // Browser APIs and event handlers
}
```

- **File Structure:**
```
app/
├── layout.tsx      # Root layout
├── page.tsx        # Home page
├── products/
│   ├── layout.tsx  # Products layout  
│   └── page.tsx    # Products listing
└── create-specification/
    └── page.tsx    # Form wizard
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
  - Mobile-first responsive design

## Database ORM

### Prisma
- **Decision**: Prisma
- **Rationale**:
  - Type-safe database access
  - Auto-generated types from schema
  - Excellent developer experience
  - Powerful migration system

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
  - Draft saving via status field

## API Design

### RESTful with Next.js App Router
- **Pattern**: RESTful endpoints with Next.js App Router
- **Key Routes**:
  - `/api/specifications` - Specification management
  - `/api/enum/[table]` - Enum table operations
  - `/api/auth/*` - Authentication endpoints
  - `/api/admin/refresh-products` - Product refresh trigger

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
- **Implementation**: For technical implementation details, see the [Technical Stack](technical-stack.md) document

## Deployment

### Netlify
- **Platform**: Netlify via Windsurf IDE integration
- **Configuration**: netlify.toml with environment variables
- **Benefits**: Seamless deployment, preview environments, excellent Next.js support
