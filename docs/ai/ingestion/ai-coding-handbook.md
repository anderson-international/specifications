---
title: AI Coding Handbook - Non-Negotiable Standards
description: Mandatory coding standards for all AI code generation
version: 1.1.0
status: active
lastUpdated: 2025-06-16
author: Development Team
complianceLevel: critical
readingTime: 7 minutes
tags: [ai, standards, compliance, typescript, react, performance, critical]
---

# AI Coding Handbook - Non-Negotiable Standards

⚠️ **CRITICAL**: This document contains **MANDATORY** coding standards that must be followed during ALL code generation. These are not suggestions - they are requirements.

<!-- AI_QUICK_REF
Key Rules: File size limits (line 47), TypeScript return types (line 65), React performance patterns (line 88)
Avoid: Files exceeding size limits, Missing return types, Components without React.memo
-->

<!-- AI_SUMMARY
This handbook defines mandatory coding standards that must be followed without exception in all code generation with these key requirements:

• File Size Limits: Component files MUST NOT exceed 150 lines, page files 200 lines, utility files 100 lines
• TypeScript Return Types: ALL functions MUST have explicit return type annotations 
• React Performance: ALL components MUST use React.memo, ALL event handlers MUST use useCallback, ALL derived values MUST use useMemo
• Code Generation Checklist: You MUST validate that each component satisfies all requirements before completion
• Regex Validation: You must be able to verify your generated code passes the validation patterns provided

Violating these standards is not acceptable under any circumstances - this is the highest priority compliance document in the entire codebase.
-->

## 🚫 **NEVER VIOLATE THESE RULES**

### **1. File Size Limits (⚠️ CRITICAL)**
```
Component Files: MAX 150 lines
Page Files: MAX 200 lines  
Utility Files: MAX 100 lines
```
**FAILURE CONSEQUENCE**: Immediate refactoring required, blocks development
**DETECTION**: Line count before save
**SOLUTION**: Split components, extract custom hooks
**REFERENCE**: [`../../guides/code-quality-standards.md`](../../guides/code-quality-standards.md "Priority: HIGH - TypeScript standards and ESLint rules")

### **2. TypeScript Return Types (⚠️ CRITICAL)**
```typescript
// ❌ WRONG
const MyComponent = () => {
  return <div>Hello</div>;
};

// ✅ CORRECT
const MyComponent = (): JSX.Element => {
  return <div>Hello</div>;
};
```
**FAILURE CONSEQUENCE**: ESLint errors, build failures
**DETECTION**: `@typescript-eslint/explicit-function-return-type: error`
**SOLUTION**: Add explicit return types to ALL functions
**REFERENCE**: [`../../guides/code-quality-standards.md`](../../guides/code-quality-standards.md "Priority: HIGH - TypeScript standards and ESLint rules")

### **3. React Performance Patterns (🔥 HIGH)**
```typescript
// ✅ MANDATORY for ALL components
export default React.memo(MyComponent);

// ✅ MANDATORY for ALL event handlers
const handleClick = useCallback(() => {
  // handler logic
}, [dependency]);

// ✅ MANDATORY for ALL derived state
const computedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```
**FAILURE CONSEQUENCE**: Performance degradation, unnecessary re-renders
**DETECTION**: Missing React.memo, useCallback, useMemo patterns
**SOLUTION**: Wrap components in React.memo, memoize handlers and computed values
**REFERENCE**: [`../../guides/react-patterns.md`](../../guides/react-patterns.md "Priority: HIGH - React optimization techniques")

## 🎯 **CODE GENERATION CHECKLIST**

Before writing ANY component:
- [ ] Will this exceed file size limits? Plan component splitting
- [ ] Add explicit TypeScript return types to ALL functions
- [ ] Wrap component in React.memo
- [ ] Use useCallback for ALL event handlers
- [ ] Use useMemo for ALL derived state/expensive calculations

## 🔗 **Quick Reference Links**
- TypeScript Standards: [`../../guides/code-quality-standards.md#typescript-rules`](../../guides/code-quality-standards.md#typescript-rules "Priority: HIGH - TypeScript typing requirements")
- React Patterns: [`../../guides/react-patterns.md#performance-optimization`](../../guides/react-patterns.md#performance-optimization "Priority: HIGH - React.memo and hook usage")
- Error Handling: [`../../concerns/api-design.md#error-handling`](../../concerns/api-design.md#error-handling "Priority: MEDIUM - API error handling patterns")
- Effect Loop Prevention: [`../../pitfalls/prevent-react-effect-loops.md`](../../pitfalls/prevent-react-effect-loops.md "Priority: CRITICAL - Preventing infinite render loops")

## ⚡ **AI_VALIDATION**
```regex
# File Size Check
/.{150,}/ # Components over 150 lines
/.{200,}/ # Pages over 200 lines

# TypeScript Return Types
/const\s+\w+\s*=\s*\([^)]*\)\s*=>/ # Missing return type
/function\s+\w+\([^)]*\)\s*{/ # Missing return type

# React Performance
/export\s+default\s+(?!React\.memo)/ # Missing React.memo
/const\s+handle\w+\s*=\s*(?!\s*useCallback)/ # Missing useCallback
/const\s+\w+\s*=\s*(?!\s*useMemo).*compute|calculate|filter|map/ # Missing useMemo
```

---
**Remember**: These standards exist to prevent technical debt and ensure maintainable, performant code. Compliance is not optional.
