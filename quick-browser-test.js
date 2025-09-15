#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs/promises';

async function quickBrowserTest() {
  console.log('🚀 Starting browser test...');

  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Visible browser
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    console.log('✅ Browser launched');

    // Navigate to your app
    await page.goto('http://localhost:5173');
    console.log('✅ Navigated to church app');

    // Get page info
    const title = await page.title();
    const url = page.url();
    console.log(`📄 Page: ${title} at ${url}`);

    // Create screenshots directory
    await fs.mkdir('./screenshots', { recursive: true });

    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `./screenshots/${timestamp}-church-app.png`;
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);

    // Test basic page elements
    const h1 = await page.$('h1');
    if (h1) {
      const h1Text = await page.evaluate(el => el.textContent, h1);
      console.log(`✅ Found main heading: "${h1Text}"`);
    }

    // Check for React
    const reactElements = await page.$$('[data-reactroot], #root');
    console.log(`✅ React elements found: ${reactElements.length}`);

    console.log('🎉 Browser test completed successfully!');
    console.log(`\n🖼️  Screenshot location: ${screenshotPath}`);

  } catch (error) {
    console.error('❌ Browser test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔚 Browser closed');
    }
  }
}

// Run the test
quickBrowserTest().catch(console.error);