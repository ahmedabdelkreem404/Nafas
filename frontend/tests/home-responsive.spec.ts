import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const widths = [320, 360, 390, 430, 540, 640, 768, 820, 1024, 1180, 1366, 1440, 1536, 1920];

const sections = [
  'ribbon',
  'ritual',
  'highlights',
  'emotional',
  'product-viewer',
  'story-chapters',
  'senses',
  'tester-to-bottle',
  'hero',
  'better-together',
  'scent-selector',
  'trust',
  'comparison',
  'keep-exploring',
  'final-cta',
];

async function gotoHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => undefined);

  if (await page.locator('.apple-nafas-page').count() === 0) {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    return scrollWidth - window.innerWidth;
  });

  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe('Apple Nafas homepage', () => {
  test('uses the isolated homepage shell and not the old homepage system', async ({ page }) => {
    await gotoHome(page);

    await expect(page.locator('.apple-nafas-page')).toHaveCount(1);
    await expect(page.locator('[data-section="hero"].anh-landing-hero')).toHaveCount(1);
    await expect(page.locator('[data-section="hero"].anh-ritual--cinematic')).toHaveCount(0);
    await expect(page.locator('[data-section="ritual"].anh-ritual--cinematic')).toHaveCount(1);
    await expect(page.locator('[data-section="cinematic-scents"]')).toHaveCount(0);
    await expect(page.locator('.page-home.nlp')).toHaveCount(0);
    await expect(page.locator('[class*="Bottle3D"], [class*="bottle3d"], .product-3d-viewer, .bottle-assembly-canvas')).toHaveCount(0);
    await expect(page.locator('[data-section="hero"] canvas')).toHaveCount(0);

    const renderedSections = await page.locator('.apple-nafas-page > [data-section]').evaluateAll((elements) => (
      elements.map((element) => element.getAttribute('data-section'))
    ));

    expect(renderedSections).toEqual(sections);
  });

  for (const width of widths) {
    test(`renders without horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1100 });
      await gotoHome(page);
      await expect(page.locator('.apple-nafas-page')).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });
  }

  test('renders all key homepage sections', async ({ page }) => {
    await gotoHome(page);

    for (const section of sections) {
      await expect(page.locator(`[data-section="${section}"]`)).toHaveCount(1);
    }
  });

  test('supports cinematic ritual controls and keyboard navigation', async ({ page }) => {
    await gotoHome(page);
    const ritual = page.locator('[data-section="ritual"]');

    await expect(ritual).toBeVisible();
    await expect(page.getByTestId('cinematic-ritual-play-toggle')).toBeVisible();
    await expect(page.getByTestId('cinematic-ritual-dot-1')).toBeVisible();
    await expect(page.getByTestId('cinematic-ritual-next')).toBeVisible();
    await expect(page.getByTestId('cinematic-ritual-prev')).toBeVisible();

    await page.getByTestId('cinematic-ritual-dot-1').click();
    await expect(ritual).toHaveAttribute('data-active-scent', 'ghayma', { timeout: 2500 });
    await expect(ritual).toHaveAttribute('data-phase', 'idle', { timeout: 2500 });

    await ritual.focus();
    await page.keyboard.press('ArrowRight');
    await expect(ritual).toHaveAttribute('data-active-scent', 'dafwa', { timeout: 2500 });
    await expect(ritual).toHaveAttribute('data-phase', 'idle', { timeout: 2500 });

    await page.getByTestId('cinematic-ritual-play-toggle').click();
    await expect(ritual).toHaveAttribute('data-autoplay', 'on');
    await expect(ritual.locator('canvas, [class*="Bottle3D"], [class*="bottle3d"]')).toHaveCount(0);
  });

  test('uses Nafas CTA colors instead of Apple blue on the homepage', async ({ page }) => {
    await gotoHome(page);

    const hasAppleBlue = await page.evaluate(() => {
      const appleBlue = ['rgb(0, 113, 227)', '#0071e3', 'rgb(0, 102, 204)', '#0066cc'];

      return [...document.querySelectorAll('.apple-nafas-page .anh-button')]
        .some((element) => {
          const styles = window.getComputedStyle(element);
          const paint = `${styles.backgroundColor} ${styles.backgroundImage} ${styles.color} ${styles.borderColor}`.toLowerCase();
          return appleBlue.some((token) => paint.includes(token));
        });
    });

    expect(hasAppleBlue).toBe(false);
  });

  test('supports highlights carousel controls and keyboard navigation', async ({ page }) => {
    await gotoHome(page);
    const highlights = page.locator('[data-section="highlights"]');

    await expect(highlights).toBeVisible();
    await expect(highlights.getByRole('button', { name: /إيقاف|تشغيل/ })).toBeVisible();
    await expect(page.getByTestId('highlight-dot-1')).toBeVisible();

    await page.getByTestId('highlight-dot-1').click();
    await expect(highlights.locator('.anh-highlight-card').nth(1)).toHaveAttribute('data-active', 'true');

    await highlights.locator('.anh-highlight-shell').focus();
    await page.keyboard.press('ArrowRight');
    await expect(highlights.locator('.anh-highlight-card').nth(2)).toHaveAttribute('data-active', 'true');
    await expect(page.locator('.nlp-highlights__controls, .nlp-viewer__side-controls')).toHaveCount(0);
  });

  test('updates product viewer scent and tab content', async ({ page }) => {
    await gotoHome(page);
    const viewer = page.locator('[data-section="product-viewer"]');

    await viewer.getByRole('button', { name: 'غيمة' }).click();
    await expect(viewer.getByRole('heading', { name: 'غيمة' })).toBeVisible();
    await expect(page.getByTestId('viewer-copy')).toContainText('نعومة تتعلق');

    await viewer.getByRole('button', { name: 'النوتات' }).click();
    await expect(page.getByTestId('viewer-copy')).toContainText('كمثرى');

    await viewer.getByRole('button', { name: 'دفوة' }).click();
    await expect(viewer.getByRole('heading', { name: 'دفوة' })).toBeVisible();
    await expect(page.getByTestId('viewer-copy')).toContainText('قهوة دافية');

    await viewer.getByRole('button', { name: 'ظلّ' }).click();
    await expect(viewer.getByRole('heading', { name: 'ظلّ' })).toBeVisible();
  });

  test('keeps key mobile controls usable at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1100 });
    await gotoHome(page);
    const hero = page.locator('[data-section="hero"]');

    await expect(hero.locator('#hero-title')).toBeVisible();
    await expect(hero.locator('.anh-landing-hero__bottle')).toBeVisible();
    await expect(hero.getByRole('link', { name: 'اكتشف المجموعة' })).toBeVisible();
    await expect(page.locator('[data-section="ritual"] .anh-ritual-cinematic__controls')).toBeVisible();
    await expect(page.locator('[data-section="product-viewer"]')).toBeVisible();
    await expect(page.locator('[data-section="comparison"] .anh-compare-card').first()).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const clippedButtons = await page.evaluate(() => {
      return [...document.querySelectorAll('.apple-nafas-page .anh-button, .apple-nafas-page button')]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width < 32 || rect.height < 32 || rect.left < -1 || rect.right > window.innerWidth + 1;
        }).length;
    });

    expect(clippedButtons).toBe(0);
  });

  test('disables autoplay when reduced motion is requested', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoHome(page);
    const ritual = page.locator('[data-section="ritual"]');

    await expect(ritual).toHaveAttribute('data-reduced-motion', 'true');
    await expect(ritual).toHaveAttribute('data-autoplay', 'off');
    await expect(page.getByTestId('cinematic-ritual-play-toggle')).toBeDisabled();
  });
});
