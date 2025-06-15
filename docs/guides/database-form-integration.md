# Database-Form Integration Guide

*Comprehensive guide for implementing forms using database schema annotations and patterns.*

<!-- AI_NAVIGATION
Primary Focus: Schema-driven form development, AI table annotations, React Hook Form patterns
Key Compliance Points:
- AI_TABLE_PURPOSE annotations (line 16-23)
- Schema validation patterns (line 71-89)
- Database transaction usage (line 91-108)
- Junction table handling (line 110-135)
- Enum caching patterns (line 137-155)
Critical for: Form components, database operations, specification wizard
Cross-references: db-schema.txt (schema), form-management.md (strategy), react-patterns.md (hooks)
Implementation Strategy: Schema annotations drive component generation
-->

> **📋 Quick Navigation:**
> - **Core Strategy**: [Form Management](../concerns/form-management.md) | [UI/UX Design Decisions](../project/ui-ux-design.md)
> - **React Implementation**: [React Development Patterns](react-patterns.md) | [Best Practices](best-practices.md)
> - **Code Standards**: [Architectural Guidelines](architectural-guidelines.md) | [Code Quality Standards](code-quality-standards.md)
> - **Database Context**: [Database Schema](../db-schema.txt) | [API Design](../concerns/api-design.md)
> - **Technical Setup**: [Technical Stack](../project/technical-stack.md) | [Feature Requirements](../project/feature-requirements.md)

> **📋 This guide explains how to use `docs/db-schema.txt` AI annotations for React Hook Form implementation. For form management strategy, see [Form Management Documentation](../concerns/form-management.md).**

## ⚠️ **CRITICAL**: Schema-Driven Form Development

### ⚠️ **CRITICAL**: Using AI_TABLE_PURPOSE Annotations

The database schema includes AI-optimized annotations that guide form implementation:

- **⚠️ CRITICAL: `AI_TABLE_PURPOSE`**: Defines the primary use case and form complexity
- **🔥 HIGH: `AI_FORM_TYPE`**: Specifies the recommended UI component patterns
- **⚙️ MEDIUM: `AI_WORKFLOW`**: Indicates state management requirements
- **🔥 HIGH: `// FORM:`**: Inline field-specific implementation guidance

### ⚙️ **MEDIUM**: Form Complexity Mapping

