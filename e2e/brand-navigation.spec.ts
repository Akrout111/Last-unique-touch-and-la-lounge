import { test, expect } from '@playwright/test'

test.describe('Brand page navigation', () => {
  test('navigate to Last Unique Touch brand page', async ({ page }) => {
    await page.goto('/ar')
    // Click the first brand card (LUT)
    const lutCard = page.locator('[role="button"]').first()
    await lutCard.click({ timeout: 10000 })
    // Should navigate to the LUT brand page
    await expect(page).toHaveURL(/\/last-unique-touch/, { timeout: 15000 })
  })

  test('navigate to La Lounge brand page', async ({ page }) => {
    await page.goto('/ar')
    // Click the second brand card (La Lounge)
    const laloungeCard = page.locator('[role="button"]').nth(1)
    await laloungeCard.click({ timeout: 10000 })
    await expect(page).toHaveURL(/\/la-lounge/, { timeout: 15000 })
  })

  test('navigate to Your Birthday brand page', async ({ page }) => {
    await page.goto('/ar')
    // Click the third brand card (Birthday)
    const birthdayCard = page.locator('[role="button"]').nth(2)
    await birthdayCard.click({ timeout: 10000 })
    await expect(page).toHaveURL(/\/your-birthday/, { timeout: 15000 })
  })

  test('brand pages have no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/ar/last-unique-touch', { waitUntil: 'networkidle' })
    // Filter out known benign errors (Three.js deprecations, etc.)
    const realErrors = errors.filter(
      (e) => !e.includes('THREE.') && !e.includes('deprecated') && !e.includes('downloadable font'),
    )
    expect(realErrors).toEqual([])
  })
})
