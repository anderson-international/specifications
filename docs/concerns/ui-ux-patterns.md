---
complianceLevel: high
status: stable
tags: [ui, components, accessibility, css, patterns]
id: 1009
---

# UI/UX Patterns Guide

*Technical patterns for UI/UX component development.*

<!-- AI_QUICK_REF
Overview: This guide defines technical patterns for UI/UX development
Key Rules: Component-scoped CSS, Single responsibility components, Accessibility guidelines, Performance optimization
Avoid: Global CSS styles, Complex components, Inaccessible UI elements, Heavy implementations
-->

## Overview

This guide provides technical patterns for UI components. These patterns focus on simplicity and maintainability. They work best for solo development projects.

The guide covers three main areas:

- **Component Architecture**: Structure UI components.
- **CSS Strategy**: Organize styles effectively.
- **Implementation Standards**: Build accessible, performant components.

For strategic UI/UX guidance, see [UI/UX Design Decisions](../project/ui-ux-design.md).

## Core Requirements

Before building components, follow these requirements:

- **Component-scoped CSS**: Keep styles within component boundaries.
- **Single-purpose components**: Each component handles one task.
- **Accessibility-first development**: Build for all users from the start.

These requirements ensure components remain maintainable and scalable.

## Key Development Rules

Follow these essential rules for component development:

1. **Component-Scoped Styling**: Keep styles tied to individual components.
2. **Single Responsibility**: Give each component one purpose.
3. **Mobile-First**: Start with mobile layouts. Enhance for desktop.
4. **Accessibility**: Build keyboard navigation and screen reader support.
5. **Performance**: Use minimal dependencies and efficient rendering.
6. **Consistent Behavior**: Make similar components behave predictably.
7. **Practical Simplicity**: Choose simple implementations over complex ones.

These rules create a cohesive development approach.

## CSS Implementation Strategy

The CSS strategy builds on the component-scoped approach. This strategy keeps styles organized and maintainable.

### Component-Scoped CSS Approach

Use these CSS approaches for component styling:

- **CSS Modules**: Isolate styles to individual components.
- **Minimal Global Styles**: Avoid large shared stylesheets.
- **Simple Patterns**: Use straightforward styling approaches.

This approach prevents style conflicts between components.

### Responsive Design Implementation

For responsive design strategy, see [UI/UX Design Decisions](../project/ui-ux-design.md).

Use these responsive patterns in your components:

- **CSS Modules**: Apply responsive patterns from the design system.
- **Performance Focus**: Optimize for mobile speed first.
- **Progressive Enhancement**: Follow established design system guidelines.

Responsive design ensures components work across all devices.

## Component Architecture Patterns

Component architecture determines how you organize and structure UI elements. Good architecture makes components easier to maintain and reuse.

### Core Component Patterns

Use these patterns when building components:

- **Consistent Behaviors**: Similar components behave the same way.
- **Reusable Elements**: Create common patterns for buttons, forms, and cards.
- **State Variations**: Define clear visual states for disabled, loading, error, and success.
- **Flexible Sizing**: Make components adapt to different content sizes.

These patterns create a predictable component system.

## Design System Integration

Design system integration ensures visual consistency. All components must follow the established design system patterns.

### Colors and Typography Standards

Follow the design system from [UI/UX Design Decisions](../project/ui-ux-design.md):

- **Limited Color Palette**: Use the defined color scheme only.
- **Readable Typography**: Apply approved fonts and font sizes.
- **Consistent Spacing**: Follow the 8px grid system throughout.

Consistent colors and typography create visual harmony.

### Accessibility Implementation Standards

For accessibility strategy, see [UI/UX Design Decisions](../project/ui-ux-design.md).

Use these accessibility patterns in all components:

- **Semantic HTML**: Use proper HTML elements for their intended purpose.
- **ARIA Labels**: Apply accessibility code patterns correctly.
- **Keyboard Navigation**: Implement proper focus management.
- **Error Messages**: Use accessible error patterns consistently.

Accessibility ensures all users can interact with your components.

## Code Examples

These examples demonstrate how to apply these patterns in practice. Use these examples as templates for your own components.

### Component CSS Implementation

```tsx
// ProductCard.tsx
import React from 'react';
import styles from './ProductCard.module.css';

export function ProductCard({ product }) {
  return (
    <div className={styles.card}>
      <img className={styles.image} src={product.imageUrl} alt={product.name} />
      <h3 className={styles.title}>{product.name}</h3>
      <button className={styles.button}>Add to Cart</button>
    </div>
  );
}
```

Here is the corresponding CSS module:

```css
/* ProductCard.module.css */
.card {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.button {
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}
```

### Accessible Form Component

Here is an accessible form implementation:

```tsx
import React, { useState } from 'react';
import styles from './ContactForm.module.css';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  
  return (
    <form 
      className={styles.form} 
      onSubmit={handleSubmit}
      aria-label="Contact form"
    >
      <fieldset>
        <legend>Contact Information</legend>
        
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            aria-required="true"
            className={styles.input}
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
        >
          Send Message
        </button>
      </fieldset>
    </form>
  );
}
```

These examples show how to implement component-scoped CSS, accessibility patterns, and maintainable component structure.
