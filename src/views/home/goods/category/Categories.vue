<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb :itemsInfo="['首页', '商品管理', '商品分类']" />
    <!-- 卡片视图区域 -->
    <categories-card />
  </div>
</template>

<script>
import Breadcrumb from 'components/content/Breadcrumb.vue'
import CategoriesCard from './childComps/CategoriesCard.vue'

export default {
  name: 'Categories',
  components: {
    Breadcrumb,
    CategoriesCard,
  },
}
</script>

<style lang="less" scoped>
</style>