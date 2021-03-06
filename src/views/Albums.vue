<template>
  <div id="albums">
    <h1>音乐专辑管理器</h1>
    <p :style="{ textAlign: 'left', display: 'flex' }">
      <a-button type="primary" @click="handleCreate">新增专辑</a-button>
      <span style="flex: 1"></span>
      <a-input class="search-form" placeholder="搜索专辑" v-model="searchText" @change="handleSearch" />
    </p>
    <a-table :columns="columns" :dataSource="albums" :pagination="false" :rowKey="album => album._id">
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
        <!-- <a>详细内容</a> -->
        <!-- <a-divider type="vertical" /> -->
        <a @click="current = cloneDeep(album); currentIndex = index; mode = 1; visible = true">编辑专辑</a>
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
            <a-select-option value="摇滚乐">摇滚乐</a-select-option>
            <a-select-option value="蓝调 / R&B">蓝调 / R&B</a-select-option>
            <a-select-option value="舞曲">舞曲</a-select-option>
            <a-select-option value="乡村音乐">乡村音乐</a-select-option>
            <a-select-option value="电影配乐">电影配乐</a-select-option>
            <a-select-option value="不可归类音乐">不可归类音乐</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="专辑封面" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-upload name="cover" listType="picture-card" :showUploadList="false" :action="uploadUrl" :beforeUpload="beforeUpload" @change="handleChange">
            <img v-if="current.image_url" :src="current.image_url" :alt="current.name" class="album-cover" />
            <div v-else class="album-cover">
              <p class="ant-upload-drag-icon"><a-icon :type="loading ? 'loading' : 'plus'" /></p>
              <p class="ant-upload-hint">点击上传</p>
            </div>
          </a-upload>
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
    width: '12%',
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
    width: '250px',
    scopedSlots: { customRender: 'action' }
  }
]

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  name: 'albums',
  data: () => {
    return {
      columns,
      albums: [],
      albums2: [],
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
      favorites: [],
      loading: false,
      uploadUrl: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      searchText: null
    };
  },
  methods: {
    cloneDeep: cloneDeep,
    handleOk() {
      if (this.current.name === null) {
        return false
      }
      if (this.mode === 0) {
        HTTP.post(`/albums`, this.current).then(res => {
          this.albums.push(res.data)
          this.albums2 = this.albums
          this.$message.info('专辑新增成功')
          this.visible = false
        })
      } else {
        HTTP.patch(`/albums/${this.current._id}`, this.current).then(res => {
          this.albums.splice(this.currentIndex, 1, { ...res.data, ...this.current })
          this.albums2 = this.albums
          this.$message.info('专辑更新成功')
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
            this.albums2 = this.albums
            this.$message.info('专辑删除成功')
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
          this.$message.info('已取消收藏')
        })
      } else {
        HTTP.put(`/user/starring/${album._id}`).then(() => {
          this.favorites.push(album._id)
          this.$message.info('已收藏')
        })
      }
    },
    handleFilter(inputValue, option) {
       return option.componentOptions.children[0].text.indexOf(inputValue) >= 0
    },
    handleOk2() {
      if (this.artist2.length === 24) {
        HTTP.put(`/albums/${this.current._id}/artists/${this.artist2}`).then(res => {
          this.albums.splice(this.currentIndex, 1, { ...res.data })
          this.albums2 = this.albums
          this.$message.info('追加艺人成功')
          this.visible2 = false
        })
      } else {
        HTTP.post('/artists', { name: this.artist2 }).then(res => {
          this.artists.push(res.data)
          HTTP.put(`/albums/${this.current._id}/artists/${res.data._id}`).then(res => {
            this.albums.splice(this.currentIndex, 1, { ...res.data })
            this.$message.info('追加艺人成功')
            this.visible2 = false
          })
        })
      }
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.current.image_url = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.$message.error('仅允许上传 JPG 格式图片');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片应小于 2MB');
      }
      return isJPG && isLt2M;
    },
    handleSearch() {
      if (this.searchText) {
        this.albums = this.albums2.filter(album => album.name.includes(this.searchText))
      } else {
        this.albums = this.albums2
      }
      
    }
  },
  created() {
    HTTP.get(`/albums`).then(res => {
      this.albums = res.data
      this.albums2 = this.albums
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
.search-form {
  width: 200px;
}
.album-cover {
  width: 150px;
  height: 150px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.album-cover i.anticon {
  font-size: 24px;
}
</style>
