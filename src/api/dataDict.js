import axios from '@/libs/api.request'

export const getTypeList = (param) => {
  return axios.request({
    url: 'resDict/queryResDictType',
    params: param,
    method: 'get'
  })
}
export const delType = (param) => {
  return axios.request({
    url: 'resDict/delResDictType',
    params: param,
    method: 'get'
  })
}

export const insertType = (data) => {
  return axios.request({
    url: 'resDict/addResDictType',
    data,
    method: 'post'
  })
}
export const updateType = (data) => {
  return axios.request({
    url: 'resDict/updateResDictType',
    data,
    method: 'post'
  })
}

export const getTypeResList = (param) => {
  return axios.request({
    url: 'resDict/queryResDict',
    params: param,
    method: 'get'
  })
}
export const insertRes = (data) => {
  return axios.request({
    url: 'resDict/addResDict',
    data,
    method: 'post'
  })
}
export const updateRes = (data) => {
  return axios.request({
    url: 'resDict/updateResDict',
    data,
    method: 'post'
  })
}
export const delRes = (param) => {
  return axios.request({
    url: 'resDict/delResDict',
    params: param,
    method: 'get'
  })
}
export const uploadExcel = (data) => {
  return axios.request({
    url: 'resDict/uploadExcel',
    data,
    method: 'post'
  })
}
