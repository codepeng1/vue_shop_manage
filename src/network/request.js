import axios from "axios";

export function request(config) {
  // 创建axios实例
  const instance = axios.create({
    // 根路径
    baseURL: 'http://127.0.0.1:8888/api/private/v1',
    timeout: 3000
  })

  // 请求拦截
  instance.interceptors.request.use(res => {
    return res
  }, err => {
    console.log(err);
  })
  // 响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  // 发送真正的网络请求
  return instance(config)
}