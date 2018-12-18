<template>
  <div class="order">
    <van-nav-bar
      title="填写订单"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <div class="address">
      <van-cell
        class="address-info"
        :title="currentChooseContact"
        is-link
        :label="currentChooseAddress"
        @click="showAddressList = true"
      />
      <van-popup style="height:100%;width:100%;" v-model="showAddressList" position="right" :overlay="true">
        <van-nav-bar
          title="订单列表"
          left-text="返回"
          left-arrow
          @click-left="showAddressList = false"
        />
        <van-address-list
          v-model="currentChosenAddressId"
          :list="addressList"
          @add="onAdd"
          @edit="onEdit"
          @select="onSelect"
        />
      </van-popup>
      <van-popup style="height:100%;width:100%;" v-model="showAddressEdit" position="right">
        <van-nav-bar
          :title="isAdd?'新增地址':'编辑地址'"
          left-text="返回"
          left-arrow
          @click-left="showAddressEdit = false"
        />
        <van-address-edit
          :area-list="areaList"
          :address-info="addressEdit"
          show-postal
          :show-delete="!isAdd"
          show-set-default
          show-search-result
          :is-saving="false"
          :is-deleting="false"
          :validator="/^1[34578]\d{9}$/"
          @save="onSave"
          @delete="onDelete"
          @change-detail="onChangeDetail"
        />
      </van-popup>
    </div>
    <div class="goodsList">
      <van-card
        class="goodsList-item"
        v-for="item in goodsList"
        :key="item.goodsId"
        :thumb="item.goodsImg"
        :num="item.count"
        :price="item.goodsPrice | moneyFilter"
        :title="item.goodsName"
      />
    </div>
    <div class="orderInfo">
      <van-cell-group>
        <van-cell title="发票" value="普票" />
        <van-cell title="优惠券" is-link />
      </van-cell-group>
    </div>
    <div class="order-price">
      <van-cell-group>
        <van-cell title="商品金额" :value="totalPrice/100 | moneyFilter" />
        <van-cell title="配送费" value="0.00" />
        <van-cell title="优惠券" value="0.00" />
      </van-cell-group>
    </div>
    <van-submit-bar
      :loading="isLoading"
      :price="totalPrice"
      button-text="提交订单"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import url from '@/api/serviceAPI.config.js'
