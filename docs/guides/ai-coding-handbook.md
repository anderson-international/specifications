# AI Coding Handbook - Non-Negotiable Standards

⚠️ **CRITICAL**: This document contains **MANDATORY** coding standards that must be followed during ALL code generation. These are not suggestions - they are requirements.

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
**REFERENCE**: `docs/guides/best-practices.md`

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
**REFERENCE**: `docs/guides/code-quality-standards.md`

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
**REFERENCE**: `docs/guides/react-patterns.md`

## 🎯 **CODE GENERATION CHECKLIST**

Before writing ANY component:
- [ ] Will this exceed file size limits? Plan component splitting
- [ ] Add explicit TypeScript return types to ALL functions
- [ ] Wrap component in React.memo
- [ ] Use useCallback for ALL event handlers
- [ ] Use useMemo for ALL derived state/expensive calculations

## 🔗 **Quick Reference Links**
- File Size Limits: `docs/guides/best-practices.md#file-size-management`
- TypeScript Standards: `docs/guides/code-quality-standards.md#typescript-rules`
- React Patterns: `docs/guides/react-patterns.md#performance-optimization`
- Error Handling: `docs/concerns/api-design.md#error-handling`
- Effect Loop Prevention: `docs/pitfalls/prevent-react-effect-loops.md`

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
