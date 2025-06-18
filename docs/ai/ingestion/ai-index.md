---
title: AI Documentation Index
description: Entry point for AI code review navigation and document prioritization
version: 2.0.0
status: active
lastUpdated: 2025-06-17
author: Development Team
complianceLevel: critical
readingTime: 8 minutes
tags: [ai, documentation, navigation, compliance, review, index]
---

# AI DOCUMENTATION INDEX
*Entry point for AI code review navigation and document prioritization*

<!-- AI_QUICK_REF
Key Rules: Document prioritization framework (line 35), Context-dependent selection (line 57), AI review workflow steps (line 77)
Avoid: Bypassing document priority order, Ignoring file type detection workflow, Missing cross-references
-->

<!-- AI_SUMMARY
This document serves as the central navigation hub for AI-based code review with these key elements:

• Document Priority Framework: Four-tier stratified system (CRITICAL, HIGH, MEDIUM, LOW) based on importance and frequency of use
• Context-Sensitive Navigation: File type detection workflow with specific document loading paths for components, pages, utilities, and API files
• Review Workflow: Three-step process for file analysis (file type detection, priority document loading, violation detection)
• Compliance Checklist: Definitive list of required patterns (file size limits, TypeScript typing, React optimization patterns)

This index document is the first entry point for all AI interaction with the codebase documentation system and defines the pathways to access all other relevant documents based on context.
-->

## ⚠️ CRITICAL Priority (Always Read First)
*Essential documents for all code reviews - Read these for every task*

1. **[AI Coding Handbook](ai-coding-handbook.md)** - Core coding standards and AI validation patterns
2. **[AI Validation Registry](ai-validation-registry.md)** - Centralized validation patterns for all document types
3. **[Business Context](../../project/business-context.md)** - User roles, authentication strategy, and business workflows
4. **[Technical Stack](../../project/technical-stack.md)** - Next.js 15, React Hook Form, Prisma, CSS Modules

## 🔥 HIGH Priority (Read Early in Review)
*Key implementation patterns and strategies*

5. **[Code Quality Standards](../../guides/code-quality-standards.md)** - ESLint, TypeScript, and Prettier configuration
6. **[React Development Patterns](../../guides/react-patterns.md)** - Performance optimization and component patterns
7. **[API Design](../../concerns/api-design.md)** - RESTful patterns, error handling, Shopify integration
8. **[Form Management](../../concerns/form-management.md)** - React Hook Form + Zod validation strategies
9. **[Authentication](../../concerns/authentication.md)** - Magic link auth, role-based access control

## ⚙️ MEDIUM Priority (Reference as Needed)
*Specialized guidance and implementation details*

10. **[Database-Form Integration](../../guides/database-form-integration.md)** - Schema-driven form development patterns
11. **[UI/UX Design](../../project/ui-ux-design.md)** - Mobile-first design, dark theme, wizard patterns
12. **[Prevent React Effect Loops](../../pitfalls/prevent-react-effect-loops.md)** - Effect loop prevention patterns
13. **[Prevent Lint Issues](../../pitfalls/prevent-lint-issues.md)** - Common ESLint/TypeScript error prevention

## 📝 LOW Priority (Background Context)
*Infrastructure and project context*

14. **[Feature Requirements](../../project/feature-requirements.md)** - Detailed specifications and validation rules

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
ALWAYS_LOAD: ['ai-coding-handbook.md']
IF type === 'component': LOAD ['code-quality-standards.md', 'react-patterns.md']
IF type === 'page_component': LOAD ['ui-ux-design.md']
IF type === 'api_file': LOAD ['api-design.md', 'form-management.md']
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

### ⚠️ **Every Component Must Avoid:**
- [ ] Infinite effect loops (use useMemo not useEffect for derived state)
- [ ] Missing error boundaries
- [ ] Using `any` type
- [ ] `<img>` tags (use Next.js Image)
- [ ] Unstable identifiers in effect dependencies

## SEVERITY_INDICATORS

### 🚨 **Severity Markers**
- **⚠️ CRITICAL**: Blocks production deployment
- **🔥 HIGH**: Address before next development phase  
- **⚙️ MEDIUM**: Refactor when convenient
- **📝 LOW**: Nice-to-have improvement

### 🎯 **Review Coverage Goals**
- **100%** critical violations detected
- **95%** high-priority violations detected  
- **90%** medium-priority violations detected

---

**Last Updated**: 2025-06-17  
**Version**: 2.0  
**AI Compatibility**: Optimized for rapid comprehension and code review automation
