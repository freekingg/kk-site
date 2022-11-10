const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const records = () => {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  const url = 'https://www.freecharge.in/'
  const cookie = [
    // {
    //   name: 'app_fc',
    //   value: 'uE7hVQspD47b02A-fZuobG61L5Z53s9fNAHQBAU6oUV_S-bADuHR0Ym-LpAHjS7gGN7tKoAlcdz5wMSgsZpNMHZQI4h3K34gkymQqtx20nx6t-l2lAwaJh32xprhQMtP'
    // }
    {
      "domain": ".freecharge.in",
      "name": "app_fc",
      "path": "/",
      "secure": true,
      "session": false,
      "storeId": null,
      "value": "HTkGY7Ao78to48Jgq3_rUQe69ImSGWyEoF1x8sAASJWvaq5PlWkwOGXMdQQgfUAOnYyYi7mgF_P4SHdLkPPxBGul6yFnVdIi4mBH3a_SV7SV-Cn-WELHtt0bQMdhIc8j"
  },
  ]
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        headless: false,
        executablePath:
          chromePath ||
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          ignoreDefaultArgs:['--enable-automation'],
        args: [
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--ignore-certifcate-errors",
          "--ignore-certifcate-errors-spki-list",
          "--disable-web-security",
          "--disable-xss-auditor", // 关闭 XSS Auditor
          "--no-zygote",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--allow-running-insecure-content", // 允许不安全内容
          "--disable-webgl",
          "--disable-popup-blocking",
          "--disable-infobars",
        ],
      });
      const page = await browser.newPage();
      await page.setViewport({
        width: 1400,
        height: 700,
      });
      const headers = {
        "Accept-Encoding": "gzip",
      };
      await page.setExtraHTTPHeaders(headers);
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (["font"].includes(request.resourceType())) {
          return request.abort();
        }
        return request.continue();
      });

      try {
        await page.goto(url, { timeout: 0, waitUntil: "networkidle2" });
        await page.setCookie(...cookie);
      } catch (error) {
        console.log('error: ', error);
        
      }

      // 刷新页面，验证登录状态
      await page.reload({ waitUntil: "networkidle2" });
      await page.goto(url, { timeout: 0, waitUntil: "networkidle2" });
      console.log("已经登陆成功");

      const cookies = await page.cookies();
      console.log("获取cookie: ", cookies);
      resolve({ status: true, cookies });
    } catch (error) {
      resolve({ status: false, error });
    }
  });
};

records()
