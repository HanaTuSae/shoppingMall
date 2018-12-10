const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()
router.get('/', async (ctx) => {
  ctx.body = '这是用户操作首页'
})
// 注册
router.post('/register', async (ctx) => {
  // ctx.body = '用户注册接口'
  // console.log(ctx.request.body)
  // ctx.body = ctx.request.body
  let username = ctx.request.body.username
  const User = mongoose.model('User')
  let result = await User.findOne({ username: username }).exec()
  if (result) {
    ctx.body = {
      code: 201,
      message: '用户名已注册'
    }
  } else {
    let newUser = new User(ctx.request.body)
    await newUser.save().then(() => {
      ctx.body = {
        code: 200,
        message: '注册成功'
      }
    }).catch(() => {
      ctx.body = {
        code: 500,
        message: '注册失败'
      }
    })
  }
})

// 登录
router.post('/login', async (ctx) => {
  try {
    let {username, password} = ctx.request.body
    const User = mongoose.model('User')
    let result = await User.findOne({ username: username }).exec()
    if (result) {
      try {
        let newUser = new User()
        let isMatch = await newUser.comparePassword(password, result.password)
        if (isMatch) {
          ctx.body = {
            code: 200,
            message: '登录成功',
            token: result._id
          }
        } else {
          ctx.body = {
            code: 201,
            message: '密码错误'
          }
        }
      } catch (error) {
        ctx.body = {
          code: 500,
          message: error
        }
      }
    } else {
      ctx.body = {
        code: 404,
        message: '用户名不存在'
      }
    }
  } catch (error) {
    ctx.body = {
      code: 500,
      message: error
    }
  }
  // await User.findOne({username: userName}).exec().then(async (result) => {
  //   console.log(result)
  //   if (result) {
  //     let newUser = new User()
  //     await newUser.comparePassword(password, result.password).then((isMatch) => {
  //       ctx.body = {
  //         code: 200,
  //         message: isMatch
  //       }
  //     }).catch(error => {
  //       console.log(error)
  //       ctx.body = {
  //         code: 500,
  //         message: error
  //       }
  //     })
  //   } else {
  //     ctx.body = {
  //       code: 500,
  //       message: '用户名不存在'
  //     }
  //   }
  // }).catch(error => {
  //   console.log(error)
  //   ctx.body = {
  //     code: 500,
  //     message: error
  //   }
  // })
})
module.exports = router
