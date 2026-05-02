import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const compactProduct = {
  id: 101,
  slug: 'sharara',
  name_ar: 'Sharara',
  name_en: 'Sharara',
  personality_ar: 'Fresh spicy musk.',
  personality_en: 'Fresh spicy musk.',
  story: 'A polished spicy musk.',
  story_en: 'A polished spicy musk.',
  notes_ar: ['Pepper', 'Citrus', 'Musk'],
  notes_en: ['Pepper', 'Citrus', 'Musk'],
  variants: [
    {
      id: 1001,
      label: '50ml',
      size_ml: 50,
      retail_price: 850,
      in_stock: true,
      type: 'retail',
    },
  ],
};

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    return scrollWidth - window.innerWidth;
  });

  expect(overflow).toBeLessThanOrEqual(1);
}

async function gotoPublic(page: Page, path: string, width: number, height = 1000) {
  await page.setViewportSize({ width, height });
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function seedGuestCart(page: Page, locale: 'ar' | 'en' = 'ar') {
  await page.addInitScript(({ product, nextLocale }) => {
    localStorage.setItem('nafas_locale', nextLocale);
    localStorage.setItem('nafas_cart', JSON.stringify([
      {
        cart_item_id: 7001,
        product,
        product_variant_id: product.variants[0].id,
        quantity: 1,
        variant: product.variants[0],
      },
    ]));
  }, { product: compactProduct, nextLocale: locale });
}

async function mockGuestCartApi(page: Page) {
  await page.route('**/api/cart', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: [
          {
            id: 7001,
            quantity: 1,
            variant: {
              ...compactProduct.variants[0],
              product: compactProduct,
            },
          },
        ],
      }),
    });
  });
}

async function mockAdminDashboardApi(page: Page) {
  await page.route('**/api/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, name: 'Admin', role: 'super_admin' }),
    });
  });

  await page.route('**/api/admin/dashboard', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        orders_count: 1,
        products_count: 4,
        customers_count: 1,
        total_sales: 850,
        pending_orders: 1,
        delivered_orders: 0,
        average_order_value: 850,
        today_revenue: 0,
        month_revenue: 850,
        new_orders_count: 1,
        recent_orders: [],
        critical_stock: [],
        low_stock: [],
        top_products_month: [],
      }),
    });
  });
}

test.describe('Nafas public readiness surfaces', () => {
  const pageCases = [
    { name: 'shop mobile Arabic', path: '/shop?lang=ar', width: 390, selector: '.page-shop' },
    { name: 'shop tablet English', path: '/shop?lang=en', width: 1024, selector: '.page-shop' },
    { name: 'Sharara mobile Arabic', path: '/products/sharara?lang=ar', width: 390, selector: '.page-product' },
    { name: 'Ghayma desktop English', path: '/products/ghayma?lang=en', width: 1440, selector: '.page-product' },
    { name: 'terms mobile Arabic', path: '/terms?lang=ar', width: 390, selector: '.content-page' },
    { name: 'privacy desktop English', path: '/privacy-policy?lang=en', width: 1440, selector: '.content-page' },
    { name: 'FAQ tablet Arabic', path: '/faq?lang=ar', width: 768, selector: '.content-page' },
    { name: 'login mobile English', path: '/login?lang=en', width: 430, selector: '.auth-page' },
    { name: 'register tablet Arabic', path: '/register?lang=ar', width: 820, selector: '.auth-page' },
    { name: 'cart mobile Arabic', path: '/cart?lang=ar', width: 390, selector: '.empty-panel, .cart-page' },
  ];

  for (const pageCase of pageCases) {
    test(`${pageCase.name} renders with the public system and no horizontal overflow`, async ({ page }) => {
      await gotoPublic(page, pageCase.path, pageCase.width);

      await expect(page.locator('.site-nav')).toBeVisible();
      await expect(page.locator(pageCase.selector).first()).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  }

  test('dark premium navbar keeps active states visible on public pages', async ({ page }) => {
    await gotoPublic(page, '/shop?lang=en', 1440, 900);

    const navBackground = await page.locator('.site-nav').evaluate((element) => getComputedStyle(element).backgroundImage);
    const navColor = await page.locator('.site-nav__link.is-active').evaluate((element) => getComputedStyle(element).color);

    expect(navBackground).toContain('linear-gradient');
    expect(navColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(page.locator('.site-nav__link.is-active')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('mobile nav drawer and cart drawer open and close cleanly', async ({ page }) => {
    await gotoPublic(page, '/shop?lang=ar', 390, 900);

    await page.locator('.site-icon--menu').click();
    await expect(page.locator('.mobile-panel.is-open')).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.keyboard.press('Escape');
    await expect(page.locator('.mobile-panel.is-open')).toHaveCount(0);

    await page.locator('.site-icon--cart').click();
    await expect(page.locator('.cart-drawer.is-open')).toBeVisible();
    await expect(page.locator('.cart-drawer .empty-panel, .drawer-item').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.cart-drawer.is-open')).toHaveCount(0);
  });

  test('checkout form remains usable on mobile with a guest cart', async ({ page }) => {
    await mockGuestCartApi(page);
    await seedGuestCart(page, 'ar');
    await gotoPublic(page, '/checkout?lang=ar', 390, 1000);

    await expect(page.locator('.checkout-page')).toBeVisible();
    await expect(page.locator('.checkout-layout')).toBeVisible();
    await expect(page.locator('.summary-card')).toBeVisible();
    await expect(page.locator('input, textarea, select').first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('Arabic and English direction are applied from LocaleContext', async ({ page }) => {
    await gotoPublic(page, '/shop?lang=ar', 390);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    await gotoPublic(page, '/shop?lang=en', 430);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('admin mobile drawer renders for authenticated admin shell', async ({ page }) => {
    await mockAdminDashboardApi(page);
    await page.addInitScript(() => {
      localStorage.setItem('token', 'playwright-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Admin', role: 'super_admin' }));
    });

    await gotoPublic(page, '/admin/dashboard', 390, 900);

    await expect(page.locator('.admin-layout')).toBeVisible();
    await page.locator('.admin-topbar__menu').click();
    await expect(page.locator('.admin-mobile-drawer.is-open')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
