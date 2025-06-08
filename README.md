# Specification Builder
A snuff specification builder and CRUD admin

## Getting Started

### Development Environment Setup

#### Prerequisites
- Node.js 18+ (LTS)
- Git
- A code editor (Windsurf IDE recommended for native Netlify integration)

#### Initial Setup

1. **Clone the Repository**
   ```cmd
   git clone <repository-url>
   cd specifications
   ```

2. **Install Dependencies**
   ```cmd
   npm install
   ```

3. **Environment Configuration**
   ```cmd
   copy .env.example .env
   ```
   Edit `.env` with your specific environment values:
   - `DATABASE_URL` - NeonDB connection string for PostgreSQL
   - `SHOPIFY_STORE_URL` - Your Shopify store URL
   - `SHOPIFY_ACCESS_TOKEN` - Shopify Storefront API access token
   - `SHOPIFY_API_VERSION` - Shopify API version to use
   - `SHOPIFY_API_KEY` - Shopify API key
   - `SHOPIFY_API_SECRET_KEY` - Shopify API secret key

4. **Database Setup**
   ```cmd
   :: Generate Prisma client based on schema
   npx prisma generate
   
   :: Apply migrations to your development database
   npx prisma migrate dev
   ```

5. **Start Development Server**
   ```cmd
   npm run dev
   ```
   The application will be available at http://localhost:3000

#### NeonDB Connection

You'll need to create a NeonDB project and obtain a connection string from the NeonDB dashboard. The connection string format is:

```
postgres://user:password@host:port/database
```

Connect to your development branch for local development and the main branch for production deployment.
