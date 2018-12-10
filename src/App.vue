<template>
  <div id="app">
    <div class="main">
      <keep-alive>
        <router-view v-if="$route.meta.keepAliveApp" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAliveApp" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
html,body {
  width: 100%;
  height: 100%;
  font-size: .24rem;
}
#app {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #efefef;
  .main {
    flex: 1;
    overflow: hidden;
  }
}
.van-search {
  padding-left: 0;
}
.van-cell {
  .van-cell__value {
    display: flex;
    // align-items: center;
    flex-direction: column;
    justify-content: center;
    .van-field__body {
      width: 100%;
    }
  }
}
.van-tabbar-item--active {
  color:#e5017d;
}
.van-nav-bar__left {
  .van-icon, span {
  color:#e5017d;
  }
}
.van-submit-bar {
  position: absolute;
}
.van-stepper__minus, .van-stepper__plus {
  width: .6rem;
  height: .4rem;
}
.van-stepper__input {
  height:.32rem;
  width: .46rem;
}
.van-checkbox__icon--checked .van-icon {
  border-color: orangered;
  background-color: orangered;
}
.van-nav-bar__text {
  color:#ff4500;
}
.van-card {
  background-color: #fff;
}
</style>
