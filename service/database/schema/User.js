const mongoose = require('mongoose') // 引入Mongoose
const Schema = mongoose.Schema // 声明Schema
const bcrypt = require('bcrypt') // 引入bcrypt
let ObjectId = Schema.Types.ObjectId // 声明Object类型
// 创建我们的用户Schema
const userSchema = new Schema({
  UserId: ObjectId,
  username: { unique: true, type: String },
  password: String,
  createAt: { type: Date, default: Date.now() },
  lastLoginAt: { type: Date, default: Date.now() }
})

// 加密
// 定义加密密码计算强度
const SALT_WORK_FACTOR = 10
userSchema.pre('save', function (next) {
  // let user = this
  // console.log(this)
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

userSchema.methods = {
  // 密码比对的方法，第一个为前台传入密码，第二个为数据库密码
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  }
}
// 发布模型
mongoose.model('User', userSchema)
