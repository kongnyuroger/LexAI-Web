/**
 * Smoke tests: register → login → view dashboard.
 *
 * All HTTP calls to VITE_API_BASE_URL are intercepted by Playwright's
 * route-intercept API, so no real backend is required.
 *
 * Run: npm run build && npm run test:e2e
 */
import { test, expect, type Page } from '@playwright/test'
import {
  MOCK_USER,
  MOCK_TOKENS,
  MOCK_USAGE,
  MOCK_DOCUMENTS,
  MOCK_DOCUMENT,
} from './fixtures'

const API = 'http://localhost:3000'

async function mockAuthApis(page: Page) {
  await page.route(`${API}/auth/register`, (route) =>
    route.fulfill({ status: 201, json: MOCK_TOKENS })
  )
  await page.route(`${API}/auth/login`, (route) =>
    route.fulfill({ status: 200, json: MOCK_TOKENS })
  )
  await page.route(`${API}/auth/me`, (route) =>
    route.fulfill({ status: 200, json: MOCK_USER })
  )
  await page.route(`${API}/users/me/usage`, (route) =>
    route.fulfill({ status: 200, json: MOCK_USAGE })
  )
  await page.route(`${API}/documents*`, (route) => {
    const url = route.request().url()
    if (url.endsWith('/documents') || url.includes('/documents?')) {
      route.fulfill({ status: 200, json: MOCK_DOCUMENTS })
    } else {
      route.fulfill({ status: 200, json: MOCK_DOCUMENT })
    }
  })
}

// ── Landing page ────────────────────────────────────────────────────────────

test('landing page shows hero and CTAs', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /understand any contract/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /get started free/i }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /sign in/i }).first()).toBeVisible()
})

// ── Register flow ────────────────────────────────────────────────────────────

test('user can register and land on dashboard', async ({ page }) => {
  await mockAuthApis(page)

  await page.goto('/register')
  await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible()

  await page.getByLabel(/full name/i).fill('Test User')
  await page.getByLabel(/email address/i).fill('test@example.com')
  await page.getByLabel(/^password/i).fill('Password1')
  await page.getByLabel(/confirm password/i).fill('Password1')
  await page.getByRole('button', { name: /create account/i }).click()

  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByRole('heading', { name: /your documents/i })).toBeVisible()
})

// ── Login flow ───────────────────────────────────────────────────────────────

test('user can log in and land on dashboard', async ({ page }) => {
  await mockAuthApis(page)

  await page.goto('/login')
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()

  await page.getByLabel(/email address/i).fill('test@example.com')
  await page.getByLabel(/password/i).fill('Password1')
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page).toHaveURL(/\/dashboard/)
})

// ── Dashboard ────────────────────────────────────────────────────────────────

test('dashboard shows document list when authenticated', async ({ page }) => {
  await mockAuthApis(page)

  // Pre-set tokens so the session-restore succeeds without going through login
  await page.goto('/')
  await page.evaluate((tokens) => {
    localStorage.setItem('lexai_access_token', tokens.accessToken)
    localStorage.setItem('lexai_refresh_token', tokens.refreshToken)
  }, MOCK_TOKENS)

  await page.goto('/dashboard')
  await expect(page.getByRole('heading', { name: /your documents/i })).toBeVisible()
  await expect(page.getByText('employment-contract.pdf')).toBeVisible()
  await expect(page.getByText('Analyzed')).toBeVisible()
})

// ── 404 ──────────────────────────────────────────────────────────────────────

test('unknown route shows 404 page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist')
  await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /back to dashboard/i })).toBeVisible()
})
