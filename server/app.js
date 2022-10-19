const Koa = require('koa')
const koaBody = require('koa-body')
const parameter = require('koa-parameter')
const cors = require('@koa/cors')
const error = require('koa-json-error')
const routing = require('./routes')
const app = new Koa();

// 错误处理
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest }
  })
);

// 处理post请求和图片上传
app.use(
  koaBody({
    multipart: true,
  })
);

// 参数校验
app.use(parameter(app));
app.use(cors());
// 路由处理
routing(app);

app.listen(3005, () => console.log('\x1B[45m%s\x1B[49m', 'server is running at http://localhost:3005 node服务已启动'));