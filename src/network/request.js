import axios from "axios";
// 导入nProgress顶部进度条
import nProgress from "nprogress";

export function request(config) {
  // 创建axios实例
  const instance = axios.create({
    // 根路径
    baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 3000
  })

  // 请求拦截
  instance.interceptors.request.use(res => {
    // 展示进度条
    nProgress.start()
    // 为请求头对象，添加token验证的Authorization字段，保证拥有获取数据的权限
    res.headers.Authorization = window.sessionStorage.getItem('token')
    return res
  }, err => {
    console.log(err);
  })
  // 响应拦截
  instance.interceptors.response.use(res => {
    // 隐藏进度条
    nProgress.done()
    return res.data
  }, err => {
    console.log(err);
  })

  // 发送真正的网络请求
  return instance(config)
}