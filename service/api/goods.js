// const Koa = require('koa')
// const app = new Koa()
const Router = require('koa-router')
let router = new Router()

const mongoose = require('mongoose')
const fs = require('fs')

// 将商品详情写入数据库
router.get('/insertAllGoodsInfo', async (ctx) => {
  fs.readFile('./goods.json', 'utf8', (err, data) => {
    if (err) {
      throw err
    }
    let newData = JSON.parse(data)
    let saveCount = 0
    const Goods = mongoose.model('Goods')
    newData.RECORDS.map((value, index) => {
      console.log(value)
      let newGoods = new Goods(value)
      newGoods.save().then(() => {
        saveCount++
        console.log('成功' + saveCount)
      }).catch(error => {
        console.log('失败：' + error)
      })
    })
  })
  ctx.body = '开始导入商品详情数据'
})

// 将大类写入数据库
router.get('/insertAllCategory', async (ctx) => {
  fs.readFile('./category.json', 'utf8', (err, data) => {
    if (err) {
      throw err
    }
    let newData = JSON.parse(data)
    let saveCount = 0
    const Category = mongoose.model('Category')
    newData.RECORDS.map((value, index) => {
      console.log(value)
      let newCategory = new Category(value)
      newCategory.save().then(() => {
        saveCount++
        console.log('成功' + saveCount)
      }).catch(error => {
        console.log('失败：' + error)
      })
    })
  })
  ctx.body = '开始导入大类数据'
})

// 将小类写入数据库
router.get('/insertAllCategorySub', async (ctx) => {
  fs.readFile('./category_sub.json', 'utf8', (err, data) => {
    if (err) {
      throw err
    }
    let newData = JSON.parse(data)
    let saveCount = 0
    const CategorySub = mongoose.model('CategorySub')
    newData.RECORDS.map((value, index) => {
      console.log(value)
      let newCategorySub = new CategorySub(value)
      newCategorySub.save().then(() => {
        saveCount++
        console.log('成功' + saveCount)
      }).catch(error => {
        console.log('失败：' + error)
      })
    })
  })
  ctx.body = '开始导入小类数据'
})

// 获取商品详细信息的接口
router.post('/getGoodsDetailInfo', async (ctx) => {
  try {
    let goodsId = ctx.request.body.goodsId
    const Goods = mongoose.model('Goods')
    let result = await Goods.findOne({ ID: goodsId }).exec()
    ctx.body = {
      code: 200,
      message: result
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      code: 200,
      message: error
    }
  }
})

// 获取大类的接口
router.post('/getCategoryList', async (ctx) => {
  try {
    const Category = mongoose.model('Category')
    let result = await Category.find().exec()
    ctx.body = {
      code: 200,
      message: result
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      code: 200,
      message: error
    }
  }
})

// 获取小类的接口
router.post('/getCategorySubList', async (ctx) => {
  try {
    let categoryId = ctx.request.body.categoryId // 大类ID
    const CategorySub = mongoose.model('CategorySub')
    let result = await CategorySub.find({ MALL_CATEGORY_ID: categoryId }).exec()
    ctx.body = {
      code: 200,
      message: result
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      code: 500,
      message: error
    }
  }
})

// 获取小类商品的接口
router.post('/getGoodsListByCategorySubId', async (ctx) => {
  try {
    let categorySubId = ctx.request.body.categorySubId // 小类ID
    let page = ctx.request.body.page // 第几页
    let num = 10 // 每页显示的数量
    let start = (page - 1) * num // 请求开始的index
    const Goods = mongoose.model('Goods')
    let result = await Goods.find({ SUB_ID: categorySubId }).skip(start).limit(num).exec()
    ctx.body = {
      code: 200,
      message: result
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      code: 200,
      message: error
    }
  }
})

module.exports = router
