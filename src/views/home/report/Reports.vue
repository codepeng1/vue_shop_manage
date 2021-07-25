<template>
  <div>
    <!-- 面包屑区域 -->
    <breadcrumb :itemsInfo="['首页', '数据统计', '数据报表']" />
    <!-- 卡片视图区域 -->
    <reports-card />
  </div>
</template>

<script>
import Breadcrumb from 'components/content/Breadcrumb.vue'
import ReportsCard from './childComps/ReportsCard.vue'

export default {
  name: 'Reports',
  components: {
    Breadcrumb,
    ReportsCard,
  },
}
</script>

<style lang="less" scoped>
</style>