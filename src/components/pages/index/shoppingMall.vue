<template>
  <div class="shoppingMall">
    <search @searchValue="getSearchValue"></search>
    <div class="banner">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="item in banner" :key="item.goodsId" @click.native="goGoodsDetail(item.goodsId)">
          <img width="100%" v-lazy="item.image" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="category">
      <div class="category-item" v-for="item in category" :key="item.mallCategoryId">
        <img v-lazy="item.image" alt="" width="100%">
        <span>{{item.mallCategoryName}}</span>
      </div>
    </div>
    <div class="adBanner">
      <img v-lazy="adBanner.PICTURE_ADDRESS" alt="" width="100%">
    </div>
    <div class="recommend" v-if="recommend.length>0">
      <div class="recommend-title">商品推荐</div>
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide
          v-for="item in recommend"
          :key="item.goodsId"
          class="recommend-item"
        >
          <img :src="item.image" alt="" width="100%">
          <div class="recommend-item_name">{{item.goodsName}}</div>
          <div class="recommend-item_price">
            <div class="mallPrice">￥{{item.mallPrice | moneyFilter}}</div>
            <div class="presentPrice">￥{{item.price | moneyFilter}}</div>
          </div>
          <van-tag mark type="danger" class="recommend-tag">推荐</van-tag>
        </swiper-slide>
      </swiper>
    </div>
    <floor :title="floorName.floor1" :floorData="floor1"></floor>
    <floor :title="floorName.floor2" :floorData="floor2"></floor>
    <floor :title="floorName.floor3" :floorData="floor3"></floor>
    <div class="hotGoods">
      <div class="hotGoods-title">
        <van-icon name="hot" class="hotGoods-title_icon"/>
        <span>热卖商品</span>
      </div>
      <!-- <div > -->
        <van-list class="hotGoods-main">
          <goods
            v-for="item in hotGoods"
            :key="item.goodsId"
            class="hotGoods-item"
            :goodsId="item.goodsId"
            :goodsImage="item.image"
            :goodsName="item.name"
            :goodsOldPrice="item.mallPrice"
            :goodsPresentPrice="item.price"
          ></goods>
        </van-list>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import floor from '@/components/common/floor.vue'
import goods from '@/components/common/goods.vue'
import search from '@/components/common/search.vue'
import url from '@/api/serviceAPI.config.js'
import { toMoney } from '@/filter/moneyFilter.js'
let _this = null
export default {
  components: {
    floor,
    goods,
    search
  },
  data () {
    return {
      banner: [], // banner
      category: [], // 分类
      adBanner: {}, // 广告banner
      recommend: [], // 推荐
      floor1: [], // 楼层1
      floor2: [], // 楼层2
      floor3: [], // 楼层3
      floorName: {}, // 楼层title集合
      hotGoods: [], // 热门
      swiperOption: { // swiper配置
        loop: true, // 开启循环播放
        slidesPerView: 3, // 页面出现3个slide
        loopedSlides: 3, // 开启循环时要复制的slide个数
        // 使用loop会导致复制的slide点击事件失效
        // 解决方法，使用swiper的api方法里的事件
        // 注意点 this指向的是swiper，在created设置_this = this来指向vue
        on: {
          click: function () {
            // console.log(this.clickedIndex)
            // clickIndex计算了复制的slide数量，所以真实index需要减去复制的slide个数
            let index = this.clickedIndex - 3
            let len = _this.recommend.length
            // 当点击的是复制的slide时，根据情况计算出真实index
            if (index > len - 1) {
              index -= len
            } else if (index < 0) {
              index += len
            }
            let id = _this.recommend[index].goodsId
            _this.goGoodsDetail(id)
          }
        }
      }
    }
  },
  created () {
    _this = this
    this.getShoppingMallData()
  },
  // activated () {
  //   _this = this
  //   this.getShoppingMallData()
  // },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  filters: {
    moneyFilter (money) {
      return toMoney(money)
    }
  },
  methods: {
    getShoppingMallData () {
      let config = {
        url: url.getShoppingMallData,
        method: 'get'
      }
      this.axios(config).then((res) => {
        let {category, advertesPicture, slides, recommend, floor1, floor2, floor3, floorName, hotGoods} = res.data.data
        this.banner = slides
        this.category = category
        this.adBanner = advertesPicture
        this.recommend = recommend
        this.floor1 = floor1
        this.floor2 = floor2
        this.floor3 = floor3
        this.floorName = floorName
        this.hotGoods = hotGoods
      }).catch((error) => { console.log(error) })
    },
    goGoodsDetail (id) {
      // this.$router.push({path: '/goodsDetail', query: {goodsId: id}})
      this.$router.push({name: 'goodsDetail', params: {goodsId: id}})
    },
    getSearchValue (data) {
      console.log(data)
    }
  }
}
</script>

<style scoped lang="scss">
$border-1px: 1PX solid #666;
.shoppingMall {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  .banner {
    width: 100%;
  }
  .category {
    display: flex;
    background-color: #fff;
    margin: .1rem;
    border-radius: .15rem;
    .category-item {
      flex: 1;
      padding: .2rem;
      img {
        margin-bottom: .1rem;
      }
    }
  }
  .recommend {
    background-color: #fff;
    margin-top: .2rem;
    .recommend-title {
      padding-left: .1rem;
      line-height: .6rem;
      font-size: .28rem;
      color: orangered;
      border-bottom: $border-1px;
      i {
        font-size: .4rem;
      }
    }
    .recommend-item {
      position: relative;
      border-right: $border-1px;
      box-sizing: border-box;
      text-align: center;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      div {
        color: orangered;
      }
      .recommend-item_name {
        padding: 0 .15rem;
      }
      .recommend-item_price {
        margin: .1rem 0;
        .mallPrice {
          font-size: .32rem;
        }
        .presentPrice {
          text-decoration: line-through;
          color: #666;
        }
      }
      .recommend-tag {
        position: absolute;
        top: 30%;
        left:0;
      }
    }
  }
  .hotGoods {
    height: auto;
    .hotGoods-title {
      height: .8rem;
      line-height: .8rem;
      font-size: .28rem;
      color: orangered;
      display: flex;
      align-items: center;
      justify-content: center;
      .hotGoods-title_icon {
        font-size: .44rem;
        margin-right: .1rem;
      }
    }
    .hotGoods-main {
      display: flex;
      flex-flow: wrap;
      background-color: #fff;
      .hotGoods-item {
        flex: 0 0 50%;
        box-sizing: border-box;
        border-bottom: $border-1px;
        &:nth-child(odd) {
          border-right: $border-1px;
        }
      }
    }
  }
}
.clearfix:after {
  content: '';
  height: 0;
  font-size: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
</style>
