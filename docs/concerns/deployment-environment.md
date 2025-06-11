# Deployment & Environment Documentation

*Centralized deployment strategy and environment configuration for the Specification Builder project.*

## Overview

This document provides strategic guidance for deployment and environment decisions. Focus is on simplicity and reliability for a solo hobbyist project with streamlined deployment workflows.

## Deployment Strategy

**Core Approach**: Platform-as-a-Service deployment with minimal configuration and automated deployment pipelines.

### Platform Philosophy
- **PaaS Integration**: Leverage platform services for simplified deployment
- **Git-Based Deployment**: Automatic deployment from version control
- **Environment Parity**: Consistent configuration across development and production
- **Minimal Infrastructure**: Avoid complex server management and orchestration

### Deployment Workflow
- **Continuous Deployment**: Automatic deployment from main branch
- **Preview Environments**: Staging deployments for feature branches
- **Rollback Capability**: Simple rollback to previous working versions
- **Zero-Downtime**: Seamless deployments without service interruption

## Environment Configuration

**Philosophy**: Environment-specific configuration with secure credential management and clear separation between environments.

### Configuration Management
- **Environment Variables**: All environment-specific values in environment variables
- **Secure Secrets**: Sensitive data encrypted and managed by platform
- **Default Values**: Sensible defaults for development environment
- **Configuration Validation**: Verify required configuration at startup

### Environment Separation
- **Development**: Local development with test data and debug features
- **Production**: Live environment with production data and security
- **Clear Boundaries**: Distinct configuration and data isolation
- **Environment Detection**: Runtime detection of current environment

## Infrastructure Strategy

### Database Hosting
- **Managed Database**: Platform-managed database service
- **Connection Pooling**: Efficient database connection management
- **Backup Strategy**: Automated backups and point-in-time recovery
- **Scaling Approach**: Simple vertical scaling for growing data needs

### Static Asset Management
- **CDN Integration**: Content delivery network for static assets
- **Image Optimization**: Automatic image compression and format conversion
- **Caching Strategy**: Appropriate caching headers for static content
- **Build Optimization**: Minification and bundling for production builds

## Development Environment

### Local Setup
- **Simple Installation**: Minimal setup requirements for new development
- **Environment Isolation**: Local development independent of production
- **Database Access**: Local database or development database connection
- **Hot Reload**: Fast development feedback with live code reloading

### Development Tools
- **Code Quality**: Linting and formatting integrated into development workflow
- **Environment Validation**: Verify development environment configuration
- **Local Testing**: Run tests locally before deployment
- **Debug Support**: Development-only debugging and profiling tools

## Development Environment Setup

### Local Development Configuration

#### Required Environment Variables
```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/specifications_dev"
DIRECT_URL="postgresql://username:password@localhost:5432/specifications_dev"

# Authentication (Development)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-dev-secret-key"

# Email Provider (Production)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@domain.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# Shopify Integration
SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
SHOPIFY_ADMIN_ACCESS_TOKEN="your-admin-access-token"
SHOPIFY_WEBHOOK_SECRET="your-webhook-secret"

# Netlify Deployment
NETLIFY_AUTH_TOKEN="your-netlify-token"
NETLIFY_SITE_ID="your-site-id"
```

#### Database Connection Setup
- **Development**: Direct connection to NeonDB development database
- **Production**: Connection pooling via NeonDB serverless adapter
- **Testing**: Separate test database instance or local PostgreSQL
- **Schema Management**: Prisma migrations for schema changes

#### API Credentials Management
- **Shopify API**: Admin API access token with read permissions for products
- **Email Service**: SMTP credentials for magic link authentication
- **Third-party Services**: Rate limiting and error handling for external APIs

#### Local Development Tools
- **Node.js**: Version 18.17+ (LTS recommended)
- **Package Manager**: npm or yarn (consistent across team)
- **Database Client**: Prisma Studio for database inspection
- **API Testing**: Thunder Client or Postman for endpoint testing

### Development Workflow Integration
- **Environment Switching**: Clear separation between dev/staging/production
- **Secret Management**: Use .env.local for local secrets, never commit
- **Database Migrations**: Test migrations locally before production deployment
- **API Integration Testing**: Mock Shopify API responses for development

## Security Considerations

### Environment Security
- **Credential Management**: Secure storage and rotation of API keys and secrets
- **Network Security**: Appropriate network restrictions and HTTPS enforcement
- **Access Control**: Limited access to production environment and data
- **Audit Logging**: Basic logging for security-relevant environment access

### Deployment Security
- **Secure Deployment**: Encrypted deployment pipelines and artifact storage
- **Environment Isolation**: Production environment isolated from development
- **Dependency Management**: Regular security updates for dependencies
- **Minimal Permissions**: Least-privilege access for deployment and runtime

## Monitoring and Maintenance

### Basic Monitoring
- **Health Checks**: Simple application health monitoring
- **Error Tracking**: Capture and alert on application errors
- **Performance Monitoring**: Basic performance metrics and alerting
- **Uptime Monitoring**: External monitoring for service availability

### Maintenance Workflow
- **Regular Updates**: Schedule for dependency and security updates
- **Backup Verification**: Regular testing of backup and recovery procedures
- **Performance Review**: Periodic review of application performance
- **Capacity Planning**: Monitor usage patterns for scaling decisions

---

*This document focuses on strategic deployment and environment guidance. Implementation details should reference current platform documentation and deployment configurations.*
