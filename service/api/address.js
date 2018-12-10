const Router = require('koa-router')
const mongoose = require('mongoose')
let router = new Router()

// 获取地址的接口
router.post('/getAddressList', async (ctx) => {
  try {
    let id = ctx.request.body.token
    const Address = mongoose.model('Address')
    let result = await Address.find({ USER_ID: id }).exec()
    if (result.length > 0) {
      let address = []
      result.forEach(item => {
        let { ID, USER_ID, USER_NAME, USER_TEL, ADDRESS_PROVINCE, ADDRESS_CIITY, ADDRESS_COUNTY, ADDRESS_DETAIL, AREA_CODE, POSTAL_CODE, IS_DEFAULT } = item
        address.push({
          id: ID,
          userId: USER_ID,
          name: USER_NAME,
          tel: USER_TEL,
          province: ADDRESS_PROVINCE,
          city: ADDRESS_CIITY,
          county: ADDRESS_COUNTY,
          addressDetail: ADDRESS_DETAIL,
          areaCode: AREA_CODE,
          postalCode: POSTAL_CODE,
          isDefault: IS_DEFAULT
        })
      })
      ctx.body = {
        code: 200,
        message: address
      }
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      code: 500,
      message: error
    }
  }
})

// 获取地址的接口
router.post('/addAddress', async (ctx) => {
  try {
    // let { id, userId, name, tel, province, city, county, addressDetail, areaCode, postalCode, isDefault } = ctx.request.body
    const Address = mongoose.model('Address')
    let newAddress = new Address(ctx.request.body).save()
    if (newAddress) {
      ctx.body = {
        code: 200,
        message: '地址增加成功'
      }
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      code: 500,
      message: '地址增加失败'
    }
  }
})

// 获取地址的接口
router.post('/updateAddress', async (ctx) => {
  try {
    // let { id, userId, name, tel, province, city, county, addressDetail, areaCode, postalCode, isDefault } = ctx.request.body
    let {ID, updateData} = ctx.request.body
    const Address = mongoose.model('Address')
    let updateAddress = await Address.update({ID: ID}, {$set: updateData})
    if (updateAddress.ok === 1) {
      ctx.body = {
        code: 200,
        message: '地址修改成功'
      }
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      code: 500,
      message: '地址修改失败'
    }
  }
})

// 获取地址的接口
router.post('/deleteAddress', async (ctx) => {
  try {
    // let { id, userId, name, tel, province, city, county, addressDetail, areaCode, postalCode, isDefault } = ctx.request.body
    let id = ctx.request.body.id
    const Address = mongoose.model('Address')
    let updateAddress = await Address.deleteMany({ ID: id })
    if (updateAddress.ok === 1) {
      ctx.body = {
        code: 200,
        message: '地址删除成功'
      }
    }
  } catch (error) {
    console.log(error)
    ctx.body = {
      code: 500,
      message: '地址删除失败'
    }
  }
})

module.exports = router
