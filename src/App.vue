<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/albums">音乐专辑管理器</router-link> |
      <router-link to="/about" v-if="login">{{ username }}</router-link>
      <router-link to="/login" v-else>Login</router-link>
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
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
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
