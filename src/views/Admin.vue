<template>
  <div id="about">
    <h1>管理中心</h1>
    <p class="hero">权力越大，责任越大。 —— 蜘蛛侠</p>
    <h2>数据统计</h2>
    <a-row style="margin-bottom: 14px">
      <a-col :span="6"><a-statistic title="注册用户数" :value="users.length" /></a-col>
      <a-col :span="6"><a-statistic title="音乐专辑数" :value="albums.length" /></a-col>
      <a-col :span="6"><a-statistic title="音乐艺人数" :value="artists.length" /></a-col>
    </a-row>
    <h2>数据库重建</h2>
    <p>点击下面按钮，可以重置音乐专辑管理器的数据</p>
    <p><a-button type="danger" ghost @click="rebuild">重置数据</a-button></p>
  </div>
</template>

<script>
import HTTP from '../utils'

export default {
  name: 'admin',
  data: () => {
    return {
      albums: [],
      users: [],
      artists: []
    }
  },
  created() {
    HTTP.get(`/albums`).then(res => {
      this.albums = res.data
    })
    HTTP.get('/users').then(res => {
      this.users = res.data
    })
    HTTP.get('/artists').then(res => {
      this.artists = res.data
    })
  },
  methods: {
    rebuild() {
      this.$confirm({
        title: '确定要重置数据吗？',
        content: '重置后，当前数据将丢失',
        okText: '重置',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          HTTP.put('/admin/rebuild').then(() => {
            this.$message.info('数据重置成功')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.hero {
  height: 100px;
  line-height: 100px;
  background-color: #f2f2f2;
}
.ant-statistic {
  text-align: left;
  padding: 10px;
}
</style>