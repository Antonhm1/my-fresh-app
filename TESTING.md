# Testing Guide

## Overview

This project uses a comprehensive testing strategy with multiple layers:

- **Unit Tests**: Vitest for utilities and hooks
- **Component Tests**: React Testing Library for UI components
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Playwright for full user journeys

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run specific test types
npm run test:unit         # Unit tests only
npm run test:components   # Component tests only
npm run test:backend      # Backend/API tests
npm run test:e2e         # End-to-end tests

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:ci
```

## Testing Philosophy

### Test Pyramid

- **70% Unit Tests**: Fast, isolated, testing pure functions
- **20% Integration Tests**: API endpoints, database interactions
- **10% E2E Tests**: Critical user journeys, cross-browser testing

### What to Test

- ✅ Business logic and utilities
- ✅ Component rendering and interactions
- ✅ API endpoints and data flow
- ✅ Authentication and authorization
- ✅ Multi-tenant data isolation
- ✅ Critical user workflows

### What NOT to Test

- ❌ Implementation details
- ❌ Third-party library internals
- ❌ Trivial code (getters/setters)
- ❌ Constants and configuration

## Testing Patterns

### Component Testing

```typescript
// Good: Test behavior, not implementation
import { render, screen, fireEvent } from '@testing-library/react'
import { EventCard } from '@/components/EventCard'

test('expands event description when read more is clicked', () => {
  const event = { title: 'Concert', description: 'Short', extendedDescription: 'Long...' }
  render(<EventCard event={event} />)

  fireEvent.click(screen.getByText('Læs mere'))
  expect(screen.getByText('Long...')).toBeInTheDocument()
})
```

### API Testing

```typescript
// Test endpoints with real database
import request from 'supertest'
import { app } from '@backend/app'

test('POST /api/events creates event for correct tenant', async () => {
  const response = await request(app)
    .post('/api/events')
    .set('Authorization', 'Bearer ' + secretaryToken)
    .set('X-Tenant-ID', 'kirke-1')
    .send({ title: 'New Event', date: '2024-12-25' })

  expect(response.status).toBe(201)
  expect(response.body.tenantId).toBe('kirke-1')
})
```

### E2E Testing

```typescript
// Test complete user workflows
test('secretary workflow: login → create event → publish', async ({ page }) => {
  await page.goto('/')
  await page.fill('[data-testid="password"]', 'secretary-password')
  await page.click('[data-testid="login"]')

  await page.click('[data-testid="add-event"]')
  await page.fill('[data-testid="title"]', 'Christmas Concert')
  await page.click('[data-testid="save"]')

  await expect(page.locator('text=Christmas Concert')).toBeVisible()
})
```

## Test Data Management

### Frontend Mocking

Use MSW (Mock Service Worker) for API mocking:

```typescript
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/events', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, title: 'Mock Event' }]))
  }),
]
```

### Backend Testing

Use TestContainers for real database testing:

```typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql'

let container: PostgreSqlContainer

beforeAll(async () => {
  container = await new PostgreSqlContainer().start()
  process.env.DATABASE_URL = container.getConnectionUri()
})
```

## Multi-Tenant Testing

### Tenant Isolation Tests

```typescript
test('events are isolated by tenant', async () => {
  // Create event for tenant A
  await createEvent({ title: 'Event A', tenantId: 'kirke-a' })

  // Create event for tenant B
  await createEvent({ title: 'Event B', tenantId: 'kirke-b' })

  // Verify tenant A only sees their event
  const response = await request(app)
    .get('/api/events')
    .set('X-Tenant-ID', 'kirke-a')

  expect(response.body).toHaveLength(1)
  expect(response.body[0].title).toBe('Event A')
})
```

## CI/CD Integration

### Coverage Requirements

- **Frontend**: 80% line coverage
- **Backend**: 75% line coverage
- **Critical paths**: 90% coverage

### Pipeline Stages

1. **Lint & Format**: ESLint + Prettier
2. **Type Check**: TypeScript compilation
3. **Unit Tests**: Fast feedback loop
4. **Integration Tests**: Database interactions
5. **E2E Tests**: Full workflow validation
6. **Security Scan**: Dependency vulnerabilities

### Environment-Specific Testing

- **PR Builds**: Unit + Integration tests
- **Main Branch**: All tests including E2E
- **Production**: Smoke tests + Health checks

## Test Maintenance

### Running Tests Locally

```bash
# Start test database
docker-compose up -d postgres-test

# Run backend tests
npm run test:backend

# Run E2E tests (requires app running)
npm run dev &
npm run test:e2e
```

### Debugging Tests

```bash
# Debug unit tests
npm run test:watch -- --inspect

# Debug E2E tests
npm run test:e2e -- --debug

# Open Playwright UI
npx playwright test --ui
```

### Coverage Reports

Coverage reports are generated in `./coverage/` directory:

- `lcov-report/index.html` - Interactive HTML report
- `lcov.info` - For CI tools like Codecov

## Best Practices

### Test Naming

```typescript
// Good: Describes behavior
test('displays error message when login fails')

// Bad: Describes implementation
test('calls handleLoginError function')
```

### Test Organization

```
src/
├── components/
│   ├── EventCard.tsx
│   └── EventCard.test.tsx
├── utils/
│   ├── dateHelpers.ts
│   └── dateHelpers.test.ts
└── test/
    ├── setup.ts
    └── mocks/
```

### Data-TestIds

Use semantic test IDs for stable E2E tests:

```jsx
<button data-testid="save-event-button">Save</button>
<form data-testid="event-creation-form">...</form>
```

## Troubleshooting

### Common Issues

- **Flaky E2E tests**: Use `waitFor` and proper assertions
- **Slow tests**: Check for unnecessary waits or network calls
- **Memory leaks**: Ensure proper cleanup in test setup

### Performance Tips

- Use `test.concurrent` for independent tests
- Mock external dependencies
- Use shallow rendering when possible
- Parallelize test execution

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
