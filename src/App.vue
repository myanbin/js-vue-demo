<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">首页</router-link>
      <router-link to="/discover">发现</router-link>
      <router-link to="/albums">专辑管理器</router-link>
      <router-link to="/admin">管理中心</router-link>
      <span :style="{ flex: 1 }"></span>
      <router-link to="/about" v-if="login">关于我</router-link>
      <router-link to="/login" v-else>登录</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      login: window.localStorage.getItem('token') !== null,
      username: window.localStorage.getItem('username')
    }
  },
  created() {
    setInterval(() => {
      this.login = window.localStorage.getItem('token') !== null
    }, 1000)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 0 20px;
  background: #000;
  height: 60px;
  color: #ccc;
  text-align: left;
  display: flex;
}

#nav a {
  color: #ccc;
  text-decoration: none;
  line-height: 60px;
  padding: 0 20px;
  font-size: 20px;
}

#nav a.router-link-exact-active {
  color: #fff;
}

#albums, #users, #login, #about, #home, #discover, #admin {
  padding: 20px;
}
</style>
