import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const frontendBase = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
const apiBase = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api';
const outputDir = path.resolve('artifacts/final-acceptance-20260430');
const apiHosts = [
  apiBase,
  apiBase.replace('127.0.0.1', 'localhost'),
  apiBase.replace('localhost', '127.0.0.1'),
];

function isApiUrl(url) {
  return apiHosts.some((host) => url.startsWith(host));
}

async function prepareDir() {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
}

async function screenshot(page, name, fullPage = true) {
  await page.screenshot({ path: path.join(outputDir, name), fullPage });
  await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => undefined);
}

async function waitReady(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => undefined);
}

async function routeMetric(page, route, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(`${frontendBase}${route}`, { waitUntil: 'domcontentloaded' });
  await waitReady(page);

  return page.evaluate(({ route: currentRoute, viewport: currentViewport }) => {
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const overflow = Math.max(0, scrollWidth - window.innerWidth);
    const tinyTargets = [...document.querySelectorAll('button, a, input, select, textarea')]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) {
          return false;
        }
        return rect.width < 32 || rect.height < 32 || rect.left < -1 || rect.right > window.innerWidth + 1;
      })
      .length;

    return {
      route: currentRoute,
      viewport: currentViewport,
      dir: document.documentElement.getAttribute('dir'),
      overflow,
      tinyTargets,
      title: document.title,
    };
  }, { route, viewport });
}

