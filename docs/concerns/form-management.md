# Form Management Documentation

*Strategic guidance for form management decisions and patterns.*

<!-- AI_NAVIGATION
Primary Focus: React Hook Form strategy, multi-step wizard patterns, schema validation
Key Compliance Points:
- React Hook Form for all form handling (line 20, 23)
- Schema-based validation (line 24)
- Multi-step wizard implementation (line 68-89)
- Draft management patterns (line 91-109)
- Next.js Server Actions for simple forms (line 34-39)
Critical for: All form components, wizard implementation, validation patterns
Cross-references: database-form-integration.md (implementation), react-patterns.md (React hooks)
Decision Framework: Simple vs Complex forms (line 28-47)
-->

> **📋 Quick Navigation:**
> - **Implementation Guides**: [Database-Form Integration](../guides/database-form-integration.md) | [React Development Patterns](../guides/react-patterns.md)
> - **UI/UX Design**: [UI/UX Design Decisions](../project/ui-ux-design.md) | [Component Patterns](ui-ux-patterns.md)
> - **Development Standards**: [Best Practices](../guides/best-practices.md) | [Architectural Guidelines](../guides/architectural-guidelines.md)
> - **Technical Context**: [Database Schema](../db-schema.txt) | [API Design](api-design.md)
> - **Project Setup**: [Technical Stack](../project/technical-stack.md) | [Feature Requirements](../project/feature-requirements.md)

## Overview

This document provides strategic guidance for form management decisions and patterns. Focus is on simplicity and consistency for a solo hobbyist project with type-safe validation.

> **🔄 Implementation Status:** See [our-plan.md](../our-plan.md) → Phase 2.2 Specification Management Core for current form wizard implementation progress.

## 🔥 **HIGH**: Form Strategy

**⚠️ **CRITICAL**: Core Approach**: React Hook Form with schema-based validation for all form interactions.

### ⚠️ **CRITICAL**: Technology Philosophy
- **⚠️ CRITICAL: React Hook Form**: Single form library for all form handling needs
- **⚠️ CRITICAL: Schema Validation**: Type-safe validation with consistent error handling
- **🔥 HIGH: Performance Focus**: Minimize re-renders and optimize user experience
- **⚙️ MEDIUM: Separation of Concerns**: Keep form logic separate from UI components

### ⚙️ **MEDIUM**: Form Complexity Decision Framework

**Simple Forms**: Basic validation, single-step interaction
- **Approach**: Standard form handling with validation
- **Use Case**: Login, simple settings, basic data entry

**Complex Forms**: Multi-step wizards, conditional logic, extensive validation
- **Approach**: Enhanced patterns with step management
- **Use Case**: Multi-step data creation, complex business workflows

**Minimal Forms**: Basic required fields only
- **Approach**: Simplified patterns with minimal validation
- **Use Case**: Quick actions, simple confirmations

## 🔥 **HIGH**: Validation Strategy

**Philosophy**: Schema-driven validation with consistent error handling and type safety.

### ⚠️ **CRITICAL**: Validation Patterns
- **⚠️ CRITICAL: Schema-First**: Define validation rules before implementation
- **🔥 HIGH: Client-Server Consistency**: Share validation logic between frontend and backend
- **🔥 HIGH: Progressive Validation**: Validate as user progresses through form
- **⚙️ MEDIUM: Clear Feedback**: Immediate, actionable error messages

### 🔥 **HIGH**: Error Handling
- **⚠️ CRITICAL: Explicit Errors**: Never hide validation failures
- **🔥 HIGH: Field-Level Feedback**: Show errors at the field level when possible
- **⚙️ MEDIUM: Form-Level Feedback**: Display overall form status and submission errors
- **⚙️ MEDIUM: Consistent Messaging**: Standardized error message patterns

### AI_VALIDATION
Form Management Compliance Patterns:

