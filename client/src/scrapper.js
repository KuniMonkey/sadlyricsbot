const puppeteer = require('puppeteer');
const request = require('request');
const cherrio = require('cheerio');

/*(async () => {
  const start = new Date();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://genius.com/Radiohead-creep-lyrics', {waitUntil: 'domcontentloaded'});
  const songText = await page.evaluate(() => document.querySelector("p").innerText);

  let finish = new Date();
  console.log(songText);
  let res = finish - start;
  console.log("got it in " + res + "ms")
  await browser.close();
})();

async function grabDatLyrics(URL) {
  const start = new Date();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL, {waitUntil: 'domcontentloaded'});
  const songText = await page.evaluate(() => document.querySelector("p").innerText);

  let finish = new Date();
  console.log(songText);
  let res = finish - start;
  console.log("got it in " + res + "ms")
  await browser.close();
}

export default grabDatLyrics;*/

request('https://genius.com/Radiohead-creep-lyrics', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cherrio.load(html);

        const song = $('.lyrics p');

        console.log(song.html()); 
    }
})