import axios from '@/libs/api.request'

export const getResTree = (param) => {
    return axios.request({
        url: '/category/selectCategoryTreeWithRes',
        params: param,
        method: 'get'
    })
}

export const getColByRes = (data, param) => {
    return axios.request({
        url: '/srv/findCols',
        params: param,
        data,
        method: 'post'
    })
}

export const buildSQL = (data, param) => {
    return axios.request({
        url: '/srv/buildSQL',
        params: param,
        data,
        method: 'post'
    })
}

//预览
export const previewData = (data, param) => {
    return axios.request({
        url: '/srv/previewData',
        params: param,
        data,
        method: 'post'
    })
}

export const debugLog = (data, param) => {
    return axios.request({
        url: '/srv/previewDebug',
        params: param,
        data,
        method: 'post'
    })
}

//保存
export const generateQrySql = (data, param) => {
    return axios.request({
        url: '/srv/generateQrySql',
        params: param,
        data,
        method: 'post'
    })
}