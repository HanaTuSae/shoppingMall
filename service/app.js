const Koa = require('koa')
const app = new Koa()
// const mongoose = require('mongoose')
const { connect, initSchemas } = require('./database/init.js')

const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// 跨域
const cors = require('koa2-cors')
app.use(cors())
// 引入路由模块
const Router = require('koa-router')
let router = new Router()
// 添加用户路由
let user = require('./api/User.js')
router.use('/user', user.routes())
// 添加商品路由
let goods = require('./api/goods.js')
router.use('/goods', goods.routes())
// 添加商品路由
let address = require('./api/address.js')
router.use('/address', address.routes())

app.use(router.routes())
app.use(router.allowedMethods())

// app.use(async (ctx) => {
//   ctx.body = '<h1>hello Koa2</h1>'
// })
;(async () => {
  await connect()
  initSchemas()
  // const User = mongoose.model('User')
  // let oneUser = new User({ userName: 'hanatusae', password: '123456' })
  // oneUser.save().then(() => {
  //   console.log('插入成功')
  // })
  // let users = await User.findOne({}).exec()
  // console.log('------------------')
  // console.log(users)
  // console.log('------------------')
})()

app.listen(3000, () => {
  console.log('[Server] starting at port 3000')
})
