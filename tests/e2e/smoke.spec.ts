import { expect, test } from '@playwright/test'

/* Smoke over the flows a visitor actually walks: hero contacts, language
   switch, the services master-detail, and a form submit through to the
   pre-domain fallback. Desktop viewport (Playwright's default) — the
   floating language switcher and tablists only exist at >= 768px. */

test('hero shows the phone number and contact links', async ({ page }) => {
  await page.goto('/')
  // Scoped to #hero: the phone number legitimately appears again on #contact.
  const hero = page.locator('#hero')
  await expect(hero.getByRole('link', { name: '+353 85 289 6539' })).toBeVisible()
  for (const name of ['WhatsApp', 'Viber', 'Telegram', 'Instagram', 'TikTok']) {
    await expect(hero.getByRole('link', { name, exact: true })).toBeVisible()
  }
})

test('language switch swaps the copy and <html lang>', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'RU', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  await expect(page.getByRole('heading', { name: 'Наши услуги' })).toBeAttached()
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('selecting a service tab swaps the detail panel', async ({ page }) => {
  await page.goto('/')
  const tab = page.getByRole('tab', { name: 'Diagnostics' })
  await tab.scrollIntoViewIfNeeded()
  await tab.click()
  await expect(tab).toHaveAttribute('aria-selected', 'true')
  await expect(
    page.locator('#service-panel-diagnostics').getByRole('heading', { name: 'Diagnostics' }),
  ).toBeVisible()
})

test('contact form validates, then reaches the pre-domain fallback', async ({ page }) => {
  await page.goto('/')
  const send = page.getByRole('button', { name: 'Send' })
  await send.scrollIntoViewIfNeeded()

  // Empty submit → localized required errors, focus lands on the name field.
  await send.click()
  await expect(page.locator('#contact-name-error')).toHaveText('This field is required.')
  await expect(page.locator('#contact-name')).toBeFocused()

  // Valid input → POST /api/contact answers 503 (no email binding in dev),
  // so the honest call/WhatsApp fallback line must appear.
  await page.locator('#contact-name').fill('Playwright Smoke')
  await page.locator('#contact-phone').fill('+353 85 123 4567')
  await page.locator('#contact-message').fill('Smoke-test enquiry — please ignore.')
  await send.click()
  await expect(page.getByText('Could not send — please call or WhatsApp us instead.')).toBeVisible()
})
