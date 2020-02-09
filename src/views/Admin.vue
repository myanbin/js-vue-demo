<template>
  <div id="admin">
    <h1>管理中心</h1>
    <a-row style="margin-bottom: 14px">
      <a-col :span="6"><a-statistic title="注册用户数" :value="users.length" :class="{ active: current === 'users' }" /></a-col>
      <a-col :span="6"><a-statistic title="音乐专辑数" :value="albums.length" :class="{ active: current === 'albums' }" /></a-col>
      <a-col :span="6"><a-statistic title="音乐艺人数" :value="artists.length" :class="{ active: current === 'artists' }" /></a-col>
      <a-col :span="6"><a-statistic title="程序已运行" :value="appAge" /></a-col>
    </a-row>
    <a-table :columns="columns" :dataSource="users" :pagination="false" :rowKey="user => user._id">
      <template slot="index" slot-scope="_id">
        {{ _id | short }}
      </template>
      <template slot="admin" slot-scope="admin">
        {{ admin ? '是' : '否' }}
      </template>
      <template slot="favorites" slot-scope="favorites">
        {{ favorites.length }}
      </template>
      <template slot="created_at" slot-scope="created_at">
        {{ created_at }}
      </template>
      <template slot="activity" slot-scope="activity">
        {{ activity }}
      </template>
    </a-table>
    <p class="hero">权力越大，责任越大。 —— 蜘蛛侠</p>
    <h2>数据库重建</h2>
    <p>点击下面按钮，可以重置音乐专辑管理器的数据</p>
    <p><a-button type="danger" ghost @click="rebuild">重置数据</a-button></p>
  </div>
</template>

<script>
import HTTP from '../utils'

const columns = [
  {
    title: '#',
    dataIndex: '_id',
    width: '20px',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '是否管理员',
    dataIndex: 'admin',
    width: '10%',
    scopedSlots: { customRender: 'admin' }
  },
  {
    title: '收藏专辑数',
    dataIndex: 'favorites',
    width: '10%',
    scopedSlots: { customRender: 'favorites' }
  },
  {
    title: '注册时间',
    dataIndex: 'created_at',
    scopedSlots: { customRender: 'created_at' }
  },
  {
    title: '最后登录设备',
    dataIndex: 'activity',
    scopedSlots: { customRender: 'activity' }
  }
]

export default {
  name: 'admin',
  data: () => {
    return {
      columns,
      current: 'users',
      albums: [],
      users: [],
      artists: [],
      appAge: 'loading ...'
    }
  },
  created() {
    this.load()
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24

    HTTP.get('/dateofbirth').then(res => {
      const dateOfBirth = new Date(res.data).getTime()
      setInterval(() => {
        const now = new Date().getTime()
        const distance = now - dateOfBirth
        const message = `${Math.floor(distance / (day))} 天 ${Math.floor((distance % (day)) / (hour))} 时 ${Math.floor((distance % (hour)) / (minute))} 分 ${Math.floor((distance % (minute)) / second)} 秒`
        this.appAge = message
      }, 1000)
    })
    
  },
  methods: {
    load() {
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
            this.load()
          })
        }
      })
    }
  },
  filters: {
    short (value) {
      return value.slice(-6)
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
  cursor: pointer;
}
.ant-table-wrapper {
  margin-bottom: 14px;
}
.active {
  color: #1890ff;
}
</style>