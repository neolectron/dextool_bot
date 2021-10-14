import dotenv from 'dotenv';
import pupeteer from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

dotenv.config();
pupeteer.use(stealthPlugin());

if (process.env['DEXTOOLS_PAIR'] === undefined) {
  console.error('DEXTOOLS_PAIR environment is not defined');
  process.exit(1);
}

const browser = await pupeteer.launch({
  headless: !!process.env['HEADLESS'],
  ignoreHTTPSErrors: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote',
    '--disable-site-isolation-trials',
  ],
});

const page = await browser.newPage();
await page.goto(
  `https://www.dextools.io/app/bsc/pair-explorer/${process.env['DEXTOOLS_PAIR']}`
);
await page.waitForNavigation({ timeout: 60 * 1000 });

console.log('->visited dextool');

const [response] = await Promise.all([
  page.waitForNavigation({ timeout: 60 * 1000 }),
  page.click('.page-title a[href^="https://bscscan"]', { delay: 1000 }),
]);
console.log('navigation done');

const tabs = await browser.pages();
console.log('->tabs: ', tabs.length);
tabs.forEach((p) => console.log(p.url()));

browser.close();
