<template>
  <el-container class="home_container" direction="vertical">
    <!-- 头部区域 -->
    <home-header />
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <home-aside :menuLists="menuLists" />
      <!-- 右侧内容主体 -->
      <home-main />
    </el-container>
  </el-container>
</template>

<script>
import HomeHeader from './childComps/HomeHeader.vue'
import HomeAside from './childComps/HomeAside.vue'
import HomeMain from './childComps/HomeMain.vue'

import { getMenuLists } from 'network/home.js'

export default {
  name: 'Home',
  data() {
    return {
      // 菜单列表数据
      menuLists: [],
    }
  },
  components: {
    HomeHeader,
    HomeAside,
    HomeMain,
  },
  created() {
    // 请求所有的菜单列表数据
    this.getMenuLists()
  },
  mounted() {
    // 第一次欢迎用户后，之后用户刷新不再显示欢迎
    let user = window.sessionStorage.getItem('username')
    user &&
      this.$message.success({
        message: `${user}，欢迎回来~`,
        duration: 2000,
        offset: 9,
      })
    window.sessionStorage.removeItem('username')
  },
  methods: {
    /**
     * 网络请求相关的方法
     */
    async getMenuLists() {
      const res = await getMenuLists()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuLists = res.data
    },
  },
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
</style>