<template>
  <div class="floor">
    <div class="floor-title">
      <span v-if="title === '休闲食品'" class="floor-title_icon">1F</span>
      <span v-else-if="title === '新鲜水果'" class="floor-title_icon">2F</span>
      <span v-else-if="title === '营养奶品'" class="floor-title_icon">3F</span>
      <span>{{title}}</span>
    </div>
    <div class="floor-anomaly" v-if="floorData.length > 0">
      <div class="floor-one">
        <img :src="floorData[0].image" alt="" width="100%" @click="goGoodsDetail(floorData[0].goodsId)">
      </div>
      <div>
        <div class="floor-two">
          <img
            :src="floorData[1].image"
            alt=""
            width="100%"
            @click="goGoodsDetail(floorData[1].goodsId)"
          >
        </div>
        <div>
          <img
            :src="floorData[2].image"
            alt="" width="100%"
            @click="goGoodsDetail(floorData[2].goodsId)"
          >
        </div>
      </div>
    </div>
    <div class="floor-rule">
      <div v-for="item in floorData.slice(3)" :key="item.goodsId" class="floor-item">
        <img :src="item.image" alt="" width="100%" @click="goGoodsDetail(item.goodsId)">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'floorData'],
  methods: {
    goGoodsDetail (id) {
      // this.$router.push({path: '/goodsDetail', query: {goodsId: id}})
      this.$router.push({name: 'goodsDetail', params: {goodsId: id}})
    }
  }
}
</script>

<style scoped lang="scss">
$border-1px: 1PX solid #666;
.floor {
  width: 100%;
  .floor-title {
    height: .8rem;
    line-height: .8rem;
    // text-align: center;
    font-size: .28rem;
    color: orangered;
    display: flex;
    align-items: center;
    justify-content: center;
    .floor-title_icon {
      width: .44rem;
      height:.44rem;
      line-height: .44rem;
      border-radius: 50%;
      text-align: center;
      display: inline-block;
      background-color: orangered;
      color: #fafafa;
      margin-right: .1rem;
    }
  }
  .floor-anomaly, .floor-rule {
    background-color: #fff;
  }
  .floor-anomaly {
    display: flex;
    border-bottom: $border-1px;
    & > div {
      width: 50%;
    }
    div {
      box-sizing: border-box;
      font-size: 0; //消除div包裹图片的留白
    }
    .floor-one {
      border-right: $border-1px;
    }
    .floor-two {
      border-bottom: $border-1px;
    }
  }
  .floor-rule {
    width: 100%;
    display: flex;
    flex-flow: wrap;
    .floor-item {
      flex: 0 0 50%;
      height: auto;
      font-size: 0; //消除div包裹图片的留白
      box-sizing: border-box;
      border-bottom: $border-1px;
      &:nth-child(odd) { //odd表示所有奇数
        border-right: $border-1px;
      }
    }
  }
}
</style>
