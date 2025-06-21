---
complianceLevel: critical
status: active
tags: [react, useeffect, performance, hooks, debugging, infinite-loops]
id: Vw_gIXfS
---

# Preventing React Effect Infinite Loops

This guide helps prevent infinite loops and performance issues caused by improper React effect hook implementation.

<!-- AI_QUICK_REF
Overview: This document provides comprehensive guidance for preventing infinite loops and performance issues in React effect hooks
Key Rules: useCallback for functions in dependencies (line 28), useMemo for derived state (line 58), Include all dependencies (line 117)
Avoid: Functions not wrapped in useCallback, Missing dependencies, Object/array literals in dependency arrays, Circular context dependencies
-->

## Common Causes of React Effect Loops

| Priority | Issue | Description |
|----------|-------|-------------|
| ⚠️ **CRITICAL** | Function dependencies | State setters or functions that aren't wrapped in `useCallback` |
| ⚠️ **CRITICAL** | Derived state | Calculated values not wrapped in `useMemo` |
| 🔥 **HIGH** | Object/array literals | New objects/arrays created on each render |
| 🔥 **HIGH** | Context interactions | Circular dependencies between contexts |
| ⚙️ **MEDIUM** | Missing dependencies | Not including all dependencies used in effect |

## Best Practices for Preventing Loops

### 1. Function Management (⚠️ CRITICAL)

**Problem:** Functions created during render cause infinite loops when used in dependency arrays.

```jsx
// ❌ WRONG: Function recreated on every render
useEffect(() => {
  fetchUserData(userId);
}, [fetchUserData]); // fetchUserData is a new function every render

const handleUpdate = () => {
  setData(newData);
};
useEffect(() => {
  document.addEventListener('click', handleUpdate);
  return () => document.removeEventListener('click', handleUpdate);
}, [handleUpdate]); // handleUpdate is a new function every render
```

**Solution:** Always wrap functions in `useCallback` when used in dependency arrays.

```jsx
// ✅ CORRECT: Function is stable across renders
const fetchUserData = useCallback((id) => {
  // fetch logic
}, []);

useEffect(() => {
  fetchUserData(userId);
}, [fetchUserData, userId]);

const handleUpdate = useCallback(() => {
  setData(newData);
}, [newData]);

useEffect(() => {
  document.addEventListener('click', handleUpdate);
  return () => document.removeEventListener('click', handleUpdate);
}, [handleUpdate]);
```

### 2. Derived State (⚠️ CRITICAL)

**Problem:** Calculated values change identity on each render, triggering effects.

```jsx
// ❌ WRONG: filteredItems has a new reference every render
useEffect(() => {
  console.log('Items changed');
}, [items.filter(item => item.active)]); // New array on every render
```

**Solution:** Memoize derived values with `useMemo`.

```jsx
// ✅ CORRECT: filteredItems is stable unless items or filter condition changes
const filteredItems = useMemo(() => 
  items.filter(item => item.active), 
  [items]
);

useEffect(() => {
  console.log('Items changed');
}, [filteredItems]);
```

### 3. Context Interactions (🔥 HIGH)

**Problem:** Multiple contexts updating each other create circular dependencies.

```jsx
// ❌ WRONG: UserContext and DataContext update each other
// In UserContext
useEffect(() => {
  if (dataContext.data) {
    setUser(buildUserFromData(dataContext.data));
  }
}, [dataContext.data]);

// In DataContext
useEffect(() => {
  if (userContext.user) {
    fetchDataForUser(userContext.user.id);
  }
}, [userContext.user]);
```

**Solutions:**
- ✅ One context should own data fetching; others should only consume
- ✅ Establish clear hierarchies between contexts
- ✅ Avoid circular updates between contexts

```jsx
// ✅ CORRECT: Clear ownership - UserContext owns user data
// In UserContext (data owner)
useEffect(() => {
  fetchUser(userId);
  if (user) {
    fetchDataForUser(user.id);
  }
}, [userId, user]);

// DataContext just consumes, doesn't fetch
```

### 4. Dependency Array Management (🔥 HIGH)

**Problem:** Incomplete or incorrect dependency arrays.

```jsx
// ❌ WRONG: Missing dependencies
useEffect(() => {
  const filtered = items.filter(item => item.category === selectedCategory);
  setFilteredItems(filtered);
}, []); // Missing items and selectedCategory
```

**Solutions:**
- ✅ Include ALL dependencies used inside the effect
- ✅ Use the ESLint react-hooks/exhaustive-deps rule
- ✅ Prefer primitive values over objects in dependency arrays

```jsx
// ✅ CORRECT: All dependencies included
useEffect(() => {
  const filtered = items.filter(item => item.category === selectedCategory);
  setFilteredItems(filtered);
}, [items, selectedCategory, setFilteredItems]);
```

## Specific Anti-Patterns to Avoid

### 1. Dual Fetching (⚠️ CRITICAL)

**Problem:** Fetching the same data in both component and context.

```jsx
// ❌ WRONG: Both context and component fetch user data
// In UserContext
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// In UserProfile component
useEffect(() => {
  fetchUserData(userId);
}, [userId]);
```

**Solution:** Define clear ownership of data fetching.

```jsx
// ✅ CORRECT: Only context fetches data
// In UserContext
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// In UserProfile component
const { user } = useUserContext(); // Just consume data
```

### 2. Unstable References (⚠️ CRITICAL)

**Problem:** Object/array literals in dependency arrays.

```jsx
// ❌ WRONG: New object in dependency array
useEffect(() => {
  doSomething();
}, [{ id: userId }]); // New object identity every render

// ❌ WRONG: Inline function in dependency
useEffect(() => {
  fetchData();
}, [() => formatData(data)]); // New function every render
```

**Solution:** Use primitive values or memoized objects.

```jsx
// ✅ CORRECT: Use primitive
useEffect(() => {
  doSomething();
}, [userId]); // Stable primitive value

// ✅ CORRECT: Memoize function
const formatDataFn = useCallback(() => formatData(data), [data]);
useEffect(() => {
  fetchData();
}, [formatDataFn]); // Stable function reference
```

## Testing for Infinite Loops

1. **Monitor network traffic** for repeated API calls
2. Add **console.log statements** in useEffect to check execution frequency
3. Use **React DevTools Profiler** to identify excessive re-renders
4. Implement **error boundaries** that catch render limits

## Common Effect Loop Patterns to Watch For

1. useEffect → setState → trigger useEffect (infinite loop)
2. useEffect with function dependency not wrapped in useCallback
3. Context value changing causing subscriber effects to re-run
4. Derived state calculated in useEffect instead of useMemo
5. Object/array dependencies changing every render
