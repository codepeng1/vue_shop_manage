<template>
  <div>
    <!-- 面包屑导航区域 -->
    <breadcrumb :itemsInfo="['首页', '商品管理', '分类参数']" />
    <!-- 卡片视图区域 -->
    <params-card />
  </div>
</template>

<script>
import Breadcrumb from 'components/content/Breadcrumb.vue'
import ParamsCard from './childComps/ParamsCard.vue'

export default {
  name: 'Params',
  components: { Breadcrumb, ParamsCard },
}
</script>

<style lang="less" scoped>
</style>