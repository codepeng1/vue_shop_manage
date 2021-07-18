<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb :itemsInfo="['首页', '用户管理', '用户列表']" />

    <!-- 卡片视图区域 -->
    <users-card />
  </div>
</template>

<script>
import Breadcrumb from 'components/content/Breadcrumb.vue'
import UsersCard from './childComps/UsersCard.vue'

export default {
  name: 'users',
  components: {
    Breadcrumb,
    UsersCard,
  },
}
</script>

<style lang="less" scoped>
</style>