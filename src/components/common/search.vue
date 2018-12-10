<template>
  <div class="search">
    <van-icon name="location" class="search-location"/>
    <van-search
      @search="onSearch"
      placeholder="请输入"
      v-model="value"
      background="#e5017d"
      class="search-input"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    onSearch () {
      // 像父级传递搜索关键字，定义事件为searchValue
      this.$emit('searchValue', this.value)
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  background-color: #e5017d;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  .search-location {
    padding: 0 .2rem;
    font-size: .32rem;
    color: #fff;
  }
  .search-input {
    flex: 1;
  }
}
</style>
