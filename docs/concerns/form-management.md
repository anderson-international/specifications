---
complianceLevel: required
status: stable
tags: [forms, validation, react, zod]
id: 1008
---

# Form Management Guide

*Simple guide for form patterns and decisions.*

<!-- AI_QUICK_REF
Overview: This guide defines our form approach
Key Rules: React Hook Form, Zod validation, Multi-step wizard patterns
Avoid: Uncontrolled inputs, Missing validation, Direct submission
-->

<!-- AI_SUMMARY
This guide defines our form approach:

• Use React Hook Form with Zod validation
• Simple forms use Server Actions
• Complex forms use client components
• Implement field validation and error handling
• Wrap submission in handleSubmit
• Use validation on client and server
• Show errors with field feedback
• Optimize performance

Avoid these patterns:
• Raw inputs without React Hook Form
• Missing validation
• Hard-coded validation rules
• Direct submission without validation
-->

## Summary

We use **React Hook Form** with **Zod validation** for all forms.

Simple forms use Server Actions. 
Complex forms use client components. 
They use wizard patterns. 
All forms need field validation. 
They need error handling.

## Key Rules

1. **Type Safety**: Validate data with Zod schemas
2. **Consistent Patterns**: Use React Hook Form everywhere  
3. **Performance**: Minimize re-renders with proper hooks
4. **Progressive Validation**: Validate as users type
5. **Error Handling**: Show errors clearly

## Overview

This guide covers form management patterns. 
Focus is on simplicity. 
Focus is on consistency. 
Built for a solo project. 
Uses type-safe validation.

## Form Strategy

**Core Approach**: React Hook Form with schema validation.

### Technology Stack
- **React Hook Form**: Single form library
- **Schema Validation**: Type-safe validation  
- **Performance Focus**: Minimize re-renders

### Form Types

**Simple Forms**: Basic validation
- **Approach**: Standard form handling
- **Use Case**: Login and settings

**Complex Forms**: Multi-step wizards  
- **Approach**: Enhanced patterns with steps
- **Use Case**: Data creation and workflows

## Validation Strategy

**Philosophy**: Schema-driven validation. 
Uses consistent errors.

### Validation Patterns
- **Schema-First**: Define rules before coding
- **Client-Server**: Share logic between frontend and backend
- **Progressive**: Validate as user progresses
- **Clear Feedback**: Show immediate errors

### Error Handling
- **Explicit Errors**: Never hide failures
- **Field-Level**: Show errors at field level
- **Form-Level**: Display overall status

## Multi-Step Forms

**Approach**: Step-based management with validation.

### Step Management
- **Progressive Validation**: Validate each step
- **State Persistence**: Keep data across steps
- **Navigation Control**: Allow backward movement

### Data Flow
- **Step Isolation**: Each step handles own validation
- **Centralized State**: Single data location
- **Async Validation**: Handle server validation

## Integration Patterns

### Component Integration
- **Hook-Based**: Custom hooks for logic
- **Provider Pattern**: Share context
- **Controlled Components**: Consistent data flow

### API Integration
- **Submission Handling**: Consistent submission patterns
- **Error Mapping**: Convert API errors to form errors
- **Loading States**: Handle async submission

## EXAMPLES

### ✅ CORRECT: Simple Form with Server Action

```typescript
// app/contact/page.tsx
export default function ContactPage(): JSX.Element {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <form action={submitContact}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Your Name</label>
          <input 
            id="name" 
            name="name" 
            className="w-full p-2 border rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Your Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            className="w-full p-2 border rounded" 
            required 
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

// app/contact/actions.ts
'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address")
});

export async function submitContact(formData: FormData): Promise<void> {
  // Validate with schema
  const data = {
    name: formData.get('name'),
    email: formData.get('email')
  };
  
  // ⚠️ CRITICAL: Always validate
  const validatedData = contactSchema.parse(data);
  
  // Process the data
  await saveContactRequest(validatedData);
  
  // Redirect after successful submission
  redirect('/contact/thank-you');
}
```

### ✅ CORRECT: Complex Form with React Hook Form and Zod

```typescript
// app/specifications/create/form-component.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema definition
const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters")
});

// Type derived from schema
type ProductData = z.infer<typeof productSchema>;

export default function ProductForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductData>({
    resolver: zodResolver(productSchema)
  });
  
  const onSubmit = async (data: ProductData) => {
    // Process the data
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          {...register('name')}
          className="w-full p-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full p-2 border rounded h-24"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Product
      </button>
    </form>
  );
}
```

## Performance Considerations

### Optimization Patterns
- **Minimal Re-renders**: Optimize form performance
- **Debounced Validation**: Avoid excessive validation calls
- **Conditional Rendering**: Only render necessary form sections

### Performance Best Practices
- Use `useCallback` for event handlers
- Implement `React.memo` for expensive form components
- Consider field-level registration for large forms

## AI_VALIDATION
Essential form patterns:

**React Hook Form:**
- Hook usage: /const.*=.*useForm</
- Submit handling: /handleSubmit\(/
- Field registration: /\{\.\.\.register\(/
- Error handling: /formState\.errors/

**Zod Schema:**
- Schema files: *.schema.ts
- Resolver: /zodResolver\(/
- Type inference: /z\.infer<typeof.*Schema>/

**Critical Anti-Patterns:**
1. Forms without schema validation
2. Client-only validation  
3. Missing error handling
4. External state management
5. Missing loading states
