const Router = require("koa-router");
const router = new Router();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const amazon = require("../controller/amazon");
const freecharge = require("../controller/freecharge");

router.get("/", (ctx) => {
  ctx.body = "<h1>主页</h1>";
});

// 25 amazon   32 freecharge
const auth = async (ctx) => {
  const body = ctx.request.body;
  const { type, account } = body;
  let result = { account };
  if (type === 25) {
    let res = await amazon.auth(ctx);
    if (res.status) {
      result["cookies"] = res.cookies;
      result["status"] = true;
    } else {
      console.log("验证失败");
      result["status"] = false;
      result["error"] = res.error;
    }
  }

  if (type === 32) {
    let res = await freecharge.auth(ctx);
    if (res.status) {
      result["cookies"] = res.cookies;
      result["status"] = true;
    } else {
      console.log("验证失败");
      result["status"] = false;
      result["error"] = res.error;
    }
  }

  ctx.body = result;
};

const records = async (ctx) => {
  const body = ctx.request.body;
  const { type, account } = body;
  let result = { account };
  if (type === 25) {
    let res = await amazon.records(ctx);
    if (res.status) {
      result["cookies"] = res.cookies;
      result["status"] = true;
    } else {
      result["status"] = false;
      result["error"] = res.error;
    }
  }

  if (type === 32) {
    let res = await freecharge.records(ctx);
    if (res.status) {
      result["cookies"] = res.cookies;
      result["status"] = true;
    } else {
      result["status"] = false;
      result["error"] = res.error;
    }
  }

  ctx.body = result;
};

router.post("/records", records);
router.post("/auth", auth);

module.exports = router;
