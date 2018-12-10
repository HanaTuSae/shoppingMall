<template>
  <div class="member">
    <div class="member-user">
      <div class="img"><img src="../../../assets/images/default-head.png" width="100%" alt=""></div>
      <div class="button" v-show="!isLogin">
        <span @click="goLogin">登录</span>
        <span>&nbsp;/&nbsp;</span>
        <span @click="goRegister">注册</span>
      </div>
    </div>
    <div class="shopInfo">
      <van-cell-group>
        <van-cell title="优惠券" is-link />
        <van-cell title="客服电话" is-link />
        <van-cell title="福利包包" is-link />
        <van-cell title="关于我们" is-link />
      </van-cell-group>
    </div>
    <div class="shopInfo" v-show="isLogin">
      <van-cell-group>
        <van-cell title="地址管理" is-link />
        <van-cell title="修改密码" is-link />
      </van-cell-group>
    </div>
    <!-- <div class="sign-out"> -->
      <van-button size="large" @click="signOut" v-show="isLogin">退出登录</van-button>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLogin: false
    }
  },
  created () {
    // console.log('created')
    this.checkLogin()
  },
  // mounted () {
  //   this.$nextTick(() => {
  //     this.checkLogin()
  //   })
  // },
  activated () {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      if (localStorage.userInfo) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    },
    goRegister () {
      this.$router.push('/register')
    },
    goLogin () {
      this.$router.push('/login')
    },
    signOut () {
      // 退出登录清除localStorage保存的信息
      localStorage.removeItem('userInfo')
      this.isLogin = false
    }
  }
}
</script>

<style scoped lang="scss">
.member {
  .member-user {
    width: 100%;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e5017d;
    .img {
      width: 1.28rem;
      height: 1.28rem;
      border-radius: 50%;
      background-color: #fff;
      margin: 0 .2rem;
    }
    .button {
      align-self: flex-end;
      margin-bottom: .2rem;
      color: #fff;
      font-size: .32rem;
    }
  }
  .shopInfo {
    margin-bottom: .2rem;
  }
  // .sign-out {
  //   display: flex;
  //   justify-content: center;
  //   button {
  //     width: 96%;
  //   }
  // }
}
</style>
