---
title: AI Documentation Index
description: Entry point for AI code review navigation and document prioritization
version: 1.1.0
status: active
lastUpdated: 2025-06-15
author: Development Team
complianceLevel: critical
readingTime: 15 minutes
tags: [ai, documentation, navigation, compliance, review, index]
---

# AI DOCUMENTATION INDEX
*Entry point for AI code review navigation and document prioritization*

<!-- AI_NAVIGATION
Reading Priority: 1 (Critical - First document to read)
Primary Focus: Navigation structure for all AI documentation and review workflows
Key Compliance Points:
- Document prioritization framework (lines 5-33)
- Context-dependent document selection (lines 35-73)
- AI review workflow steps (lines 97-135)
- Terminology standardization (lines 146-152)
Critical Cross-references:
- AI Compliance Matrix (ai-compliance-matrix.md): Master compliance rules document
- AI Coding Handbook (guides/ai-coding-handbook.md): Detailed coding practices
- Document Relationship Graph (document-graph.json): Visual mapping of document relationships
- AI Validation Registry (ai-validation-registry.md): Central validation patterns registry
Anti-patterns:
- Bypassing the document priority order
- Ignoring file type detection workflow
- Missing cross-references between related documents
- Inconsistent terminology usage
Additional Context: This is the central hub for AI navigation through all documentation
Decision Framework: How to determine which documents to reference based on file type and context
-->

<!-- AI_SUMMARY
This document serves as the central navigation hub for AI-based code review with these key elements:

• Document Priority Framework: Stratified system of documentation by importance (CRITICAL, CONTEXT_DEPENDENT, REFERENCE_ONLY)
• Context-Sensitive Navigation: File type detection workflow with specific document loading paths for components, pages, utilities, and API files
• Review Workflow: Three-step process for file analysis (file type detection, priority document loading, violation detection)
• Compliance Checklist: Definitive list of required patterns (file size limits, TypeScript typing, React optimization patterns)
• Terminology Standardization: Consistent naming conventions for technical concepts across all documentation
• Severity Classification: Standardized markers for violation severity and required actions

This index document is the first entry point for all AI interaction with the codebase documentation system and defines the pathways to access all other relevant documents based on context.
-->

## CRITICAL_FOR_CODE_REVIEW (Always check these first)

### 🔥 **Primary Compliance Documents** (Check every review)
1. **[`ai-compliance-matrix.md`](ai-compliance-matrix.md "Priority: CRITICAL - Master compliance rule set")** - Master compliance rules with validation patterns
2. **[`best-practices.md`](guides/best-practices.md "Priority: CRITICAL - File size, code organization")** - File size limits (150/200/100 lines), coding principles
3. **[`code-quality-standards.md`](guides/code-quality-standards.md "Priority: HIGH - ESLint, TypeScript standards")** - ESLint rules, TypeScript requirements
4. **[`react-patterns.md`](guides/react-patterns.md "Priority: HIGH - Hook patterns, performance")** - Performance patterns, hook usage, memo patterns
5. **[`prevent-react-effect-loops.md`](guides/prevent-react-effect-loops.md "Priority: CRITICAL - Infinite loop prevention")** - Critical anti-patterns to avoid

### ⚠️ **Essential Standards** (Check for violations)
6. **[`architectural-guidelines.md`](guides/architectural-guidelines.md "Priority: HIGH - Component architecture")** - Component structure, single responsibility
7. **[`form-management.md`](concerns/form-management.md "Priority: HIGH - Form validation")** - React Hook Form + Zod validation patterns
8. **[`ui-ux-patterns.md`](concerns/ui-ux-patterns.md "Priority: HIGH - CSS & accessibility")** - CSS Modules, accessibility, mobile-first design

## CONTEXT_DEPENDENT (Check based on file type being reviewed)

### For Component Files (.tsx)
**Priority Order:**
1. [`ai-compliance-matrix.md`](ai-compliance-matrix.md "Priority: CRITICAL - Master compliance rules") → File size + TypeScript rules
2. [`react-patterns.md`](guides/react-patterns.md "Priority: HIGH - Optimization patterns") → React.memo, useCallback, useMemo patterns
3. [`ui-ux-patterns.md`](concerns/ui-ux-patterns.md "Priority: HIGH - CSS & accessibility") → CSS Modules, accessibility patterns
4. [`form-management.md`](concerns/form-management.md "Context: Form components only") → If form-related components
5. [`performance-optimization.md`](guides/performance-optimization.md "Priority: MEDIUM - Asset optimization") → Image optimization, lazy loading

**Common Violations:**
- File size > 150 lines
- Missing explicit return types
- Missing React.memo for stable props
- Missing useCallback for event handlers

### For Page Files (page.tsx, layout.tsx)
**Priority Order:**
1. [`ai-compliance-matrix.md`](ai-compliance-matrix.md "Priority: CRITICAL - Master compliance rules") → File size + TypeScript rules
2. [`architectural-guidelines.md`](guides/architectural-guidelines.md "Priority: HIGH - Component organization") → Component hierarchy, organization
3. [`performance-optimization.md`](guides/performance-optimization.md "Priority: HIGH - Bundle optimization") → Image optimization, bundle splitting
4. [`api-design.md`](concerns/api-design.md "Context: Pages with API calls") → If API integration present
5. [`authentication.md`](guides/authentication.md "Context: Auth-related pages") → If auth-related pages

**Common Violations:**
- File size > 200 lines
- Missing error boundaries
- No image optimization
- Missing loading states

