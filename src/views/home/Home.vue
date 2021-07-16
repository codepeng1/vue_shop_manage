<template>
  <div>
    <div>首页</div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    // 第一次欢迎用户后，之后用户刷新不再显示
    let user = window.sessionStorage.getItem('username')
    user &&
      this.$message.success({
        message: `${user}，欢迎回来~`,
        duration: 2000,
      })
    window.sessionStorage.removeItem('username')
  },
  methods: {
    // 退出登录
    logout() {
      // 1.清空sessionStorage中的token
      window.sessionStorage.clear()
      // 2.跳转到登录页
      this.$router.replace('/login')
    },
  },
}
</script>

<style lang="less" scoped>
</style>