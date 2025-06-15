# AI COMPLIANCE MATRIX
*Machine-readable compliance rules for automated code review*

## CRITICAL_VIOLATIONS (Block deployment)

### FILE_SIZE_LIMITS
- **RULE_ID**: `component_file_size_limit`
- **STANDARD**: Component files must not exceed 150 lines
- **VALIDATION**: `line_count <= 150`
- **SOURCE**: `best-practices.md:22`
- **ERROR_ACTION**: `refactor_into_smaller_components`
- **SEVERITY**: `critical`

### TYPESCRIPT_RETURN_TYPES  
- **RULE_ID**: `explicit_function_return_types`
- **STANDARD**: All functions must have explicit return types
- **VALIDATION**: `@typescript-eslint/explicit-function-return-type: error`
- **SOURCE**: `code-quality-standards.md:49`
- **ERROR_ACTION**: `add_explicit_return_type_annotations`
- **SEVERITY**: `critical`

### REACT_EFFECT_LOOPS
- **RULE_ID**: `prevent_infinite_effect_loops`
- **STANDARD**: No infinite effect loops - use useMemo for derived state
- **VALIDATION**: `derived_state_in_useMemo_not_useEffect`
- **SOURCE**: `prevent-react-effect-loops.md:1`
- **ERROR_ACTION**: `replace_useEffect_with_useMemo_for_derived_state`
- **SEVERITY**: `critical`

### PAGE_FILE_SIZE_LIMITS
- **RULE_ID**: `page_file_size_limit`
- **STANDARD**: Page files must not exceed 200 lines
- **VALIDATION**: `line_count <= 200`
- **SOURCE**: `best-practices.md:22`
- **ERROR_ACTION**: `extract_components_and_logic`
- **SEVERITY**: `critical`

### UTILITY_FILE_SIZE_LIMITS
- **RULE_ID**: `utility_file_size_limit`
- **STANDARD**: Utility files must not exceed 100 lines
- **VALIDATION**: `line_count <= 100`
- **SOURCE**: `best-practices.md:22`
- **ERROR_ACTION**: `split_utility_functions`
- **SEVERITY**: `critical`

## HIGH_PRIORITY (Address before next phase)

### REACT_MEMO_USAGE
- **RULE_ID**: `react_memo_for_stable_props`
- **STANDARD**: Use React.memo for components with stable props
- **VALIDATION**: `React.memo(component_with_stable_props)`
- **SOURCE**: `react-patterns.md:58`
- **ERROR_ACTION**: `wrap_component_in_memo`
- **SEVERITY**: `high`

### ERROR_BOUNDARIES
- **RULE_ID**: `fail_fast_error_handling`
- **STANDARD**: Implement fail-fast error boundaries
- **VALIDATION**: `error_boundary_wraps_components`
- **SOURCE**: `api-design.md:67`
- **ERROR_ACTION**: `add_error_boundary_wrapper`
- **SEVERITY**: `high`

### USECALLBACK_STATE_UPDATES
- **RULE_ID**: `usecallback_for_state_updates`
- **STANDARD**: Wrap all functions that update state in useCallback
- **VALIDATION**: `state_update_functions_in_useCallback`
- **SOURCE**: `react-patterns.md:25`
- **ERROR_ACTION**: `wrap_state_functions_in_useCallback`
- **SEVERITY**: `high`

### USEMEMO_DERIVED_STATE
- **RULE_ID**: `usememo_for_derived_state`
- **STANDARD**: Use useMemo for all derived state and expensive computations
- **VALIDATION**: `derived_state_in_useMemo`
- **SOURCE**: `react-patterns.md:34`
- **ERROR_ACTION**: `wrap_computations_in_useMemo`
- **SEVERITY**: `high`

### FORM_MANAGEMENT_PATTERNS
- **RULE_ID**: `react_hook_form_with_zod`
- **STANDARD**: Use React Hook Form with schema-based validation (Zod)
- **VALIDATION**: `useForm_with_zodResolver`
- **SOURCE**: `form-management.md:9`
- **ERROR_ACTION**: `implement_react_hook_form_with_zod`
- **SEVERITY**: `high`

## MEDIUM_PRIORITY (Refactor when convenient)

### IMPORT_ORGANIZATION
- **RULE_ID**: `import_order_with_blank_lines`
- **STANDARD**: Organize imports with blank lines between groups
- **VALIDATION**: `import_groups_separated_by_blank_lines`
- **SOURCE**: `code-quality-standards.md:89`
- **ERROR_ACTION**: `reorganize_imports_with_eslint_rule`
- **SEVERITY**: `medium`

