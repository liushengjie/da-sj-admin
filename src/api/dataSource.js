import axios from '@/libs/api.request'

export const getDsList = (param) => {
  return axios.request({
    url: 'dataSource/selectDsByPage',
    params: param,
    method: 'get'
  })
}

export const getDsType = () => {
  return axios.request({
    url: 'sysCode/selectDsType',
    method: 'get'
  })
}

export const insertDs = (data) => {
  return axios.request({
    url: 'dataSource/insertDs',
    data,
    method: 'post'
  })
}

export const updateDs = (data) => {
  return axios.request({
    url: 'dataSource/updateDs',
    data,
    method: 'post'
  })
}

export const deleteDs = (param) => {
  return axios.request({
    url: 'dataSource/deleteDs',
    params: param,
    method: 'get'
  })
}

export const testConn = (data) => {
  return axios.request({
    url: 'dataSource/connectDs',
    data,
    method: 'post'
  })
}

export const getTables = (param) => {
  return axios.request({
    url: 'dataSource/findTables',
    params: param,
    method: 'get'
  })
}

export const getTableColumns = (param) => {
  return axios.request({
    url: 'dataSource/findColsByTable',
    params: param,
    method: 'get'
  })
}

export const updateAlias = (data) => {
  return axios.request({
    url: '/dataSource/updateAlias',
    data,
    method: 'post'
  })
}

export const addAlias = (data) => {
  return axios.request({
    url: '/dataSource/addAlias',
    data,
    method: 'post'
  })
}

export const findColsBySQL = (data) => {
  return axios.request({
    url: '/dataSource/findColsBySQL',
    data,
    method: 'post'
  })
}

export const previewDataDetailed = (param) => {
  return axios.request({
    url: '/dataSource/preloadData',
    params: param,
    method: 'get'
  })
}

export const preloadSQLData = (data) => {
  return axios.request({
    url: '/dataSource/preloadSQLData',
    data,
    method: 'post'
  })
}

export const findCountByTable = (param) => {
  return axios.request({
    url: '/dataSource/findCountByTable',
    params: param,
    method: 'get'
  })
}

export const preloadExcel = (data) => {
  return axios.request({
    url: '/dataSource/preloadExcel',
    params: data,
    method: 'post'
  })
}
