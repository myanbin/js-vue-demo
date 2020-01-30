<template>
  <div id="albums">
    <h1>音乐专辑管理器</h1>
    <p :style="{ textAlign: 'left' }"><a-button type="primary" @click="handleCreate">新增专辑</a-button></p>
    <a-table :columns="columns" :dataSource="albums" :rowKey="album => album._id">
      <template slot="index" slot-scope="_id, album">
        <a-icon type="star" :theme="favorites.find(fav => fav === album._id) ? 'filled' : 'outlined'" @click="handleStar(album)" />
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
        <a @click="current = cloneDeep(album); currentIndex = index; visible2 = true">追加艺人</a>
        <a-divider type="vertical" />
        <a @click="currentIndex = index; handleDelete(album)">删除</a>
      </template>
    </a-table>
    <a-modal :title="mode === 0 ? '新增专辑' : '编辑专辑'" v-model="visible" okText="确定" cancelText="取消" @ok="handleOk">
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
    <a-modal title="追加艺人" v-model="visible2" okText="确定" cancelText="取消" @ok="handleOk2">
      <a-form>
        <a-form-item label="艺人姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <!-- <a-select showSearch :showArrow="false" v-model="artist2">
            <a-select-option v-for="artist in artists" :key="artist._id" :value="artist._id">{{ artist.name }}</a-select-option>
          </a-select> -->
          <a-auto-complete :filterOption="handleFilter" v-model="artist2">
            <template slot="dataSource">
              <a-select-option v-for="artist in artists" :key="artist._id" :value="artist._id">{{ artist.name }}</a-select-option>
            </template>
          </a-auto-complete>
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
      albums: [],
      mode: 0,
      visible: false,
      current: {
        name: null,
        released_at: null,
        genres: null
      },
      currentIndex: null,
      visible2: false,
      artists: [],
      artist2: null,
      favorites: []
    };
  },
  methods: {
    cloneDeep: cloneDeep,
    handleOk() {
      if (this.mode === 0) {
        HTTP.post(`/albums`, this.current).then(res => {
          this.albums.push(res.data)
          this.$message.info('专辑新增完成')
          this.visible = false
        })
      } else {
        HTTP.patch(`/albums/${this.current._id}`, this.current).then(res => {
          this.albums.splice(this.currentIndex, 1, { ...res.data, ...this.current })
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
            this.albums.splice(this.currentIndex, 1)
            this.$message.info('专辑删除完成')
            this.visible = false
          })
        }
      })
    },
    handleStar(album) {
      const index = this.favorites.findIndex(fav => fav === album._id)
      if (index !== -1) {
        HTTP.delete(`/user/starring/${album._id}`).then(() => {
          this.favorites.splice(index, 1)
          this.$message.info('专辑取消收藏')
        })
      } else {
        HTTP.put(`/user/starring/${album._id}`).then(() => {
          this.favorites.push(album._id)
          this.$message.info('专辑收藏')
        })
      }
    },
    handleFilter(inputValue, option) {
       return option.componentOptions.children[0].text.indexOf(inputValue) >= 0
    },
    handleOk2() {
      if (this.artist2.length === 24) {
        HTTP.put(`/albums/${this.current._id}/artists/${this.artist2}`).then(() => {
          this.$message.info('追加艺人成功')
          this.visible2 = false
        })
      } else {
        HTTP.post('/artists', { name: this.artist2 }).then(res => {
          HTTP.put(`/albums/${this.current._id}/artists/${res.data._id}`).then(() => {
            this.$message.info('追加艺人成功')
            this.visible2 = false
          })
        })
      }
    }
  },
  created() {
    HTTP.get(`/albums`).then(res => {
      this.albums = res.data
    })
    HTTP.get('/artists').then(res => {
      this.artists = res.data
    })
    HTTP.get('/user/starring').then(res => {
      this.favorites = res.data
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
