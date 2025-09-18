import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function debugWebsite() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 720 }
    });

    try {
        const page = await browser.newPage();

        // Enable console logging
        page.on('console', msg => {
            const type = msg.type().substr(0, 3).toUpperCase();
            console.log(`[CONSOLE ${type}] ${msg.text()}`);
        });

        // Enable error logging
        page.on('pageerror', error => {
            console.log(`[PAGE ERROR] ${error.message}`);
        });

        // Enable request/response logging
        page.on('response', response => {
            const status = response.status();
            const url = response.url();
            if (status >= 400) {
                console.log(`[FAILED REQUEST] ${status} ${url}`);
            }
        });

        console.log('Navigating to http://localhost:5175/...');
        await page.goto('http://localhost:5175/', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Take initial screenshot
        console.log('Taking screenshot...');
        await page.screenshot({
            path: '/Users/Anton/Documents/hjemmeside Gislev kirke/minKirke-code/my-fresh-app/debug-screenshot.png',
            fullPage: true
        });

        // Get page title and URL
        const title = await page.title();
        const url = await page.url();
        console.log(`Page title: "${title}"`);
        console.log(`Current URL: ${url}`);

        // Check if elements exist
        const bodyExists = await page.$('body');
        const rootExists = await page.$('#root');
        const anyDivs = await page.$$('div');

        console.log(`Body element exists: ${!!bodyExists}`);
        console.log(`Root element exists: ${!!rootExists}`);
        console.log(`Number of div elements: ${anyDivs.length}`);

        // Get page source
        const htmlContent = await page.content();
        fs.writeFileSync('/Users/Anton/Documents/hjemmeside Gislev kirke/minKirke-code/my-fresh-app/debug-source.html', htmlContent);

        // Check computed styles of body and root
        const bodyStyles = await page.evaluate(() => {
            const body = document.querySelector('body');
            if (!body) return null;
            const styles = getComputedStyle(body);
            return {
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                width: styles.width,
                height: styles.height
            };
        });

        const rootStyles = await page.evaluate(() => {
            const root = document.querySelector('#root');
            if (!root) return null;
            const styles = getComputedStyle(root);
            return {
                backgroundColor: styles.backgroundColor,
                color: styles.color,
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                width: styles.width,
                height: styles.height,
                innerHTML: root.innerHTML.substring(0, 500) // First 500 chars
            };
        });

        console.log('Body styles:', bodyStyles);
        console.log('Root styles:', rootStyles);

        // Check for CSS files
        const cssFiles = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
            return links.map(link => ({
                href: link.href,
                loaded: link.sheet !== null
            }));
        });

        console.log('CSS files:', cssFiles);

        // Check for JavaScript files and errors
        const scriptTags = await page.evaluate(() => {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            return scripts.map(script => ({
                src: script.src,
                loaded: script.readyState || 'unknown'
            }));
        });

        console.log('Script files:', scriptTags);

        // Wait a bit more and check if anything changes
        console.log('Waiting 5 seconds for any delayed rendering...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Take another screenshot
        await page.screenshot({
            path: '/Users/Anton/Documents/hjemmeside Gislev kirke/minKirke-code/my-fresh-app/debug-screenshot-after-wait.png',
            fullPage: true
        });

        // Check if content appeared
        const finalCheck = await page.evaluate(() => {
            const root = document.querySelector('#root');
            return {
                rootContent: root ? root.innerHTML.length : 0,
                bodyContent: document.body.innerHTML.length,
                allElements: document.querySelectorAll('*').length
            };
        });

        console.log('Final content check:', finalCheck);

    } catch (error) {
        console.error('Error during debugging:', error);
    } finally {
        await browser.close();
    }
}

debugWebsite().catch(console.error);