import { toMoney } from '@/filter/moneyFilter.js'
import areaList from '@/utils/area.js'
export default {
  name: 'order',
  data () {
    return {
      goodsList: [], // 商品列表
      totalPrice: 0, // 总价格
      currentChosenAddressId: '1', // 当前选择的地址id
      currentChosenAddressIndex: '0', // 当前选择的地址索引
      currentEditAddressId: '', // 当前编辑的地址索引
      showAddressList: false, // 是否显示地址列表
      showAddressEdit: false, // 是否打开地址编辑
      isLoading: false, // 防止多次提交
      addressData: [], // 地址列表
      areaList: areaList, // 省市区 列表
      // searchResult: [], // 详细地址
      addressEdit: {}, // 地址信息，新增为{}，编辑为点击对应的地址信息
      isAdd: true // 判断是否新增，true为是，false为否
    }
  },
  computed: {
    // 当前选择的联系人
    currentChooseContact () {
      return this.addressList.length > 0 ? `${this.addressList[this.currentChosenAddressIndex].name}，${this.addressList[this.currentChosenAddressIndex].tel}` : '没有可选择的地址，请添加'
    },
    // 当前选择的地址
    currentChooseAddress () {
      return this.addressList.length > 0 ? this.addressList[this.currentChosenAddressIndex].address : ''
    },
    // 地址列表格式化
    addressList () {
      let addressList = []
      if (this.addressData.length > 0) {
        this.addressData.forEach(item => {
          let {id, name, tel, province, city, county, addressDetail} = item
          let address = province === city ? `${province}${county}${addressDetail}` : `${province}${city}${county}${addressDetail}`
          addressList.push({
            id,
            name,
            tel,
            address
          })
        })
      }
      return addressList
    }

  },
  created () {
    if (localStorage.userInfo) {
      this.goodsList = this.$route.params.goodsList
      this.totalPrice = this.$route.params.totalPrice
      this.getAddressList()
    } else {
      this.$toast('请您先登录')
    }
  },
  filters: {
    // 金钱格式化
    moneyFilter (money) {
      return toMoney(money)
    }
  },
  methods: {
    // 返回上一页
    goBack () {
      this.$dialog.confirm({
        message: '您确定要残忍离开吗？',
        confirmButtonText: '去意已决',
        cancelButtonText: '再考虑考虑'
      }).then(() => {
        this.$router.back(-1)
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取地址列表
    getAddressList () {
      let {token} = JSON.parse(localStorage.userInfo)
      let config = {
        url: url.getAddressList,
        method: 'post',
        data: {
          token: token
        }
      }
      this.axios(config).then((res) => {
        // console.log(res.data)
        this.addressData = res.data.message
      }).catch((error) => {
        console.log(error)
      })
    },
    // 下订单
    onSubmit () {
      // 打开loading，防止多次点击请求
      this.isLoading = true
      setTimeout(() => {
        this.$toast.success({
          message: '购买成功',
          duration: 1000
        })
        // 删除购物车中的商品
        // 获取购物车的商品
        let cart = JSON.parse(localStorage.getItem('cartInfo'))
        // 循环goodsList，使用findIndex比较goodsId获取index，删除商品
        this.goodsList.forEach(item => {
          cart.splice(cart.findIndex(o => item.goodId === o.goodId), 1)
        })
        // 将商品重新存入本地
        localStorage.setItem('cartInfo', JSON.stringify(cart))
        this.isLoading = false
      }, 1000)
    },
    // 打开新增商品页面
    onAdd () {
      this.showAddressEdit = true
      this.isAdd = true
      this.addressEdit = {}
    },
    // 打开编辑界面
    onEdit (item) {
      let address = this.addressData.filter(data => data.id === item.id)
      let { name, tel, province, city, county, addressDetail, areaCode, postalCode, isDefault } = address[0]
      this.currentEditAddressId = item.id
      this.addressEdit = {
        name,
        tel,
        province,
        city,
        county,
        addressDetail,
        areaCode,
        postalCode,
        isDefault
      }
      this.isAdd = false
      this.showAddressEdit = true
    },
    // 选择地址。。。。。
    onSelect (item, index) {
      this.currentChosenAddressId = item.id
      this.currentChosenAddressIndex = index
    },
    // 保存地址
    onSave (content) {
      // 获取地址信息
      let { name, tel, province, city, county, addressDetail, areaCode, postalCode, isDefault } = content
      // 判断是否新增
      if (this.isAdd) {
        let {token} = JSON.parse(localStorage.getItem('userInfo'))
        let config = {
          url: url.addAddress,
          method: 'post',
          data: {
            ID: this.addressList.length + 1,
            USER_ID: token,
            USER_NAME: name,
            USER_TEL: tel,
            ADDRESS_PROVINCE: province,
            ADDRESS_CIITY: city,
            ADDRESS_COUNTY: county,
            ADDRESS_DETAIL: addressDetail,
            AREA_CODE: areaCode,
            POSTAL_CODE: postalCode,
            IS_DEFAULT: isDefault
          }
        }
        this.axios(config).then((res) => {
          if (res.data.code === 200) {
            // console.log(res.data.message)
            this.$toast.success(res.data.message)
            this.showAddressEdit = false
            this.addressData.push({
              id: this.addressList.length + 1,
              userId: token,
              name,
              tel,
              province,
              city,
              county,
              addressDetail,
              areaCode,
              postalCode,
              isDefault
            })
          } else {
            this.$toast.fail(res.data.message)
          }
        }).catch((error) => {
          console.log(error)
        })
      } else {
        let config = {
          url: url.updateAddress,
          method: 'post',
          data: {
            ID: this.currentEditAddressId,
            updateData: {
              USER_NAME: name,
              USER_TEL: tel,
              ADDRESS_PROVINCE: province,
              ADDRESS_CIITY: city,
              ADDRESS_COUNTY: county,
              ADDRESS_DETAIL: addressDetail,
              AREA_CODE: areaCode,
              POSTAL_CODE: postalCode,
              IS_DEFAULT: isDefault
            }
          }
        }
        this.axios(config).then((res) => {
          if (res.data.code === 200) {
            this.$toast.success(res.data.message)
            this.showAddressEdit = false
            let address = this.addressData.filter((item) => item.id === this.currentEditAddressId)
            address[0].name = name
            address[0].tel = tel
            address[0].province = province
            address[0].city = city
            address[0].county = county
            address[0].addressDetail = addressDetail
            address[0].areaCode = areaCode
            address[0].postalCode = postalCode
            address[0].isDefault = isDefault
          } else {
            this.$toast.fail(res.data.message)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    onDelete () {
      let config = {
        url: url.deleteAddress,
        method: 'post',
        data: {
          id: this.currentEditAddressId
        }
      }
      this.axios(config).then((res) => {
        if (res.data.code === 200) {
          this.$toast.success(res.data.message)
          this.showAddressEdit = false
          this.addressData.forEach((item, index) => {
            if (this.currentEditAddressId === item.id) {
              console.log(index)
              this.addressData.splice(index, 1)
            }
          })
        }
      })
    },
    onChangeDetail () {}
  }
}
</script>

<style scoped lang="scss">
.order {
  .address {
    position: relative;
    margin-bottom: .2rem;
    // 彩色底线
    .address-info::before {
      content: '';
      height: .02rem;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
      background-size: 2rem;
    }
  }
  .goodsList {
    background-color: #fff;
    &-item:not(:last-child) {
      border-bottom: 1PX solid #666;
    }
  }
  .orderInfo,.order-price {
    margin-top: .2rem;
  }
}
</style>
