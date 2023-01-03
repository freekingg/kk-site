const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const XLSX = require("xlsx");
const os = require('os');
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

      console.log("profile-name");
      await page.waitForSelector(".profile-name", { timeout: 0 });
      // await page.waitForFunction("window.location.pathname == '/pay/history'", {
      //   timeout: 0,
      // });
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
      console.log("error: ", error);
      resolve({ status: false, error });
    }
  });
};

const records = (ctx) => {
  const body = ctx.request.body;
  const { url, cookie, chromePath } = body;
  let c = cookie.split("=");
  let newCookie = [
    {
      domain: ".freecharge.in",
      name: "app_fc",
      path: "/",
      secure: true,
      session: false,
      storeId: null,
      value: c[1],
    },
  ];
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
      await page.setCookie(...newCookie);

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
  let c = cookie.split("=");
  let newCookie = [
    {
      domain: ".freecharge.in",
      name: "app_fc",
      path: "/",
      secure: true,
      session: false,
      storeId: null,
      value: c[1],
    },
  ];
  return new Promise(async (resolve, reject) => {
    try {
      const downloadImageDirectoryPath = process.cwd();
      console.log("downloadImageDirectoryPath: ", downloadImageDirectoryPath);
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
      await page.setCookie(...newCookie);

      // 刷新页面，验证登录状态
      await page.reload({ waitUntil: "networkidle2" });
      // await page.goto(url, { timeout: 0, waitUntil: "networkidle2" });

      // await page.waitForFunction("window.location.pathname == '/pay/history'", {
      //   timeout: 0,
      // });

      await page.waitForTimeout(3000);
      const data = await page.evaluate(async (account) => {
        console.log('account: ', account);
        document.title = `${account} - 下载中`;

        let tipDom = document.createElement("div");
        tipDom.style.position = "fixed";
        tipDom.style.zIndex = 9999;
        tipDom.style.left = "20px";
        tipDom.style.top = "60px";
        tipDom.style.backgroundColor = "red";
        tipDom.style.padding = "30px";
        tipDom.innerHTML = `
        <h1>下载中...</h1>
        `;
        setTimeout(() => {
          document.body.appendChild(tipDom);
        }, 1000);

        const sleep = (time = 1000, cb) => {
          return new Promise((resolve) => {
            const timer = setTimeout(() => {
              cb && cb();
              resolve(timer);
            }, time);
          });
        };

        let transList = [];
        let params = {};
        let currentStatus = "";
        let gn = 1;
        let maxNum = 200;
        let process = 0

        const getList = (body = {}) => {
          return new Promise((resolve, reject) => {
            let params = "{}";
            if (body.lastGlobalTxnId) {
              params = body;
            }
            params = JSON.stringify(body);
            fetch("https://www.freecharge.in/thv/list", {
              referrer: "https://www.freecharge.in/",
              referrerPolicy: "origin",
              headers: {
                accept: "application/json, text/plain, */*",
                "accept-language":
                  "zh-CN,zh;q=0.9,en;q=0.8,en-CA;q=0.7,ja-JP;q=0.6,ja;q=0.5",
                "content-type": "application/json",
                // "csrfrequestidentifier": "5ee838bb-bd62-465a-87a6-f16798c980c6",
                fcchannel: "12",
                "sec-ch-ua":
                  '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
              },
              body: params,
              method: "POST",
              mode: "cors",
              credentials: "include",
            })
              .then((res) => {
                let json = null;
                try {
                  json = res.json();
                } catch (error) {
                  console.log("error: ", error);
                }
                return json;
              })
              .then((res) => {
                if (res && res.length) {
                  resolve({ status: true, list: res });
                } else {
                  resolve({ status: true, list: [] });
                }
              })
              .catch((err) => {
                console.log("err: ", err);
                resolve({ status: false, list: [] });
              });
          });
        };

        const getAllList = async () => {
          return new Promise(async (resolve) => {
            await sleep(5000);
            let { status, list } = await getList(params);
            if (status) {
              gn++;
              currentStatus = `当前下载进度：第 ${gn} 页,共 ${maxNum} 页`;
              tipDom.innerHTML = `
              <h1>${currentStatus}</h1>
              `;
              transList = [...list, ...transList];
              if (list.length === 0) {
                console.log("没有数据了，", transList.length);
                process = 1
                currentStatus = `当前下载进度：第 ${gn} 页,本轮提前下载完成`;
                tipDom.innerHTML = `
                <h1>${currentStatus}</h1>
                <h2>请在桌面查看文件</h2>
                `;
                resolve(transList)
                return;
              }
              let last = list[list.length - 1];
              params = {
                lastGlobalTxnId: last.globalTxnId,
                lastGlobalTxnType: last.globalTxnType,
              };

              if (gn <= maxNum) {
                getAllList();
              } else {
                console.log("本轮拉取完成,共", transList.length);
                currentStatus = `当前下载进度：本轮下载完成`;
                tipDom.innerHTML = `
                <h1>${currentStatus}</h1>
                <h2>请在桌面查看文件</h2>
                `;
                process = 1
                resolve(transList)
              }
            } else {
              getAllList();
            }
          });
        };

        let { status, list } = await getList();
        if (status && list.length) {
          transList = [...list];
          let last = list[list.length - 1];
          params = {
            lastGlobalTxnId: last.globalTxnId,
            lastGlobalTxnType: last.globalTxnType,
          };
          getAllList();
        }
        //  else {
        //   await sleep(3000);
        //   download();
        // }

        const check = ()=>{
          return new Promise(resolve=>{
            let timer = setInterval(() => {
              if(process === 1){
                clearInterval(timer)
                resolve()
              }
            }, 1000);
          })
        }

        await check()

        return Promise.resolve(transList);
      }, account);
      console.log("已经登陆成功");

      console.log("获取数据", data);
      let jsonWorkSheet = XLSX.utils.json_to_sheet(data);
      let workBook = {
        SheetNames: ["jsonWorkSheet"],
        Sheets: {
          jsonWorkSheet: jsonWorkSheet,
        },
      };

      const homedir = os.homedir();
      console.log("homedir: ", homedir);
      XLSX.writeFile(workBook, `${homedir}/Desktop/${account}.xlsx`);

      resolve({ status: true, cookies: {} });
    } catch (error) {
      console.log("error: ", error);
      resolve({ status: false, error });
    }
  });
};

module.exports = { auth, records, download };
