<template>
  <div class="goodsList">
    <div class="nav">
      <van-nav-bar
        title="商品列表"
        left-text="返回"
        left-arrow
        @click-left="goBack"
      />
    </div>
    <div class="list" ref="list">
      <van-pull-refresh class="refresh" v-model="isRefresh" @refresh="onRefresh" :head-height="92">
        <!-- immediate-check为true默认加载一次onLoad，实际加载了2次 -->
        <van-list
          ref="vanList"
          v-model="loading"
          :finished="finished"
          @load="onLoad"
          :offset="10"
          :immediate-check="false"
        >
          <div class="list-main">
            <goods
              v-for="item in goodsList"
              :key="item.ID"
              class="list-item"
              :goodsId="item.ID"
              :goodsImage="item.IMAGE1"
              :goodsName="item.NAME"
              :goodsOldPrice="item.ORI_PRICE"
              :goodsPresentPrice="item.PRESENT_PRICE"
            ></goods>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import url from '@/api/serviceAPI.config.js'
import goods from '@/components/common/goods.vue'
export default {
  components: {
    goods
  },
  data () {
    return {
      categorySubId: '', // 小类ID
      goodsList: [], // 商品列表
      loading: false, // 上拉加载
      finished: false, // 上拉加载完成
      isRefresh: false, // 下拉刷新,
      page: 1 // 页面
    }
  },
  created () {
    // this.categorySubId = this.$route.query.categorySubId
    // this.onLoad()
  },
  activated () {
    // console.log('activated')
    // 商品详情页返回不刷新数据，从分类页面进入刷新数据
    if (!this.$route.meta.isGoodsDetail) {
      this.categorySubId = this.$route.query.categorySubId
      this.onLoad()
    } else {
      this.$route.meta.isGoodsDetail = false
    }
  },
  mounted () {
    // 最低高度为list高度，使得点击空白位置也可以下拉刷新
    let height = 0
    this.$nextTick(() => {
      height = this.$refs.list.offsetHeight / 100 + 'rem'
      this.$refs.vanList.$el.style.minHeight = height
    })
  },
  methods: {
    // 数据初始化
    innitData () {
      this.page = 1
      this.finished = false
      this.isRefresh = false
      this.goodsList = []
    },
    // 返回上一页
    goBack () {
      this.$router.back(-1)
      setTimeout(() => {
        this.innitData()
      }, 1000)
      // this.innitData()
    },
    // 请求商品列表
    getGoodsList () {
      let config = {
        url: url.getGoodsListByCategorySubId,
        method: 'post',
        data: {
          categorySubId: this.categorySubId,
          page: this.page
        }
      }
      this.axios(config).then((res) => {
        // 如果请求返回200且有数据
        if (res.data.code === 200 && res.data.message.length > 0) {
          // 页面+1
          this.page++
          // 商品数量叠加
          this.goodsList = this.goodsList.concat(res.data.message)
        } else if (res.data.code === 200 && this.page === 1) {
          this.$toast('暂无商品')
          this.finished = true
        } else {
          this.finished = true
        }
        this.loading = false
        this.isRefresh = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
        this.isRefresh = false
      })
    },
    // 打开页面时自动加载
    onLoad () {
      console.log('加载')
      setTimeout(() => {
        this.getGoodsList()
      }, 1000)
    },
    onRefresh () {
      console.log('刷新')
      setTimeout(() => {
        this.innitData()
        this.onLoad()
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
$border-1px: 1PX solid #666;
.goodsList {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
    background-color: #fff;
    // margin-top: 1rem;
    overflow: hidden;
    overflow-y: auto;
    .refresh {
      width:100%;
      min-height: 100%;
      .list-main {
        width: 100%;
        height: auto;
        display: flex;
        flex-flow: wrap;
        .list-item {
          width: 50%;
          box-sizing: border-box;
          border-bottom: $border-1px;
          &:nth-child(odd) {
            border-right: $border-1px;
          }
        }
      }
    }
  }
}

</style>
