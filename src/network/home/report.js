import { request } from "network/request";

// 获取折线图数据
export function getChartData() {
  return request({
    url: 'reports/type/1'
  })
}