---
title: UI/UX Patterns Guide
description: Simple patterns for component structure and styling
version: 1.2.0
status: stable
lastUpdated: 2025-06-17
author: Development Team
complianceLevel: high
readingTime: 8 minutes
tags: [ui, components, accessibility, css, patterns]
---

# UI/UX Patterns Guide

*Simple patterns and guidance for UI/UX development.*

<!-- AI_QUICK_REF
Key Rules: Component-scoped CSS, Single responsibility components, Accessibility guidelines, Performance optimization
Avoid: Global CSS styles, Complex components, Inaccessible UI elements, Heavy implementations
-->

<!-- AI_SUMMARY
This guide defines technical patterns for UI/UX development:

• Component-scoped CSS: Styles tied to individual components
• Single responsibility components: Each component handles one purpose
• Mobile-first design: Start with mobile then add desktop features 
• Accessibility compliance: Keyboard navigation and screen reader support
• Performance optimization: Minimal dependencies and efficient rendering
• Consistent behaviors: Similar components behave predictably

This guide focuses on technical implementation for solo development.
-->

## Summary

This guide defines technical patterns for UI components. Focus is on simplicity. Focus is on maintainability. Built for solo development.

For strategic UI/UX guidance and design philosophy, see [UI/UX Design Decisions](../project/ui-ux-design.md).

Key requirements include component-scoped CSS. Also small single-purpose components. Also accessibility-first development. The guidance prioritizes practical approaches. These maximize productivity. They ensure quality user experience.

## Key Rules

1. **Component-Scoped Styling**: All styles tied to individual components
2. **Single Responsibility**: Each component has one clear purpose
3. **Mobile-First**: Follow mobile-first principles defined in [UI/UX Design Decisions](../project/ui-ux-design.md)
4. **Accessibility**: Implement accessibility patterns defined in [UI/UX Design Decisions](../project/ui-ux-design.md)
5. **Performance**: Use minimal dependencies. Use efficient rendering.
6. **Consistent Behavior**: Similar components behave predictably
7. **Practical Simplicity**: Choose straightforward implementations

## Overview

### CSS Strategy
- **Component-Scoped**: CSS Modules for isolated styling
- **Minimal Global Styles**: Avoid large shared stylesheets
- **Simple Patterns**: Use easy styling approaches

### Responsive Design
For comprehensive responsive design strategy, see [UI/UX Design Decisions](../project/ui-ux-design.md).

Implementation patterns:
- **CSS Modules**: Use responsive patterns defined in design system
- **Performance Focus**: Optimize for mobile speed
- **Progressive Enhancement**: Follow design system guidelines

## Component Organization

### Implementation Patterns
- **Consistent Behaviors**: Similar components behave the same
- **Reusable Elements**: Common patterns like buttons and forms and cards
- **State Variations**: Clear visual states like disabled and loading and error and success
- **Flexible Sizing**: Components adapt to different content

## Design System Implementation

### Color and Typography
Follow the design system defined in [UI/UX Design Decisions](../project/ui-ux-design.md):
- **Limited Palette**: Use defined color scheme
- **Readable Typography**: Use approved fonts
- **Consistent Spacing**: Follow 8px grid system

### Accessibility Implementation
For accessibility strategy and requirements, see [UI/UX Design Decisions](../project/ui-ux-design.md).

Technical implementation patterns:
- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: Follow accessibility code patterns
- **Keyboard Navigation**: Implement proper focus management
- **Error Messages**: Use accessible error patterns

## EXAMPLES

### Component CSS Example

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

### Form Example

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
