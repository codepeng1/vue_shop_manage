import Vue from "vue"

// 根据id删除对应的数据
export async function removeDataById(id, delRequest, updateRequest) {
  // 弹框询问用户是否确认删除数据
  const confirmRes = await Vue.prototype.$confirm(
    `此操作将永久删除该项, 是否继续?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).catch((err) => err)

  // 确认返回confirm, 取消返回cancel
  if (confirmRes === 'confirm') {
    // 发送删除数据的请求
    const res = await delRequest(id)
    if (res.meta.status !== 200)
      return Vue.prototype.$message.error('删除失败！')
    // 如果有重新请求数据函数就执行
    updateRequest && updateRequest()
    Vue.prototype.$message({
      type: 'success',
      message: '删除成功！!',
      duration: 1500,
    })
    // 将服务器的响应数据返回
    return res.data
  } else {
    Vue.prototype.$message({
      type: 'info',
      message: '已取消删除',
      duration: 1500,
    })
  }
}