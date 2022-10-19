const Router = require("koa-router");
const router = new Router();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

router.get("/", (ctx) => {
  ctx.body = "<h1>主页</h1>";
});

const auth = async (ctx) => {
  const body = ctx.request.body;
  const { url, account, chromePath } = body;
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: chromePath || '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"',
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
    width: 1920,
    height: 700,
  });
  await page.goto(url, { timeout: 0 });

  // 最长等10分钟
  // await page.waitForFunction("window.location.pathname == '/pay/history'", { timeout: 1000 * 60 *10 })
  await page.waitForFunction("window.location.pathname == '/pay/history'", { timeout: 0 })
  console.log('已经登陆成功')
  const cookies = await page.cookies();
  console.log('获取cookie: ', cookies);
  setTimeout(()=>{
    browser.close()
  },5000)
  ctx.body = { cookies: cookies, account };
};

const records = async (ctx) => {
  const body = ctx.request.body;
  const { url , cookie, chromePath } = body;
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: chromePath || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
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
    width: 1920,
    height: 700,
  });
  await page.goto(url, { timeout: 0 });
  // /pay/history
  // await page.waitForFunction("window.location.pathname == '/Books/b/'", { timeout: 1000 * 60 *10 })
  
  await page.setCookie(...cookie);

  // 刷新页面，验证登录状态
  await page.reload({ waitUntil: 'networkidle2' });

  console.log('已经登陆成功')
  const cookies = await page.cookies();
  console.log('获取cookie: ', cookies);
  ctx.body = { cookies: cookies };
};

router.post("/records", records);
router.post("/auth", auth);

module.exports = router;
