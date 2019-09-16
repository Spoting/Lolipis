const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const url = process.argv[2];
if (!url) {
    throw "Please provide URL as a first argument";
}

const dir = 'screenshots';
(async() => {
    try {
        const stat = await fs.lstat(dir);
        console.log(stat.isDirectory());
    } catch(err) {
        console.log(err);
        fs.mkdir(dir);
    }
})();
(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    await page.goto(url);
    await page.screenshot({ path: 'screenshots/screenshot.png' });
    browser.close();
})();
