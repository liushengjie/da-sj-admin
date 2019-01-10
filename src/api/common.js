import axios from '@/libs/api.request'
// 分类管理(资源类型数据对接)
export const getTree = (param) => {
  return axios.request({
    url: 'category/selectCategoryTree?type=' + param,
    method: 'get'
  })
}

export const updateCategory = (data) => {
  return axios.request({
    url: 'category/updateCategory',
    data,
    method: 'post'
  })
}

export const addCategory = (data) => {
  return axios.request({
    url: 'category/addCategory',
    data,
    method: 'post'
  })
}

export const delCategory = (param) => {
  return axios.request({
    url: 'category/delCategory?id=' + param,
    method: 'get'
  })
}
