import { expect, test } from '@playwright/test';

const widths = [360, 390, 430, 768, 1024, 1366, 1440, 1920];

test.describe('Apple Nafas homepage responsiveness', () => {
  for (const width of widths) {
    test(`renders without horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1100 });
      await page.goto('/', { waitUntil: 'networkidle' });
      await expect(page.locator('.apple-nafas-page')).toHaveCount(1);
      await expect(page.locator('.apple-nafas-page')).toBeVisible();
      await expect(page.locator('.page-home.nlp')).toHaveCount(0);

      const overflow = await page.evaluate(() => {
        const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        return scrollWidth - window.innerWidth;
      });

      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
