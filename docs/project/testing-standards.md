# Minimalist Testing Standards

This document outlines practical testing approaches for the specifications project - a snuff specification builder and CRUD admin application - designed for solo development.

## Core Testing Philosophy

As a solo hobbyist developer, I follow these testing principles:

1. **Test What Matters**: Focus testing efforts on critical functionality
2. **Practical Coverage**: Aim for quality over quantity in test coverage
3. **Simple Setup**: Keep testing infrastructure lightweight
4. **Manual + Automated**: Combine strategic manual testing with minimal automation

## Testing Approaches

### Critical Path Testing (Manual)

For a solo project, start with thorough manual testing of critical user flows:

- **User Authentication**: Login, logout, password reset
- **CRUD Operations**: Create, read, update, delete specification data
- **Data Import/Export**: File uploads, data exports
- **Access Control**: Permission-based feature access

Document manual test cases in simple markdown files when they become complex enough to need documentation:

```markdown
# Authentication Tests

## Login Flow
1. Navigate to /login
2. Enter valid credentials → Should redirect to dashboard
3. Enter invalid credentials → Should display error message
4. Test "Remember me" functionality
5. Test password reset flow
```

### Automated Testing Strategy

#### Unit Testing

For critical utility functions and business logic:

- **Test Library**: Jest (comes pre-configured with Next.js)
- **Coverage Goal**: Focus on quality over arbitrary coverage percentages
- **Key Areas**: Test complex calculations, data transformations, and business rules
- **File Location**: Co-locate tests with implementation in `/src` directory with `.test.js` or `.test.ts` suffix

Example unit test structure:
```javascript
// utils/formatters.test.js
import { formatCurrency, formatDate } from './formatters';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });
  
  it('handles zero values', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });
});
```

#### Component Testing

For key UI components:

- **Library**: React Testing Library (simple, focused on user behavior)
- **Coverage Strategy**: Test complex interactive components only
- **Test Aspects**: Rendering, basic interactions, accessibility

Example component test:
```javascript
// components/SpecificationCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import SpecificationCard from './SpecificationCard';

describe('SpecificationCard', () => {
  it('displays specification details', () => {
    render(<SpecificationCard title="Test Spec" description="Test Description" />);
    expect(screen.getByText('Test Spec')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = jest.fn();
    render(<SpecificationCard title="Test" onEdit={handleEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });
});
```

#### Integration Testing

Minimal integration tests for critical user flows:

- **Scope**: Test key workflows end-to-end
- **Count**: Create just 2-5 integration tests for the most critical paths
- **Tool**: Cypress (minimal configuration) or Playwright

Example integration test:
```javascript
// cypress/integration/create-specification.spec.js
describe('Create Specification', () => {
  it('allows a user to create a new specification', () => {
    cy.login(); // Custom command for authentication
    cy.visit('/specifications/new');
    cy.get('#title').type('New Test Specification');
    cy.get('#description').type('This is a test specification');
    cy.get('#submit').click();
    cy.url().should('include', '/specifications/');
    cy.contains('New Test Specification');
  });
});
```

### Mock Data & Fixtures

Keep mocking simple and focused:

- **Mock Data Location**: `/mocks` directory or co-located with tests
- **Structure**: Simple JSON files for mock data
- **Usage**: Default to static data for tests unless dynamic data is necessary

Example:
```javascript
// mocks/specificationData.js
export const sampleSpecifications = [
  {
    id: '1',
    title: 'Sample Specification',
    description: 'A sample specification for testing',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    status: 'active'
  },
  // Add more as needed
];
```

## Testing Strategy

**Complete Implementation**: See [Testing Strategy Documentation](../concerns/testing-strategy.md) for comprehensive testing approach including unit testing patterns, component testing, integration testing, and development workflow integration.

## Test Naming Conventions

Follow simple, descriptive naming:

- **Unit test files**: `[filename].test.js`
- **Component test files**: `[ComponentName].test.jsx`
- **Integration tests**: `[feature-name].spec.js`
- **Test descriptions**: Use clear, action-oriented descriptions

Example naming pattern:
```
describe('[Unit/Component Name]', () => {
  it('should [expected behavior] when [condition]', () => {
    // test code
  });
});
```

## Testing Tools

Minimal, effective tooling:

- **Jest**: Unit and component testing
- **React Testing Library**: Component testing
- **Cypress/Playwright**: Limited integration tests (only if needed)
- **Browser DevTools**: For manual testing and debugging

## Bug Reporting Process

For solo development, maintain a simple bug tracking system:

1. Record bugs in a central location (GitHub Issues, Trello, or simple TODO.md file)
2. Include steps to reproduce, expected vs. actual behavior
3. Prioritize based on impact
4. Create regression tests for critical bugs once fixed

## Continuous Integration

Optional lightweight CI setup:

- GitHub Actions for simple test runs on push
- Basic workflow that runs linting and tests

Example GitHub Actions workflow:
```yaml
name: Basic Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

## Final Testing Checklist

Before deploying major changes:

- [ ] Manual testing of critical user flows completed
- [ ] Unit tests for complex business logic pass
- [ ] Component tests for key UI components pass
- [ ] Basic cross-browser testing (your primary development browser + one other)
- [ ] Mobile/responsive testing for critical features

Remember: As a solo developer, focus testing efforts where they provide the most value. Don't create tests for the sake of testing—focus on what helps you build with confidence.
