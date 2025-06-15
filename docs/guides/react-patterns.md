# React Development Patterns

*Comprehensive React patterns, performance optimization, and infinite loop prevention for the Specification Builder.*

<!-- AI_NAVIGATION
Primary Focus: React infinite loop prevention, performance patterns, Next.js App Router
Key Compliance Points:
- useCallback for state updates (line 19, 23-29)
- useMemo for derived state (line 20, 31-37)
- Effect dependency arrays (line 43-56)
- Next.js Server vs Client component patterns (line 85-110)
- React.memo optimization (line 63-70)
Critical for: All .tsx files, useEffect hooks, component optimization
Cross-references: prevent-react-effect-loops.md (anti-patterns), form-management.md (form patterns)
Anti-patterns: Object/array dependencies without memoization, dual data fetching
-->

> **📋 Quick Navigation:**
> - **Development Standards**: [Best Practices](best-practices.md) | [Architectural Guidelines](architectural-guidelines.md) | [Code Quality Standards](code-quality-standards.md)
> - **Form Implementation**: [Database-Form Integration](database-form-integration.md) | [Form Management](../concerns/form-management.md)
> - **UI/UX Design**: [UI/UX Design Decisions](../project/ui-ux-design.md) | [Component Patterns](../concerns/ui-ux-patterns.md)
> - **Technical Context**: [Technical Stack](../project/technical-stack.md) | [API Design](../concerns/api-design.md)
> - **Pitfall Prevention**: [React Effect Loops](../pitfalls/prevent-react-effect-loops.md) | [Authentication](../concerns/authentication.md)

> **📋 This document consolidates React-specific guidance from multiple sources. For component organization and file size standards, see [Best Practices](best-practices.md).**

## ⚠️ **CRITICAL**: React Effect Loop Prevention

### ⚠️ **CRITICAL**: Critical Safeguards
React useEffect hooks can cause infinite loops if not properly managed. These patterns are mandatory:

1. **⚠️ **CRITICAL**: Functions that update state must be wrapped in `useCallback`**
2. **⚠️ **CRITICAL**: Derived state must use `useMemo`**  
3. **🔥 **HIGH**: Context interactions must have clear ownership**

### ⚠️ **CRITICAL**: useCallback Pattern (Required)
```typescript
// ✅ Correct: Stable event handler
const handleSubmit = useCallback((data: FormData): void => {
  setSubmitting(true);
  // handle submission
}, []);

// ❌ **BLOCKS DEPLOYMENT**: Creates new function on every render
const handleSubmit = (data: FormData): void => {
  setSubmitting(true);
  // handle submission
};
```

### ⚠️ **CRITICAL**: useMemo Pattern (Required)
```typescript
// ✅ Correct: Memoized derived state
const filteredProducts = useMemo(() => 
  products.filter(product => product.brand === selectedBrand),
  [products, selectedBrand]
);

// ❌ **BLOCKS DEPLOYMENT**: Creates new array on every render
const filteredProducts = products.filter(product => product.brand === selectedBrand);
```

### 🔥 **HIGH**: Context Interaction Guidelines
- **Single Source of Truth**: One context should own data fetching; others should only consume
- **No Circular Dependencies**: Avoid circular dependencies between contexts
- **Clear Ownership**: Define which context is responsible for loading specific data
- **No Dual Fetching**: Never duplicate data fetching logic between component and context

## 🔥 **HIGH**: React Performance Optimization

### 🔥 **HIGH**: Component Optimization Patterns

#### 🔥 **HIGH**: React.memo Usage
```typescript
// ✅ Memoize components that receive stable props
const ProductCard = React.memo(({ product, onSelect }: ProductCardProps): JSX.Element => {
  return (
    <div className={styles.card}>
      {/* component content */}
    </div>
  );
});
```

#### ⚙️ **MEDIUM**: Custom Hook Patterns
```typescript
// ✅ Extract complex state logic to custom hooks
const useFormWizard = (initialData: FormData) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const nextStep = useCallback((): void => {
    setCurrentStep(prev => prev + 1);
  }, []);

  return { currentStep, formData, nextStep };
};
```

