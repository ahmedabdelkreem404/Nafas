import { expect, test } from '@playwright/test';

const apiBase = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api';
const apiHosts = [apiBase, apiBase.replace('127.0.0.1', 'localhost'), apiBase.replace('localhost', '127.0.0.1')];

function isApiUrl(url: string) {
  return apiHosts.some((host) => url.startsWith(host));
}

test.describe('real local API customer and admin journeys', () => {
  test.use({ viewport: { width: 390, height: 900 } });

  test('customer can order Sharara end-to-end against seeded Laravel API', async ({ page }) => {
    const apiResponses: number[] = [];
    const consoleErrors: string[] = [];

    page.on('response', (response) => {
      if (isApiUrl(response.url())) {
        apiResponses.push(response.status());
      }
    });
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto('/?lang=ar', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.apple-nafas-page')).toBeVisible();

    await page.goto('/shop?lang=ar', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.page-shop')).toBeVisible();

    await page.goto('/products/sharara?lang=ar', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.page-product')).toBeVisible();

    const addButton = page.locator('.purchase-card .n-btn--primary').first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    await expect(page.locator('.cart-drawer.is-open')).toBeVisible();
    await expect(page.locator('.drawer-item')).toHaveCount(1);

    await page.goto('/checkout?lang=ar', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.checkout-page')).toBeVisible();

    await page.locator('input[type="text"]').nth(0).fill('Readiness Customer');
    await page.locator('input[type="text"]').nth(1).fill('01012345678');
    await page.locator('input[type="email"]').fill('readiness-customer@example.com');
    await page.locator('input[type="text"]').nth(2).fill('Cairo');
    await page.locator('select').selectOption({ index: 1 });
    await page.locator('textarea').first().fill('12 Readiness Street, Cairo, Egypt');

    await page.locator('.summary-card .n-btn--primary').click();
    await page.waitForURL('**/order-confirmation/**', { timeout: 30000 });
    await expect(page.locator('.order-page .confirmation-card')).toBeVisible();
    await expect(page.locator('.order-page .mono')).toContainText('ORD-');

    expect(apiResponses.length).toBeGreaterThan(0);
    expect(apiResponses.every((status) => status < 500)).toBe(true);
    expect(consoleErrors).toEqual([]);
  });

  test('admin can login and open dashboard/orders/products against seeded Laravel API', async ({ page }) => {
    const apiStatuses: number[] = [];

    page.on('response', (response) => {
      if (isApiUrl(response.url())) {
        apiStatuses.push(response.status());
      }
    });

    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').fill('admin@nafas.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('**/admin/dashboard', { timeout: 30000 });
    await expect(page.locator('.admin-layout')).toBeVisible();

    await page.goto('/admin/products', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.admin-layout')).toBeVisible();
    await expect(page.locator('.ui-table, .data-card, .admin-page-shell').first()).toBeVisible();

    await page.goto('/admin/orders', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.admin-layout')).toBeVisible();

    expect(apiStatuses.length).toBeGreaterThan(0);
    expect(apiStatuses.every((status) => status < 500)).toBe(true);
  });
});
