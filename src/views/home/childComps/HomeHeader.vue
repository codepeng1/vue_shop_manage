<template>
  <el-header>
    <div>
      <img src="~assets/img/home/user.png" alt="" title="电商后台管理系统" />
      <span>电商后台管理系统(Shoping Manage System)</span>
    </div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </el-header>
</template>

<script>
export default {
  name: 'HomeHeader',
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
.el-header {
  // width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 7px;
    }
  }
}
</style>