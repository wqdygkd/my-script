<template>
    <div class="list">
      <el-card class="item" v-for="(item, index) in totalList" :key="index" >
        <el-image
          :src="previewList[index]"
          :preview-src-list="previewList"
          fit="cover"
          lazy>
        </el-image>
        <div style="padding: 14px;">
          <span>{{item.name}}</span>
          <div class="bottom clearfix">
            <el-button type="text" class="button">复制链接</el-button>
          </div>
        </div>
      </el-card>
    </div>
</template>

<script>

export default {
  name: 'Index',
  data() {
    return {
      current: [],
      totalList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.axios.get('https://api.github.com/repos/cuilongjin/static/contents/img').then((res) => {
          this.totalList = (res.data || []).map((item) => {
            item.acceleratedUrl =  'https://cdn.jsdelivr.net/gh/cuilongjin/static@main/' + item.path
            return item
          })
          this.previewList = this.totalList.map((item) => {
            return 'https://cdn.jsdelivr.net/gh/cuilongjin/static@main/' + item.path
          })
      })
    }
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.item {
  width: 200px;
  float: left;
  margin: 10px;
}
</style>
