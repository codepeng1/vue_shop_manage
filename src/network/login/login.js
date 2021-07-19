import { request } from "network/request";

// 登录验证
export function getLoginData(userInfo) {
  return request({
    url: '/login',
    method: 'post',
    data: userInfo
  })
}