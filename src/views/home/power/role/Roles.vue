<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb :itemsInfo="['首页', '权限管理', '角色列表']" />
    <!-- 卡片视图区域 -->
    <roles-card />
  </div>
</template>

<script>
import Breadcrumb from 'components/content/Breadcrumb.vue'
import RolesCard from './childComps/RolesCard.vue'

export default {
  name: 'Roles',
  components: {
    Breadcrumb,
    RolesCard,
  },
}
</script>

<style lang="less" scoped>
</style>