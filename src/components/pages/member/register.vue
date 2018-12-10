<template>
  <div class="register">
    <div class="nav">
      <van-nav-bar
        title="注册"
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
        <van-field
          v-model="sms"
          center
          clearable
          label="短信验证码"
          placeholder="请输入短信验证码"
          class="input-field"
        >
          <van-button slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>
        <van-button
          type="primary"
          size="large"
          class="button-register"
          @click="registerUserAction"
          :loading="openLoading"
        >注册</van-button>
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
      sms: '', // 手机验证码
      openLoading: false, // 是否打开loading
      userNameErrorMessage: '', // 手机号码错误提示
      passWordErrorMessage: '' // 密码错误提示
    }
  },
  methods: {
    // 返回上一页
    goBack () {
      this.$router.back(-1)
    },
    // 注册
    registerUserAction () {
      if (this.checkForm()) {
        this.axiosRegisterUser()
      }
    },
    // 验证手机号吗和密码
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
    // 注册请求
    axiosRegisterUser () {
      let config = {
        url: url.registerUser,
        method: 'post',
        data: {
          username: this.userName,
          password: this.passWord
        }
      }
      this.openLoading = true // 打开注册按钮的loading，防止多次点击重复请求
      this.axios(config).then((res) => {
        // console.log(res.data.code)
        if (res.data.code === 200) {
          this.openLoading = false
          this.$toast.success(res.data.message)
          this.$router.push('/member')
        } else if (res.data.code === 201) {
          this.openLoading = false
          this.$toast(res.data.message)
        } else {
          // console.log(res.data.message)
          this.$toast.fail(res.data.message)
          this.openLoading = false
        }
      }).catch((error) => {
        console.log(error)
        this.$toast.fail('注册失败')
        this.openLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.register {
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
  .button-register {
    width: 96%;
    margin-top: 1rem;
  }
}
</style>
