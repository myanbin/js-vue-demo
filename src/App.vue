<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">首页</router-link> |
      <router-link to="/albums">音乐专辑管理器</router-link> |
      <router-link to="/admin">管理中心</router-link> |
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
  padding: 20px;
  background: rgb(63,81,181);
  background: linear-gradient(90deg, rgba(63,81,181,1) 0%, rgba(9,57,121,1) 100%);
  font-size: 20px;
  color: #ccc;
  text-align: left;
}

#nav a {
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  line-height: 2rem;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#albums, #users, #login, #about, #home {
  padding: 20px;
}
</style>
