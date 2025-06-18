---
title: Database-Form Integration Guide
description: Comprehensive guide for schema-driven form development using database annotations and React Hook Form patterns
version: 1.0.0
status: active
lastUpdated: 2025-06-17
author: Development Team
complianceLevel: critical
readingTime: 22 minutes
tags: [database, forms, schema, react-hook-form, validation, annotations]
---

# Database-Form Integration Guide

*Comprehensive guide for implementing forms using database schema annotations and patterns.*

<!-- AI_QUICK_REF
Key Rules: AI_TABLE_PURPOSE annotations (line 16), Schema validation patterns (line 71), Database transactions (line 91), Enum caching (line 137)
Avoid: Missing junction table transformation, Bypassing schema validation, Redundant enum fetches, Non-atomic database operations
-->

<!-- AI_SUMMARY
This guide establishes schema-driven form development patterns for the Specification Builder project with these key components:

• Schema Annotation System - AI_TABLE_PURPOSE, AI_FORM_TYPE, and AI_WORKFLOW annotations in db-schema.txt that guide form component implementation
• Enum Table Integration - Single-select dropdown components with caching strategies and efficient data fetching patterns for database enum tables
• Junction Table Handling - Multi-select checkbox/tag components for many-to-many relationships with proper data transformation patterns
• Multi-Step Form Implementation - Step-based schema validation, database transaction handling, and atomic operations for complex form workflows
• Field Component Patterns - Boolean toggles, star ratings, and other specialized input components following schema annotation guidance
• Performance Optimization - Enum data caching, React Query integration, and efficient data fetching to prevent repeated database calls

The approach uses database schema annotations as the single source of truth for form implementation, ensuring consistency between data structure and UI components.
-->

> **📋 Quick Navigation:**
> - **Form Implementation**: [Form Management](../concerns/form-management.md) | [UI/UX Design](../project/ui-ux-design.md)
> - **React Implementation**: [React Development Patterns](react-patterns.md) | [Code Quality Standards](code-quality-standards.md)
> - **Data Context**: [Database Schema](../db-schema.txt) | [API Design](../concerns/api-design.md)
> - **Project Setup**: [Technical Stack](../project/technical-stack.md) | [Feature Requirements](../project/feature-requirements.md)

> **📋 This guide explains how to use `docs/db-schema.txt` AI annotations for React Hook Form implementation. For form management strategy, see [Form Management Documentation](../concerns/form-management.md).**

## ⚠️ **CRITICAL**: Schema-Driven Form Development

### ⚠️ **CRITICAL**: Using AI_TABLE_PURPOSE Annotations

The database schema includes AI-optimized annotations that guide form implementation:

- **⚠️ CRITICAL: `AI_TABLE_PURPOSE`**: Defines primary use case and form complexity
- **🔥 HIGH: `AI_FORM_TYPE`**: Specifies recommended UI component patterns
- **⚙️ MEDIUM: `AI_WORKFLOW`**: Indicates state management requirements
- **🔥 HIGH: `// FORM:`**: Inline field-specific implementation guidance

### Example Annotations

```typescript
// Core specification data - Multi-step wizard
specifications: {
  purpose: "Core specification data - main CRUD operations focus here",
  formType: "Multi-step wizard form (product selection, ratings, review, enums)",
  workflow: "Draft → Published → Needs Revision → Under Review"
}

// Junction tables - Multi-select components
spec_cures: {
  purpose: "Junction table - handle as multi-select in forms",
  formType: "Multi-select checkboxes or tags"
}
```

## 🔥 **HIGH**: Enum Table Integration

### ⚠️ **CRITICAL**: Single-Select Enum Fields

For fields with enum relationships:

```typescript
// Schema annotation: FORM: dropdown from enum_product_types, REQUIRED
const ProductTypeSelect = ({ control, errors }: FormFieldProps): JSX.Element => {
  const { data: productTypes } = useProductTypes(); // Fetch enum data

  return (
    <Controller
      name="product_type_id"
      control={control}
      rules={{ required: "Product type is required" }}
      render={({ field }) => (
        <select {...field}>
          <option value="">Select product type...</option>
          {productTypes?.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      )}
    />
  );
};
```

### 🔥 **HIGH**: Enum Data Fetching Pattern

```typescript
// Custom hook for enum data fetching
const useEnumData = (enumType: string) => {
  return useQuery({
    queryKey: ['enum', enumType],
    queryFn: () => fetchEnumData(enumType),
    staleTime: 5 * 60 * 1000, // 5 minutes - enums rarely change
  });
};

// Usage
const { data: productTypes } = useEnumData('product_types');
```

## 🔥 **HIGH**: Junction Table Handling

### ⚠️ **CRITICAL**: Multi-Select Component Pattern

For junction tables (many-to-many relationships):

