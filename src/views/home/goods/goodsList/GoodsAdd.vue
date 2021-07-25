<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb :itemsInfo="['首页', '商品管理', '添加商品']" />
    <!-- 卡片视图区域 -->
    <goods-add-card />
  </div>
</template>

<script>
import Breadcrumb from 'components/content/Breadcrumb.vue'
import GoodsAddCard from './childComps/GoodsAddCard.vue'

export default {
  name: 'GoodsAdd',
  components: {
    Breadcrumb,
    GoodsAddCard,
  },
}
</script>

<style lang="less" scoped>
</style>