### 🛠️ **REFACTOR**: File Size Integration
When components approach the **⚠️ CRITICAL: 150-line limit**, apply these React patterns:

#### 🛠️ **REFACTOR**: Extract Custom Hooks
- Move complex `useState` and `useEffect` logic to custom hooks
- Keep component focused on rendering and event handling
- Reference: [Best Practices - Component Splitting Guidelines](best-practices.md#component-splitting-guidelines)

#### ✨ **ENHANCE**: Container/Presentation Pattern
```typescript
// Container (manages state and data)
const ProductsContainer = (): JSX.Element => {
  const { products, loading, error } = useProducts();
  
  return (
    <ProductsList 
      products={products}
      loading={loading}
      error={error}
    />
  );
};

// Presentation (pure rendering)
const ProductsList = React.memo(({ products, loading, error }: ProductsListProps): JSX.Element => {
  // Pure rendering logic only
});
```

## 🔥 **HIGH**: Next.js 15 App Router React Patterns

### ⚠️ **CRITICAL**: Server vs Client Component Hook Usage

**⚠️ **CRITICAL**: Server Components - Forbidden Patterns:**
```typescript
// ❌ **BLOCKS DEPLOYMENT**: NEVER in Server Components
'use client'; // Don't add this to Server Components
const [state, setState] = useState(); // Hooks not allowed
useEffect(() => {}, []); // Browser APIs not available
```

**✅ **REQUIRED**: Client Components - Required Patterns:**
```typescript
'use client';
// ✅ Required for any component using hooks
export default function InteractiveComponent(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      const data = await getProducts();
      setProducts(data);
    };
    
    fetchProducts();
  }, []);
  
  return <div>{/* render products */}</div>;
}
```

### ⚙️ **MEDIUM**: Component Composition Patterns

**Mixing Server and Client Components:**
```typescript
// Server Component (default)
export default async function ProductPage({ params }: { params: { id: string } }): Promise<JSX.Element> {
  const product = await getProduct(params.id); // Server-side data fetching
  
  return (
    <div>
      {/* Server Component - static content */}
      <ProductDetails product={product} />
      
      {/* Client Component - interactive features */}
      <ProductInteractions productId={product.id} />
      
      {/* Server Component - more static content */}
      <RelatedProducts category={product.category} />
    </div>
  );
}
```

### 🔥 **HIGH**: Form Patterns with App Router

**✨ **PREFERRED**: Server Actions (Preferred for Forms):**
```typescript
// app/create-specification/actions.ts
'use server';
export async function createSpecification(formData: FormData): Promise<void> {
  const data = {
    productId: formData.get('productId') as string,
    // ... other fields
  };
  
  await prisma.specification.create({ data });
  redirect('/specifications');
}

// In component
export default function CreateForm(): JSX.Element {
  return (
    <form action={createSpecification}>
      <input name="productId" />
      <button type="submit">Create</button>
    </form>
  );
}
```

**🔥 **HIGH**: Client-Side Forms (When Validation Needed):**
```typescript
'use client';
export default function ValidatedForm(): JSX.Element {
  const { register, handleSubmit } = useForm<FormData>();
  
  const onSubmit = useCallback(async (data: FormData): Promise<void> => {
    await fetch('/api/specifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }, []);
  
  return <form onSubmit={handleSubmit(onSubmit)}>{/* form fields */}</form>;
}
```

## 🔥 **HIGH**: React Performance Optimization Validation

### 🔥 **HIGH**: AI Validation for Performance Patterns

<!-- AI_VALIDATION
React Performance Patterns to Validate:

useCallback Usage:
- All event handlers wrapped in useCallback: /const\s+\w+\s*=\s*useCallback\(/
- Functions passed as props memoized: Check for function props without useCallback
- State setters in dependencies: useCallback dependencies include only primitives/memoized functions

useMemo Usage:
- Derived state computed with useMemo: /const\s+\w+\s*=\s*useMemo\(/
- Complex computations memoized: Object/array computations wrapped in useMemo
- Filter/map operations on large datasets use useMemo

React.memo Usage:
- Components with props wrapped in React.memo: /export.*React\.memo\(/
- Prop comparison functions for complex props: memo with second parameter

useEffect Dependency Validation:
- No functions in dependency arrays without useCallback: Check dependencies are stable
- No object/array literals in dependencies: Objects should be memoized
- Empty dependency arrays only for mount/unmount effects

Anti-Patterns to Detect:
- Functions defined inside render without useCallback
- Object/array literals in JSX props: {items: []} or {config: {}}
- Missing dependencies in useEffect/useMemo/useCallback
- useEffect for derived state instead of useMemo

Critical Performance Violations:
1. Functions passed as props without useCallback
2. Derived state not using useMemo  
3. Components receiving new objects every render
4. Missing React.memo on components with stable props
5. useEffect dependency arrays with unstable references
-->

## ⚠️ **CRITICAL**: Specific Anti-Patterns to Avoid

### ⚠️ **CRITICAL**: Effect Loop Anti-Patterns
- **⚠️ CRITICAL: Dual Fetching**: Don't fetch the same data from both component and context
- **⚠️ CRITICAL: Unstable Dependencies**: Avoid functions that return new objects/arrays in dependency arrays
- **🔥 HIGH: Cross-Context Updates**: One context update should not trigger another context cyclically
- **🔥 HIGH: Ignored Dependency Warnings**: Always address React Hook dependency warnings

### 🔥 **HIGH**: Performance Anti-Patterns
- **🔥 HIGH: Missing useCallback**: Event handlers not wrapped in useCallback
- **🔥 HIGH: Missing useMemo**: Derived state computed on every render
- **🔥 HIGH: Unnecessary Re-renders**: Components not memoized when receiving stable props
- **⚠️ CRITICAL: Large Component Files**: Components exceeding 150 lines without splitting

## ⚠️ **CRITICAL**: TypeScript Return Types (Required)

All React component and hook functions must have explicit return types:

```typescript
// ✅ Correct: Explicit return types
const MyComponent = (props: Props): JSX.Element => {
  return <div>{props.children}</div>;
};

const useCustomHook = (): { value: string; setValue: (v: string) => void } => {
  const [value, setValue] = useState('');
  return { value, setValue };
};

// ❌ **BLOCKS DEPLOYMENT**: Missing return types
const MyComponent = (props: Props) => {
  return <div>{props.children}</div>;
}

## 🔥 **HIGH**: React Performance Optimization

### 🔥 **HIGH**: Component Optimization Patterns

#### 🔥 **CRITICAL - MANDATORY FOR ALL COMPONENTS**: React.memo
**REQUIREMENT**: ALL functional components MUST be wrapped in React.memo
**VIOLATION CONSEQUENCE**: Unnecessary re-renders, performance degradation, code review rejection

```typescript
// ❌ FORBIDDEN - No memoization
const ProductCard = ({ product }: Props) => {
  return <div>{product.name}</div>;
};
export default ProductCard;

// ✅ MANDATORY - React.memo wrapper
const ProductCard = ({ product }: Props): JSX.Element => {
  return <div>{product.name}</div>;
};
export default React.memo(ProductCard);
```

#### 🔥 **CRITICAL - MANDATORY FOR ALL COMPONENTS**: useCallback for Event Handlers
**REQUIREMENT**: ALL event handlers and functions passed as props MUST use useCallback
**VIOLATION CONSEQUENCE**: Child component re-renders, performance issues

```typescript
// ❌ FORBIDDEN - No useCallback
const handleClick = () => {
  setData(newData);
};

// ✅ MANDATORY - useCallback wrapper
const handleClick = useCallback(() => {
  setData(newData);
}, [newData]);
```

#### 🔥 **CRITICAL - MANDATORY FOR ALL COMPONENTS**: useMemo for Derived State
**REQUIREMENT**: ALL computed values, filtered data, and expensive calculations MUST use useMemo
**VIOLATION CONSEQUENCE**: Unnecessary computations on every render

```typescript
// ❌ FORBIDDEN - Computation on every render
const filteredProducts = products.filter(p => p.category === selectedCategory);

// ✅ MANDATORY - useMemo wrapper
const filteredProducts = useMemo(() => 
  products.filter(p => p.category === selectedCategory),
  [products, selectedCategory]
);
```
