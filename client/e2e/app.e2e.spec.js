// @ts-check
import { test, expect } from '@playwright/test';

const MOCK_HEALTH_RESPONSE = {
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: '2024-06-15T10:30:00Z',
};

test.describe('ShopSmart E2E Tests', () => {
    // Test 1
    test('homepage loads and shows title "ShopSmart"', async ({ page }) => {
        await page.route('**/api/health', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_HEALTH_RESPONSE) })
        );
        await page.goto('/');
        await expect(page.locator('h1')).toHaveText('ShopSmart');
    });

    // Test 2
    test('health status displays after page load', async ({ page }) => {
        await page.route('**/api/health', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_HEALTH_RESPONSE) })
        );
        await page.goto('/');
        await expect(page.locator('.status-ok')).toHaveText('ok');
        await expect(page.getByText('ShopSmart Backend is running')).toBeVisible();
    });

    // Test 3
    test('page shows loading state then data', async ({ page }) => {
        await page.route('**/api/health', async (route) => {
            await new Promise((r) => setTimeout(r, 500));
            await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_HEALTH_RESPONSE) });
        });
        await page.goto('/');
        // Should show loading initially
        await expect(page.getByText('Loading backend status...')).toBeVisible();
        // Then data should appear
        await expect(page.locator('.status-ok')).toBeVisible({ timeout: 5000 });
    });

    // Test 4
    test('handles backend failure — app still renders', async ({ page }) => {
        await page.route('**/api/health', (route) =>
            route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Internal Server Error' }) })
        );
        await page.goto('/');
        // App should still render, showing at least the title
        await expect(page.locator('h1')).toHaveText('ShopSmart');
        // Health data should NOT appear
        await expect(page.locator('.status-ok')).not.toBeVisible();
    });

    // Test 5
    test('page title tag is "ShopSmart"', async ({ page }) => {
        await page.route('**/api/health', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_HEALTH_RESPONSE) })
        );
        await page.goto('/');
        await expect(page).toHaveTitle('ShopSmart');
    });

    // Test 6
    test('container element has class "container"', async ({ page }) => {
        await page.route('**/api/health', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_HEALTH_RESPONSE) })
        );
        await page.goto('/');
        await expect(page.locator('.container')).toBeVisible();
    });

    // Test 7
    test('status text shows "ok" for healthy backend', async ({ page }) => {
        await page.route('**/api/health', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_HEALTH_RESPONSE) })
        );
        await page.goto('/');
        await expect(page.getByText('Status:')).toBeVisible();
        await expect(page.locator('.status-ok')).toHaveText('ok');
    });

    // Test 8
    test('HMR hint text is visible', async ({ page }) => {
        await page.route('**/api/health', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_HEALTH_RESPONSE) })
        );
        await page.goto('/');
        await expect(page.locator('.hint')).toBeVisible();
        await expect(page.getByText('src/App.jsx')).toBeVisible();
    });

    // Test 9
    test('timestamp renders from API response', async ({ page }) => {
        await page.route('**/api/health', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_HEALTH_RESPONSE) })
        );
        await page.goto('/');
        await expect(page.getByText('2024-06-15T10:30:00Z')).toBeVisible();
    });

    // Test 10
    test('page has correct structure (h1, card, hint)', async ({ page }) => {
        await page.route('**/api/health', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_HEALTH_RESPONSE) })
        );
        await page.goto('/');
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('.card')).toHaveCount(1);
        await expect(page.locator('.hint')).toHaveCount(1);
        await expect(page.locator('h2')).toHaveText('Backend Status');
    });
});
