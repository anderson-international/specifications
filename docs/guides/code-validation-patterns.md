---
complianceLevel: critical
status: active
tags: [ai, validation, patterns, compliance, registry, automated-review]
id: 1002
---

# AI Validation Registry

*Centralized registry of all validation patterns for AI compliance checking.*

<!-- AI_QUICK_REF
Overview: This document serves as the centralized registry for all validation patterns. We use these for automated compliance c...
Key Rules: React performance patterns (line 45), TypeScript typing requirements (line 80), Form validation patterns (line 105), API design validation (line 130)
Avoid: Missing useCallback/useMemo, 'any' type usage, Unvalidated form inputs, Missing error response formats
-->

## Overview

This document serves as a centralized registry of all validation patterns. We use these for automated compliance checking. Each pattern includes:
- A unique identifier
- The validation regex or rule
- Source document reference
- Priority level
- Description of what it validates

## Table of Contents

1. [React Validation Patterns](#react-validation-patterns)
2. [TypeScript Validation Patterns](#typescript-validation-patterns) 
3. [Form Management Validation Patterns](#form-management-validation-patterns)
4. [API Design Validation Patterns](#api-design-validation-patterns)

The validation patterns are organized by domain, starting with React-specific patterns and progressing through TypeScript, forms, and API design. Each domain builds upon the previous one to create comprehensive validation coverage.

## React Validation Patterns

Source: [React Development Patterns](react-patterns.md "Priority: HIGH - Core React performance and component patterns")

React validation patterns focus on performance optimization and component structure. These patterns ensure our React components follow best practices for performance and maintainability.

### Performance Patterns

| ID | Pattern | Priority | Description |
|----|---------|----------|-------------|
| REACT_CALLBACK_001 | `/const\s+\w+\s*=\s*useCallback\(/` | ⚠️ CRITICAL | Validates that event handlers are wrapped in useCallback |
| REACT_MEMO_001 | `/const\s+\w+\s*=\s*useMemo\(/` | ⚠️ CRITICAL | Validates that derived state is computed with useMemo |
| REACT_MEMO_002 | `/export.*React\.memo\(/` | 🔥 HIGH | Validates that components with props are wrapped in React.memo |
| REACT_EFFECT_001 | Check for stable references in dependency arrays | 🔥 HIGH | No functions in dependency arrays without useCallback |
| REACT_EFFECT_002 | No object/array literals in dependencies | 🔥 HIGH | Objects should be memoized before being used in dependencies |

### Component Patterns

| ID | Pattern | Priority | Description |
|----|---------|----------|-------------|
| REACT_COMP_001 | Component line count < 150 | ⚠️ CRITICAL | Ensures components don't exceed the maximum line count |
| REACT_CLIENT_001 | `/'use client';/` presence in client components | ⚠️ CRITICAL | Validates correct client component declaration |
| REACT_SERVER_001 | No hooks in server components | ⚠️ CRITICAL | Prevents use of React hooks in server components |

Building on React component patterns, we need equally robust TypeScript validation to ensure type safety throughout our application.

## TypeScript Validation Patterns

Source: [Code Quality Standards](code-rules-quality.md "Priority: CRITICAL - TypeScript standards and ESLint rules")

TypeScript validation patterns enforce type safety and code organization standards. These patterns work together with React patterns to create a comprehensive validation system.

### Type Safety

| ID | Pattern | Priority | Description |
|----|---------|----------|-------------|
| TS_RETURN_001 | `/: (void\|Promise<\w+>\|\w+)/` | ⚠️ CRITICAL | Validates explicit function return types |
| TS_ANY_001 | Reject `/: any\|any\[\]/` | ⚠️ CRITICAL | Prevents usage of the 'any' type |
| TS_CONSOLE_001 | Allow only `/console\.(warn\|error)/` | 🔥 HIGH | Restricts console usage to warn/error only |

### Code Organization

| ID | Pattern | Priority | Description |
|----|---------|----------|-------------|
| TS_IMPORT_001 | Require blank lines between import groups | 🔥 HIGH | Ensures proper import organization |
| TS_NAME_001 | Component files use PascalCase | ⚙️ MEDIUM | Validates naming conventions for components |
| TS_NAME_002 | Utility files use camelCase | ⚙️ MEDIUM | Validates naming conventions for utilities |

## Form Management Validation Patterns

Source: [Form Management](../concerns/form-management.md "Priority: HIGH - Form validation and state management")

### React Hook Form

| ID | Pattern | Priority | Description |
|----|---------|----------|-------------|
| FORM_HOOK_001 | `/const.*=.*useForm</` | ⚠️ CRITICAL | Validates React Hook Form usage |
| FORM_SUBMIT_001 | `/handleSubmit\(/` | ⚠️ CRITICAL | Ensures form submission is wrapped in handleSubmit |
| FORM_REG_001 | `/\{\.\.\.register\(/` | 🔥 HIGH | Validates field registration with register |
| FORM_ERROR_001 | `/formState\.errors/` | 🔥 HIGH | Ensures error handling with formState.errors |

### Schema Validation

| ID | Pattern | Priority | Description |
|----|---------|----------|-------------|
| FORM_ZOD_001 | `*.schema.ts` files exist | ⚠️ CRITICAL | Ensures schema files are separate from components |
| FORM_ZOD_002 | `/zodResolver\(/` | ⚠️ CRITICAL | Validates schema integration with resolver |
| FORM_ZOD_003 | `/z\.infer<typeof.*Schema>/` | 🔥 HIGH | Ensures type inference from schema |
| FORM_ZOD_004 | `/export.*=.*z\.object\(/` | 🔥 HIGH | Validates schema export pattern |

## API Design Validation Patterns

Source: [API Design](../concerns/api-design.md "Priority: HIGH - API structure and error handling")

### API Route Structure

| ID | Pattern | Priority | Description |
|----|---------|----------|-------------|
| API_ROUTE_001 | Next.js route handler files organized by resource | ⚠️ CRITICAL | Validates API route structure |
| API_STATUS_001 | All responses include appropriate status codes | ⚠️ CRITICAL | Ensures proper HTTP status codes |
| API_ERR_001 | Error responses include error code and message | 🔥 HIGH | Validates error response format |
| API_VALID_001 | Input validation before processing | ⚠️ CRITICAL | Ensures all inputs are validated |

## Usage Guidelines

1. **For AI Tools**: Reference validation patterns by their unique ID. Use this when checking code compliance.
2. **For Documentation Updates**: Add new validation rules to individual documents. Also add them to this registry.
3. **For Rule Changes**: Update both this registry and the source document. Do this when modifying validation rules.
4. **For Priority Changes**: Any changes to priority levels must be reflected in both locations. Update this registry and the source document.
