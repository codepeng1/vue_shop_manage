import { request } from "network/request";

// 获取用户列表数据
export function getUserlist(queryInfo) {
  return request({
    url: '/users',
    params: queryInfo
  })
}

// 修改用户状态
export function setUserState(userInfo) {
  return request({
    url: `/users/${userInfo.id}/state/${userInfo.mg_state}`,
    method: 'put'
  })
}

// 添加新用户
export function addNewUser(userInfo) {
  return request({
    url: '/users',
    method: 'post',
    data: userInfo
  })
}

// 根据id获取用户数据
export function getUserById(id) {
  return request({
    url: `/users/${id}`
  })
}

// 编辑用户信息
export function editUserinfo(editInfo) {
  const { id, email, mobile } = editInfo
  return request({
    url: `/users/${id}`,
    method: 'put',
    data: {
      email,
      mobile
    }
  })
}

// 根据id删除对应的单个用户
export function removeUserById(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

// 分配用户新角色
export function AllotNewRole(userId, rid) {
  return request({
    url: `/users/${userId}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}