<template>
  <div class="shoppingCart">
    <div class="nav">
      <van-nav-bar
        v-if="isFromGoodsDetail"
        title="购物车"
        :left-text="rightText?'返回':''"
        :left-arrow="rightText"
        :right-text="rightText?'编辑':'完成'"
        @click-right='navRight'
        @click-left="goBack"
      />
      <van-nav-bar
        v-else
        title="购物车"
        :right-text="rightText?'编辑':'完成'"
        @click-right='navRight'
      />
    </div>
    <!-- rightText为true时 -->
    <div v-show="rightText" class="list">
      <div class="isEmpty" v-show="!isEmpty">
        <van-icon name="cart" size="2rem" color="#999999" />
        <span>购物车空空如也，快去选购喜爱的物品吧</span>
      </div>
      <van-checkbox-group class="cart-list" v-model="checkedResultFinish">
        <div class="cart-item" v-for="(item, index) in shoppingCart" :key="index" >
          <van-checkbox class="checkbox" :name="item.goodsId" @click.native="check"/>
          <van-row type="flex" class="goods-item">
            <van-col span="8">
              <img v-lazy="item.goodsImg" alt="" width="100%">
            </van-col>
            <van-col span="8" class="goods-name">
              <span>{{item.goodsName}}</span>
            </van-col>
            <van-col span="8" class="goods-price">
              <span>￥{{item.goodsPrice | moneyFilter}}</span>
              <span>X{{numList[index]}}</span>
              <van-stepper
                max="99"
                integer
                v-model="numList[index]"
                @blur="stepperChange(index,numList[index])"
                @plus="addNum(index)"
                @minus="reduceNum(index)"
              />
            </van-col>
          </van-row>
        </div>
      </van-checkbox-group>
      <van-submit-bar
        :loading="isLoading"
        :price="totalPrice"
        button-text="去结算"
        @submit="onSubmit"
      >
        <van-checkbox class="submitCheck" v-model="checkedFinish" @click.native="checkAll">全选</van-checkbox>
      </van-submit-bar>
      <div class="recommend">
        <div class="recommend-title">为您推荐</div>
        <div class="recommend-list">
          <goods
            v-for="item in recommend.slice(0,4)"
            :key="item.goodsId"
            class="recommend-list-item"
            :goodsId="item.goodsId"
            :goodsImage="item.image"
            :goodsName="item.goodsName"
            :goodsOldPrice="item.mallPrice"
            :goodsPresentPrice="item.price"
          ></goods>
        </div>
      </div>
    </div>
    <!-- rightText为false -->
    <div v-show="!rightText" class="list">
      <van-checkbox-group class="cart-list" v-model="checkedResultEdit">
        <div class="cart-item" v-for="(item, index) in shoppingCart" :key="index" >
          <van-checkbox class="checkbox" :name="item.goodsId" @click.native="check"/>
          <van-row type="flex" class="goods-item">
            <van-col span="8">
              <img v-lazy="item.goodsImg" alt="" width="100%">
            </van-col>
            <van-col span="8" class="goods-name">
              <span>{{item.goodsName}}</span>
            </van-col>
            <van-col span="8" class="goods-price">
              <span>￥{{item.goodsPrice | moneyFilter}}</span>
              <span>X{{numList[index]}}</span>
              <van-stepper
                max="99"
                integer
                v-model="numList[index]"
                @blur="stepperChange(index,numList[index])"
                @plus="addNum(index)"
                @minus="reduceNum(index)"
              />
            </van-col>
          </van-row>
        </div>
      </van-checkbox-group>
      <van-submit-bar button-text="删除" @submit="deleteGoods">
        <van-checkbox class="submitCheck" v-model="checkedEdit" @click.native="checkAll">全选</van-checkbox>
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import bus from '@/common/bus.js'
import { toMoney } from '@/filter/moneyFilter.js'
import url from '@/api/serviceAPI.config.js'
import goods from '@/components/common/goods.vue'
export default {
  components: {
    goods
  },
  data () {
    return {
      shoppingCart: [], // 购物车列表
      // isEmpty: false,
      isLoading: false, // 结算按钮是否开启loading
      checkedFinish: false, // 完成状态下全选按钮是否勾选
      checkedResultFinish: [], // 完成状态下checkgrop已勾选数组
      checkedEdit: false, // 编辑状态下全选按钮是否勾选
      checkedResultEdit: [], // 编辑状态下checkgrop已勾选数组
      rightText: true, // 判断导航栏右边文字，true显示为编辑（完成状态），false显示为完成（编辑状态）
      recommend: [], // 推荐列表
      isFromGoodsDetail: false // 判断是不是从详情页进入
    }
  },
  computed: {
    // 商品数量列表
    numList () {
      let numList = []
      if (this.isEmpty) {
        this.shoppingCart.forEach(item => {
          numList.push(item.count)
        })
      }
      return numList
    },
    // 总价格
    totalPrice () {
      let totalPrice = 0
      // 判断是否存在商品
      if (this.isEmpty) {
        this.shoppingCart.forEach(item => {
          // 判断是否选中商品
          let isChecked = this.checkedResultFinish.filter(id => { return id === item.goodsId })
          if (isChecked.length > 0) {
            // 选中的商品计算总价格并叠加
            totalPrice += item.goodsPrice * item.count
          }
        })
      }
      // 返回总价格,van-submit-bar组件价格格式为价格的100倍
      return totalPrice * 100
    },
    // 购物车是否为空，false为空，true不为空
    isEmpty () {
      // 根据length判断购物车是否为空，并返回值
      return this.shoppingCart.length > 0
    }
  },
  watch: {
    // 监听购物车列表变化，写入localstorage
    shoppingCart: {
      handler (val, oldVal) {
        if (val) {
          localStorage.cartInfo = JSON.stringify(val)
        }
      },
      deep: true // 深度监听，为了监听对象内部数值的变化，数组则不需要
    }
  },
  created () {
    // console.log('created')
    // this.getCartInfo()
    this.getRecommend()
  },
  mounted () {
    bus.$on('isfromDetail', (val) => {
      this.isFromGoodsDetail = val
    })
  },
  activated () {
    console.log('activated')
    this.getCartInfo()
    // this.getRecommend()
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
      this.$router.back(-1)
    },
    // 获取推荐商品
    getRecommend () {
      // 请求参数
      let config = {
        url: url.getShoppingMallData,
        method: 'get'
      }
      this.axios(config).then((res) => {
        // 返回的推荐数据赋值给recommend
        this.recommend = res.data.data.recommend
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取本地购物车信息
    getCartInfo () {
      // 判断本地是否存在cartInfo信息
      let cart = localStorage.getItem('cartInfo')
      if (cart.length > 0) {
        let newShoppingCart = JSON.parse(localStorage.cartInfo)
        // 判断是否新增了商品，是则把全选取消
        if (this.shoppingCart.length < newShoppingCart.length) {
          this.checkedFinish = false
        }
        // 转换为对象格式并赋值
        this.shoppingCart = newShoppingCart
      }
    },
    // 商品数量+1
    addNum (index) {
      this.shoppingCart[index].count++
      if (this.rightText) {
        this.setInfo()
      }
    },
    // 商品数量-1
    reduceNum (index) {
      this.shoppingCart[index].count--
      if (this.rightText) {
        this.setInfo()
      }
    },
    // 输入商品数量
    stepperChange (index, num) {
      num = num < 2 ? 1 : num
      this.shoppingCart[index].count = num
      if (this.rightText) {
        this.setInfo()
      }
    },
    // 根据勾选组内商品判断是否勾选全选按钮
    check () {
      // 判断是完成状态还是编辑状态
      if (this.rightText) {
        // 完成状态
        // 如果全部物品勾选，则全选按钮设为true
        this.checkedFinish = this.checkedResultFinish.length === this.shoppingCart.length
      } else {
        // 编辑状态
        // 如果全部物品勾选，则全选按钮设为true
        this.checkedEdit = this.checkedResultEdit.length === this.shoppingCart.length
      }
    },
    // 是否勾选全选按钮
    checkAll () {
      // 判断是完成状态还是编辑状态
      if (this.rightText) {
        // 完成状态
        if (this.checkedFinish) {
          // 勾选全选按钮，将物品全部勾选
          this.shoppingCart.forEach(item => {
            this.checkedResultFinish.push(item.goodsId)
          })
        } else {
          this.checkedResultFinish = []
        }
      } else {
        // 编辑状态
        if (this.checkedEdit) {
          // 勾选全选按钮，将物品全部勾选
          this.shoppingCart.forEach(item => {
            this.checkedResultEdit.push(item.goodsId)
          })
        } else {
          this.checkedResultEdit = []
        }
      }
    },
    // 结算按钮
    onSubmit () {
      // 判断是否登录
      let token = localStorage.getItem('userInfo')
      if (token) {
        // 判断是否选择了商品
        if (this.checkedResultFinish.length > 0) {
          // 开启loading防止多次提交
          this.isLoading = true
          // 判断是否全选商品
          if (this.checkedFinish) {
            this.goOrder(this.shoppingCart)
          } else {
            let checkGoodsList = []
            this.checkedResultFinish.forEach(id => {
              let good = this.shoppingCart.filter(item => { return item.goodsId === id })
              checkGoodsList.push(good[0])
            })
            this.goOrder(checkGoodsList)
          }
        } else {
          this.$toast('请选择要结算的商品')
        }
      } else {
        this.$toast({
          message: '您尚未登录!正在为您跳转登录界面...',
          duration: 1000
        })
        setTimeout(() => {
          this.$router.push({name: 'login'})
          // bus.$emit('tab', true)
        }, 1000)
      }
    },
    // 跳转到order页面
    goOrder (goodsList) {
      setTimeout(() => {
        this.$router.push({
          name: 'order',
          params: {
            goodsList,
            totalPrice: this.totalPrice
          }
        })
        // 状态初始化
        this.isLoading = false
        this.checkedFinish = false
        this.checkedResultFinish = []
      }, 1000)
    },
    // 导航栏右边文字显示
    navRight () {
      // 从编辑变为完成状态时，更新导航栏的info,勾选的物品取消
      if (!this.rightText) {
        this.setInfo()
        this.checkedResultEdit = []
        this.checkedEdit = false
      }
      // 更改状态
      this.rightText = !this.rightText
    },
    // 删除购物车商品
    deleteGoods () {
      // 判断是否选中商品
      if (this.checkedResultEdit.length > 0) {
        this.$dialog.confirm({
          title: '删除',
          message: '您确认要删除选中的商品吗？'
        }).then(() => {
          // 判断是否全选
          if (this.checkedEdit) {
            // 清空购物车
            this.shoppingCart = []
            this.checkedEdit = false
            this.checkedResultFinish = []
          } else {
            this.checkedResultEdit.forEach((check) => {
              this.shoppingCart.splice(this.shoppingCart.findIndex(item => check === item.goodsId), 1)
              this.checkedResultFinish.splice(this.checkedResultFinish.findIndex(item => check === item, 1))
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      } else {
        this.$toast('请选择要删除的商品')
      }
    },
    // 设置标签栏的info
    setInfo () {
      let num = 0
      if (this.numList.length > 0) {
        num = this.numList.reduce((m, n) => {
          return m + n
        })
      }
      num = num > 0 ? num : ''
      bus.$emit('info', num)
    }
  }
}
</script>

<style scoped lang="scss">
.shoppingCart {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    margin-bottom: 1rem;
    .isEmpty {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: .1rem 0;
      background-color: #fff;
      span {
        font-size: .32rem;
        padding: 0 .2rem;
        color: #666;
      }
    }
    .recommend {
      width: 100%;
      height: auto;
      .recommend-title {
        text-align: center;
        font-size: .32rem;
        color: #ff4500;
        margin: .2rem 0;
      }
      .recommend-list {
        display: flex;
        flex-flow: wrap;
        box-sizing: border-box;
        background-color: #fff;
        .recommend-list-item {
          flex: 0 0 50%;
          box-sizing: border-box;
          border-bottom: 1PX solid #666;
          &:nth-child(odd) {
            border-right: 1PX solid #666;
          }
        }
      }
    }
  }
  .cart-list {
    width: 100%;
    height: auto;
    overflow: hidden;
    overflow-y: auto;
  }
  .cart-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 .1rem;
    background-color: #fff;
    // height: auto;
    &:not(:last-child) {
      border-bottom: 1PX solid #666;
    }
    .goods-item {
      flex: 1;
      margin-left: .1rem;
      .goods-name {
        padding: .2rem .1rem;
        line-height: .32rem;
      }
      .goods-price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-around;
        span {
          &:first-child {
            color: #ff4500;
            font-size: .32rem;
          }
          &:nth-child(2) {
            color: #999;
          }
        }
      }
    }
  }
  .submitCheck {
    padding-left: .1rem;
  }
}
</style>
