import axios from '@/libs/api.request'

export const previewData = (data, param) => {
	return axios.request({
		url: '/res/previewData',
		params: param,
		data,
		method: 'post'
	})
}

export const queryResListByPage = (param) => {
	return axios.request({
		url: '/res/queryResListByPage',
		params: param,
		method: 'get'
	})
}

export const saveRes = (data) => {
	return axios.request({
		url: '/res/saveRes',
		data,
		method: 'post'
	})
}

export const loadResObj = (param, data) => {
	return axios.request({
		url: '/res/loadResource',
		params: param,
		data,
		method: 'post'
	})
}

export const loadResCols = (data) => {
	return axios.request({
		url: '/res/loadResourceCols',
		data,
		method: 'post'
	})
}

export const getRes = (param) => {
	return axios.request({
		url: '/res/findResBean',
		params: param,
		method: 'get'
	})
}

//查询所有的资源
export const queryResAll = () => {
	return axios.request({
		url: '/res/queryResAll',
		method: 'get'
	})
}
