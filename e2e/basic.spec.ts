import { test, expect } from '@playwright/test'

test.describe('Basic E2E Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')

    // Check for Vite + React + TS title (actual app title)
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/)

    // Check that page content loads
    await expect(page.locator('body')).toBeVisible()
  })

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Verify page loads on mobile
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/)
    await expect(page.locator('body')).toBeVisible()
  })
})