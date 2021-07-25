<template>
  <div>
    <!-- 面包屑区域 -->
    <breadcrumb :itemsInfo="['首页', '订单管理', '订单列表']" />
    <!-- 卡片视图区域 -->
    <orders-card />
  </div>
</template>

<script>
import Breadcrumb from 'components/content/Breadcrumb.vue'
import OrdersCard from './childComps/OrdersCard.vue'

export default {
  name: 'Orders',
  components: {
    Breadcrumb,
    OrdersCard,
  },
}
</script>

<style lang="less" scoped>
</style>