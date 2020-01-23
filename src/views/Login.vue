<template>
  <div id="login">
    <!-- 登录表单 -->
    <a-form v-if="!noAccount" class="login-form" layout="vertical" @submit="login">
      <h2 :style="{ margin: '16px 0 36px 0', fontSize: '30px', textAlign: 'center' }">用户登录</h2>
      <a-form-item label="输入用户名">
        <a-input>
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-item>
      <a-form-item label="输入密码">
        <a-input type="password">
          <a-icon slot="prefix" type="lock" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" class="login-form-button" :style="{ width: '100%', height: '34px' }">立即登录</a-button>
        <div :style="{ marginTop: '16px' }">没有帐号？<a @click="noAccount = true">立即注册</a></div>
      </a-form-item>
    </a-form>
    <!-- 注册表单 -->
    <a-form v-else class="register-form" layout="vertical" @submit="register">
      <h2 :style="{ margin: '16px 0 36px 0', fontSize: '30px', textAlign: 'center' }">新用户注册</h2>
      <a-form-item label="输入用户名">
        <a-input>
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-item>
      <a-form-item label="输入密码">
        <a-input type="password">
          <a-icon slot="prefix" type="lock" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" class="login-form-button" :style="{ width: '100%', height: '34px' }">立即注册</a-button>
        <div :style="{ marginTop: '16px' }">已有帐号？<a @click="noAccount = false">立即登录</a></div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data: () => {
    return {
      noAccount: false
    }
  },
  methods: {
    login () {
      window.console.log('you click login')
    },
    register () {
      window.console.log('you click register')
    }
  }
}
</script>

<style scoped>
.login-form, .register-form {
  width: 300px;
  margin: auto;
}
</style>