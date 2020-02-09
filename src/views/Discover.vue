<template>
  <div id="discover">
    <h1>发现音乐</h1>
    <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 6 }" :dataSource="albums">
      <a-list-item slot="renderItem" slot-scope="albums">
        <a-card :bordered="false" style="width: 240px">
          <img :alt="albums.name" :src="albums.image_url" slot="cover" v-if="albums.image_url" />
          <img :alt="albums.name" src="../assets/cover.png" slot="cover" v-else />
          <a-card-meta :title="albums.name"></a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import HTTP from '../utils'

export default {
  name: 'discover',
  data: () => {
    return {
      albums: [],
      artists: []
    }
  },
  created() {
    HTTP.get(`/albums`).then(res => {
        this.albums = res.data
      })
      HTTP.get('/artists').then(res => {
        this.artists = res.data
      })
  },
  methods: {
  }
}
</script>

<style scoped>
</style>