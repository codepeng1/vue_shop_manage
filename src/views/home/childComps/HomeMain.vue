<template>
  <el-main>
    <!-- 路由占位符 -->
    <router-view></router-view>
  </el-main>
</template>

<script>
export default {
  name: 'HomeMain',
}
</script>

<style lang="less" scoped>
.el-main {
  background-color: #eaedf1;
}
</style>