// @ts-check
import { test, expect } from '@playwright/test';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 7999,
    originalPrice: 9999,
    rating: 4.7,
    reviews: 100,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    inStock: true,
  },
  {
    id: 2,
    name: 'Leather Sneakers',
    category: 'Fashion',
    price: 4999,
    originalPrice: 6999,
    rating: 4.8,
    reviews: 200,
    badge: 'Hot',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    inStock: true,
  },
];

test.describe('ShopSmart E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/products**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PRODUCTS),
      })
    );
    await page.route('**/api/categories', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(['All', 'Electronics', 'Fashion', 'Lifestyle', 'Home']),
      })
    );
    await page.route('**/api/checkout', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, orderId: 'ORD-TEST-123', total: 7999, items: [] }),
      })
    );
  });

  // Test 1
  test('homepage loads with ShopSmart branding', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Maison').first()).toBeVisible();
  });

  // Test 2
  test('hero section is visible with a CTA button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-section')).toBeVisible();
    await expect(page.getByTestId('hero-cta-btn')).toBeVisible();
  });

  // Test 3
  test('product cards render after page load', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('product-card').first()).toBeVisible({ timeout: 8000 });
    const cards = await page.getByTestId('product-card').count();
    expect(cards).toBeGreaterThan(0);
  });

  // Test 4
  test('category section exists and shows category buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('category-section')).toBeVisible();
    await expect(page.getByTestId('category-all')).toBeVisible();
  });

  // Test 5
  test('add to cart shows badge on cart icon', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('product-card').first()).toBeVisible({ timeout: 8000 });
    await page.getByTestId('add-to-cart-btn').first().click();
    await expect(page.getByTestId('cart-badge')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('cart-badge')).toHaveText('1');
  });

  // Test 6
  test('clicking cart icon opens the cart drawer', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('cart-icon-btn').click();
    await expect(page.getByTestId('cart-drawer')).toBeVisible();
  });

  // Test 7
  test('empty cart shows empty state message', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('cart-icon-btn').click();
    await expect(page.getByTestId('cart-empty')).toBeVisible();
  });

  // Test 8: Full user flow - browse, add to cart, open drawer, checkout
  test('full flow: add to cart - open cart - proceed to checkout', async ({ page }) => {
    await page.goto('/');
    // Wait for products
    await expect(page.getByTestId('product-card').first()).toBeVisible({ timeout: 8000 });
    // Add to cart
    await page.getByTestId('add-to-cart-btn').first().click();
    // Open cart
    await page.getByTestId('cart-icon-btn').click();
    await expect(page.getByTestId('cart-drawer')).toBeVisible();
    // Proceed to checkout
    await page.getByTestId('checkout-btn').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();
    // Should show step 0 (cart review)
    await expect(page.getByTestId('step-cart-review')).toBeVisible();
  });

  // Test 9
  test('checkout flow: cart review - shipping form', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('product-card').first()).toBeVisible({ timeout: 8000 });
    await page.getByTestId('add-to-cart-btn').first().click();
    await page.getByTestId('cart-icon-btn').click();
    await page.getByTestId('checkout-btn').click();
    // Click continue to shipping
    await page.getByTestId('next-to-shipping-btn').click();
    await expect(page.getByTestId('step-shipping')).toBeVisible();
  });

  // Test 10
  test('page title is ShopSmart', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('ShopSmart');
  });
});
