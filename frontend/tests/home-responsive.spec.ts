import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const widths = [320, 360, 390, 430, 540, 640, 768, 820, 1024, 1180, 1366, 1440, 1480, 1536, 1920];

const sections = [
  'ribbon',
  'hero',
  'highlights',
  'comparison',
  'story-chapters',
  'tester-to-bottle',
  'scent-selector',
  'trust',
  'final-cta',
];

async function gotoHome(page: Page, locale: 'ar' | 'en' = 'ar') {
  await page.goto(`/?lang=${locale}`, { waitUntil: 'domcontentloaded' });
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

test.describe('Nafas public homepage', () => {
  test('uses the normalized public homepage shell and section order', async ({ page }) => {
    await gotoHome(page);

    await expect(page.locator('.apple-nafas-page')).toHaveCount(1);
    await expect(page.locator('[data-section="hero"].anh-landing-hero')).toHaveCount(1);
    await expect(page.locator('[data-section="cinematic-scents"], [data-section="ritual"].anh-ritual--cinematic')).toHaveCount(0);
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
      await gotoHome(page, width === 430 || width === 1024 || width === 1920 ? 'en' : 'ar');
      await expect(page.locator('.apple-nafas-page')).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });
  }

  test('keeps content-driven section rhythm on compact laptop heights', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await gotoHome(page);

    const metrics = await page.evaluate(() => {
      const headingSelectors = [
        '[data-section="hero"] h1',
        '[data-section="highlights"] .anh-section-head h2',
        '[data-section="comparison"] h2',
        '[data-section="story-chapters"] .anh-section-head h2',
        '[data-section="tester-to-bottle"] .anh-section-head h2',
        '[data-section="scent-selector"] h2',
        '[data-section="trust"] h2',
        '[data-section="final-cta"] h2',
      ];

      const headings = headingSelectors.map((selector) => {
        const element = document.querySelector(selector);
        return {
          fontSize: element ? Number.parseFloat(window.getComputedStyle(element).fontSize) : 0,
          selector,
        };
      });

      const sections = [...document.querySelectorAll<HTMLElement>('.apple-nafas-page > [data-section]:not(.anh-ribbon)')]
        .map((element) => ({
          height: element.getBoundingClientRect().height,
          paddingBottom: Number.parseFloat(window.getComputedStyle(element).paddingBottom),
          paddingTop: Number.parseFloat(window.getComputedStyle(element).paddingTop),
        }));

      return { headings, sections };
    });

    for (const heading of metrics.headings) {
      expect(heading.fontSize, heading.selector).toBeGreaterThan(0);
      expect(heading.fontSize, heading.selector).toBeLessThanOrEqual(96);
    }

    for (const section of metrics.sections) {
      expect(section.height).toBeGreaterThan(180);
      expect(section.height).toBeLessThanOrEqual(980);
      expect(section.paddingTop).toBeLessThanOrEqual(112);
      expect(section.paddingBottom).toBeLessThanOrEqual(112);
    }

    await expectNoHorizontalOverflow(page);
  });

  test('supports Arabic RTL and English LTR from LocaleContext', async ({ page }) => {
    await gotoHome(page, 'ar');
    await expect(page.locator('.apple-nafas-page')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    await gotoHome(page, 'en');
    await expect(page.locator('.apple-nafas-page')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
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
    await expect(highlights.locator('.anh-carousel-dock .anh-dock-button')).toBeVisible();
    await expect(page.getByTestId('highlight-dot-1')).toBeVisible();

    await page.getByTestId('highlight-dot-1').click();
    await expect(highlights.locator('.anh-highlight-card').nth(1)).toHaveAttribute('data-active', 'true');

    await highlights.locator('.anh-highlight-shell').focus();
    await page.keyboard.press('ArrowRight');
    await expect(highlights.locator('.anh-highlight-card').nth(2)).toHaveAttribute('data-active', 'true');
    await expect(page.locator('.nlp-highlights__controls, .nlp-viewer__side-controls')).toHaveCount(0);
  });

  test('keeps key mobile controls usable at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1100 });
    await gotoHome(page);

    await expect(page.locator('[data-section="hero"] #hero-title')).toBeVisible();
    await expect(page.locator('[data-section="hero"] .anh-landing-hero__bottle')).toBeVisible();
    await expect(page.locator('[data-section="hero"] .anh-button').first()).toBeVisible();
    await expect(page.locator('[data-section="highlights"] .anh-carousel-dock')).toBeVisible();
    await expect(page.locator('[data-section="comparison"] .anh-compare-card').first()).toBeVisible();

    const clippedButtons = await page.evaluate(() => {
      return [...document.querySelectorAll('.apple-nafas-page .anh-button, .apple-nafas-page button')]
        .filter((element) => {
          if (element.closest('[aria-hidden="true"]')) {
            return false;
          }
          const rect = element.getBoundingClientRect();
          return rect.width < 32 || rect.height < 32 || rect.left < -1 || rect.right > window.innerWidth + 1;
        }).length;
    });

    expect(clippedButtons).toBe(0);
    await expectNoHorizontalOverflow(page);
  });

  test('does not leave custom cursor or pointer-following artifacts in the DOM', async ({ page }) => {
    await gotoHome(page);

    await expect(page.locator('.custom-cursor, .cursor-dot, .cursor-ring')).toHaveCount(0);

    const cursorStyles = await page.evaluate(() => [...document.styleSheets]
      .flatMap((sheet) => {
        try {
          return [...sheet.cssRules].map((rule) => rule.cssText);
        } catch {
          return [];
        }
      })
      .some((cssText) => cssText.includes('cursor-dot') || cssText.includes('cursor-ring')));

    expect(cursorStyles).toBe(false);
  });
});
