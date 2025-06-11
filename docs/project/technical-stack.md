# Technical Stack Decisions

## Frontend Framework

### Next.js
- **Decision**: Next.js
- **Rationale**: 
  - React-based with strong ecosystem
  - Excellent mobile performance
  - Server-side rendering for fast initial loads
  - Built-in API routes
  - Image optimization for product images

## CSS/Styling Approach

### CSS Modules
- **Decision**: CSS Modules
- **Rationale**:
  - Simplicity - plain CSS, no new syntax
  - Zero runtime overhead (small file sizes)
  - Clear separation of concerns
  - Built into Next.js (no dependencies)
  - Automatic style scoping
- **Implementation**:
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
