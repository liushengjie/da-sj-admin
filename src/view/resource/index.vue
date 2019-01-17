<template>
	<div style="padding: 10px">
		<Row>
			<Col span="4">
			<div style="padding-top: 10px;padding-left:10px;background: #f8f8f9;">
				<category-tree ref="categoryTree"></category-tree>
			</div>
			</Col>
			<Col span="20">
			<Row>
				<Col span="2" class="form-item">资源名称</Col>
				<Col span="5" class="form-input" size="small">
				<Input placeholder="名称"></Input>
				</Col>
				<Col span="2" class="form-item">来源数据源</Col>
				<Col span="5" class="form-input" size="small">
				<Select placeholder="全部">
					<Option value="">全部</Option>
				</Select>
				</Col>
				<Col span="2" class="form-item">连接方式</Col>
				<Col span="5" class="form-input" size="small">
				<Select placeholder="全部">
					<Option value="">全部</Option>
				</Select>
				</Col>
			</Row>
			<Row>
				<Col span="2" class="form-item">状态</Col>
				<Col span="5" class="form-input" size="small">
				<Input placeholder="名称"></Input>
				</Col>
				<Col span="2" class="form-item">时间</Col>
				<Col span="5" class="form-input" size="small">
				<Select placeholder="全部">
					<Option value="">全部</Option>
				</Select>
				</Col>
				<Col span="2" class="form-item">
				<Button type="primary" icon="ios-search" size="small">查询</Button>
				</Col>
				<Col span="2" class="form-item">
				<Button type="dashed" icon="ios-search" size="small" @click="openResModel">新增资源</Button>
				</Col>
			</Row>

			<div style="padding-left: 10px">
				<Divider dashed />
				<Breadcrumb>
					<BreadcrumbItem>
						<Icon type="ios-home-outline"></Icon> 资源库
					</BreadcrumbItem>
					<BreadcrumbItem>
						<Icon type="logo-buffer"></Icon> 默认
					</BreadcrumbItem>
				</Breadcrumb>
				<Table border :columns="columns" :data="res_data" :height="tableHeight"></Table>
				<div style="margin: 10px;overflow: hidden">
					<div style="float: right;padding-right:20px">
						<Page :total="tableDataCount" :current="searchParam.currentPage" :page-size="searchParam.pageSize" @on-change="qryResList"
						 show-total size="small" />
					</div>
				</div>
			</div>
			</Col>
		</Row>
		<res-model ref="resModel" @qryResList="qryResList"></res-model>
	</div>
</template>
<script>
	import * as resApi from '@/api/resource'
	import categoryTree from '@/components/tree/category_tree'
	import resModel from '@/view/resource/components/res_model'
	import vis from 'vis'
	export default {
		components: {
			categoryTree,
			resModel
		},
		data() {
			return {
				tableHeight: document.body.clientHeight - 279,
				columns: [{
						title: '资源名称',
						key: 'name',
						sortable: true
					},
					{
						title: '资源分类',
						key: 'category_name'
					},
					{
						title: '来源数据源',
						key: 'ds_name',
						sortable: true
					},
					{
						title: '连接方式',
						key: 'connect_type_name'
					},
					{
						title: '数据量',
						key: 'num'
					},
					{
						title: '状态',
						key: 'status_name'
					},
					{
						title: '时间',
						key: 'create_time_str'
					},
					{
						title: '操作',
						key: 'address',
						render: (h, params) => {
							return h('a', {
								on: {
									click: () => {
										this.getResDetail(params.row.id)
									}
								}
							}, '编辑')
						}
					}
				],
				res_data: [],
				searchParam: { // 获取资源列表所需参数
					category: '',
					currentPage: 1,
					pageSize: 10
				},
				tableDataCount: 0 // 资源列表总数
			}
		},
		mounted() {
			this.qryResList(1)
		},
		methods: {
			qryResList(pageIndex, category = '') {
				this.searchParam.currentPage = pageIndex
				resApi.queryResListByPage(this.searchParam).then(res => {
					if (res.success) {
						this.res_data = res.data.list
						this.tableDataCount = res.data.total
					}
				})
			},
			openResModel() {
				this.$refs.resModel.res_model = true
				let obj = Object.assign([], this.$refs.categoryTree.category_data)
				this.getCategoryList(obj)
				this.$refs.resModel.categoryList = obj
			},
			getCategoryList(obj) {
				obj.forEach(item => {
					item.value = item.id
					item.label = item.title
					if (item.selected) {
						this.$refs.resModel.curCategory.id = [item.id]
					}
					if (item.children.length) {
						this.getCategoryList(item.children)
					}
				})
			},
			getResDetail(id) {
				resApi.getRes({
					resId: id
				}).then(res => {
					if (res.success) {
						this.$store.state.resource = res.data
						this.$refs.resModel.res_model = true
						this.$refs.resModel.reviewData()
						console.log(this.$store.state.resource)
					}
				})
			}
		}
	}

</script>
<style>
	.form-item {
		line-height: 40px;
		text-align: center;
		font-size: 13px;
	}

	.form-input {
		line-height: 40px;
	}

</style>
