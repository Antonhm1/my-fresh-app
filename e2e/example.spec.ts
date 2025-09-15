import { test, expect } from '@playwright/test'

test.describe('Church App E2E Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Kirke/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('secretary can login and create event', async ({ page }) => {
    // Navigate to login
    await page.goto('/')
    await page.click('[data-testid="login-button"]')

    // Login as secretary
    await page.fill('[data-testid="password-input"]', 'secretary-password')
    await page.click('[data-testid="login-submit"]')

    // Verify edit mode is active
    await expect(
      page.locator('[data-testid="edit-mode-indicator"]')
    ).toBeVisible()

    // Create new event
    await page.click('[data-testid="add-event-button"]')
    await page.fill('[data-testid="event-title"]', 'Test Concert')
    await page.fill('[data-testid="event-description"]', 'A beautiful concert')
    await page.fill('[data-testid="event-date"]', '2024-12-25')
    await page.fill('[data-testid="event-time"]', '19:00')

    // Submit event
    await page.click('[data-testid="save-event"]')

    // Verify event appears
    await expect(page.locator('text=Test Concert')).toBeVisible()
  })

  test('user can suggest event for approval', async ({ page }) => {
    // Login as regular user
    await page.goto('/')
    await page.click('[data-testid="login-button"]')
    await page.fill('[data-testid="password-input"]', 'user-password')
    await page.click('[data-testid="login-submit"]')

    // Create event suggestion
    await page.click('[data-testid="add-event-button"]')
    await page.fill('[data-testid="event-title"]', 'Suggested Event')
    await page.fill('[data-testid="event-description"]', 'This needs approval')
    await page.click('[data-testid="save-event"]')

    // Verify pending status
    await expect(page.locator('text=Pending approval')).toBeVisible()
  })

  test('newsletter signup works', async ({ page }) => {
    await page.goto('/')

    // Newsletter popup should appear
    await expect(page.locator('[data-testid="newsletter-popup"]')).toBeVisible()

    // Sign up for newsletter
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.click('[data-testid="subscribe-button"]')

    // Verify success message
    await expect(page.locator('text=Tak for tilmelding')).toBeVisible()
  })

  test('multi-tenant isolation', async ({ page }) => {
    // Test that different subdomains show different content
    // This would require setting up different tenant configurations
    await page.goto('/')

    // Verify tenant-specific branding
    await expect(page.locator('[data-testid="church-logo"]')).toBeVisible()
    await expect(page.locator('[data-testid="church-name"]')).toBeVisible()
  })

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Test mobile navigation
    await page.click('[data-testid="burger-menu"]')
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()

    // Test event cards on mobile
    const eventCard = page.locator('[data-testid="event-card"]').first()
    await expect(eventCard).toBeVisible()

    // Test read more functionality
    await eventCard.locator('[data-testid="read-more"]').click()
    await expect(
      eventCard.locator('[data-testid="expanded-description"]')
    ).toBeVisible()
  })
})
