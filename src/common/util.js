import Vue from "vue"

/**
 * 根据id删除对应的数据
 * @param {*} id id数值或id对象
 * @param {Function} delRequest 删除数据的网络请求
 * @param {Function} updateRequest 更新数据的网络请求
 * @returns 服务器响应的数据
 */
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

/**
 * 时间格式化函数
 * @param {Number} millisecond 需要格式化的毫秒值
 * @param {String} separator 日期分隔符
 * @returns 格式化后的时间字符串
 */
export function dateFormat(millisecond, separator = "/") {
  // 将毫秒值传入构造函数，获得Date对象
  const dt = new Date(millisecond)

  // 年月日
  const dateArr = []
  dateArr.push(dt.getFullYear())
  dateArr.push((dt.getMonth() + 1 + '').padStart(2, '0'))
  dateArr.push((dt.getDate() + '').padStart(2, '0'))

  // 时分秒
  const hour = (dt.getHours() + '').padStart(2, '0')
  const minutes = (dt.getMinutes() + '').padStart(2, '0')
  const second = (dt.getSeconds() + '').padStart(2, '0')

  return dateArr.join(separator) + ` ${hour}:${minutes}:${second}`
}