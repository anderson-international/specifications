# Business Context & Requirements

## Overview
This document defines the business context, problem statement, and core requirements for the Specification Builder application. It represents the foundational understanding of why this project exists and what business needs it addresses.

## Business Context

### Current Situation
- **Business**: Online snuff retailer
- **Problem**: Lack of reliable product information
- **Solution**: Structured review system with 20 trusted reviewers (experts + newbies)
- **Current Process**: Using JotForm for specification collection
- **Migration**: Recently normalized and migrated data from JotForm to NeonDB using jotform-sync app
- **Scale**: ~1,200 specifications collected, ~600 products in Shopify store

### Ultimate Goal
Building a comprehensive dataset for AI/LLM training with multiple perspectives on each product. Eventually opening to public reviewers for "wisdom of crowds" data.

## User Types and Access

### Phase 1 (MVP)

#### 1. Reviewers (~20 users)
- Can create and edit their own specifications
- Can view (but not edit) other reviewers' specifications
- Each reviewer expected to eventually review all 600 products
- Can save specifications as drafts before publishing

#### 2. Admin (store owner)
- **Full CRUD access to all primary tables:**
  - specifications: Can create, read, update, and delete any specification regardless of author
  - users: Complete user management (create, update, delete reviewer accounts)
  - All enum tables: Can manage values for all 11 enum tables (product types, grinds, nicotine levels, etc.)
- **Workflow management:**
  - Can change specification status (draft, published, needs_revision, under_review)
  - Can approve or request revisions for specifications
- **System configuration:** Can modify system settings and integrations
- **Data management:** Export data and generate reports
- Can manually trigger product data refresh from Shopify

### Phase 2 (Future)

#### 3. Public Reviewers
- Can only see and edit their own specifications
- Provides additional data volume (less trusted but valuable)

## Core Workflow

### Current Review Process
1. Reviewer decides which snuffs to review next
2. Submits "snuff request" to Slack #snuff-requests channel  
3. Request processed and products physically shipped
4. Upon receipt, reviewer selects product from dropdown
5. Creates specification in JotForm

### Problems to Solve
- Hard to track which of 600 products have been reviewed
- Popular products become over-represented
- Manual process is inefficient

### New App Workflow

#### 1. Product Discovery
- Clear visual indicator showing which products have already been reviewed vs. those awaiting review
- Products displayed as cards with filters by brand and type-ahead search box
- Product images displayed only on product cards
- Products managed via database-driven sync strategy

#### 2. Specification Creation
- Direct entry in app (replacing JotForm) using multi-step wizard form
- Rich form with all specification fields organized in logical steps
- Draft saving capability using status workflow
- Form validation with clear feedback

#### 3. Specification Management
- View lists grouped by status (Draft, Published, Needs Revision, Under Review)
- Edit draft specifications
- View read-only published specifications
- Filter by product attributes

## Authentication Strategy
- **Production**: Magic link email authentication (no password storage)
- **Development**: User selection dropdown for testing
- Role-based access control (Admin vs Reviewer)
