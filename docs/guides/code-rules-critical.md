---
complianceLevel: critical
status: active
tags: [ai, standards, compliance, typescript, react, performance, critical]
id: 1010
---

# Code Rules Critical - Non-Negotiable Standards

⚠️ **CRITICAL**: This document contains **MANDATORY** coding standards. You must follow these during ALL code generation. These are not suggestions. They are requirements.

<!-- AI_QUICK_REF
Overview: This handbook defines mandatory coding standards. You must follow these without exception in all code generation. Key...
Key Rules: File size limits (line 47), TypeScript return types (line 65), React performance patterns (line 88)
Avoid: Files exceeding size limits, Missing return types, Components without React.memo
-->

## 🚫 **NEVER VIOLATE THESE RULES**

### **1. File Size Limits (⚠️ CRITICAL)**
```
Component Files: MAX 150 lines
Page Files: MAX 200 lines  
Utility Files: MAX 100 lines
```
**FAILURE CONSEQUENCE**: We require immediate refactoring. This blocks development.
**DETECTION**: Count lines before save.
**SOLUTION**: Split components. Extract custom hooks.
**REFERENCE**: [`../../guides/../../guides/code-rules-quality.md`](code-rules-quality.md "Priority: HIGH - TypeScript standards and ESLint rules")

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
**FAILURE CONSEQUENCE**: We get ESLint errors and build failures.
**DETECTION**: `@typescript-eslint/explicit-function-return-type: error`
**SOLUTION**: Add explicit return types to all functions.
**REFERENCE**: [`../../guides/../../guides/code-rules-quality.md`](code-rules-quality.md "Priority: HIGH - TypeScript standards and ESLint rules")

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
**FAILURE CONSEQUENCE**: We get performance degradation and unnecessary re-renders.
**DETECTION**: Missing React.memo, useCallback, useMemo patterns.
**SOLUTION**: Wrap components in React.memo, memoize handlers and computed values.
**REFERENCE**: [`react-patterns.md`](react-patterns.md "Priority: HIGH - React optimization techniques")

## 🎯 **CODE GENERATION CHECKLIST**

Before writing any component:
- [ ] Will this exceed file size limits? Plan component splitting.
- [ ] Add explicit TypeScript return types to all functions.
- [ ] Wrap component in React.memo.
- [ ] Use useCallback for all event handlers.
- [ ] Use useMemo for all derived state and expensive calculations.

## 🔗 **Quick Reference Links**
- TypeScript Standards: [`code-rules-quality.md#typescript-rules`](code-rules-quality.md#typescript-rules "Priority: HIGH - TypeScript typing requirements")
- React Patterns: [`react-patterns.md#performance-optimization`](react-patterns.md#performance-optimization "Priority: HIGH - React.memo and hook usage")
- Error Handling: [`../concerns/api-design.md#error-handling`](../concerns/api-design.md#error-handling "Priority: MEDIUM - API error handling patterns")
- Effect Loop Prevention: [`../pitfalls/prevent-react-effect-loops.md`](../pitfalls/prevent-react-effect-loops.md "Priority: CRITICAL - Preventing infinite render loops")

## ⚡ **AI_VALIDATION**
```regex
# TypeScript Return Types
/const\s+\w+\s*=\s*\([^)]*\)\s*=>/ # Missing return type
/function\s+\w+\([^)]*\)\s*{/ # Missing return type

# React Performance  
/export\s+default\s+(?!React\.memo)/ # Missing React.memo
/const\s+handle\w+\s*=\s*(?!\s*useCallback)/ # Missing useCallback
/const\s+\w+\s*=\s*(?!\s*useMemo).*compute|calculate|filter|map/ # Missing useMemo
```
---
**Remember**: These standards prevent technical debt. They ensure maintainable, performant code. Compliance is not optional.
