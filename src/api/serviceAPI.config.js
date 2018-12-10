const BASEURL = 'https://www.easy-mock.com/mock/5ba0b95e043d4954b17ceb23/shoppingMall/'
const LOCALURL = 'http://localhost:3000/'
// const LOCALURL = 'http://192.168.2.105:3000/'
const URL = {
  getShoppingMallData: BASEURL + 'shop', // 首页数据接口
  registerUser: LOCALURL + 'user/register', // 用户注册接口
  loginUser: LOCALURL + 'user/login', // 用户登录接口
  getGoodsDetailInfo: LOCALURL + 'goods/getGoodsDetailInfo', // 商品详情接口
  getCategoryList: LOCALURL + 'goods/getCategoryList', // 大类接口
  getCategorySubList: LOCALURL + 'goods/getCategorySubList', // 根据大类ID获取小类接口
  getGoodsListByCategorySubId: LOCALURL + 'goods/getGoodsListByCategorySubId', // 根据小类ID获取商品列表
  getAddressList: LOCALURL + 'address/getAddressList', // 获取地址列表
  addAddress: LOCALURL + 'address/addAddress', // 增加地址
  updateAddress: LOCALURL + 'address/updateAddress', // 修改地址
  deleteAddress: LOCALURL + 'address/deleteAddress' // 删除地址
  // getGoodsInfo: BASEURL + 'getGoodsInfo'
}
module.exports = URL
