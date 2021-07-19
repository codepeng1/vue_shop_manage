<template>
  <el-card class="box-card">
    <el-table :data="rightsList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template v-slot="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.level === '1'"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getRightsList } from 'network/home/power.js'

export default {
  name: 'RightsCard',
  data() {
    return {
      // 权限列表
      rightsList: [],
    }
  },
  created() {
    // 请求权限列表数据
    this.getRightsList()
  },
  methods: {
    // 获取权限列表数据
    async getRightsList() {
      const res = await getRightsList('list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.rightsList = res.data
    },
  },
}
</script>

<style lang="less" scoped>
</style>