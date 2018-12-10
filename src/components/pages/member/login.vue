<template>
  <div class="login">
    <div class="nav">
      <van-nav-bar
        title="登录"
        left-text="返回"
        left-arrow
        @click-left="goBack"
      />
    </div>
    <!-- <div class="field"> -->
      <van-cell-group class="field">
        <van-field
          v-model="userName"
          required
          center
          type="number"
          label="手机号码"
          clearable
          placeholder="请输入手机号码"
          class="input-field"
          :error-message="userNameErrorMessage"
        />
        <van-field
          v-model="passWord"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
          center
          class="input-field"
          :error-message="passWordErrorMessage"
        />
        <van-button
          type="primary"
          size="large"
          class="button-login"
          @click="loginUserAction"
          :loading="openLoading"
        >登录</van-button>
      </van-cell-group>
    <!-- </div> -->
  </div>
</template>

<script>
import url from '@/api/serviceAPI.config.js'
export default {
  data () {
    return {
      userName: '', // 手机号码
      passWord: '', // 密码
      openLoading: false, // 是否打开loading
      userNameErrorMessage: '', // 手机号码错误提示
      passWordErrorMessage: '' // 密码错误提示
    }
  },
  created () {
    // 判断localstorage是否存有userInfo，有则说明已登录
    if (localStorage.userInfo) {
      this.$toast.success('您已经登录')
      this.$router.push('/member')
    }
  },
  methods: {
    // 返回上一页
    goBack () {
      this.$router.back(-1)
    },
    // 登录
    loginUserAction () {
      if (this.checkForm()) {
        this.axiosLoginUser()
      }
    },
    // 手机号码和密码验证
    checkForm () {
      let username = this.userName
      let password = this.passWord
      let isOk = true // 判断格式是否正确，有一个错误就返回false
      if (!(/^1[34578]\d{9}$/.test(username))) {
        this.userNameErrorMessage = '手机号码格式错误！'
        isOk = false
      } else {
        this.userNameErrorMessage = ''
      }
      if (password.length < 6) {
        this.passWordErrorMessage = '密码不能小于6位！'
        isOk = false
      } else {
        this.passWordErrorMessage = ''
      }
      return isOk
    },
    // 登录请求
    axiosLoginUser () {
      let config = {
        url: url.loginUser,
        method: 'post',
        data: {
          username: this.userName,
          password: this.passWord
        }
      }
      this.openLoading = true // 是否打开loading
      this.axios(config).then((res) => {
        let {code, message, token} = res.data
        if (code === 200) {
          // this.$toast.success('登录成功')
          // this.$router.push('/member')
          this.localStorageUserInfo(message, token)
        } else if (code === 201) {
          this.$toast.fail(message)
          this.openLoading = false
        } else if (code === 404) {
          // console.log(message)
          this.$toast.fail(message)
          this.openLoading = false
        }
      }).catch((error) => {
        console.log(error)
        this.$toast.fail('登录失败')
        this.openLoading = false
      })
    },
    // 登录信息存入localstorage
    localStorageUserInfo (message, token) {
      // let _this = this
      return new Promise((resolve, reject) => {
        localStorage.userInfo = JSON.stringify({token: token})
        if (localStorage.userInfo.length > 0) {
          setTimeout(() => {
            resolve()
          }, 500)
        } else {
          // eslint规则必须添加new Error()
          reject(new Error(0))
        }
      }).then(() => {
        this.$toast.success({
          message: message,
          duration: 1000
        })
        setTimeout(() => {
          // this.$router.push('/member')
          this.$router.back(-1)
        }, 1000)
      }).catch(err => {
        this.$toast.fail('登录状态保存失败')
        console.log(err)
        this.openLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.field {
  display: flex;
  flex-direction: column;
  align-items: center;
  .input-field {
    margin: .3rem auto;
  }
  .button-login {
    width: 96%;
    margin-top: 1rem;
  }
}
</style>
