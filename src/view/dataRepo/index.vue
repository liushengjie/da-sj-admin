<template>
	<div>
		<Row>
			<Col span="4" style="padding-top: 10px;padding-left:10px;background: #f8f8f9">
			<Card title="源" icon="logo-buffer" :padding="0" shadow style="height: 90%;">
				<CellGroup @on-click="callClick" :style="{height:listHeight+'px'}" style="overflow: auto" class="ele-scroll">
					<Cell v-for="item in dsList" :name="item.id" :title="item.name" :extra="item.typeName" :label="item.ip">
						<Icon type="logo-buffer" slot="icon" />
					</Cell>
				</CellGroup>
			</Card>
			</Col>
			<Col span="20">
			<div style="padding: 10px">
				<Table highlight-row border :columns="columns" :data="tables_data" :height="tableHeight" :loading="loading">
				</Table>
			</div>
			</Col>
		</Row>
		<tableDetail ref="tableDetail"></tableDetail>
		<preview ref="preview" :tableColumns="previewData" @dataNumber='dataNumber'></preview>
	</div>
</template>
<script>
	import * as dbApi from '@/api/dataSource'
	import tableDetail from '@/view/dataRepo/components/tableDetail'
	import preview from '@/components/table/commonTable'
	export default {
		components: {
			tableDetail,
			preview
		},
		data() {
			return {
				dsList: [],
				tableHeight: document.body.clientHeight - 84,
				listHeight: document.body.clientHeight - 135,
				columns: [{
						title: '数据表',
						key: 'tableName',
						render: (h, params) => {
							return h('div', [
								h('Icon', {
									props: {
										type: 'md-grid'
									},
									style: {
										marginRight: '5px'
									}
								}),
								h('strong', params.row.tableName)
							])
						},
						sortable: true
					},
					{
						title: '数据表别名',
						key: 'age',
						className: 'edit-col',
						render: (h, params) => {
							if (this.curLineIndex === 'alias' + params.index) {
								return h('Input', {
									props: {
										placeholder: '输入数据表别名',
										size: 'small',
										value: params.row.alias,
										autofocus: true
									},

									domProps: {
										ref: 'alias' + params.index
									},
									on: {
										'on-blur': event => {
											this.tables_data[params.index].alias =
												event.target.value
											this.curLineIndex = -1
											this.updateTable(
												this.tables_data[params.index],
												'1'
											)
										},
										'on-keyup': event => {
											if (event.code == 'Enter') {
												this.tables_data[
														params.index
													].alias =
													event.target.value
												this.curLineIndex = -1
											}
										}
									}
								})
							} else {
								return h(
									'div', {
										style: {
											width: '100%',
											height: '100%',
											display: 'flex',
											'align-items': 'center'
										},
										on: {
											dblclick: () => {
												this.curLineIndex =
													'alias' + params.index
												setTimeout(() => {
													this.$refs[
														'alias' + params.index
													].focus()
												}, 1000)
											}
										}
									},
									params.row.alias
								)
							}
						}
					},
					{
						title: '数据量',
						key: 'tableRows',
						sortable: true
					},
					{
						title: '最后更新时间',
						key: 'updateTime',
						sortable: true
					},
					{
						title: '备注',
						key: 'tableComment',
						className: 'edit-col',
						render: (h, params) => {
							if (this.curLineIndex === 'remark' + params.index) {
								return h('Input', {
									props: {
										placeholder: '输入备注',
										size: 'small',
										value: params.row.remark ||
											params.row.tableComment
									},
									on: {
										'on-blur': event => {
											this.tables_data[params.index].remark =
												event.target.value
											this.curLineIndex = -1
											this.updateTable(
												this.tables_data[params.index],
												'1'
											)
										},
										'on-keyup': event => {
											if (event.code == 'Enter') {
												this.tables_data[
														params.index
													].remark =
													event.target.value
												this.curLineIndex = -1
											}
										}
									}
								})
							} else {
								return h(
									'div', {
										style: {
											width: '100%',
											height: '100%',
											display: 'flex',
											'align-items': 'center'
										},
										on: {
											dblclick: () => {
												this.curLineIndex =
													'remark' + params.index
											}
										}
									},
									params.row.remark || params.row.tableComment
								)
							}
						}
					},
					{
						title: '操作',
						key: 'action',
						width: 150,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('icon', {
									props: {
										type: 'ios-browsers',
										size: '20',
										color: 'gray'
									},
									attrs: {
										title: '表详情'
									},
									style: {
										marginRight: '5px',
										cursor: 'pointer'
									},
									on: {
										click: () => {
											this.$refs.tableDetail.getTableData(
												this.curDsId,
												params.row
											)
										}
									}
								}),
								h('icon', {
									props: {
										type: 'md-eye',
										size: '20',
										color: 'gray'
									},
									attrs: {
										title: '数据预览'
									},
									style: {
										marginRight: '5px',
										cursor: 'pointer'
									},
									on: {
										click: e => {
											this.variableParams = params.row.tableName
											this.openPreview(params.row.tableName)
										}
									}
								}),
								h('icon', {
									props: {
										type: 'md-refresh',
										size: '20',
										color: 'gray'
									},
									attrs: {
										title: '刷新数据量'
									},
									style: {
										marginRight: '5px',
										cursor: 'pointer'
									},
									on: {
										click: () => {
											this.refreshCount(params.row.tableName, params.index)
										}
									}
								})
							])
						}
					}
				],
				tables_data: [],
				loading: false,
				curDsId: 0, // 当前选择的数据源id
				curLineIndex: -1, // 当前table编辑行index
				previewData: {},
				dataListNumber: '50', // 组件返回的查询数据条数
				variableParams: '' // 点击事件返回的当前表名
			}
		},
		mounted() {
			this.getDsList(1)
		},
		watch: {
			dataListNumber(v1) {
				const _this = this
				_this.openPreview(_this.variableParams)
			}
		},
		methods: {
			getDsList(pageIndex) {
				var searchParam = {
					dataMode: 0,
					currentPage: 1,
					pageSize: 100
				}
				dbApi.getDsList(searchParam).then(res => {
					if (res.success) {
						this.dsList = res.data.list
					}
				})
			},
			callClick(name) {
				this.loading = true
				this.curLineIndex = -1
				this.curDsId = name
				dbApi
					.getTables({
						dataSource: name
					})
					.then(res => {
						if (res.success) {
							this.tables_data = res.data
							this.loading = false
						}
					})
			},
			updateTable(data, type) {
				let param = {
					type: type,
					datasource: this.curDsId,
					tablename: data.tableName,
					alias: data.alias || '',
					remark: data.remark || ''
				}
				let api = 'addAlias'
				if (data.aliasId) {
					param.id = data.aliasId
					api = 'updateAlias'
				}
				dbApi[api](param).then(res => {
					if (res.success) {
						this.$Message.success('修改成功')
					}
					this.callClick(this.curDsId)
				})
			},
			openPreview(tableName) {
				const _this = this

				//			this.loading = true;
				const param = {
					dataSource: this.curDsId,
					tableName: tableName
				}

				var tableCol = [] // 表头数据
				var tableData = [] // 列表数据
				dbApi.getTableColumns(param).then(res => {
					if (res.success) {
						res.data.forEach(d => {
							var col = {}
							col.title = d.alias || d.col
							col.key = d.col.toLowerCase()
							col.minWidth = 100
							col.tooltip = true
							tableCol.push(col)
						})

						this.$refs.preview.tableColumns.tableCol = tableCol
						console.log(tableCol)

						const paramDetailed = {
							dataSource: this.curDsId,
							tableName: tableName,
							limit: _this.dataListNumber
						}

						dbApi
							.previewDataDetailed(paramDetailed)
							.then(resDetailed => {
								// 获取列表详细数据
								if (resDetailed.success) {
									this.$refs.preview.tableColumns.tableData = resDetailed.data
									this.$refs.preview.modelShow = true
								}
								this.loading = false
							})
					} else {
						this.loading = false
					}
				})
			},
			refreshCount(tableName, index) {
				dbApi.findCountByTable({
					dataSource: this.curDsId,
					tableName: tableName
				}).then(res => {
					if (res.success) {
						this.tables_data[index].tableRows = res.data
					}
				})
			},
			dataNumber: function (data) {
				const _this = this
				_this.dataListNumber = data
			}
		}
	}

</script>
<style>
	.edit-col .ivu-table-cell {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}

</style>
