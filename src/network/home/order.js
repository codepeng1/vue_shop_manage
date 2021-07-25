import { request } from "network/request";

// 获取订单列表数据
export function getOrderList(queryInfo) {
  return request({
    url: '/orders',
    params: queryInfo
  })
}

// 查看物流信息
export function checkLogistics(id) {
  return request({
    url: `/kuaidi/${id}`
  })
}