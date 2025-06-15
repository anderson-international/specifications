## ⚠️ **CRITICAL**: Enforce safeguards against infinite loops in React effect hooks

### ⚠️ **CRITICAL**: React useEffect Dependency Management

1. **⚠️ CRITICAL**: Functions that update state must be wrapped in `useCallback`.
2. **⚠️ CRITICAL**: Derived state must use `useMemo`.
3. **🔥 HIGH**: Context interactions must have clear ownership.

### 🔥 **HIGH**: Context Interaction Guidelines

- **🔥 HIGH**: One context should own data fetching; others should only consume.
- **🔥 HIGH**: Avoid circular dependencies between contexts.
- **⚙️ MEDIUM**: When using multiple data contexts, clearly define which context is responsible for loading specific data.
- **⚠️ CRITICAL**: Never duplicate data fetching logic between a component and its context provider.

### ⚠️ **CRITICAL**: Derived State in Dependencies

- **⚠️ CRITICAL**: Always memoize derived state with `useMemo`.
- **🔥 HIGH**: Validate effect dependency arrays carefully.
- **🔥 HIGH**: Prefer stable identifiers over objects or arrays in dependencies.
- **⚙️ MEDIUM**: For array transformations (sort, filter, map), use a stable cached result instead of creating new arrays on each render.

### ⚠️ **CRITICAL**: Specific Anti-Patterns to Avoid

- **⚠️ CRITICAL - BLOCKS DEPLOYMENT**: Dual fetching**: Don't fetch the same data from both a component and its context.
- **⚠️ CRITICAL - BLOCKS DEPLOYMENT**: Unstable identifiers in dependencies**: Avoid using functions that return new objects/arrays in dependency arrays.
- **🔥 HIGH**: Cross-context update cycles**: One context update should not trigger another context update in a cyclical manner.
- **🔥 HIGH**: Missed dependency warnings**: Always address React Hook dependency warnings rather than suppressing them.

### ⚠️ **CRITICAL**: AI_VALIDATION

React Effect Loop Prevention Patterns:

Critical Effect Loop Detection:
- useEffect with state setter in dependency array: /useEffect\(.*\[.*set\w+.*\]/
- Functions in dependency arrays without useCallback: Check for function refs in deps
- Object/array literals in dependencies: /useEffect\(.*\[.*\{.*\}.*\]/ or /useEffect\(.*\[.*\[.*\].*\]/
- Missing dependencies that should be included: Use React Hook ESLint rule

UseCallback Validation:
- State setters wrapped in useCallback: /const.*=.*useCallback.*set\w+/
- Event handlers wrapped in useCallback: /const.*handler.*=.*useCallback/
- Functions passed as props are memoized: Check prop drilling of unmemoized functions

UseMemo for Derived State:
- Computed values use useMemo: /const.*=.*useMemo\(.*\[.*\]/
- Array transformations memoized: filter/map/sort operations wrapped in useMemo
- Complex object creation memoized: Object literals moved to useMemo

Effect Dependency Validation:
- Stable primitive dependencies only: Numbers, strings, booleans in dependency arrays
- No unstable object references: Objects created with useMemo/useCallback
- Empty arrays only for mount effects: useEffect(fn, []) for mount/unmount only

Anti-Pattern Detection Regex:
- Dual fetching: Multiple useEffect hooks calling same API endpoint
- Unstable dependencies: /useEffect\(.*\[.*\{.*\}/
- Missing useCallback: Functions defined in render without useCallback wrapper
- Effect triggering effect: useEffect calling state setter that triggers another useEffect

Critical Loop Patterns:
1. useEffect → setState → trigger useEffect (infinite loop)
2. useEffect with function dependency not wrapped in useCallback
3. Context value changing causing subscriber effects to re-run
4. Derived state calculated in useEffect instead of useMemo
5. Object/array dependencies changing every render

### 📝 **LOW**: Testing for Infinite Loop Prevention

- When implementing data fetching with React contexts:
  1. Monitor network traffic to check for repeated identical API calls.
  2. Add console.log statements in useEffect hooks to verify execution frequency.
  3. Use React DevTools profiler to identify components re-rendering excessively.