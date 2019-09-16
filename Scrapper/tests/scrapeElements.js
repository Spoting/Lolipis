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
        const browser = await puppeteer.launch();
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

                //let url = ref.getAttribute('href') + "\n"; //for writing to each line \n
                //results.push(url);
            });
            return results;
        })
        browser.close();
        return urls;
    } catch (e) {
        console.log(e);
    };
};

//append to file
// const target = 'productsUrl';
// let appendToFile = async (data) => {
//     await fs.appendFile(target, data, (err) => {
//         if (err) throw err;
//     });
// };

//write to file
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
scrape().then(async (value) => {
    if (value.length === 0) {
        console.log("Gami8ikes sta fail me tin kolo DOM", value);
        // QQ
    } else {
        console.log("Success getting products URLs", value);
        value.reverse();
        // value.forEach((product) => {
        //   //  appendToFile(product); //
        //     appendToFile(JSON.stringify(product));
        // })
        await storeData(value);

        let size = await getFilesizeInBytes();
        console.log("Wrote URLs To file successfully with size " + size / 1000000.0 + "MB");
    }
});
