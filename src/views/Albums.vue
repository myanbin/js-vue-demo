<template>
  <div class="albums">
    <h1>音乐专辑管理器</h1>
    <a-table :columns="columns" :dataSource="data" :rowKey="record => record._id">
      <template slot="singers" slot-scope="singers">
        {{ singers[0].singer_name }} {{ singers.length > 1 ? `等 ${singers.length} 人` : `` }}
      </template>
      <template slot="public_time" slot-scope="public_time">
        {{ public_time | date }}
      </template>
      <template slot="action" slot-scope="action, record">
        <a @click="current = cloneDeep(record); readonly = true; visible = true">详细内容</a>
        <a-divider type="vertical" />
        <a @click="current = cloneDeep(record); readonly = false; visible = true">编辑</a>
        <a-divider type="vertical" />
        <a>追加歌手</a>
        <a-divider type="vertical" />
        <a @click="handleDelete(record)">删除</a>
      </template>
    </a-table>
    <a-modal :title="(readonly ? '查看' : '编辑') + '音乐专辑'" v-model="visible" @ok="handleOK">
      <div class="form-item">
        <img :src="current.cover" class="album-cover">
      </div>
      <div class="form-item">
        <label>专辑名称</label>
        <a-input :class="{readonly}" v-model="current.album_name" />
      </div>
      <div class="form-item">
        <label>发布时间</label>
        <a-input :class="{readonly}" v-model="current.public_time" />
      </div>
      <div class="form-item">
        <label>价格</label>
        <a-input :class="{readonly}" v-model="current.price" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep';
const baseurl = '/albums'

const columns = [
  {
    title: '专辑编号',
    dataIndex: '_id',
    width: '10%'
  },
  {
    title: '专辑名称',
    dataIndex: 'album_name'
  },
  {
    title: '发布时间',
    dataIndex: 'public_time',
    width: '12%',
    scopedSlots: { customRender: 'public_time' }
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: '10%',
  },
  {
    title: '歌手',
    dataIndex: 'singers',
    width: '12%',
    scopedSlots: { customRender: 'singers' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '30%',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'albums',
  data: () => {
    return {
      columns,
      data: null,
      readonly: false,
      visible: false,
      current: {
        album_name: null,
        public_time: null,
        price: null
      }
    };
  },
  methods: {
    cloneDeep: cloneDeep,
    handleOK() {
      window.console.log(this.current)

      if (this.readonly === true) {
        this.visible = false
      } else {
        window.fetch(`${baseurl}/${this.current._id}`, { method: 'PUT' }).then(res => res.json()).then(() => {
          this.getdata()
          this.$message.info('专辑更新完成')
          this.visible = false
        })
      }
    },
    handleDelete(record) {
      this.$confirm({
        title: '确定要删除该专辑吗？',
        content: '删除后，专辑将不可恢复',
        okText: '删除',
        cancelText: '取消',
        okType: 'danger',
        onOk: () => {
          window.fetch(`${baseurl}/${record._id}`, { method: 'DELETE' }).then(res => res.json()).then(() => {
            this.getdata()
            this.$message.info('专辑删除完成')
            this.visible = false
          })
        }
      })
    },
    getdata() {
      window.fetch(`${baseurl}`).then(res => res.json()).then(data => {
        this.data = data
      })
    }
  },
  created() {

    window.console.log(baseurl)

    this.getdata()
  },
  filters: {
    date (value) {
      return value.split('T')[0]
    }
  }
}
</script>

<style>
.form-item {
  display: flex;
  margin-bottom: 10px;
}
.form-item label {
  display: block;
  width: 100px;
  line-height: 32px;
}
.readonly {
  pointer-events: none;
  border: none;
}
.album-cover {
  height: 64px;
}
</style>
