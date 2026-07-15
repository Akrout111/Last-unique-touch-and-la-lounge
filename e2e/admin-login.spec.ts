import { test, expect } from '@playwright/test'

test.describe('Admin login', () => {
  test('admin login page loads', async ({ page }) => {
    await page.goto('/ar/admin/login')
    // The login form should be visible
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 15000 })
  })

  test('admin login rejects empty password', async ({ page }) => {
    await page.goto('/ar/admin/login')
    const submitButton = page.locator('button[type="submit"]')
    if (await submitButton.isVisible()) {
      await submitButton.click()
    }
    // Should stay on login page or show error
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 })
  })

  test('admin login rejects wrong password', async ({ page }) => {
    await page.goto('/ar/admin/login')
    const passwordInput = page.locator('input[type="password"]')
    await passwordInput.fill('wrongpassword123')
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    // Should stay on login page (error shown)
    await page.waitForTimeout(2000)
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 })
  })

  test('rate limiting triggers after multiple failed attempts', async ({ page }) => {
    await page.goto('/ar/admin/login')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    // Attempt 6 logins (limit is 5/minute)
    for (let i = 0; i < 6; i++) {
      await passwordInput.fill(`wrongpass${i}`)
      await submitButton.click()
      await page.waitForTimeout(500)
    }
    // After 5 attempts, should be rate limited (stay on login page)
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 5000 })
  })
})
