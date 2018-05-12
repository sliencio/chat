const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')();
const session = require('koa-session')
const path = require('path')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const art_template = require('koa-art-template');

//设置session
app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa:sess',
  /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000,
  overwrite: true,
  /** (boolean) can overwrite or not (default true) */
  httpOnly: true,
  /** (boolean) httpOnly or not (default true) */
  signed: true,
  /** (boolean) signed or not (default true) */
  rolling: false,
  /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false,
  /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));

//设置session
app.keys = ['some secret hurr'];


const users = require('./routes/users')
const admin = require('./routes/admin')
const chat = require('./routes/chat')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

//使用art-template 模板引擎
art_template(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

router.get('/', async (ctx) => {
  await ctx.render('users/login');
})

//设置路由
app.use(users.routes(), users.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())
app.use(chat.routes(), chat.allowedMethods())
//启动路由
app.use(router.routes()).use(router.allowedMethods());

// 错误处理
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app