### For Utility Files (.ts)
**Priority Order:**
1. `ai-compliance-matrix.md` → File size + TypeScript rules
2. `code-quality-standards.md` → Import organization, no `any` types
3. `architectural-guidelines.md` → Single responsibility principle

**Common Violations:**
- File size > 100 lines
- Missing explicit return types
- Using `any` type
- Poor import organization

### For API Files (/api/*.ts)
**Priority Order:**
1. `api-design.md` → RESTful patterns, error handling
2. `database.md` → Database integration patterns
3. `authentication.md` → Auth middleware patterns
4. `performance-optimization.md` → Query optimization

### For Form Components (wizard, validation)
**Priority Order:**
1. `form-management.md` → React Hook Form + Zod patterns
2. `database-form-integration.md` → Database transaction patterns
3. `react-patterns.md` → Performance optimization
4. `ui-ux-patterns.md` → Multi-step wizard patterns

## REFERENCE_ONLY (Background context, lower priority)

### 📋 **Project Context** (Understand requirements)
- `business-context.md` - User roles (Admin, Reviewer), business requirements
- `feature-requirements.md` - Specific feature specifications
- `technical-stack.md` - Technology choices and rationale
- `ui-ux-design.md` - Design decisions and component patterns

### 🗄️ **Implementation Reference** (As needed)
- `db-schema.txt` - Database structure for data integration
- `our-plan.md` - Development phases and current status

### 🚀 **Deployment & Environment** (Infrastructure context)
- `deployment-environment.md` - PaaS deployment patterns
- `testing-strategy.md` - Testing approach and coverage
- `concerns/` folder - Detailed technical deep-dives

## AI_REVIEW_WORKFLOW

### 🔍 **Step 1: File Type Detection**
```
IF file.endsWith('.tsx') AND file.includes('page.') 
  THEN type = 'page_component'
ELSE IF file.endsWith('.tsx') 
  THEN type = 'component'
ELSE IF file.endsWith('.ts') AND file.includes('/api/')
  THEN type = 'api_file'
ELSE IF file.endsWith('.ts')
  THEN type = 'utility'
```

### ⚡ **Step 2: Priority Document Loading**
```
ALWAYS_LOAD: ['ai-compliance-matrix.md']
IF type === 'component': LOAD ['react-patterns.md', 'ui-ux-patterns.md']
IF type === 'page_component': LOAD ['architectural-guidelines.md', 'performance-optimization.md']
IF type === 'api_file': LOAD ['api-design.md', 'database.md']
IF type === 'utility': LOAD ['code-quality-standards.md']
```

### 🎯 **Step 3: Violation Detection Priority**
```
1. CRITICAL: File size, TypeScript return types, effect loops
2. HIGH: React patterns, error boundaries, form management
3. MEDIUM: Import organization, accessibility, image optimization
4. LOW: Console.log, documentation
```

## QUICK_COMPLIANCE_CHECKLIST

### ✅ **Every Component Must Have:**
- [ ] File size ≤ 150 lines (components) / 200 lines (pages) / 100 lines (utilities)
- [ ] Explicit TypeScript return types for all functions
- [ ] React.memo for components with stable props
- [ ] useCallback for event handlers and state updates
- [ ] useMemo for derived state and expensive computations
- [ ] CSS Modules for styling
- [ ] Proper import organization with blank lines

### ⚠️ **Every Component Must Avoid:**
- [ ] infinite effect loops (use useMemo not useEffect for derived state)
- [ ] Missing error boundaries
- [ ] Using `any` type
- [ ] console.log in production code
- [ ] `<img>` tags (use Next.js Image)
- [ ] Unstable identifiers in effect dependencies

## TERMINOLOGY_STANDARDIZATION

### 🔄 **Consistent Terms (Use these)**
- **"Form validation"** = **"Schema-based validation"** = **"Zod validation"**
- **"Component optimization"** = **"React.memo"** = **"Performance patterns"**  
- **"File size limits"** = **"Line count limits"** = **"Component size constraints"**
- **"Effect loops"** = **"Infinite re-render loops"** = **"useEffect anti-patterns"**
- **"State updates"** = **"Functions that update state"** = **"State modifier functions"**
- **"Derived state"** = **"Computed values"** = **"Memoized computations"**

## URGENT_INDICATORS_LEGEND

### 🚨 **Severity Markers**
- **⚠️ CRITICAL**: Blocks production deployment
- **🔥 HIGH**: Address before next development phase  
- **⚙️ MEDIUM**: Refactor when convenient
- **📝 LOW**: Nice-to-have improvement

### 🎯 **Action Indicators**
- **🛠️ REFACTOR**: Immediate code changes needed
- **📏 SIZE**: File size violation
- **🔧 FIX**: Logic or pattern issue
- **✨ ENHANCE**: Optimization opportunity

## PERFORMANCE_EXPECTATIONS

### ⚡ **AI Processing Targets**
- **Document Loading**: ≤ 2 seconds for priority docs
- **Violation Detection**: ≤ 5 seconds per component
- **Compliance Scoring**: ≤ 1 second calculation
- **Cross-Reference Resolution**: ≤ 3 seconds

### 📊 **Review Coverage Goals**
- **100%** critical violations detected
- **95%** high-priority violations detected  
- **90%** medium-priority violations detected
- **80%** low-priority violations detected

---

**Last Updated**: 2025-06-15  
**Version**: 1.0  
**AI Compatibility**: Optimized for code review automation