async function main() {
  await prepareDir();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const apiResponses = [];
  const requestFailures = [];
  const consoleErrors = [];
  const pageErrors = [];
  const bottleChunkRequests = [];

  page.on('response', (response) => {
    const url = response.url();
    if (isApiUrl(url)) {
      apiResponses.push({ url, status: response.status() });
    }
    if (/Bottle3D|@react-three|three/.test(url)) {
      bottleChunkRequests.push({ url, status: response.status(), page: page.url() });
    }
  });
  page.on('requestfailed', (request) => {
    requestFailures.push({ url: request.url(), failure: request.failure()?.errorText || 'unknown' });
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  const homeBreakpoints = [
    ['home-390-ar.png', '/?lang=ar', { width: 390, height: 900 }],
    ['home-430-en.png', '/?lang=en', { width: 430, height: 900 }],
    ['home-768-ar.png', '/?lang=ar', { width: 768, height: 920 }],
    ['home-1024-en.png', '/?lang=en', { width: 1024, height: 920 }],
    ['home-1440-ar.png', '/?lang=ar', { width: 1440, height: 920 }],
    ['home-1920-en.png', '/?lang=en', { width: 1920, height: 1080 }],
  ];

  for (const [file, route, viewport] of homeBreakpoints) {
    await page.setViewportSize(viewport);
    await page.goto(`${frontendBase}${route}`, { waitUntil: 'domcontentloaded' });
    await waitReady(page);
    await screenshot(page, file);
  }

  const proofScreens = [
    ['shop-1440-en.png', '/shop?lang=en', { width: 1440, height: 920 }],
    ['navbar-home-1440.png', '/?lang=ar', { width: 1440, height: 920 }],
    ['navbar-shop-1440.png', '/shop?lang=en', { width: 1440, height: 920 }],
    ['navbar-product-1440.png', '/products/sharara?lang=ar', { width: 1440, height: 920 }],
    ['navbar-terms-1440.png', '/terms?lang=en', { width: 1440, height: 920 }],
    ['product-sharara-1440.png', '/products/sharara?lang=ar', { width: 1440, height: 920 }],
    ['product-ghayma-1440.png', '/products/ghayma?lang=ar', { width: 1440, height: 920 }],
    ['product-dafwa-1440.png', '/products/dafwa?lang=ar', { width: 1440, height: 920 }],
    ['product-zell-1440.png', '/products/zell?lang=ar', { width: 1440, height: 920 }],
    ['terms-1440.png', '/terms?lang=en', { width: 1440, height: 920 }],
    ['privacy-1440.png', '/privacy-policy?lang=en', { width: 1440, height: 920 }],
    ['faq-1440.png', '/faq?lang=ar', { width: 1440, height: 920 }],
    ['quality-1440.png', '/quality?lang=ar', { width: 1440, height: 920 }],
  ];

  for (const [file, route, viewport] of proofScreens) {
    await page.setViewportSize(viewport);
    await page.goto(`${frontendBase}${route}`, { waitUntil: 'domcontentloaded' });
    await waitReady(page);
    await screenshot(page, file);
  }

  const chunkCounts = {};
  await page.setViewportSize({ width: 1440, height: 920 });
  await page.goto(`${frontendBase}/?lang=en`, { waitUntil: 'domcontentloaded' });
  await waitReady(page);
  chunkCounts.home = bottleChunkRequests.length;

  await page.goto(`${frontendBase}/shop?lang=en`, { waitUntil: 'domcontentloaded' });
  await waitReady(page);
  chunkCounts.shop = bottleChunkRequests.length;

  await page.goto(`${frontendBase}/products/sharara?lang=en`, { waitUntil: 'domcontentloaded' });
  await waitReady(page);
  chunkCounts.productInitial = bottleChunkRequests.length;
  await screenshot(page, 'product-initial-no-3d-1440.png');

  const threeDButton = page.locator('.editorial-gallery__tab').filter({ hasText: '3D' });
  if (await threeDButton.count()) {
    await threeDButton.first().click();
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => undefined);
  }
  chunkCounts.after3DClick = bottleChunkRequests.length;
  await screenshot(page, 'product-after-3d-click-1440.png');

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${frontendBase}/products/sharara?lang=ar`, { waitUntil: 'domcontentloaded' });
  await waitReady(page);
  await page.locator('.purchase-card .n-btn--primary').first().click();
  await page.waitForSelector('.cart-drawer.is-open', { timeout: 15000 });
  await screenshot(page, 'cart-drawer-mobile-390.png');

  await page.goto(`${frontendBase}/checkout?lang=ar`, { waitUntil: 'domcontentloaded' });
  await waitReady(page);
  await screenshot(page, 'checkout-mobile-390.png');
  await page.locator('input[type="text"]').nth(0).fill('Readiness Customer');
  await page.locator('input[type="text"]').nth(1).fill('01012345678');
  await page.locator('input[type="email"]').fill('readiness-customer@example.com');
  await page.locator('input[type="text"]').nth(2).fill('Cairo');
  await page.locator('select').selectOption({ index: 1 });
  await page.locator('textarea').first().fill('12 Readiness Street, Cairo, Egypt');
  await page.locator('.summary-card .n-btn--primary').click();
  await page.waitForURL('**/order-confirmation/**', { timeout: 30000 });
  await screenshot(page, 'order-confirmation-mobile-390.png');

  await page.goto(`${frontendBase}/admin/login`, { waitUntil: 'domcontentloaded' });
  await waitReady(page);
  await page.locator('input[type="email"]').fill('admin@nafas.com');
  await page.locator('input[type="password"]').fill('password123');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/admin/dashboard', { timeout: 30000 });
  await waitReady(page);
  await screenshot(page, 'admin-dashboard-390.png');
  await page.locator('.admin-topbar__menu').click();
  await page.waitForSelector('.admin-mobile-drawer.is-open', { timeout: 15000 });
  await screenshot(page, 'admin-sidebar-mobile-390.png');

  await page.setViewportSize({ width: 1440, height: 920 });
  await page.goto(`${frontendBase}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
  await waitReady(page);
  await screenshot(page, 'admin-dashboard-1440.png');

  const metrics = [];
  for (const route of [
    '/?lang=ar',
    '/shop?lang=en',
    '/products/sharara?lang=ar',
    '/products/ghayma?lang=en',
    '/products/dafwa?lang=ar',
    '/products/zell?lang=en',
    '/checkout?lang=ar',
    '/terms?lang=en',
    '/privacy-policy?lang=en',
    '/faq?lang=ar',
    '/quality?lang=ar',
    '/admin/dashboard',
    '/admin/products',
    '/admin/orders',
  ]) {
    metrics.push(await routeMetric(page, route, { width: 390, height: 900 }));
    metrics.push(await routeMetric(page, route, { width: 1440, height: 920 }));
  }

  const files = (await fs.readdir(outputDir)).filter((file) => file.endsWith('.png'));
  const summary = {
    generatedAt: new Date().toISOString(),
    frontendBase,
    apiBase,
    screenshotDir: outputDir,
    screenshotCount: files.length,
    screenshots: files,
    apiResponseCount: apiResponses.length,
    apiStatuses: [...new Set(apiResponses.map((item) => item.status))],
    apiFailures: apiResponses.filter((item) => item.status >= 400),
    requestFailures: requestFailures.filter((item) => item.failure !== 'net::ERR_ABORTED'),
    navigationAborts: requestFailures.filter((item) => item.failure === 'net::ERR_ABORTED'),
    consoleErrors,
    pageErrors,
    bottle3D: {
      chunkCounts,
      requests: bottleChunkRequests,
    },
    overflowFailures: metrics.filter((metric) => metric.overflow > 1),
    tapTargetWarnings: metrics.filter((metric) => metric.tinyTargets > 0),
    metrics,
  };

  await fs.writeFile(path.join(outputDir, 'final-acceptance-summary.json'), JSON.stringify(summary, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