React Hook Form Usage:
- All forms use useForm hook: /const.*=.*useForm</
- Form submission wrapped in handleSubmit: /handleSubmit\(/
- Field registration with register: /\{\.\.\.register\(/
- Error handling with formState.errors: /formState\.errors/

Zod Schema Validation:
- Schema files separate from components: *.schema.ts files
- Schema integration with resolver: /zodResolver\(/
- Type inference from schema: /z\.infer<typeof.*Schema>/
- Schema export pattern: /export.*=.*z\.object\(/

Multi-Step Form Patterns:
- Step validation before progression: Check for validation calls before setStep
- State persistence across steps: useForm with defaultValues
- Draft auto-save implementation: useEffect with form watch
- Step navigation controls: Previous/Next button handlers

Server Action Integration:
- Form action attribute: /action=\{.*\}/
- Server-side validation: Zod schema validation in actions
- Error return patterns: Return { errors: ... } from actions
- Loading state management: useFormStatus or pending states

Critical Form Anti-Patterns:
1. Forms without schema validation
2. Client-only validation (no server validation)
3. Missing error handling for field-level feedback
4. State management outside React Hook Form
5. Missing loading states during submission
6. No draft save functionality for multi-step forms

Form Validation Requirements:
- Progressive validation: Validate on blur, show errors immediately
- Field-level errors: Individual field error display
- Form-level errors: Overall submission error handling
- Client-server consistency: Same validation rules both sides
- Type safety: TypeScript integration with Zod schemas

## 🔥 **HIGH**: Multi-Step Form Strategy

**Approach**: Step-based form management with validation at each stage.

### 🔥 **HIGH**: Step Management
- **🔥 HIGH: Progressive Validation**: Validate current step before advancing
- **🔥 HIGH: State Persistence**: Maintain form state across steps
- **⚙️ MEDIUM: Navigation Control**: Allow backward navigation with data preservation
- **⚙️ MEDIUM: Visual Progress**: Clear indication of current step and overall progress

### ⚙️ **MEDIUM**: Data Flow Patterns
- **Step Isolation**: Each step handles its own validation and data
- **Centralized State**: Form data managed in single location
- **Async Validation**: Handle server-side validation without blocking UI
- **Draft Saving**: Optional auto-save for long forms

## ⚙️ **MEDIUM**: Integration Patterns

### Component Integration
- **Hook-Based**: Custom hooks for form logic encapsulation
- **Provider Pattern**: Share form context across related components
- **Controlled Components**: Maintain consistent data flow
- **Reusable Patterns**: Common form components and validation logic

### API Integration
- **Submission Handling**: Consistent patterns for form submission to APIs
- **Error Mapping**: Convert API errors to form field errors
- **Loading States**: Handle async submission with appropriate UI feedback
- **Success Handling**: Consistent post-submission user flows

## 🔥 **HIGH**: Next.js 15 App Router Form Patterns

### ✨ **PREFERRED**: Server Actions vs Client-Side Forms

**✨ **PREFERRED**: Server Actions (Preferred for Simple Forms):**
```typescript
// app/actions/specification.ts
'use server';
export async function createSpecification(formData: FormData): Promise<void> {
  const data = {
    productId: formData.get('productId') as string,
    experienceLevel: formData.get('experienceLevel') as string,
  };
  
  // ⚠️ **CRITICAL**: Validate with Zod
  const validatedData = specificationSchema.parse(data);
  
  await prisma.specification.create({
    data: validatedData
  });
  
  redirect('/specifications');
}

// In component
export default function SimpleForm(): JSX.Element {
  return (
    <form action={createSpecification}>
      <input name="productId" required />
      <select name="experienceLevel">
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
      </select>
      <button type="submit">Create</button>
    </form>
  );
}
```

**🔥 **HIGH**: Client Components (For Complex Validation):**
```typescript
'use client';
export default function ComplexForm(): JSX.Element {
  const { register, handleSubmit, formState: { errors } } = useForm<SpecificationData>({
    resolver: zodResolver(specificationSchema) // ⚠️ **CRITICAL**: Required for type safety
  });
  
  const onSubmit = useCallback(async (data: SpecificationData): Promise<void> => {
    await fetch('/api/specifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }, []);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* React Hook Form with real-time validation */}
    </form>
  );
}
```

### 🔥 **HIGH**: Multi-Step Form Architecture

**🔥 **HIGH**: App Router Multi-Step Pattern:**
```typescript
// app/create-specification/page.tsx (Client Component for wizard)
'use client';
export default function SpecificationWizard(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SpecificationData>>({});
  
  // Wizard navigation and state management
  return <WizardContainer step={currentStep} data={formData} />;
}

// Individual steps can be Server or Client components based on needs
// Step 1: Product Selection (Server Component - data fetching)
export default async function ProductSelectionStep(): Promise<JSX.Element> {
  const products = await getProducts();
  return <ProductSelector products={products} />;
}

// Step 2: Interactive Form (Client Component - state management)  
'use client';
export default function CharacteristicsStep(): JSX.Element {
  const { register, watch } = useForm();
  return <CharacteristicsForm register={register} watch={watch} />;
}
```

### ⚙️ **MEDIUM**: Draft Management with App Router

**Server Actions for Draft Operations:**
```typescript
'use server';
export async function saveDraft(formData: FormData): Promise<void> {
  const draftData = Object.fromEntries(formData);
  
  await prisma.specificationDraft.upsert({
    where: { userId: getCurrentUserId() },
    update: { data: draftData },
    create: { userId: getCurrentUserId(), data: draftData },
  });
}

export async function loadDraft(userId: string): Promise<DraftData | null> {
  return await prisma.specificationDraft.findUnique({
    where: { userId }
  });
}
```

**Client Component Integration:**
```typescript
'use client';
export default function AutoSaveForm(): JSX.Element {
  const { register, watch, getValues } = useForm();
  const watchedValues = watch();
  
  // Auto-save with Server Actions
  useEffect(() => {
    const timer = setTimeout(async () => {
      const formData = new FormData();
      Object.entries(getValues()).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      await saveDraft(formData);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [watchedValues, getValues]);
  
  return <form>{/* form fields */}</form>;
}
```

## ⚙️ **MEDIUM**: Development Patterns

### Form Organization
- **Custom Hooks**: Encapsulate form logic in reusable hooks
- **Validation Schemas**: Centralized schema definitions for reuse
- **Form Components**: Modular, testable form components
- **Type Safety**: Leverage TypeScript for form data types

### Testing Strategy
- **Unit Testing**: Test form logic and validation independently
- **Integration Testing**: Test complete form workflows
- **User Flow Testing**: Validate end-to-end form experiences
- **Error Scenario Testing**: Test validation and error handling

## ⚙️ **MEDIUM**: Performance Considerations

### Optimization Patterns
- **Minimal Re-renders**: Optimize form performance for complex forms
- **Debounced Validation**: Avoid excessive validation calls during typing
- **Conditional Rendering**: Only render necessary form sections
- **Memory Management**: Clean up form state when components unmount
