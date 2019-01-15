<template>
	<div>
		<Modal v-model="colListShow" title="选择字段" class-name="vertical-center-modal">
			<Table :columns="columns" :data="colList" @on-row-click="getCol"></Table>
		</Modal>
		<Modal v-model="filterModalShow" title="筛选器" width="900" @on-ok="saveFilter" @on-cancel="init">
			<div style="height: 200px;">
				<div class="split-type-list">
					<CellGroup>
						<Cell v-for="filter in filterList" :selected="filter.selected" :data-id="filter.id" :data-name="filter.name"
						 :title="filter.name" :name="filter.id" class="draggable1"></Cell>
					</CellGroup>
				</div>
				<div class="split-type-list dropArea" id="visAera" style="width: 300px">

				</div>
				<div class="split-type-list">
					<dateFilter ref="dateFilter" v-show="curFilterId.includes('filter_date')"></dateFilter>
					<notnullFilter ref="notnullFilter" v-show="curFilterId.includes('filter_notnull')"></notnullFilter>
					<equalsFilter ref="equalsFilter" :previewData="previewData" :curColName="curColName" v-show="curFilterId.includes('filter_content')"></equalsFilter>
				</div>
			</div>
		</Modal>
	</div>
</template>
<script>
	import dateFilter from '@/view/resource/components/filterComponents/dateFilter'
	import notnullFilter from '@/view/resource/components/filterComponents/notnullFilter'
	import equalsFilter from '@/view/resource/components/filterComponents/equalsFilter'
	import vis from 'vis'
	import * as procApi from '@/api/processor'
	import * as dragUtils from '@/libs/dragUtils'
	export default {
		components: {
			dateFilter,
			notnullFilter,
			equalsFilter
		},
		props: ['colList', 'dsType', 'previewData'],
		data() {
			return {
				colListShow: false,
				filterModalShow: false,
				curDescription: '',
				filterList: [],
				columns: [ // 字段表头
					{
						title: '列名',
						key: 'col'
					},
					{
						title: '筛选器数量',
						key: 'filterCount',
						render: (h, params) => {
							let filterCount = 0
							this.$store.state.resource.resFilterList.forEach(filter => {
								if (filter.col === params.row.col) {
									filterCount = filter.proc.length
								}
							})
							return h('span', filterCount)
						}
					}
				],
				curColType: '', // 当前选中的列类型
				curColName: '', // 当前选中的列名
				curFilterList: [], // 使用过的过滤器id列表
				curFilterId: '', // 当前选中的过滤器id
				filterIndex: 0,
				visOptions: { // vis配置项
					manipulation: false,
					physics: {
						enabled: false
					},
					edges: {
						smooth: false
					},
					layout: {
						hierarchical: {
							direction: 'LR',
							blockShifting: true
						}
					},
					interaction: {
						//                        zoomView: false, //关闭缩放
						//                        dragView: false, //关闭拖拽
						//                        dragNodes: false  //关闭元素的拖拽
					}
				},
				visData: { // vis数据项
					nodes: [],
					edges: []
				}
			}
		},
		methods: {
			// 获取列信息并展示对应的筛选器
			getCol(col) {
				this.curColName = col.col.toLowerCase()
				this.curColType = col.type
				this.colListShow = false
				this.showFilterModal()
			},
			// 回显筛选器参数
			initFilterParam(proc) {
				const params = JSON.parse(proc.params)
				if (proc.procId.includes('filter_date')) {
					this.$refs.dateFilter.daterange = [params.begin, params.end]
				}
				if (proc.procId.includes('filter_notnull')) {
					this.$refs.notnullFilter.isNotNull = '1'
				}
				if (proc.procId.includes('filter_content')) {
					this.$refs.equalsFilter.equal = params.equal
					this.$refs.equalsFilter.content = params.content.split(',')
				}
			},
			// 初始化显示之前已连接的筛选器
			initFilterList() {
				let filterColList = []
				this.$store.state.resource.resFilterList.forEach((filter, i) => {
					if (filter.proc.length === 0) {
						this.$store.state.resource.resFilterList.splice(i, 1) // 删除掉之前没有保存的筛选器
						return false
					}
					filterColList.push(filter.col)
					if (filter.col === this.curColName) {
						filter.proc.forEach((proc, index) => {
							let procName = ''
							if (proc.procId.includes('filter_date')) {
								procName = '日期范围'
							} else if (proc.procId.includes('filter_notnull')) {
								procName = '条件非空'
							} else if (proc.procId.includes('filter_content')) {
								procName = '内容等价'
							}
							this.dragEnd(proc.procId, procName)
							this.initFilterParam(proc)
						})
					}
				})
				if (!filterColList.includes(this.curColName)) {
					this.$store.state.resource.resFilterList.push({
						'col': this.curColName,
						'proc': []
					})
				}
			},
			showFilterModal() {
				this.filterModalShow = true
				this.$nextTick(() => {
					let container = document.getElementById('visAera')
					const _this = this
					this.visNetwork = new vis.Network(container, this.visData, this.visOptions)
					this.visNetwork.on('click', function (params) {
						const id = params.nodes[0]
						if (id && _this.curColName !== id) _this.curFilterId = id
					})
					this.visNetwork.on('doubleClick', function (params) {
						console.log(params)
						this.body.data.nodes.remove({
							id: params.nodes[0]
						})
						_this.curFilterId = ''
						_this.curFilterList.forEach((proc, index) => {
							if (proc === params.nodes[0]) {
								_this.curFilterList.splice(index, 1)
							}
						})
					})
					this.visNetwork.body.data.nodes.add({
						id: this.curColName,
						label: this.curColName,
						fixed: {
							x: 100,
							y: 10
						},
						color: {
							background: '#10aba8'
						},
						shape: 'box',
						widthConstraint: 100,
						level: 1
					})
					this.initFilterList()
					const param = {
						ds_type: this.dsType,
						type: 'filter',
						id: '',
						categroy: ''
					}
					procApi.queryProcessor(param).then(res => {
						console.log(res)
						if (res.success) {
							this.filterList = res.data
							this.$nextTick(() => {
								dragUtils.setDragAndDrop(
									'.draggable1',
									'.dropArea',
									'drop-highlight',
									dom => {
										this.dragEnd(dom.data('id'), dom.data('name'))
									})
							})
						}
					})
				})
			},
			dragEnd(filterId, filterName) {
				this.curFilterId = filterId
				if (!this.curFilterList.includes(this.curFilterId)) {
					this.curFilterList.push(this.curFilterId)
					this.visNetwork.body.data.nodes.add({
						id: filterId,
						label: filterName,
						level: 2
					})
					this.visNetwork.body.data.edges.add([{
						id: 'addEdge' + filterId,
						from: this.curColName,
						to: filterId
					}])
				}
			},
			saveFilter() {
				console.log(this.$store.state.resource.resFilterList)
				this.$store.state.resource.resFilterList.forEach(resFilter => {
					resFilter.proc = []
					console.log(this.curFilterList)
					if (resFilter.col === this.curColName) {
						this.curFilterList.forEach((filter, index) => {
							let param = null
							if (filter.includes('filter_date')) {
								param = {
									begin: this.$refs.dateFilter.daterange[0],
									end: this.$refs.dateFilter.daterange[1],
									type: this.curColType
								}
							}
							if (filter.includes('filter_notnull')) {
								if (this.$refs.notnullFilter.isNotNull === '1') {
									param = {
										type: this.curColType
									}
								} else {
									resFilter.proc.forEach((item, i) => {
										if (item.procId === 'filter_notnull') {
											resFilter.proc.splice(i, 1)
										}
									})
								}
							}
							if (filter.includes('filter_content')) {
								param = {
									equal: this.$refs.equalsFilter.equal,
									content: this.$refs.equalsFilter.content.join(),
									type: this.curColType
								}
							}
							if (param) {
								this.addFilter(resFilter, param, filter)
							}
						})
					}
				})
				this.$emit('renderColList')
				this.init()
			},
			addFilter(resFilter, param, filterId) {
				let flag = false
				resFilter.proc.forEach(item => {
					if (item.procId === filterId) {
						flag = true
						item.params = JSON.stringify(param)
					}
				})
				if (!flag) {
					resFilter.proc.push({
						'params': JSON.stringify(param),
						'procId': filterId
					})
				}
			},
			init() {
				this.curFilterId = ''
				this.$refs.equalsFilter.equal = 'yes'
				this.$refs.equalsFilter.content = []
				this.$refs.notnullFilter.isNotNull = '0'
				this.$refs.dateFilter.daterange = []
				this.$refs.dateFilter.date = ''
				this.curFilterList = []
				this.visNetwork.destroy()
			}
		}
	}

</script>
<style>
	.vertical-center-modal {
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.vertical-center-modal .ivu-modal {
		width: 520px;
		max-height: calc(100% - 167px);
		top: 0;
		height: 100%;
	}

	.vertical-center-modal .ivu-modal-body {
		height: calc(100% - 105px);
		overflow: auto;
	}

	.vertical-center-modal .ivu-modal-content {
		height: 100%;
	}

	.vertical-center-modal .ivu-modal-header {}

</style>
