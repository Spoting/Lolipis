const puppeteer = require('puppeteer');
const fs = require('fs').promises;

/**
 * This file is responsible for scraping Urls into a file {productsUrl}. 
 * Then the productsUrl file will be given as input to another puppeteer to get the actual content for each URL.
 * 
 * TODO: Add functionality getNewUrls() { lastUrl = productsUrl.lastUrlInFile; scrapeNewerOf(lasturl); } 
 */



//Getting argv from bash scripts
const pageIndex = process.argv[2];
if (!pageIndex) {
    throw "Please provide PageIndex as a first argument";
}

let url;
if (pageIndex === 0) {
    url = `https://e-hentai.org/?f_cats=1017`;
} else {
    url = `https://e-hentai.org/?page=${pageIndex}&f_cats=1017`;
}

//Get Urls
let scrape = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ]
        });
        const page = await browser.newPage();
        console.log(`We are producing products from : ${url}`);
        await page.goto(url);
        let urls = await page.evaluate(() => {
            let results = [];
            let titles = document.querySelectorAll('td.gl3c.glname'); //get everything from the third column 
            titles.forEach((title) => {
                let ref = title.querySelector('a');
                results.push({                          //for makings an object
                    url: ref.getAttribute('href')
                });
            });
            return results;
        })
        browser.close();
        return urls;
    } catch (e) {
        console.log(e);
    };
};

//write to file
//TODO: Instead of a file inside project maybe try instantly writing to external storage
const target = 'productsUrl';
const storeData = async (data) => {
    try {
        await fs.writeFile(target, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

//getting file size qq
getFilesizeInBytes = async () => {
    const stats = await fs.stat(target);
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

//RUN
scrape().then(async (urls) => {
    if (urls.length === 0) {
        console.log("Gami8ikes sta fail me tin kolo DOM", urls);
        // QQ
    } else {
        console.log("Success getting products URLs", urls);
        urls.reverse();

        await storeData(urls);

        let size = await getFilesizeInBytes();
        console.log("Wrote URLs To file successfully with size " + size / 1000000.0 + "MB");
    }
});
