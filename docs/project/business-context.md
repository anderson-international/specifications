---
title: Business Context & Requirements
description: Business problem statement, user types, and core workflow requirements
version: 1.0.0
status: active
lastUpdated: 2025-06-17
author: Development Team
complianceLevel: critical
readingTime: 6 minutes
tags: [business-context, requirements, user-types, workflow, authentication]
---

# Business Context & Requirements

<!-- AI_NAVIGATION
Reading Priority: 1 (Critical - Essential business context for all development)
Primary Focus: Business problem definition, user role requirements, and core workflow specifications for specification builder application
Key Compliance Points:
- User role definitions and access levels (line 20-35)
- Authentication strategy requirements (line 77-82)
- Core workflow specifications (line 45-75)
- Scale and migration context (line 13-16)
Critical Cross-references:
- Feature Requirements (feature-requirements.md): Detailed feature specifications and acceptance criteria
- Authentication (../concerns/authentication.md): Authentication implementation strategy and patterns
- UI/UX Design (ui-ux-design.md): User interface requirements and design decisions
- Technical Stack (technical-stack.md): Technology choices supporting business requirements
Anti-patterns:
- Ignoring user role access level requirements
- Misunderstanding the reviewer vs admin distinction
- Overlooking the JotForm migration context
- Missing the scale requirements (20 reviewers, 600 products, 1200+ specifications)
Additional Context: This document establishes the foundational business requirements that drive all technical decisions and feature prioritization
-->

<!-- AI_SUMMARY
This document establishes the foundational business context for the Specification Builder application with these key components:

• Business Problem - Online snuff retailer needs reliable product information system to replace inefficient JotForm process with 20 trusted reviewers
• User Role Definitions - Phase 1 MVP supports Reviewers (create/edit own specs, view others) and Admin (full CRUD access, workflow management, system configuration)
• Current Scale Context - 1,200+ specifications migrated from JotForm, ~600 products in Shopify store, targeting comprehensive coverage by 20 reviewers
• Core Workflow Requirements - Product discovery with visual indicators, multi-step specification wizard, draft/publish workflow, and database-driven sync
• Authentication Strategy - Magic link email authentication for production, user selection dropdown for development, with role-based access control
• Future Vision - AI/LLM training dataset with eventual public reviewer expansion for "wisdom of crowds" data collection

This document serves as the single source of truth for business requirements that drive all technical implementation decisions.
-->

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
