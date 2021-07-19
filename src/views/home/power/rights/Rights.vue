<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb :itemsInfo="['首页', '权限管理', '权限列表']" />
    <!-- 卡片视图区域 -->
    <rights-card />
  </div>
</template>

<script>
import Breadcrumb from 'components/content/Breadcrumb.vue'
import RightsCard from './childComps/RightsCard.vue'

export default {
  name: 'rights',
  components: {
    Breadcrumb,
    RightsCard,
    Breadcrumb,
  },
}
</script>

<style lang="less" scoped>
</style>