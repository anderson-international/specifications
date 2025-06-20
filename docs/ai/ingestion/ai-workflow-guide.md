---
complianceLevel: critical
status: active
tags: [ai, documentation, navigation, compliance, review, index]
id: 1001
---

# AI DOCUMENTATION INDEX
*Entry point for AI code review navigation and document prioritization*

<!-- AI_QUICK_REF
Overview: This document is the central navigation hub for AI-based code review. It contains these key elements
Key Rules: Follow document priority, use context-dependent selection, and review workflow steps.
Avoid: Skipping priority order, ignoring file type detection, and missing cross-references.
-->

---

## ⚠️ CRITICAL Priority (Always Read First)

*Essential documents for all code reviews*

1. **[AI Coding Handbook](../../guides/code-rules-critical.md)** - Core coding standards and validation patterns
2. **[AI Validation Registry](../../guides/code-validation-patterns.md)** - Validation patterns for all document types
3. **[Business Context](../../project/business-context.md)** - User roles, auth strategy, business workflows
4. **[Technical Stack](../../project/technical-stack.md)** - Next.js 15, React Hook Form, Prisma, CSS Modules

---

## 🔥 HIGH Priority (Read Early in Review)

*Key implementation patterns*

5. **[Code Quality Standards](../../guides/code-rules-quality.md)** - ESLint, TypeScript, Prettier config
6. **[React Development Patterns](../../guides/react-patterns.md)** - Performance optimization and component patterns
7. **[API Design](../../concerns/api-design.md)** - RESTful patterns, error handling, Shopify integration
8. **[Form Management](../../concerns/form-management.md)** - React Hook Form + Zod validation
9. **[Authentication](../../concerns/authentication.md)** - Magic link auth, role-based access

---

## ⚙️ MEDIUM Priority (Reference as Needed)

*Specialized guidance*

10. **[Database-Form Integration](../../guides/database-form-integration.md)** - Schema-driven form development
11. **[UI/UX Design](../../project/ui-ux-design.md)** - Mobile-first design, dark theme, wizard patterns
12. **[Prevent React Effect Loops](../../pitfalls/prevent-react-effect-loops.md)** - Effect loop prevention
13. **[Prevent Lint Issues](../../pitfalls/prevent-lint-issues.md)** - Common ESLint/TypeScript error prevention

---

## 📝 LOW Priority (Background Context)

*Infrastructure and project context*

14. **[Feature Requirements](../../project/feature-requirements.md)** - Detailed specs and validation rules

---

## AI_REVIEW_WORKFLOW

### 🧠 **CONTEXTUAL INTELLIGENCE PROTOCOL**
**CRITICAL**: Before starting ANY coding work, AI must be contextually intelligent:

1. **Analyze the task type** from user request
2. **Load appropriate workflow** using stdout-based ingestion  
3. **NEVER start coding without proper context**

**Task Type → Workflow Mapping:**
- API/backend work → `@[/docs-api]`
- Forms/validation → `@[/docs-forms]` 
- UI/styling/design → `@[/docs-ui]`
- Debugging issues → `@[/docs-debug]`
- General/mixed work → `@[/docs-ai-context]`

**Implementation:** Use `cmd /c node docs/ai/ingestion/scripts/docs-ingestion-engine.js [workflow-name]`

**Not following this protocol will result in code that violates standards and patterns.**

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
- [ ] File size limits: 150 lines for components, 200 lines for pages, 100 lines for utilities
- [ ] Explicit TypeScript return types for all functions
- [ ] React.memo for components with stable props
- [ ] useCallback for event handlers and state updates
- [ ] useMemo for derived state and expensive computations

### ⚠️ **Every Component Must Avoid:**
- [ ] Infinite effect loops. Use useMemo not useEffect for derived state.
- [ ] Missing error boundaries
- [ ] Using `any` type
- [ ] `<img>` tags. Use Next.js Image instead.
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
