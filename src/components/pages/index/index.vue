<template>
  <div class="index">
    <div class="index-main">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
      <!-- <router-view /> -->
    </div>
    <div class="tab" v-show="isShowTab">
      <!-- <keep-alive> -->
        <van-tabbar v-model="active">
          <van-tabbar-item icon="wap-home" :to="{name:'shoppingMall'}">商城</van-tabbar-item>
          <van-tabbar-item :to="{name:'category'}">
            <span>分类</span>
            <img
              slot="icon"
              slot-scope="props"
              :src="props.active ? icon[0].active : icon[0].normal"
            >
          </van-tabbar-item>
          <van-tabbar-item icon="cart" :info="info" :to="{name:'shoppingCart'}">购物车</van-tabbar-item>
          <van-tabbar-item icon="contact" :to="{name:'member'}">会员中心</van-tabbar-item>
        </van-tabbar>
      <!-- </keep-alive> -->
    </div>
  </div>
</template>

<script>
import bus from '@/common/bus.js'
export default {
  name: 'index',
  data () {
    return {
      active: 0,
      icon: [{
        normal: require('@/assets/images/classify.png'),
        active: require('@/assets/images/classify-active.png')
      }],
      info: '',
      isShowTab: true
    }
  },
  watch: {
    // active: {
    //   handler (val, oldval) {
    //     console.log(val)
    //   },
    //   deep: true
    // }
  },
  created () {
    // this.changeTabbar()
  },
  mounted () {
    // console.log('mounted')
    // this.getInfo()
    this.changeInfo()
  },
  activated () {
    console.log('activated')
    this.getInfo()
    this.changeTabbar()
    // this.getInfo()
  },
  methods: {
    getInfo () {
      let cart = []
      let num = 0
      if (localStorage.cartInfo) {
        cart = JSON.parse(localStorage.cartInfo)
        cart.forEach(item => {
          num += item.count
        })
      }
      this.info = num > 0 ? num : ''
    },
    // 防止刷新显示错误
    changeTabbar () {
      let arrRouter = ['shoppingMall', 'category', 'shoppingCart', 'member']
      let nowRouteName = this.$route.name
      arrRouter.forEach((item, index) => {
        if (nowRouteName === item) {
          this.active = index
        }
      })
    },
    changeInfo () {
      bus.$on('info', (val) => {
        this.info = val
      })
      bus.$on('tab', (val) => {
        this.isShowTab = val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  // background-color: #efefef;
  .index-main {
    flex: 1;
    overflow: hidden;
  }
  .tab {
    width: 100%;
    height: 1rem;
    border-top: 1PX solid #666;
  }
}
</style>
