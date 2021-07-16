import { request } from "./request";

export function getLoginData(userInfo) {
  return request({
    url: '/login',
    method: 'post',
    data: userInfo
  })
}