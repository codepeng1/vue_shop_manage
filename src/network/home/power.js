import { request } from "network/request";

// 获取所有权限列表数据
export function getRightsList(type) {
  return request({
    url: `/rights/${type}`
  })
}

// 获取角色列表数据
export function getRolesList() {
  return request({
    url: '/roles'
  })
}

// 添加新角色
export function addNewRole(role) {
  return request({
    url: '/roles',
    method: 'post',
    data: role
  })
}

// 通过id请求角色数据
export function getRoleById(id) {
  return request({
    url: `/roles/${id}`
  })
}

// 编辑角色信息
export function editRoleInfo(role) {
  const { roleName, roleDesc } = role
  return request({
    url: `/roles/${role.roleId}`,
    method: 'put',
    data: {
      roleName,
      roleDesc
    }
  })
}

// 根据id删除角色
export function removeRoleById(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

// 根据id删除角色对应权限
export function removeRightsById(allId) {
  const { roleId, rightId } = allId
  return request({
    url: `/roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 角色授权
export function allotRights(roleId, rids) {
  return request({
    url: `/roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids
    }
  })
}