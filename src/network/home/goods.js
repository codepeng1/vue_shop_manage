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

// 获取分类参数列表
export function getCateParams(id, sel) {
  return request({
    url: `/categories/${id}/attributes`,
    params: {
      sel
    }
  })
}

// 添加参数
export function addParams(id, attrName, attrSel) {
  return request({
    url: `/categories/${id}/attributes`,
    method: 'post',
    data: {
      attr_name: attrName,
      attr_sel: attrSel
    }
  })
}

// 编辑参数
export function editParams(id, attrId, attrName, attrSel, attrVals) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    method: 'put',
    data: {
      attr_name: attrName,
      attr_sel: attrSel,
      attr_vals: attrVals
    }
  })
}

// 删除参数
export function delParams(ids) {
  const { cat_id, attrid } = ids
  return request({
    url: `/categories/${cat_id}/attributes/${attrid}`,
    method: 'delete'
  })
}

// 获取商品列表数据
export function getGoodsList(queryInfo) {
  return request({
    url: '/goods',
    params: queryInfo
  })
}

// 删除商品
export function delGoods(id) {
  return request({
    url: `/goods/${id}`,
    method: 'delete'
  })
}

// 添加商品
export function addGoods(goodsInfo) {
  return request({
    url: '/goods',
    method: 'post',
    data: goodsInfo
  })
}

// 通过id查询商品信息
export function getGoodsInfoById(id) {
  return request({
    url: `/goods/${id}`
  })
}

// 编辑商品
export function editGoods(goodsInfo) {
  const { goods_id } = goodsInfo
  delete goodsInfo.goods_id
  return request({
    url: `/goods/${goods_id}`,
    method: 'put',
    data: goodsInfo
  })
}