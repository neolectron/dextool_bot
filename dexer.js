const config = require('./config.json');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('start');

  const url = config.url;

  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
      `--proxy-server=${config.proxyservice}`,
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--deterministic-fetch',
      '--disable-features=IsolateOrigins',
      '--disable-site-isolation-trials',
    ],
  });

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);
  await page.authenticate({
    username: config.username,
    password: config.password,
  });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  );

  try {
    await page.goto(url);
    await page.waitForSelector(
      'body > app-root > div.container-fluid.icon-sidebar-nav.ng-tns-c70-0 > div > main > app-exchange > div > app-pairexplorer > app-layout > div > div > div.row.mb-4.ng-tns-c118-2 > div.col-12.col-md-8.col-xl-3.text-center.text-sm-left.mt-3.mt-md-0.pair-container.ng-tns-c118-2 > ul > li.text-right.pair-name.mt-2.mb-3.ng-tns-c118-2.ng-star-inserted > span > button',
      { timeout: 12000 }
    );
  } catch (e) {
    console.error(e);
    browser.close();
    return 0;
  }

  await sleep(config.sleep);

  const elem = await page.$x(
    '/html/body/app-root/div[2]/div/main/app-exchange/div/app-pairexplorer/app-layout/div/div/div[2]/div[2]/ul/li[1]/button[3]'
  );

  console.log('selector ready');

  console.log('click 1');
  await elem[0].click();
  await sleep(config.sleep);

  elem = await page.$x(
    '/html/body/app-root/div[2]/div/main/app-exchange/div/app-pairexplorer/app-layout/div/div/div[2]/div[2]/ul/li[1]/button[2]'
  );

  console.log('click 2');
  await elem[0].click();
  await sleep(config.sleep);

  console.log('DONE, exiting');
  browser.close();
  return 0;
}

run();
