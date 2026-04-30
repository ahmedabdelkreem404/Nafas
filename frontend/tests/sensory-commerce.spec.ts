import { expect, test } from '@playwright/test';

const widths = [320, 360, 390, 430, 540, 640, 768, 820, 1024, 1180, 1366, 1440, 1536, 1920];

test.setTimeout(120000);

const sharara = {
  data: {
    id: 1,
    code: 'NFS-001',
    slug: 'sharara',
    name_ar: 'شرارة',
    name_en: 'Sharara',
    gender: 'Men',
    story: 'أول رشة تلفت، وأثر يفضل.',
    personality: 'fresh spicy dark musky',
    marketing_line_ar: 'أول رشة تلفت، وأثر يفضل.',
    marketing_line_en: 'A bright first spark with a darker trail.',
    scent_notes: 'citrus, spice, musk',
    variants: [{ id: 101, sku: 'NFS-001-3ML', label: '3ml Tester', size_ml: 3, retail_price: 149, in_stock: true, is_active: true, is_tester: true, type: 'tester' }],
  },
};

async function mockCatalog(page: any) {
  await page.route('**/api/cart', (route: any) => route.fulfill({ json: { items: [] } }));
  await page.route('**/api/products/sharara', (route: any) => route.fulfill({ json: sharara }));
  await page.route('**/api/products', (route: any) => route.fulfill({ json: { data: [sharara.data] } }));
  await page.route('**/api/cart/items', (route: any) => route.fulfill({ status: 201, json: { items: [{ id: 1, quantity: 1, variant: { ...sharara.data.variants[0], product: sharara.data } }] } }));
}

test('public routes stay responsive without horizontal overflow', async ({ page }) => {
  await mockCatalog(page);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/shop', '/scent-finder', '/discovery-set', '/gift-boxes', '/products/sharara']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => undefined);
      await expect(page.locator('.app-shell')).toBeVisible();
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(hasOverflow, `${path} overflowed at ${width}px`).toBe(false);
    }
  }
});

test('add to cart opens the cart drawer', async ({ page }) => {
  await mockCatalog(page);
  await page.goto('/products/sharara');
  await page.getByRole('button', { name: /أضف|Add/ }).first().click();
  await expect(page.locator('.cart-drawer.is-open')).toBeVisible();
});

test('admin login reaches dashboard with valid seeded role shape', async ({ page }) => {
  await page.route('**/api/auth/login', (route) => route.fulfill({
    json: { token: 'admin-token', user: { id: 1, name: 'Super Admin', email: 'admin@nafas.com', role: 'super_admin' } },
  }));
  await page.route('**/api/admin/dashboard', (route) => route.fulfill({
    json: { today_revenue: 0, month_revenue: 0, average_order_value: 0, new_orders_count: 0, recent_orders: [], critical_stock: [], low_stock: [], top_products_month: [] },
  }));
  await page.goto('/admin/login');
  await page.getByPlaceholder('admin@nafas.com').fill('admin@nafas.com');
  await page.locator('input[type="password"]').fill('password123');
  await page.getByRole('button', { name: /دخول|Sign|Login/ }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
});
