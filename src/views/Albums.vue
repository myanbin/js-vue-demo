<template>
  <div id="albums">
    <h1>音乐专辑管理器</h1>
    <p :style="{ textAlign: 'left' }"><a-button type="primary" @click="handleCreate">新增专辑</a-button></p>
    <a-table :columns="columns" :dataSource="data" :rowKey="album => album._id">
      <template slot="index" slot-scope="_id, album">
        <a-icon type="star" theme="filled" @click="handleStar(album)" />
      </template>
      <template slot="artists" slot-scope="artists">
        <span v-if="artists.length === 0">暂无</span>
        <span v-else>{{ artists[0].name }} {{ artists.length > 1 ? `等 ${artists.length} 人` : `` }}</span>
      </template>
      <template slot="released_at" slot-scope="released_at">
        {{ released_at | date }}
      </template>
      <template slot="action" slot-scope="action, album, index">
        <a>详细内容</a>
        <a-divider type="vertical" />
        <a @click="current = cloneDeep(album); currentIndex = index; mode = 1; visible = true">编辑</a>
        <a-divider type="vertical" />
        <a>追加艺人</a>
        <a-divider type="vertical" />
        <a @click="currentIndex = index; handleDelete(album)">删除</a>
      </template>
    </a-table>
    <a-modal :title="'编辑专辑'" v-model="visible" okText="确定" cancelText="取消" @ok="handleOk">
      <a-form>
        <a-form-item label="专辑名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="current.name" />
        </a-form-item>
        <a-form-item label="年份" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="current.released_at" />
        </a-form-item>
        <a-form-item label="流派" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select v-model="current.genres">
            <a-select-option value="电子乐">电子乐</a-select-option>
            <a-select-option value="爵士乐">爵士乐</a-select-option>
            <a-select-option value="流行乐">流行乐</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import HTTP from '../utils'

const columns = [
  {
    title: '#',
    dataIndex: '_id',
    width: '20px',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '专辑名称',
    dataIndex: 'name'
  },
  {
    title: '年份',
    dataIndex: 'released_at',
    width: '10%',
    scopedSlots: { customRender: 'released_at' }
  },
  {
    title: '流派',
    dataIndex: 'genres',
    width: '10%',
  },
  {
    title: '艺人',
    dataIndex: 'artists',
    width: '15%',
    scopedSlots: { customRender: 'artists' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '300px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'albums',
  data: () => {
    return {
      columns,
      data: null,
      mode: 0,
      visible: false,
      current: {
        name: null,
        released_at: null,
        genres: null
      },
      currentIndex: null
    };
  },
  methods: {
    cloneDeep: cloneDeep,
    handleOk() {
      if (this.mode === 0) {
        HTTP.post(`/albums`, this.current).then(res => {
          this.data.push(res.data)
          this.$message.info('专辑新增完成')
          this.visible = false
        })
      } else {
        HTTP.put(`/albums/${this.current._id}`, this.current).then(res => {
          this.data.splice(this.currentIndex, 1, { ...res.data, ...this.current })
          this.$message.info('专辑更新完成')
          this.visible = false
        })
      }
      
    },
    handleCreate() {
      this.mode = 0
      this.visible = true
      this.current = {
        name: null,
        released_at: null,
        genres: null
      }
    },
    handleDelete(album) {
      this.$confirm({
        title: '确定要删除该专辑吗？',
        content: '删除后，专辑将不可恢复',
        okText: '删除',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          HTTP.delete(`/albums/${album._id}`).then(() => {
            this.data.splice(this.currentIndex, 1)
            this.$message.info('专辑删除完成')
            this.visible = false
          })
        }
      })
    },
    handleStar(album) {
      window.console.log(album)
    }
  },
  created() {
    HTTP.get(`/albums`).then(res => {
      this.data = res.data
    })
  },
  filters: {
    date (value) {
      return new Date(value).getFullYear()
    }
  }
}
</script>

<style scoped>
.readonly {
  pointer-events: none;
  border: none;
}
</style>
