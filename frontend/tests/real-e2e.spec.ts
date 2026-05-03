import { expect, test } from '@playwright/test';

const apiBase = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api';
const apiHosts = [apiBase, apiBase.replace('127.0.0.1', 'localhost'), apiBase.replace('localhost', '127.0.0.1')];

function isApiUrl(url: string) {
  return apiHosts.some((host) => url.startsWith(host));
}

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() => (
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
  ));
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe('real seeded Laravel API journeys', () => {
  test.use({ viewport: { width: 390, height: 900 } });

  test('customer creates a real COD Sharara order through Laravel API', async ({ page, request }) => {
    test.setTimeout(120000);
    const apiStatuses: number[] = [];
    const consoleErrors: string[] = [];

    page.on('response', (response) => {
      if (isApiUrl(response.url())) {
        apiStatuses.push(response.status());
      }
    });
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto('/products/sharara?lang=ar', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect(page.locator('.page-product')).toBeVisible();

    const firstVariant = page.locator('.variant-pill').first();
    await expect(firstVariant).toBeVisible();
    await firstVariant.click();

    const addCartResponse = page.waitForResponse((response) => (
      isApiUrl(response.url()) && response.url().includes('/cart/items') && response.request().method() === 'POST'
    ));
    await page.locator('.purchase-card .n-btn--primary').click();
    await expect((await addCartResponse).status()).toBeLessThan(300);

    await expect(page.locator('.cart-drawer.is-open')).toBeVisible();
    await expect(page.locator('.drawer-item')).toHaveCount(1);
    await expect(page.locator('.drawer-item')).toContainText(/Sharara|شرارة/);

    await page.locator('.cart-drawer__foot a[href="/checkout"]').click();
    await expect(page).toHaveURL(/\/checkout(?:\?lang=ar)?$/);
    await expect(page.locator('.summary-item')).toHaveCount(1);

    await page.locator('input[type="text"]').nth(0).fill('Real Api Customer');
    await page.locator('input[type="text"]').nth(1).fill('01012345678');
    await page.locator('input[type="email"]').fill('real-api-customer@example.com');
    await page.locator('input[type="text"]').nth(2).fill('Nasr City');
    await page.locator('select').selectOption({ index: 1 });
    await page.locator('textarea').first().fill('12 Real API Street, floor 2, Cairo');
    await page.locator('input[value="cash_on_delivery"]').check();

    const checkoutResponse = page.waitForResponse((response) => (
      isApiUrl(response.url()) && response.url().includes('/checkout') && response.request().method() === 'POST'
    ));
    await page.locator('button[type="submit"]').click();
    await expect((await checkoutResponse).status()).toBeLessThan(300);

    await expect(page).toHaveURL(/\/order-confirmation\/ORD-[A-Z0-9]+$/);
    await expect(page.locator('.confirmation-card')).toBeVisible();
    await expect(page.locator('.confirmation-card .mono')).toContainText(/^ORD-/);

    const orderNumber = page.url().split('/').pop() || '';
    expect(orderNumber).toMatch(/^ORD-[A-Z0-9]+$/);
    expect(orderNumber).not.toMatch(/^LOCAL-/);

    const lookup = await request.get(`${apiBase}/orders/confirmation/${orderNumber}`, {
      params: { email: 'real-api-customer@example.com', phone: '01012345678' },
    });
    expect(lookup.status()).toBe(200);
    const lookupBody = await lookup.json();
    expect(lookupBody.data?.order_number ?? lookupBody.order_number).toBe(orderNumber);

    expect(apiStatuses.length).toBeGreaterThan(0);
    expect(apiStatuses.every((status) => status < 500)).toBe(true);
    expect(consoleErrors).toEqual([]);
  });

  test('admin logs in with seeded credentials and opens protected admin routes', async ({ page }) => {
    const apiStatuses: number[] = [];

    page.on('response', (response) => {
      if (isApiUrl(response.url())) {
        apiStatuses.push(response.status());
      }
    });

    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').fill(process.env.NAFAS_E2E_ADMIN_EMAIL || 'admin@nafas.com');
    await page.locator('input[type="password"]').fill(process.env.NAFAS_E2E_ADMIN_PASSWORD || 'password123');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('**/admin/dashboard', { timeout: 30000 });
    await expect(page.locator('.admin-layout')).toBeVisible();

    await page.goto('/admin/products', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/admin\/products$/);
    await expect(page.locator('.admin-page-shell, .page-header, .data-card, .loading-state').first()).toBeVisible({ timeout: 30000 });

    await page.goto('/admin/orders', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/admin\/orders$/);
    await expect(page.locator('.admin-page-shell, .page-header, .data-card, .loading-state').first()).toBeVisible({ timeout: 30000 });

    expect(apiStatuses.length).toBeGreaterThan(0);
    expect(apiStatuses.every((status) => status < 500)).toBe(true);
  });

  test('public storefront has no horizontal overflow at launch mobile widths', async ({ page }) => {
    test.setTimeout(600000);
    for (const width of [320, 360, 390, 430, 768, 1024]) {
      await page.setViewportSize({ width, height: 1100 });
      for (const route of ['/', '/shop', '/products/sharara', '/cart', '/checkout', '/about', '/quality', '/faq']) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle').catch(() => undefined);
        await expectNoHorizontalOverflow(page);
      }
    }
  });
});
