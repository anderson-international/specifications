# Business Context & Requirements

## Overview
This document defines the business context, problem statement, and core requirements for the Specification Builder application.

## Business Context

### Current Situation
- **Business**: Online snuff retailer
- **Problem**: Lack of reliable product information
- **Solution**: Structured review system with 20 trusted reviewers
- **Current Process**: Using JotForm for specification collection
- **Migration**: Data normalized and migrated from JotForm to NeonDB
- **Scale**: ~1,200 specifications collected, ~600 products in Shopify store

### Ultimate Goal
Building a comprehensive dataset for AI/LLM training with multiple perspectives on each product. Eventually opening to public reviewers for "wisdom of crowds" data.

## User Types and Access

### Phase 1 (MVP)

#### 1. Reviewers (~20 users)
- Create and edit their own specifications
- View (but not edit) other reviewers' specifications
- Each reviewer expected to eventually review all 600 products
- Save specifications as drafts before publishing

#### 2. Admin (store owner)
- **Full CRUD access to all primary tables:**
  - specifications: All specification management
  - users: Complete user management
  - All enum tables: Manage values for all 11 enum tables
- **Workflow management:** Change specification status and approve/request revisions
- **System configuration:** Modify system settings and integrations
- **Data management:** Export data and generate reports
- Manually trigger product data refresh from Shopify

### Phase 2 (Future)

#### 3. Public Reviewers
- Only see and edit their own specifications
- Provides additional data volume (less trusted but valuable)

## Core Workflow

### Current Review Process
1. Reviewer selects snuffs to review
2. Submits "snuff request" via Slack
3. Products physically shipped
4. Reviewer selects product from dropdown
5. Creates specification in JotForm

### Problems to Solve
- Hard to track which products have been reviewed
- Popular products become over-represented
- Manual process is inefficient

### New App Workflow

#### 1. Product Discovery
- Visual indicators for reviewed vs. unreviewed products
- Product cards with filters and search
- Product images on cards only
- Database-driven product sync

#### 2. Specification Creation
- Multi-step wizard form replacing JotForm
- Organized fields with logical steps
- Draft saving with status workflow
- Form validation with clear feedback

#### 3. Specification Management
- View lists by status (Draft, Published, Needs Revision, Under Review)
- Edit drafts and view published specifications
- Filter by product attributes

## Authentication Strategy
- **Production**: Magic link email authentication
- **Development**: User selection dropdown for testing
- Role-based access control (Admin vs Reviewer)
