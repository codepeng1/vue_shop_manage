import { request } from "network/request";

// 获取所有的菜单列表数据
export function getMenuLists() {
  return request({
    url: '/menus'
  })
}