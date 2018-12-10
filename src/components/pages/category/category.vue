<template>
  <div class="category">
    <search @searchValue="getSearchValue"></search>
    <div class="category-list">
      <ul class="nav-left">
        <li
          v-for="(item, index) in categoryList"
          :key="index"
          @click="onCategory(index, item.ID)"
          :class="navLeftActive===index?'nav-left_active':''"
        >
          <span>{{item.MALL_CATEGORY_NAME}}</span>
        </li>
      </ul>
      <ul class="nav-right">
        <li v-for="(item, index) in categorySubList" :key="index" @click="goGoodsList(item.ID)">
          <span>{{item.MALL_SUB_NAME}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import url from '@/api/serviceAPI.config.js'
import search from '@/components/common/search.vue'
export default {
  components: {
    search
  },
  data () {
    return {
      categoryList: [],
      categorySubList: [],
      goodsList: [],
      navLeftActive: 0
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    getCategoryList () {
      let config = {
        url: url.getCategoryList,
        method: 'post'
      }
      this.axios(config).then((res) => {
        if (res.data.code === 200 && res.data.message) {
          this.categoryList = res.data.message
          this.getCategorySubList(this.categoryList[0].ID)
        }
      }).catch((error) => {
        console.log(error)
        this.$toast('服务器错误，数据取得失败!')
      })
    },
    onCategory (index, id) {
      this.navLeftActive = index
      this.getCategorySubList(id)
    },
    getCategorySubList (id) {
      let config = {
        url: url.getCategorySubList,
        method: 'post',
        data: {
          categoryId: id
        }
      }
      this.axios(config).then((res) => {
        if (res.data.code === 200 && res.data.message) {
          this.categorySubList = res.data.message
        }
      }).catch((error) => {
        console.log(error)
        this.$toast('服务器错误，数据取得失败!!')
      })
    },
    goGoodsList (id) {
      this.$router.push({path: '/goodsList', query: {categorySubId: id}})
      // this.$router.push({name: 'goodsList', params: {categorySubId: id}})
    },
    getSearchValue (data) {
      console.log(data)
    }
  }
}
</script>

<style scoped lang="scss">
.category {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.category-list {
  display: flex;
  flex: 1;
  .nav-left {
    flex: 0 0 1.2rem;
    li {
      height: .8rem;
      line-height: .8rem;
      text-align: center;
      color: #666;
    }
    .nav-left_active {
      background-color: #fff;
      color: #000;
      position: relative;
      &::before {
        content: '';
        display: inline-block;
        width: .05rem;
        height: 50%;
        background-color: orangered;
        position: absolute;
        left: 0;
        top: 25%;
      }
    }
  }
  .nav-right {
    flex: 1;
    display: flex;
    flex-flow: wrap;
    align-content: flex-start;
    background-color: #fff;
    li {
      // flex: 0 0 50%;
      width: 50%;
      height: 1rem;
      line-height: 1rem;
      text-align: center;
    }
  }
}
</style>
