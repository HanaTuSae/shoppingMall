<template>
  <div class="goodsDetail">
    <div class="nav">
      <van-nav-bar
        title="商品详情"
        left-text="返回"
        left-arrow
        @click-left="goBack"
      />
    </div>
    <div class="topimage-div">
      <img v-lazy="goodsInfo.IMAGE1" width="100%"/>
    </div>
    <div class="goods-name">{{goodsInfo.NAME}}</div>
    <div class="goods-price">价格：<span>￥{{goodsInfo.PRESENT_PRICE | moneyFilter}}</span></div>
    <div>
      <van-tabs sticky swipeable>
        <van-tab title="商品详情">
          <div class="detail" v-html="goodsInfo.DETAIL">
          </div>
        </van-tab>
        <van-tab title="评价">
            正在制作中
        </van-tab>
      </van-tabs>
    </div>
    <div class="goods-bottom">
      <van-goods-action>
        <van-goods-action-mini-btn icon="chat" text="客服"/>
        <van-goods-action-mini-btn icon="cart" :info="info" text="购物车" @click="goShoppingCart"/>
        <van-goods-action-big-btn text="加入购物车" @click="addGoodsToCart"/>
        <van-goods-action-big-btn text="立即购买" primary />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import url from '@/api/serviceAPI.config.js'
import bus from '@/common/bus.js'
import { toMoney } from '@/filter/moneyFilter.js'
export default {
  data () {
    return {
      goodsId: '', // 商品id
      goodsInfo: {}, // 商品详细信息
      info: '', // 购物车右上角图标
      cart: [] // 购物车信息
    }
  },
  // created () {
  //   this.initData()
  //   this.getGoodsDetailInfo()
  // },
  // 启用keep-alive时使用
  activated () {
    this.initData()
    this.getInfo()
    this.getGoodsDetailInfo()
  },
  filters: {
    moneyFilter (money) {
      return toMoney(money)
    }
  },
  methods: {
    // 数据初始化
    initData () {
      // this.goodsId = this.$route.query.goodsId
      this.goodsId = this.$route.params.goodsId
    },
    // 获取购物车右上角图标是否显示
    getInfo () {
      let num = 0
      if (localStorage.cartInfo) {
        this.cart = JSON.parse(localStorage.cartInfo)
        this.cart.forEach(item => {
          num += item.count
        })
      }
      this.info = num > 0 ? num : ''
    },
    // 商品详细信息请求
    getGoodsDetailInfo () {
      let config = {
        url: url.getGoodsDetailInfo,
        method: 'post',
        data: {
          goodsId: this.goodsId
        }
      }
      this.axios(config).then((res) => {
        // console.log(res.data)
        if (res.data.code === 200 && res.data.message) {
          this.goodsInfo = res.data.message
        } else {
          this.$toast('服务器错误，数据取得失败')
        }
        // this.goodsInfo = res.data.message
      }).catch((error) => {
        console.log(error)
      })
    },
    // 返回上一页
    goBack () {
      setTimeout(() => {
        this.goodsInfo = {}
      })
      this.$router.back(-1)
      // 判断是不是从详情页进入购物车，否则tab为true，返回按钮为false
      bus.$emit('tab', true)
      bus.$emit('isfromDetail', false)
    },
    // 向购物车添加商品
    addGoodsToCart () {
      // let num = 0
      // this.cart.forEach(item => {
      //   num += item.count
      // })
      this.info++
      // 判断购物车内是否已经有这个商品
      // 如果没有返回undeifnd，如果有返回第一个查找到的数据
      let isHaveGoods = this.cart.find((item) => { return item.goodsId === this.goodsId })
      if (!isHaveGoods) {
        // 没有商品直接添加到数组中
        // 重新组成添加到购物车的信息
        let newGoodsInfo = {
          goodsId: this.goodsInfo.ID,
          goodsName: this.goodsInfo.NAME,
          goodsPrice: this.goodsInfo.PRESENT_PRICE,
          goodsImg: this.goodsInfo.IMAGE1,
          count: 1
        }
        this.cart.push(newGoodsInfo)
        // localStorage.cartInfo = JSON.stringify(this.cart)
      } else {
        // console.log(isHaveGoods)
        isHaveGoods.count++
        // console.log(this.cart)
      }
      localStorage.cartInfo = JSON.stringify(this.cart)
      // bus.$emit('info', this.info)
    },
    // 去购物车页面
    goShoppingCart () {
      this.$router.push({name: 'shoppingCart'})
      // 判断是不是从详情页进入购物车，是则tab为false，返回按钮为true
      bus.$emit('tab', false)
      bus.$emit('isfromDetail', true)
    }
  },
  // router勾子，路由离开前触发，to表示下一个路由，from表示当前路由
  beforeRouteLeave (to, from, next) {
    // 设置下一个路由的 meta
    if (to.path === '/goodsList') {
      to.meta.isGoodsDetail = true
    }
    next()
  }
}
</script>

<style scoped lang="scss">
.goodsDetail {
  width:100%;
  height:100%;
  background-color: #fff;
  overflow: hidden;
  overflow-y: auto;
  .goods-name, .goods-price {
    padding-left: .1rem;
    line-height: .6rem;
  }
  .goods-name {
    font-size: .32rem;
  }
  .goods-price {
    span {
      color: #ff4500;
      font-size: .36rem;
    }
  }
  .detail {
    font-size: 0; // 去除图片间隙
  }
  .goods-bottom {
    width: 100%;
    height: 1rem;
  }
}
</style>
