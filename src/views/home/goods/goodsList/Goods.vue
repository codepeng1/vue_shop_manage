<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb :itemsInfo="['首页', '商品管理', '商品列表']" />
    <!-- 卡片视图区域 -->
    <goods-card />
  </div>
</template>

<script>
import Breadcrumb from 'components/content/Breadcrumb.vue'
import GoodsCard from './childComps/GoodsCard.vue'

export default {
  name: 'Goods',
  components: {
    Breadcrumb,
    GoodsCard,
  },
}
</script>

<style lang="less" scoped>
</style>