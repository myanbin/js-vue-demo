<template>
  <div id="about">
    <h1>关于我</h1>
    <pre>{{ JSON.stringify(user, null, 4) }}</pre>
    <p><a-button type="link" @click="logout">点击此处退出</a-button></p>
  </div>
</template>

<script>
import HTTP from '../utils'

export default {
  name: 'about',
  data: () => {
    return {
      user: null
    }
  },
  created() {
    HTTP.get('/user').then(res => {
      this.user = res.data
    })
  },
  methods: {
    logout() {
      window.localStorage.clear()
      this.$message.info('退出成功')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
pre {
  text-align: left;
  padding: 15px;
  background-color: #f2f2f2;
}
</style>