<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">
      {{ itemsInfo[0] }}
    </el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in itemsInfo.splice(1)" :key="index">
      {{item}}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    itemsInfo: {
      type: Array,
      default() {
        return []
      },
    },
  },
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  font-size: 13px;
}
</style>