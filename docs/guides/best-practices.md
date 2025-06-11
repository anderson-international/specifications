# Development Best Practices

## Core Principles

### Simplicity and Brevity

As a solo hobbyist coder, I prioritize simplicity and brevity above all else in my code. This means:

- **Small Code Files**: Keep files small and focused on a single responsibility
- **Minimal Comments**: Rely on self-documenting code rather than extensive comments
- **Simple Solutions**: Choose the most straightforward implementation over complex patterns
- **Pragmatic Approach**: Avoid over-engineering and only build what's actually needed
- **Function Size**: Keep functions small and focused on a single task
- **Naming**: Use clear, descriptive names that make comments unnecessary

These principles guide all coding decisions in this project to maintain enjoyable and sustainable development as a solo developer.

### File Size and Separation of Concerns

To maintain clarity and simplicity in the Next.js project structure:

- **Component Files**: Each component should have its own file and not exceed 150 lines of code
- **Utility Functions**: Place in dedicated files or group by related functionality; keep under 50 lines per file
- **Page Files**: Limit to 250 lines maximum; refactor larger pages by extracting logic and subcomponents
- **File Organization**: Maintain a flat and intuitive folder structure to avoid deep nesting
- **Refactoring Threshold**: If any file exceeds these guidelines, refactor for clarity and maintainability

These are not hard technical limits imposed by Next.js, but exceeding them can hinder maintainability and clarity. Following these guidelines ensures small files, clear separation of concerns, and a maintainable codebase.

### API Strategy

- **Default to Next.js API Routes** for custom backend needs
- **Use direct GraphQL queries** to the Shopify Storefront API with a minimal client
- **Keep API integration code** simple, concise, and modular
- **Avoid unnecessary abstractions** or extra infrastructure

This approach balances simplicity with the specific requirements of Shopify's GraphQL API while maintaining a straightforward development experience.

### Form Management Strategy

**Complete Implementation**: See [Form Management Documentation](../concerns/form-management.md) for comprehensive form handling strategy including React Hook Form patterns, validation approaches, and multi-step form management.

### CSS/Styling Strategy

- **Default to CSS Modules** for all component styling
- **Keep style files small** and scoped to individual components
- **Use clear, descriptive class names** that reflect the component's structure
- **Only use inline styles or CSS-in-JS** for rare, highly dynamic styling needs
- **Avoid global styles** and large, shared CSS files

CSS Modules provide automatic scoping, prevent style conflicts, and have minimal learning curve with low runtime overhead, making them ideal for a solo developer workflow.

### Authentication Strategy

**Complete Implementation**: See [Authentication Documentation](../concerns/authentication.md) for comprehensive authentication strategy including magic link approach, role management, and development patterns.

## File Operations

### Always Create Destination Folders Before Writing Files

When writing files to the filesystem, always check if the destination directory exists first. If it doesn't exist, create it using the `mkdir` command before attempting to write the file.

Steps to follow:
1. Extract the directory path from the target file path
2. Check if the directory exists using a command like `list_dir` or similar
3. If the directory doesn't exist, create it using `run_command` with `mkdir` (example: `mkdir "path/to/directory"`)
4. Only after confirming the directory exists, proceed with `write_to_file`

This prevents errors when trying to write files to non-existent directories and ensures smoother file operations.

Example:
```javascript
// Example of proper file writing workflow
// 1. Determine directory path
const targetFile = "path/to/directory/file.txt";
const dirPath = targetFile.substring(0, targetFile.lastIndexOf("/"));

// 2. Check if directory exists 
// 3. If not, create it: 
//    mkdir -p "path/to/directory"
// 4. Then write the file
```

## Solo Development Workflow

### Streamlined Process

- Use direct commits to main branch for most changes
- Create feature branches only for experimental features
- Keep documentation lightweight and focused on "why" not "what"
- Use TODO comments for future enhancements
- Prioritize working code over perfect code

### Version Control

- Use meaningful commit messages that explain the reason for the change
- Group related changes in single commits
- Use tags for major version changes
