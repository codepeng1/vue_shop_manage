import { request } from "network/request";

// 获取商品分类列表数据
export function getGoodsCategoryList(queryInfo) {
  return request({
    url: '/categories',
    params: queryInfo
  })
}

// 获取父级分类的数据列表
export function getParentCateList() {
  return request({
    url: '/categories',
    params: {
      type: 2
    }
  })
}

// 添加分类
export function addCategories(cateInfo) {
  return request({
    url: '/categories',
    method: 'post',
    data: cateInfo
  })
}

// 根据id请求分类信息
export function getCategoryById(id) {
  return request({
    url: `/categories/${id}`
  })
}

// 编辑分类
export function editCategory(editInfo) {
  const { id, cat_name } = editInfo
  return request({
    url: `/categories/${id}`,
    method: 'put',
    data: {
      cat_name
    }
  })
}

// 根据id删除分类
export function delCategoryById(id) {
  return request({
    url: `/categories/${id}`,
    method: 'delete'
  })
}