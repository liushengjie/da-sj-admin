import * as dbApi from '@/api/dataSource'
export default {
	state: {
		'resource': {},
		'datasource': {},
	},
	mutations: {
		setResource: (state, res) => {
			state.resource = res
		},
		setDatasource: (state, datasource) => {
			state.datasource = datasource
		},
		setResourceName: (state, name) =>{
			state.resource.resourceBody.name = name
		}
	},
	actions: {

	},
	getters: {
		resCols: (state) => {
			return state.resource.resourceCols
		},
		resName: (state) => {
			return state.resource.hasOwnProperty('resourceBody') && state.resource.resourceBody.name != "" ? state.resource.resourceBody.name : "默认资源名称"
		}
	}
}
