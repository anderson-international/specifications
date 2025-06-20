---
complianceLevel: critical
status: active
tags: [eslint, typescript, react, code-quality, debugging, best-practices]
id: 1014
---

# Preventing Common Lint Issues

This guide helps prevent common linting errors when writing code for this project.

<!-- AI_QUICK_REF
Overview: This document provides comprehensive guidance for preventing and fixing the most common linting errors in the project
Key Rules: Underscore prefix for unused vars (line 26), Hook dependencies complete (line 104), Next/Image not img (line 127), TypeScript return types (line 183)
Avoid: 'any' type usage, Missing hook dependencies, HTML img elements, Empty destructuring without underscore
-->

## Lint Issues by Frequency

| Rank | Issue Type | Frequency | Description |
|------|------------|-----------|-------------|
| 1 | `@typescript-eslint/no-unused-vars` | High | Variables, imports, or parameters declared but never used |
| 2 | `@typescript-eslint/no-explicit-any` | Medium | Use of `any` type that bypasses TypeScript's type checking |
| 3 | `react-hooks/exhaustive-deps` | Medium | Missing dependencies in React hook dependency arrays |
| 4 | `@next/next/no-img-element` | Medium | Using HTML `<img>` instead of Next.js `<Image>` component |
| 5 | `no-empty-pattern` | Low | Empty object destructuring patterns |
| 6 | TypeScript component props errors | Low | Incorrect props or prop types when using components |
| 7 | `@typescript-eslint/no-misused-promises` | Very Low | Using promises in locations expecting synchronous values |

## TypeScript Issues

### 1. Unused Variables and Imports (`@typescript-eslint/no-unused-vars`)

**Problem:** Variables, imports, or parameters declared but never used.

**Solutions:**
- ✓ Remove unused imports: `import { ZodTypeAny } from 'zod'` instead of `import { ZodSchema, ZodTypeAny } from 'zod'`
- ✓ Remove unused catch parameters: `catch { throw new Error() }` 
- ✓ Use underscore prefix for intentionally unused variables: `catch (_err) { throw new Error() }`

```typescript
// BEFORE
import { useState, useEffect, useRef, useMemo } from 'react';
// Only useState is used below
const Component = () => {
  const [value, setValue] = useState(0);
  return <div>{value}</div>;
}

// AFTER
import { useState } from 'react';
const Component = () => {
  const [value, setValue] = useState(0);
  return <div>{value}</div>;
}
```

### 2. Avoid Any Type (`@typescript-eslint/no-explicit-any`)

**Problem:** Using `any` type bypasses TypeScript's type checking.

**Solutions:**
- ✓ Create specific interfaces or types
- ✓ Use `unknown` instead of `any` when type is truly unknown
- ✓ Use generics for flexible typing

```typescript
// BEFORE
async function processData(data: any): Promise<any> {
  return data.someProperty;
}

// AFTER
interface DataType {
  someProperty: string;
}

async function processData(data: DataType): Promise<string> {
  return data.someProperty;
}
```

### 3. Empty Object Patterns (`no-empty-pattern`)

**Problem:** Empty object destructuring patterns are often a mistake.

**Solution:**
- ✓ Use underscore prefix: `function Component(_props: ComponentProps)`

```typescript
// BEFORE
export default function Component({}: Props): JSX.Element {
  return <div>Content</div>;
}

// AFTER
export default function Component(_props: Props): JSX.Element {
  return <div>Content</div>;
}
```

### 4. Misused Promises (`@typescript-eslint/no-misused-promises`)

**Problem:** Using promises in locations expecting synchronous values.

**Solutions:**
- ✓ Use void operator: `<button onClick={() => void saveData()}>Save</button>`
- ✓ Don't return the promise: `const handleClick = () => { void saveData() }`

## React Issues

### 1. Hook Dependencies (`react-hooks/exhaustive-deps`)

**Problem:** Missing dependencies in hook arrays cause stale closures or excessive re-renders.

```typescript
// BEFORE
const selectedOptions = useMemo(() => {
  const items = watch('field_name') || [];
  return items.map(id => availableTastingNotes.find(n => n.id === id));
}, []); // Missing dependencies

// AFTER
const selectedOptions = useMemo(() => {
  const items = watch('field_name') || [];
  return items.map(id => availableTastingNotes.find(n => n.id === id));
}, [watch, availableTastingNotes]); // All dependencies included
```

### 2. Next.js Image Component (`@next/next/no-img-element`)

**Problem:** Using HTML `<img>` instead of Next.js's optimized `<Image>` component.

```tsx
// BEFORE
<img 
  src={product.image_url} 
  alt={product.title} 
  className={styles.productImage}
/>

// AFTER
import Image from 'next/image'

<Image 
  src={product.image_url} 
  alt={product.title} 
  className={styles.productImage}
  width={80}
  height={80}
  loading="lazy"
/>
```

### 3. Component Props Errors

**Problem:** Incorrect props or prop types when using components.

```tsx
// BEFORE
<MultiSelectChips
  options={tastingNoteOptions}
  value={selectedTastingOptions} // Incorrect prop name
  onChange={handleTastingNotesChange}
  loading={loading} // Prop doesn't exist
/>

// AFTER
<MultiSelectChips
  options={tastingNoteOptions}
  selectedValues={watch('tasting_notes') || []} // Correct prop name
  onChange={handleTastingNotesChange}
  name="tasting-notes" // Required prop
  disabled={loading}
/>
```

### 4. Key Props in Lists

**Problem:** Missing or ineffective keys in lists can cause performance issues.

**Solutions:**
- ✓ Use unique, stable identifiers for keys
- ✓ Avoid using array index as keys unless list is static

```tsx
// GOOD
{items.map(item => <ListItem key={item.id} {...item} />)}

// AVOID
{items.map((item, index) => <ListItem key={index} {...item} />)}
```

## Prevention Strategies

1. **IDE Configuration**
   - ✓ Configure ESLint + TypeScript plugins in your editor
   - ✓ Enable "Fix on Save" for minor issues

2. **Typing Practices**
   - ✓ Define interfaces/types for all props, state, and function parameters  
   - ✓ Specify return types for all functions, especially exported ones
   - ✓ Use discriminated unions for complex state

3. **Component Best Practices**
   - ✓ Small, focused components with well-defined props
   - ✓ Document complex props with JSDoc comments
   - ✓ Follow accessibility (a11y) guidelines with semantic HTML

4. **Pre-commit Tools**
   - ✓ Run `npm run lint` before committing
   - ✓ Set up pre-commit hooks with Husky to automate checks
