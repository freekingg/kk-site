const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const XLSX = require("xlsx");
const os = require('os');
const UserPreferencesPlugin = require("puppeteer-extra-plugin-user-preferences");
puppeteer.use(StealthPlugin());

const auth = (ctx) => {
  const body = ctx.request.body;
  const { url, account, chromePath } = body;

  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        headless: false,
        executablePath:
          chromePath ||
          '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"',
        ignoreDefaultArgs: ["--enable-automation"],
        args: [
          "--disable-gpu",
          "--disable-infobars",
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

      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (["font"].includes(req.resourceType())) {
          return req.abort();
        }
        return req.continue();
      });

      await page.setExtraHTTPHeaders(headers);
      await page.goto(url, { timeout: 0, waitUntil: "networkidle2" });

      await page.evaluate((account) => {
        document.title = account;
        return Promise.resolve();
      }, account);

      await page.waitForFunction("window.location.pathname == '/pay/history'", {
        timeout: 0,
      });
      await page.evaluate((account) => {
        document.title = account;
        return Promise.resolve();
      }, account);
      console.log("已经登陆成功");
      const cookies = await page.cookies();
      setTimeout(() => {
        browser.close();
      }, 15000);
      await page.evaluate((account) => {
        alert(`${account}：已经验证成功`);
        return Promise.resolve();
      }, account);
      resolve({ status: true, cookies });
    } catch (error) {
      resolve({ status: false, error });
    }
  });
};

const records = (ctx) => {
  const body = ctx.request.body;
  const { url, cookie, chromePath } = body;
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        headless: false,
        executablePath:
          chromePath ||
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        ignoreDefaultArgs: ["--enable-automation"],
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

      await page.goto(url, { timeout: 0, waitUntil: "networkidle2" });
      await page.setCookie(...cookie);

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

const download = (ctx) => {
  const body = ctx.request.body;
  const { url, cookie, chromePath, account } = body;
  return new Promise(async (resolve, reject) => {
    try {
      const downloadImageDirectoryPath = process.cwd();
      console.log("downloadImageDirectoryPath: ", downloadImageDirectoryPath);
      puppeteer.use(
        UserPreferencesPlugin({
          userPrefs: {
            webkit: {
              webprefs: {
                download: {
                  prompt_for_download: false,
                  default_directory: downloadImageDirectoryPath,
                },
              },
            },
          },
        })
      );

      const browser = await puppeteer.launch({
        headless: false,
        executablePath:
          chromePath ||
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        ignoreDefaultArgs: ["--enable-automation"],
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

      await page.goto(url, { timeout: 0, waitUntil: "networkidle2" });
      await page.setCookie(...cookie);

      //设置下载路径
      // const client = await page.target().createCDPSession()
      // await client.send('Page.setDownloadBehavior', {
      //   behavior: 'allow', 
      //   downloadPath: downloadImageDirectoryPath
      // })

      // 刷新页面，验证登录状态
      await page.reload({ waitUntil: "networkidle2" });
      // await page.goto(url, { timeout: 0, waitUntil: "networkidle2" });

      await page.waitForFunction("window.location.pathname == '/pay/history'", {
        timeout: 0,
      });

      await page.waitForTimeout(3000)
      await page.click('input[value="UPI"]')
      await page.click('input[value="SUCCESS"]')
      const data = await page.evaluate(async (account) => {
        document.title = `${account} - 下载中`;

        const downloadImage = (imgsrc, name) => { 
          var image = new Image()
          image.setAttribute('crossOrigin', 'anonymous')
          image.onload = function() {
            var canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            var context = canvas.getContext('2d')
            context.drawImage(image, 0, 0, image.width, image.height)
            var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
         
            var a = document.createElement('a') // 生成一个a元素
            var event = new MouseEvent('click') // 创建一个单击事件
            a.download = name || 'photo' // 设置图片名称
            a.href = url // 将生成的URL设置为a.href属性
            a.dispatchEvent(event) // 触发a的单击事件
          }
          image.src = imgsrc
        }

        // downloadImage('https://m.media-amazon.com/images/I/71n9xHYpaHL._AC_UL320_.jpg','test')

        let tipDom = document.createElement('div');
        tipDom.style.position = 'fixed'
        tipDom.style.zIndex = 9999
        tipDom.style.left = '20px'
        tipDom.style.top = '60px'
        tipDom.style.backgroundColor = 'red'
        tipDom.style.padding = '30px'
        tipDom.innerHTML = `
        <h1>下载中...</h1>
        `
        setTimeout(()=>{
          document.body.appendChild(tipDom)
        },1000)
        // 滚动页面
        let lastHeight = 0
        const scrollBottom = () => {
          return new Promise((resolve)=>{
            let timer = setInterval(()=>{
              let clientHeight = document.body.clientHeight
              if(lastHeight <  clientHeight){
                window.scrollBy(0, 500);
                lastHeight += 500
              }else{
                console.log('scrollBottom ok')
                clearInterval(timer)
                resolve(true)
              }
            },1000)
          })
        }
        
        await scrollBottom()
        

        let items = document.querySelectorAll('#transactions-desktop span.a-declarative')
        let data = []
        if(items.length){
          let a = Array.from(items)
          let getText = (dom,sel) => {
            let d = dom.querySelector(sel)
            if(d){
              return d.innerText 
            }else{
              return '-'
            }
          }
          data = a.map(item=>{
            let rows = item.querySelectorAll('.a-expander-content .a-row.pad-mini-details-text')
            let rowsDom = Array.from(rows)
            let rowData = rowsDom.map(item=>{
              let cloumns = item.querySelectorAll('.a-column')
              return `${cloumns[0] ? cloumns[0].innerText.replace(/\s|\n/g,"") : ''} ${cloumns[1] ? cloumns[1].innerText.replace(/\s|\n/g,""):''}`
              // return item.innerText.replace(/\s|\n/g,"")
            })
            return {
              title:getText(item, '.a-text-left .pad-header-text'),
              payment:getText(item, '.a-text-left .payment-details-desktop'),
              date:getText(item, '.a-text-left>.a-color-tertiary'),
              amount:getText(item, '.a-text-right>span'),
              detail:rowData.join('  ')
            }
          })
        }
        document.title = `${account} - 下载完成`;
        tipDom.innerHTML = `
        <h1>下载完成，请在桌面查看...</h1>
        `
        return Promise.resolve(data);
      }, account);
      console.log("已经登陆成功");

      console.log('获取数据',data)
      // 将数据转成workSheet
      let jsonWorkSheet = XLSX.utils.json_to_sheet(data);
      // 构造workBook
      let workBook = {
        SheetNames: ['jsonWorkSheet'],
        Sheets: {
          'jsonWorkSheet': jsonWorkSheet,
        }
      };

      const homedir = os.homedir();
      console.log('homedir: ', homedir);
      XLSX.writeFile(workBook, `${homedir}/Desktop/${account}.xlsx`);

      resolve({ status: true, cookies:{} });
    } catch (error) {
      console.log('error: ', error);
      resolve({ status: false, error });
    }
  });
};

module.exports = { auth, records, download };
