import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const widths = [320, 360, 390, 430, 540, 640, 768, 820, 1024, 1180, 1366, 1440, 1480, 1536, 1920];

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

  test('keeps desktop section frames bounded and readable', async ({ page }) => {
    await page.setViewportSize({ width: 1480, height: 920 });
    await gotoHome(page);

    const sectionFrames = await page.locator('.apple-nafas-page > [data-section]:not(.anh-ribbon)').evaluateAll((elements) => (
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);

        return {
          height: rect.height,
          paddingBottom: Number.parseFloat(styles.paddingBottom),
          paddingTop: Number.parseFloat(styles.paddingTop),
          width: rect.width,
        };
      })
    ));

    for (const frame of sectionFrames) {
      expect(Math.round(frame.width)).toBe(1480);
      expect(frame.height).toBeGreaterThan(320);
      expect(frame.paddingTop).toBeGreaterThan(40);
      expect(frame.paddingBottom).toBeGreaterThan(40);
    }

    await expectNoHorizontalOverflow(page);
  });

  test('scales the section frame on compact laptop heights', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await gotoHome(page);

    const compactSizing = await page.evaluate(() => {
      const headingSelectors = [
        '[data-section="ritual"] h2',
        '[data-section="highlights"] .anh-section-head h2',
        '[data-section="emotional"] h2',
        '[data-section="product-viewer"] .anh-section-head h2',
        '[data-section="product-viewer"] h3',
        '[data-section="story-chapters"] .anh-section-head h2',
        '[data-section="story-chapters"] h3',
        '[data-section="senses"] h2',
        '[data-section="tester-to-bottle"] .anh-section-head h2',
        '[data-section="hero"] h1',
        '[data-section="better-together"] h2',
        '[data-section="scent-selector"] h2',
        '[data-section="trust"] h2',
        '[data-section="comparison"] h2',
        '[data-section="keep-exploring"] h2',
        '[data-section="final-cta"] h2',
      ];

      const headings = headingSelectors.map((selector) => {
        const element = document.querySelector(selector);
        return {
          fontSize: element ? Number.parseFloat(window.getComputedStyle(element).fontSize) : 0,
          selector,
        };
      });

      const heightSelectors = [
        '[data-section="ritual"] .anh-ritual-cinematic__stage',
        '[data-section="highlights"] .anh-highlight-card',
        '[data-section="emotional"] .anh-love__inner',
        '[data-section="product-viewer"] .anh-viewer-panel',
        '[data-section="story-chapters"] .anh-chapter',
        '[data-section="senses"] .anh-senses__stage',
        '[data-section="tester-to-bottle"] .anh-flow__steps article',
        '[data-section="hero"] .anh-landing-hero__content',
        '[data-section="better-together"] .anh-together__visual',
        '[data-section="trust"] .anh-why__grid article',
        '[data-section="comparison"] .anh-compare-card__visual',
        '[data-section="keep-exploring"] .anh-explore-card',
      ];

      const blocks = heightSelectors.map((selector) => {
        const element = document.querySelector(selector);
        return {
          height: element?.getBoundingClientRect().height ?? 0,
          selector,
        };
      });

      return { blocks, headings };
    });

    const sectionFrames = await page.locator('.apple-nafas-page > [data-section]:not(.anh-ribbon)').evaluateAll((elements) => (
      elements.map((element) => {
        const styles = window.getComputedStyle(element);

        return {
          height: element.getBoundingClientRect().height,
          paddingBottom: Number.parseFloat(styles.paddingBottom),
          paddingTop: Number.parseFloat(styles.paddingTop),
          width: Math.round(element.getBoundingClientRect().width),
        };
      })
    ));

    for (const frame of sectionFrames) {
      expect(frame.width).toBe(1366);
      expect(frame.height).toBeGreaterThan(240);
      expect(frame.paddingTop).toBeLessThan(96);
      expect(frame.paddingBottom).toBeLessThan(96);
    }

    for (const heading of compactSizing.headings) {
      expect(heading.fontSize, heading.selector).toBeGreaterThan(0);
      expect(heading.fontSize, heading.selector).toBeLessThanOrEqual(96);
    }

    for (const block of compactSizing.blocks) {
      expect(block.height, block.selector).toBeGreaterThan(0);
      expect(block.height, block.selector).toBeLessThanOrEqual(640);
    }
  });

  test('supports cinematic ritual controls and keyboard navigation', async ({ page }) => {
    await gotoHome(page);
    const ritual = page.locator('[data-section="ritual"]');

    await expect(ritual).toBeVisible();
    await expect(page.getByTestId('cinematic-ritual-play-toggle')).toBeVisible();
    await expect(page.getByTestId('cinematic-ritual-dot-1')).toBeVisible();
    await expect(page.getByTestId('cinematic-ritual-next')).toHaveCount(0);
    await expect(page.getByTestId('cinematic-ritual-prev')).toHaveCount(0);

    const ritualControlChildren = await ritual.locator('.anh-ritual-cinematic__controls').evaluate((element) => (
      [...element.children].map((child) => child.className)
    ));

    expect(ritualControlChildren).toEqual([
      'anh-dock-button anh-ritual-control anh-ritual-control--play',
      'anh-dots anh-ritual-dots',
    ]);

    const ritualControlLayout = await ritual.locator('.anh-ritual-cinematic__controls').evaluate((element) => {
      const buttonElement = element.querySelector('.anh-dock-button');
      const dotsElement = element.querySelector('.anh-dots');
      const button = buttonElement?.getBoundingClientRect();
      const dots = dotsElement?.getBoundingClientRect();

      return {
        buttonBackground: buttonElement ? window.getComputedStyle(buttonElement).backgroundColor : '',
        buttonLeft: button?.left ?? 0,
        direction: window.getComputedStyle(element).direction,
        dotsBackground: dotsElement ? window.getComputedStyle(dotsElement).backgroundColor : '',
        dotsRight: dots?.right ?? 0,
      };
    });

    expect(ritualControlLayout.direction).toBe('rtl');
    expect(ritualControlLayout.buttonLeft).toBeGreaterThan(ritualControlLayout.dotsRight);
    expect(ritualControlLayout.buttonBackground).toBe(ritualControlLayout.dotsBackground);

    await page.getByTestId('cinematic-ritual-dot-1').click();
    await expect(ritual).toHaveAttribute('data-active-scent', 'ghayma', { timeout: 2500 });
    await expect(ritual).toHaveAttribute('data-phase', 'idle', { timeout: 2500 });

    await ritual.focus();
    await page.keyboard.press('ArrowRight');
    await expect(ritual).toHaveAttribute('data-active-scent', 'athar', { timeout: 2500 });
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

    const highlightControlLayout = await highlights.locator('.anh-carousel-dock').evaluate((element) => {
      const button = element.querySelector('.anh-dock-button')?.getBoundingClientRect();
      const dots = element.querySelector('.anh-dots')?.getBoundingClientRect();

      return {
        buttonLeft: button?.left ?? 0,
        direction: window.getComputedStyle(element).direction,
        dotsRight: dots?.right ?? 0,
      };
    });

    expect(highlightControlLayout.direction).toBe('rtl');
    expect(highlightControlLayout.buttonLeft).toBeGreaterThan(highlightControlLayout.dotsRight);

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

    await viewer.getByRole('button', { name: 'مدار' }).click();
    await expect(viewer.getByRole('heading', { name: 'مدار' })).toBeVisible();
    await expect(page.getByTestId('viewer-copy')).toContainText('نظيف');

    await viewer.getByRole('button', { name: 'ندى' }).click();
    await expect(viewer.getByRole('heading', { name: 'ندى' })).toBeVisible();
  });

  test('keeps key mobile controls usable at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1100 });
    await gotoHome(page);
    const hero = page.locator('[data-section="hero"]');

    await expect(hero.locator('#hero-title')).toBeVisible();
    await expect(hero.locator('.anh-landing-hero__bottle')).toBeVisible();
    await expect(hero.getByRole('link', { name: 'اكتشف العطور' })).toBeVisible();
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
