<template>
	<div>
		<Row>
			<Col span="2" class="form-item">源名称</Col>
			<Col span="5" class="form-input">
			<Input placeholder="名称" v-model="searchParam.name"></Input>
			</Col>
			<Col span="2" class="form-item">源类型</Col>
			<Col span="5" class="form-input">
			<Select v-model="searchParam.type" placeholder="全部">
				<Option value="">全部</Option>
				<Option v-for="type in typeList" v-model="type.code">{{type.name}}</Option>
			</Select>
			</Col>
			<Col span="4" class="form-item">
			<Button type="primary" icon="ios-search" @click="getDsList(1)">查询</Button>
			&emsp;
			<Button type="primary" icon="md-add" @click="showNewModel">新建</Button>
			</Col>
		</Row>
		<div style="padding:20px">
			<Table :height="tableHeight" :columns="tableColumns" :data="tableData"></Table>
		</div>
		<div style="margin: 10px;overflow: hidden">
			<div style="float: right;padding-right:20px">
				<Page :total="tableDataCount" :current="searchParam.currentPage" :page-size="searchParam.pageSize" @on-change="changePage"
				 show-total size="small" />
			</div>
		</div>
		<ds-firstmodel ref="dsFirstModel" @NewBuild='NewBuildEmit'></ds-firstmodel>
		<ds-model :dataMode="searchParam.dataMode" ref="dsModel"></ds-model>
		<excel-modal :dataMode="searchParam.dataMode" ref="excelModal"></excel-modal>
	</div>
</template>
<script>
	import * as dbApi from '@/api/dataSource'
	import dsModel from '@/view/dataSource/components/ds_model'
	import dsFirstmodel from '@/view/dataSource/components/dsFirstmodel'
	import excelModal from '@/view/dataSource/components/excel_model'

	export default {
		components: {
			dsModel,
			dsFirstmodel,
			excelModal
		},
		data() {
			return {
				tableHeight: document.body.clientHeight - 205,
				tableColumns: [{
						width: 60,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('icon', {
									props: {
										type: 'logo-buffer',
										color: 'gray'
									}
								})
							])
						}
					},
					{
						title: '源名称',
						key: 'name'
					},
					{
						title: '源类型',
						key: 'typeName'
					},
					{
						title: 'IP地址',
						key: 'ip'
					},
					{
						title: '数据库名称',
						key: 'database',
						render: (h, params) => {
							if (params.row.type === '3') {
								return h('div')
							} else {
								return h('div', params.row.database)
							}
						}
					},
					{
						title: '端口号',
						key: 'port'
					},
					{
						title: '用户名',
						key: 'username',
						render: (h, params) => {
							if (params.row.type === '3') {
								return h('div')
							} else {
								return h('div', params.row.username)
							}
						}
					},
					{
						title: '创建时间',
						key: 'createTime'
					},
					{
						title: '操作',
						key: 'op',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'primary',
										size: 'small',
										icon: 'ios-create-outline'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.showEditModel(params.row)
										}
									}
								}),
								h('Button', {
									props: {
										type: 'primary',
										size: 'small',
										icon: 'ios-trash-outline'
									},
									on: {
										click: () => {
											this.deleteDs(params)
										}
									}
								})
							])
						}
					}
				],
				tableData: [],
				tableDataCount: 0,
				searchParam: {
					name: '',
					type: '',
					dataMode: '0',
					currentPage: 1,
					pageSize: 10
				},
				typeList: [],
				buildType: {} // 返回的新建类型
			}
		},
		mounted() {
			this.getDsList(1)
			this.getDsType()
		},
		watch: {
			buildType(v1) {
				const _this = this
				this.$refs.dsModel.modalTitle = v1.name
				this.$refs.dsModel.modalShow = true
			}
		},
		methods: {
			// 获取列表数据
			getDsList(pageIndex) {
				const _this = this
				_this.searchParam.currentPage = pageIndex
				dbApi.getDsList(_this.searchParam).then(res => {
					if (res.success) {
						//					res.data.list.forEach(t =>{
						//						if(t.type == '3') {
						//							t.database = ''
						//							t.username = ''
						//						}
						//					})
						_this.tableData = res.data.list
						_this.tableDataCount = res.data.total
					}
				})
			},
			getDsType() {
				const _this = this
				dbApi.getDsType().then(res => {
					if (res.success) {
						_this.typeList = res.data
					}
				})
			},
			// 翻页
			changePage(curPage) {
				this.getDsList(curPage)
			},
			// 弹出新建弹窗
			showNewModel() {
				this.$refs.dsFirstModel.modelTitle = '新增'
				this.$refs.dsFirstModel.modelShow = true
			},
			NewBuildEmit: function (arr) {
				if (arr.name === '新建Excel') {
					this.$refs.excelModal.modalShow = true
					return
				}
				this.buildType = arr
			},
			// 删除数据源
			deleteDs(param) {
				this.$Modal.confirm({
					title: '请求确认',
					content: '是否确定删除该条数据',
					onOk: () => {
						dbApi
							.deleteDs({
								id: param.row.id
							})
							.then(res => {
								if (res.success) {
									this.tableData.splice(param.index, 1)
									this.$Message.success('删除成功')
								}
							})
					}
				})
			},
			showEditModel(data) {
				let ref = 'dsModel'
				console.log(data)
				if (data.typeName === 'EXCEL') {
					ref = 'excelModal'
				}
				this.$refs[ref].dsParam = Object.assign({}, data)
				this.$refs[ref].modalEdit = true
				this.$refs[ref].modalTitle = '编辑'
				this.$refs[ref].modalShow = true
			}
		}
	}

</script>
<style scoped>

</style>
