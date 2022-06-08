<template>
  <div class="login-container">
    <!-- elementUI
      1. el-form  绑定一个表单对象 + 绑定一个规则对象
      2. el-form-item   通过一个prop指定当前表单项要用哪条规则
      3. el-input   v-model双向绑定
      多组件协作完成表单校验
     -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>
      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <!-- 账号框 -->
        <el-input
          ref="username"
          v-model="loginForm.mobile"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          @keyup.enter.native="$refs.password.focus"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <!-- 密码框 -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <!--
          效果：当我们输入完密码的时候 回车之后可以不用点击提交按钮也可以正常进行登录
          enter：回车键
          这里必须先在密码输入框中聚焦输入 然后才能enter提交
         -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-button
        class="loginBtn"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >
        Login
      </el-button>
      <!--
        native:把当前事件识别为原生的点击事件 click写到了组件身上 当前click到底是
        原生浏览器支持的click还是说父子通信时候的自定义事件 是不确定的
        如果不加在vue2版本中 它会被识别为自定义事件 加上之后才会识别为浏览器原生的click

        prevent: 阻止默认行为 表单中 表单域的提交有可能触发整个页面的刷新 加上这个之后
        就阻止了表单的默认提交行为 防止页面整体刷新
       -->
      <div class="tips">
        <span style="margin-right: 20px">账号: 13800000004</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    // 校验手机号的函数
    const validateMobile = (_, value, callback) => {
      // 1.rule 当前应用的规则 当某个参数使用频率很低 没有实际作用 但是还需要占一个位置 _
      // 2.当前要校验的值
      // 3.callback一个回调函数 失败的时候抛出错误提示 成功的时候通过校验 不管成功失败都必须调用！！
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请填写正确的手机号格式'))
      } else {
        callback()
      }
    }
    return {
      // 表单对象
      loginForm: {
        mobile: '13800000004',
        password: '123456'
      },
      // 规则对象[按照实际需求定义规则]
      loginRules: {
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.$refs.username.focus()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 点击登录执行的方法
    handleLogin() {
      // 1. 表单兜底校验  看文档 获取到form实例对象  调用校验方法 validate
      this.$refs.loginForm.validate(async(valid) => {
        // valid：只有在所有需要校验的表单都通过校验是才为true
        if (valid) {
          // 接口调用
          // console.log('login')
          // loading展示
          this.loading = true
          try {
            // 触发action函数  这里容易出错的地方 一个是参数传递 一个是await
            // 保证action函数中的异步执行完毕 才能执行后续的提示和跳转
            await this.$store.dispatch('user/fetchLogin', this.loginForm)
            // 3. 跳转
            // 4. 提示用户
            this.$router.push('/')
            this.$message.success('登录成功')
          } catch (error) {
            // console.log(error)
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
// 全局生效的样式
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }

  .el-form-item__error {
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
// 只对当前组件生效的样式
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  background-image: url("~@/assets/common/login.jpg"); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .loginBtn {
    background: #407ffe;
    height: 64px;
    line-height: 32px;
    font-size: 24px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