### NO_EXPLICIT_ANY
- **RULE_ID**: `no_explicit_any_type`
- **STANDARD**: Avoid using `any` type
- **VALIDATION**: `@typescript-eslint/no-explicit-any: error`
- **SOURCE**: `code-quality-standards.md:52`
- **ERROR_ACTION**: `replace_any_with_specific_types`
- **SEVERITY**: `medium`

### IMAGE_OPTIMIZATION
- **RULE_ID**: `nextjs_image_optimization`
- **STANDARD**: Use Next.js Image component with lazy loading
- **VALIDATION**: `next/image_with_lazy_loading`
- **SOURCE**: `performance-optimization.md:45`
- **ERROR_ACTION**: `replace_img_with_next_image`
- **SEVERITY**: `medium`

### ACCESSIBILITY_PATTERNS
- **RULE_ID**: `keyboard_navigation_support`
- **STANDARD**: Implement keyboard navigation and screen reader support
- **VALIDATION**: `aria_labels_and_semantic_html`
- **SOURCE**: `ui-ux-patterns.md:67`
- **ERROR_ACTION**: `add_accessibility_attributes`
- **SEVERITY**: `medium`

### CSS_MODULES_USAGE
- **RULE_ID**: `component_scoped_styling`
- **STANDARD**: Use CSS Modules for component-scoped styling
- **VALIDATION**: `styles_module_import`
- **SOURCE**: `ui-ux-patterns.md:23`
- **ERROR_ACTION**: `convert_to_css_modules`
- **SEVERITY**: `medium`

## LOW_PRIORITY (Nice-to-have improvements)

### CONSOLE_LOG_REMOVAL
- **RULE_ID**: `no_console_log_production`
- **STANDARD**: Remove console.log from production code
- **VALIDATION**: `no_console_statements_in_production`
- **SOURCE**: `code-quality-standards.md:78`
- **ERROR_ACTION**: `remove_console_statements`
- **SEVERITY**: `low`

### COMPONENT_DOCUMENTATION
- **RULE_ID**: `jsdoc_for_complex_components`
- **STANDARD**: Add JSDoc comments for complex components
- **VALIDATION**: `jsdoc_present_for_complex_logic`
- **SOURCE**: `best-practices.md:67`
- **ERROR_ACTION**: `add_jsdoc_comments`
- **SEVERITY**: `low`

## VALIDATION_PATTERNS

### TypeScript Return Types
```regex
PATTERN: ): (void|JSX\.Element|\w+|\w+\[\]) =>
ANTI_PATTERN: \) =>
```

### File Size Validation
```regex
COMPONENT_FILES: \.tsx$ AND line_count > 150
PAGE_FILES: /page\.tsx$ AND line_count > 200  
UTILITY_FILES: \.ts$ AND line_count > 100
```

### React Patterns
```regex
MEMO_PATTERN: React\.memo\(
CALLBACK_PATTERN: useCallback\(
MEMO_COMPUTATION: useMemo\(
```

### Import Organization
```regex
GOOD_IMPORTS: ^import.*from ['"]react['"];\n\nimport.*from ['"]@?[\w/]+['"];\n\nimport.*from ['"]\.
BAD_IMPORTS: ^import.*from ['"]react['"];\nimport.*from ['"]@[\w/]+['"]
```

## COMPLIANCE_SCORING

### Score Calculation
- **CRITICAL violations**: -2 points each
- **HIGH violations**: -1 point each  
- **MEDIUM violations**: -0.5 points each
- **LOW violations**: -0.1 points each

### Quality Thresholds
- **9.0-10.0**: Excellent (Production Ready)
- **8.0-8.9**: Good (Minor issues)
- **7.0-7.9**: Acceptable (Refactoring needed)
- **6.0-6.9**: Poor (Major issues)
- **<6.0**: Unacceptable (Blocks deployment)

## AI_NAVIGATION_QUICK_REFERENCE

### For Component Reviews (.tsx files)
1. Check: `component_file_size_limit`, `explicit_function_return_types`
2. Validate: `react_memo_for_stable_props`, `usecallback_for_state_updates`
3. Verify: `import_organization`, `css_modules_usage`

### For Page Reviews (page.tsx files)  
1. Check: `page_file_size_limit`, `explicit_function_return_types`
2. Validate: `usememo_for_derived_state`, `fail_fast_error_handling`
3. Verify: `nextjs_image_optimization`, `accessibility_patterns`

### For Utility Reviews (.ts files)
1. Check: `utility_file_size_limit`, `explicit_function_return_types` 
2. Validate: `no_explicit_any_type`, `import_organization`
3. Verify: `no_console_log_production`
