const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  // 1. Screenshot of the local custom profile preview
  const localPreviewPath = 'file://' + path.resolve('preview.html').replace(/\\/g, '/');
  console.log('Navigating to local preview:', localPreviewPath);
  await page.goto(localPreviewPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // Wait for canvas / animations to render
  const localScreenshotPath = path.resolve('screenshot-preview-new.png');
  await page.screenshot({ path: localScreenshotPath, fullPage: true });
  console.log('Captured local preview screenshot:', localScreenshotPath);

  // 2. Screenshot of the live GitHub profile
  const githubProfileUrl = 'https://github.com/Suvesh108';
  console.log('Navigating to live GitHub profile:', githubProfileUrl);
  try {
    await page.goto(githubProfileUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    const githubScreenshotPath = path.resolve('screenshot-github-current.png');
    await page.screenshot({ path: githubScreenshotPath, fullPage: true });
    console.log('Captured GitHub profile screenshot:', githubScreenshotPath);
  } catch (err) {
    console.error('Error fetching live GitHub profile:', err.message);
  }

  await browser.close();
  console.log('Done screenshots.');
})();
