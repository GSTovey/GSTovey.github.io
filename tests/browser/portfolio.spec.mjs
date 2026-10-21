import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { renderPage } from '../../src/render.mjs';
import { site } from '../../src/data/site.mjs';
import { existsSync } from 'node:fs';

for (const locale of ['en', 'zh']) for (const width of [1440, 1024, 768, 390, 320]) {
  test(`${locale}: responsive page and accessible content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(locale === 'zh' ? '/zh/' : '/');
    await expect(page.locator('h1')).toHaveText(locale === 'zh' ? '你好，我是 Tovey。' : 'Hi, I’m Tovey.');
    await expect(page.locator('.publication-card')).toHaveCount(3);
    await expect(page.locator('.project-card')).toHaveCount(2);
    await expect(page.locator('.resource-card')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
    expect(errors).toEqual([]);
    expect(await page.locator('.publication-summary').first().evaluate((node) => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
    await page.screenshot({ path: `test-results/portfolio-${locale}-${width}.png`, fullPage: true });
  });
}

test('all same-page links resolve and production assets are served', async ({ page, request }) => {
  const failedLocal = [];
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:5173') && response.status() >= 400) failedLocal.push(response.url());
  });
  await page.goto('/');
  const hashes = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.hash));
  for (const hash of hashes) await expect(page.locator(hash)).toHaveCount(1);
  for (const path of ['/zh/', '/assets/fonts/manrope-latin-variable.woff2', '/assets/favicon.svg', '/assets/social-card.png', '/robots.txt', '/sitemap.xml']) expect((await request.get(path)).ok()).toBe(true);
  expect((await request.get('/missing-resource.png')).status()).toBe(404);
  expect(failedLocal).toEqual([]);
});

test('mobile menu supports toggling, keyboard escape, navigation and focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await expect(toggle).toHaveAccessibleName('Open navigation');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Close navigation');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole('navigation').getByRole('link', { name: 'Publications' }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#publications$/);
  await expect(page.locator('#publications')).toBeFocused();
  expect((await page.locator('#publications').boundingBox()).y).toBeGreaterThanOrEqual(68);
});

test('citation dialog preserves reference, copies BibTeX, and restores keyboard focus', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const cite = page.getByRole('button', { name: /^Cite NESTTOR/ });
  await cite.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('code')).toContainText('Zhou, Chenxin and Huang, Cheng and Zhang, Qiang and Xie, Qiliang and Li, Zeqing');
  await dialog.getByRole('button', { name: 'Copy BibTeX' }).click();
  await expect(dialog.getByRole('status')).toHaveText('BibTeX copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('10.1109/TNSM.2026.3743261');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(cite).toBeFocused();
});

test('avatar failure has a visible text fallback without a broken image', async ({ page }) => {
  await page.route('**/assets/avatar.png', (route) => route.abort());
  await page.route('**/assets/avatar.jpg', (route) => route.abort());
  await page.route('https://avatars.githubusercontent.com/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('.avatar')).toBeHidden();
  await expect(page.locator('.avatar-monogram')).toBeVisible();
  await expect(page.locator('.avatar-wrap')).toHaveAttribute('aria-label', 'Profile image unavailable');
});

test('reduced motion, keyboard skip link, and footer navigation work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await page.getByRole('link', { name: 'Back to top' }).click();
  await expect(page).toHaveURL(/#home$/);
});

test('content and small-screen navigation remain usable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.locator('.publication-card').first()).toBeVisible();
  await expect(page.locator('.cite-button').first()).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test('language switch preserves section, restores explicit preference, and can return to English', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#publications');
  await page.getByRole('link', { name: '切换到中文' }).click();
  await expect(page).toHaveURL(/\/zh\/#publications$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans');
  await expect(page.getByRole('navigation')).toHaveAccessibleName('主导航');
  await expect(page.locator('.publication-card')).toHaveCount(3);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans');
  await page.goto('/');
  await expect(page).toHaveURL(/\/zh\/$/);
  await page.getByRole('link', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate(() => localStorage.getItem('portfolio-language'))).toBe('en');
});

test('Chinese menu, citation, copy feedback and accessible labels are translated', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/zh/');
  await page.getByRole('button', { name: '展开导航' }).click();
  await page.getByRole('navigation').getByRole('link', { name: '论文', exact: true }).click();
  await expect(page.getByRole('button', { name: '展开导航' })).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: /^引用 R3S/ }).click();
  const dialog = page.getByRole('dialog', { name: '引用这项研究' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '复制 BibTeX' }).click();
  await expect(dialog.getByRole('status')).toHaveText('已复制 BibTeX。');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('10.1109/TIFS.2026.3725546');
  await dialog.getByRole('button', { name: '关闭引用' }).click();
  await expect(dialog).not.toBeVisible();
});

test('language link works when localStorage is unavailable', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable'); } }));
  await page.goto('/');
  await page.getByRole('link', { name: '切换到中文' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans');
  await page.getByRole('link', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('Chinese content and language link work without JavaScript; local font loads', async ({ browser, page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].some((face) => face.family === 'Manrope' && face.status === 'loaded'))).toBe(true);
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const plain = await context.newPage();
  await plain.goto('/zh/');
  await expect(plain.locator('h1')).toHaveText('你好，我是 Tovey。');
  await expect(plain.locator('.publication-card')).toHaveCount(3);
  await plain.getByRole('link', { name: 'Switch to English' }).click();
  await expect(plain.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});

test('desktop navigation reaches every section and exposes an active location', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const links = page.getByRole('navigation').getByRole('link');
  for (let i = 0; i < await links.count(); i++) {
    const link = links.nth(i);
    const hash = await link.getAttribute('href');
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    await expect(page.locator(hash)).toBeFocused();
  }
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'location');
});

test('long content and missing optional fields remain readable on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  await page.setContent(renderPage({
    site: { ...site, email: undefined },
    publications: [{ title: 'A long research title '.repeat(18), tags: ['Averylongtopicwithoutbreaks'.repeat(6)] }],
    projects: [{ title: 'Averylongrepositorynamewithoutbreaks'.repeat(4) }],
  }));
  await page.waitForFunction(() => !!document.styleSheets.length);
  await expect(page.locator('.publication-content h3 a')).toHaveCount(0);
  await expect(page.locator('#news, #experience, #open-source, #research')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('body').innerText()).not.toMatch(/undefined|null/);
});

test('locally downloaded avatar is decoded as a real image', async ({ page }) => {
  const localAvatar = ['avatar.jpg', 'avatar.png'].find((name) => existsSync(`public/assets/${name}`));
  test.skip(!localAvatar, 'No local avatar; the remote image and failure fallback are checked separately.');
  await page.goto('/');
  await expect(page.locator('.avatar')).toBeVisible();
  await expect.poll(() => page.locator('.avatar').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  expect(await page.locator('.avatar').getAttribute('src')).toBe(`/assets/${localAvatar}`);
});
