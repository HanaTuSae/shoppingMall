<template>
  <div class="goods" @click="goGoodsDetail(goodsId)">
    <img v-lazy="goodsImage" alt="" width="100%">
    <div class="goods-name">{{goodsName}}</div>
    <div class="goods-price">
      <span>￥{{goodsPresentPrice | moneyFilter}}</span>
      <span>￥{{goodsOldPrice | moneyFilter}}</span>
    </div>
  </div>
</template>

<script>
import { toMoney } from '@/filter/moneyFilter.js'
export default {
  props: ['goodsId', 'goodsImage', 'goodsName', 'goodsOldPrice', 'goodsPresentPrice'],
  data () {
    return {
      // errImg: 'this.src="' + require('@/assets/images/error.png') + '"'
    }
  },
  filters: {
    moneyFilter (money) {
      return toMoney(money)
    }
  },
  methods: {
    goGoodsDetail (goodsId) {
      // query路径显示传递参数，params不显示
      // query：刷新数据仍在；params：刷新数据丢失，可以使用动态路由来保证刷新数据不丢失
      // this.$router.push({path: '/goodsDetail', query: {goodsId: goodsId}})
      this.$router.push({name: 'goodsDetail', params: {goodsId: goodsId}})
    }
  }
}
</script>

<style scoped lang="scss">
.goods {
  width: 100%;
  height: auto;
  text-align: center;
  color: orangered;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  & > div {
    margin-top: .1rem;
  }
  .goods-name {
    padding: 0 .15rem;
  }
  .goods-price {
    height: .4rem;
    display: flex;
    align-items: flex-end;
    margin-bottom: .1rem;
    span {
      &:first-child {
        margin-right: .1rem;
        font-size: .36rem;
      }
      &:last-child {
        color: #666;
        text-decoration: line-through;
      }
    }
  }
}
</style>