```typescript
// Core specification data - Multi-step wizard
specifications: {
  purpose: "Core specification data - main CRUD operations focus here",
  formType: "Multi-step wizard form (product selection, ratings, text review, enum selections)",
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

For fields with enum relationships (e.g., `product_type_id`, `grind_id`):

```typescript
// ⚠️ **CRITICAL**: Schema annotation: FORM: dropdown from enum_product_types, REQUIRED
const ProductTypeSelect = ({ control, errors }: FormFieldProps): JSX.Element => {
  const { data: productTypes } = useProductTypes(); // Fetch enum data

  return (
    <Controller
      name="product_type_id"
      control={control}
      rules={{ required: "Product type is required" }} // ⚠️ **CRITICAL**: Required validation
      render={({ field }) => (
        <select {...field} className={styles.select}>
          <option value="">Select product type...</option>
          {productTypes?.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      )}
    />
  );
};
```

### 🔥 **HIGH**: Enum Data Fetching Pattern

```typescript
// 🔥 **HIGH**: Custom hook for enum data fetching
const useEnumData = (enumType: string) => {
  return useQuery({
    queryKey: ['enum', enumType],
    queryFn: () => fetchEnumData(enumType),
    staleTime: 5 * 60 * 1000, // 5 minutes - enums rarely change
  });
};

// Usage in components
const { data: productTypes } = useEnumData('product_types');
const { data: nicotineLevels } = useEnumData('nicotine_levels');
```

## 🔥 **HIGH**: Junction Table Handling

### ⚠️ **CRITICAL**: Multi-Select Component Pattern

For junction tables (many-to-many relationships):

```typescript
// ⚠️ **CRITICAL**: Schema annotation: AI_FORM_TYPE: Multi-select checkboxes or tags
const TastingNotesMultiSelect = ({ control, errors }: FormFieldProps): JSX.Element => {
  const { data: tastingNotes } = useEnumData('tasting_notes');

  return (
    <Controller
      name="tasting_note_ids"
      control={control}
      render={({ field: { value = [], onChange } }) => (
        <div className={styles.multiSelect}>
          {tastingNotes?.map(note => (
            <label key={note.id} className={styles.checkboxLabel}>
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
// ⚠️ **CRITICAL**: Transform form data for junction table creation
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

### ⚠️ **CRITICAL**: Automatic Schema Generation

```typescript
// ⚠️ **CRITICAL**: Generate Zod schemas from database annotations
const createSpecificationSchema = () => z.object({
  // ⚠️ **CRITICAL**: Required fields from schema annotations
  shopify_handle: z.string().min(1, "Product selection required"),
  product_type_id: z.number().min(1, "Product type required"),
  
  // 🔥 **HIGH**: Field-specific validation based on schema hints
  star_rating: z.number().min(1, "Rating required").max(5, "Rating must be 1-5"),
  review: z.string().min(10, "Review must be at least 10 characters"),
  
  // ⚙️ **MEDIUM**: Junction table arrays
  tasting_note_ids: z.array(z.number()).min(1, "Select at least one tasting note"),
  cure_ids: z.array(z.number()).default([]),
  tobacco_type_ids: z.array(z.number()).default([]),
  
  // Boolean fields with defaults
  is_fermented: z.boolean().default(false),
  is_oral_tobacco: z.boolean().default(false),
  is_artisan: z.boolean().default(false)
});
```

## 🔥 **HIGH**: Multi-Step Form Implementation

### 🔥 **HIGH**: Step-Based Schema Validation

```typescript
// 🔥 **HIGH**: Split schema by wizard steps based on UI groupings
const Step1Schema = z.object({
  shopify_handle: z.string().min(1, "Product selection required"),
});

const Step2Schema = z.object({
  product_type_id: z.number().min(1, "Product type required"),
  experience_level_id: z.number().min(1, "Experience level required"),
  tobacco_type_ids: z.array(z.number()).min(1, "Select at least one tobacco type")
});

const Step3Schema = z.object({
  cure_ids: z.array(z.number()).default([]),
  grind_id: z.number().min(1, "Grind selection required"),
  is_fermented: z.boolean().default(false),
  is_oral_tobacco: z.boolean().default(false),
  is_artisan: z.boolean().default(false)
});
```

### ⚠️ **CRITICAL**: Database Transaction Handling

```typescript
// ⚠️ **CRITICAL**: Handle specification creation with junction tables
const createSpecificationWithRelations = async (data: SpecificationFormData) => {
  const { specification, junctionData } = transformSpecificationData(data);

  // ⚠️ **CRITICAL**: Use database transaction for atomic operations
  return await db.transaction(async (trx) => {
    // Create core specification
    const [spec] = await trx('specifications')
      .insert(specification)
      .returning('*');

    // ⚠️ **CRITICAL**: Create junction table entries
    if (junctionData.spec_tasting_notes.length > 0) {
      await trx('spec_tasting_notes').insert(
        junctionData.spec_tasting_notes.map(item => ({
          ...item,
          specification_id: spec.id
        }))
      );
    }

    // Repeat for other junction tables...
    
    return spec;
  });
};
```

## ⚙️ **MEDIUM**: Boolean Field Patterns

### Toggle Implementation

```typescript
// Schema annotation: FORM: checkbox or toggle
const BooleanToggle = ({ name, label, control }: BooleanFieldProps): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={value || false}
            onChange={onChange}
            className={styles.toggleInput}
          />
          <span className={styles.toggleSlider} />
          {label}
        </label>
      )}
    />
  );
};
```

## ⚙️ **MEDIUM**: Rating Input Implementation

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
        <div className={styles.starRating}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              className={`${styles.star} ${star <= value ? styles.filled : ''}`}
              onClick={() => onChange(star)}
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
// ⚠️ **CRITICAL**: Cache enum data globally to prevent repeated fetches
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

## ⚙️ **MEDIUM**: Integration with Form Management

This guide complements the [Form Management Documentation](../concerns/form-management.md):

- **Technical Patterns**: Use form management patterns for React Hook Form setup
- **UI Patterns**: Use [UI/UX Design Decisions](../project/ui-ux-design.md) for wizard layout
- **Performance**: Apply [React Patterns](react-patterns.md) for optimization

---

*Database schema annotations are maintained in `docs/db-schema.txt`. Update annotations when schema changes to maintain form implementation guidance.*
