const Koa = require('koa');
const { koaBody } = require('koa-body');
// const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');

const routes = require('./router');

const app = new Koa();

// 全局异常处理
process.on('uncaughtException', (err, origin) => {
  console.log(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

// 静态资源目录，
app.use(serve('../client/build'));
app.use(
  koaBody({ parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE'] })
);

// 统一接口错误处理
app.use(async (ctx, next) => {
  try {
    // ctx.body = ctx.request.body;
    await next();
    if (ctx.response.status === 404 && !ctx.response.body) {
      ctx.throw(404);
    }
  } catch (error) {
    const { url = '' } = ctx.request;
    const { status = 500, message } = error;
    if (url.startsWith('/api')) {
      ctx.status = typeof status === 'number' ? status : 500;
      ctx.body = {
        msg: message,
      };
    }
  }
});
// 加载数据路由
app.use(routes.routes());

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
