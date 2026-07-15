import { test, expect } from '@playwright/test'

test.describe('Homepage — 3 brand cards', () => {
  test('loads Arabic homepage and shows 3 brand cards', async ({ page }) => {
    await page.goto('/ar')
    await expect(page).toHaveTitle(/Last Unique Touch|La Lounge/i)
    // The 3 brand cards should be visible
    const cards = page.locator('[role="button"]')
    await expect(cards.first()).toBeVisible({ timeout: 30000 })
    // Verify brand names appear
    await expect(page.getByText(/Last Unique Touch|الأخيرة/i)).toBeVisible({ timeout: 15000 })
  })

  test('homepage shows LUT tagline about furniture rental', async ({ page }) => {
    await page.goto('/ar')
    // The new tagline for LUT should be visible
    await expect(page.getByText(/تأجير الأثاث/)).toBeVisible({ timeout: 15000 })
  })

  test('English homepage loads correctly', async ({ page }) => {
    await page.goto('/en')
    await expect(page.getByText(/Luxury Furniture Rental/)).toBeVisible({ timeout: 15000 })
  })

  test('3D background or fallback is present', async ({ page }) => {
    await page.goto('/ar')
    // Either the 3D canvas or the CSS fallback should be present
    const canvas = page.locator('canvas')
    const fallback = page.locator('.hero-bg-gradient')
    await expect(canvas.or(fallback)).toBeVisible({ timeout: 15000 })
  })
})
