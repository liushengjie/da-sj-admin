import * as dbApi from '@/api/dataSource'
export default {
	state: {
		'resource': {
			'resourceBody': {
				'name': '默认资源名称'
			}
		},
		'datasource': {},
	},
	mutations: {
		setResource: (state, res) => {
			state.resource = res
		},
		setDatasource: (state, datasource) => {
			state.datasource = datasource
		},
		setResourceName: (state, name) => {
			state.resource.resourceBody.name = name
		},
		setResourceCategory: (state, name) => {
			state.resource.resourceBody.category = name
		},
		setResourceCol:(state, col) => {
			state.resource.resourceCols.push(col)
		}
	},
	actions: {
		initRes: (context) => {
			var res = {
				'resourceBody': {
					'name': '默认资源名称'
				}
			}
			context.commit('setResource', res)
		},
		assignResObj: (context, res) => {
			res.resourceBody.name = context.state.resource.resourceBody.name
			res.resourceBody.category = context.state.resource.resourceBody.category
			context.commit('setResource', res)
		},

	},
	getters: {
		resCols: (state) => {
			return state.resource.resourceCols
		},
		res_name: (state) => {
			return state.resource.resourceBody.name
		},
		res_category: (state) =>{
			return state.resource.resourceBody.category
		},
		datasource_id: (state) => {
			return state.datasource.id
		}
	}
}
