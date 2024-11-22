const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cors = require('@koa/cors'); // 引入 CORS 中间件

require('dotenv').config();

const app = new Koa();
const router = new Router();

app.use(
  cors({
    origin: 'http://localhost:3000', // 允许的前端地址
    credentials: true, // 是否允许发送 Cookie
  })
);

// 中间件
app.use(bodyParser());

// 数据库连接
connectDB();

// 路由
router.use('/auth', authRoutes.routes());
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