```typescript
// Schema annotation: AI_FORM_TYPE: Multi-select checkboxes or tags
const TastingNotesMultiSelect = ({ control }: FormFieldProps): JSX.Element => {
  const { data: tastingNotes } = useEnumData('tasting_notes');

  return (
    <Controller
      name="tasting_note_ids"
      control={control}
      render={({ field: { value = [], onChange } }) => (
        <div className={styles.multiSelect}>
          {tastingNotes?.map(note => (
            <label key={note.id}>
              <input
                type="checkbox"
                checked={value.includes(note.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...value, note.id]);
                  } else {
                    onChange(value.filter((id: number) => id !== note.id));
                  }
                }}
              />
              {note.name}
            </label>
          ))}
        </div>
      )}
    />
  );
};
```

### ⚠️ **CRITICAL**: Junction Table Data Transformation

```typescript
// Transform form data for junction table creation
const transformSpecificationData = (formData: SpecificationFormData) => {
  const { tasting_note_ids, cure_ids, tobacco_type_ids, ...coreData } = formData;

  return {
    // Core specification data
    specification: coreData,
    
    // Junction table data
    junctionData: {
      spec_tasting_notes: tasting_note_ids.map(id => ({
        enum_tasting_note_id: id
      })),
      spec_cures: cure_ids.map(id => ({
        enum_cure_id: id
      })),
      spec_tobacco_types: tobacco_type_ids.map(id => ({
        enum_tobacco_type_id: id
      }))
    }
  };
};
```

## ⚠️ **CRITICAL**: Schema-to-Zod Validation

```typescript
// Generate Zod schemas from database annotations
const createSpecificationSchema = () => z.object({
  // Required fields from schema annotations
  shopify_handle: z.string().min(1, "Product selection required"),
  product_type_id: z.number().min(1, "Product type required"),
  
  // Field-specific validation based on schema hints
  star_rating: z.number().min(1, "Rating required").max(5, "Rating must be 1-5"),
  
  // Junction table arrays
  tasting_note_ids: z.array(z.number()).min(1, "Select at least one tasting note"),
  cure_ids: z.array(z.number()).default([]),
  
  // Boolean fields with defaults
  is_fermented: z.boolean().default(false),
  is_oral_tobacco: z.boolean().default(false)
});
```

## 🔥 **HIGH**: Multi-Step Form Implementation

### Step-Based Schema Validation

```typescript
// Split schema by wizard steps based on UI groupings
const Step1Schema = z.object({
  shopify_handle: z.string().min(1, "Product selection required"),
});

const Step2Schema = z.object({
  product_type_id: z.number().min(1, "Product type required"),
  experience_level_id: z.number().min(1, "Experience level required")
});

const Step3Schema = z.object({
  cure_ids: z.array(z.number()).default([]),
  grind_id: z.number().min(1, "Grind selection required"),
  is_fermented: z.boolean().default(false)
});
```

### ⚠️ **CRITICAL**: Database Transaction Handling

```typescript
// Handle specification creation with junction tables
const createSpecificationWithRelations = async (data: SpecificationFormData) => {
  const { specification, junctionData } = transformSpecificationData(data);

  // Use database transaction for atomic operations
  return await db.transaction(async (trx) => {
    // Create core specification
    const [spec] = await trx('specifications')
      .insert(specification)
      .returning('*');

    // Create junction table entries
    if (junctionData.spec_tasting_notes.length > 0) {
      await trx('spec_tasting_notes').insert(
        junctionData.spec_tasting_notes.map(item => ({
          ...item,
          specification_id: spec.id
        }))
      );
    }
    
    return spec;
  });
};
```

## ⚙️ **MEDIUM**: Field Components

### Boolean Toggle Component

```typescript
// Schema annotation: FORM: checkbox or toggle
const BooleanToggle = ({ name, label, control }: BooleanFieldProps): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <label>
          <input
            type="checkbox"
            checked={value || false}
            onChange={onChange}
          />
          {label}
        </label>
      )}
    />
  );
};
```

### Star Rating Component

```typescript
// Schema annotation: FORM: 1-5 star rating input
const StarRating = ({ control, name }: RatingFieldProps): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ min: 1, max: 5, required: "Rating is required" }}
      render={({ field: { value, onChange } }) => (
        <div>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={star <= value ? 'filled' : ''}
            >
              ★
            </button>
          ))}
        </div>
      )}
    />
  );
};
```

## 🔥 **HIGH**: Performance Optimization

### ⚠️ **CRITICAL**: Enum Data Caching

```typescript
// Cache enum data globally to prevent repeated fetches
const useEnumCache = () => {
  const queryClient = useQueryClient();
  
  const preloadEnums = useCallback(async (): Promise<void> => {
    const enumTypes = [
      'product_types', 'grinds', 'nicotine_levels', 
      'experience_levels', 'moisture_levels', 'product_brands',
      'tasting_notes', 'cures', 'tobacco_types'
    ];

    await Promise.all(
      enumTypes.map(type => 
        queryClient.prefetchQuery({
          queryKey: ['enum', type],
          queryFn: () => fetchEnumData(type),
          staleTime: 10 * 60 * 1000 // 10 minutes
        })
      )
    );
  }, [queryClient]);

  return { preloadEnums };
};
```

*Database schema annotations are maintained in `docs/db-schema.txt`. Update annotations when schema changes to maintain form implementation guidance.*
