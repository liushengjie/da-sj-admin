<template>
	<Modal class="full-model res-modal" v-model="res_model" fullscreen :z-index="900" :mask="false" @on-cancel="closeModal"
	 @on-ok="save" :loading="modalLoading">
		<p slot="header">
			<Icon type="ios-information-circle"></Icon>
			<Input class="model-title-input" size="large" v-model="res_name" />
			<Cascader class="category" placeholder="资源类别" size="small" style="display: inline-block" :data="categoryList"
		    @on-change="changeCategory"></Cascader>
		</p>
		<div class="split">
			<Split v-model="split1" min="50px" max="100px">
				<div slot="left" class="split-pane">
					<Row>
						<font size="3.5">数据源</font>
					</Row>
					<Row>
						<Col span="24" class="form-input" size="small">
						<Select placeholder="请选择数据源" @on-change="getTableList">
							<Option v-for="item in dsList" :value="JSON.stringify(item)" :label="item.name">
								<span>{{item.name}}</span>
								<br>
								<span>{{item.ip}}</span>
							</Option>
						</Select>
						</Col>
					</Row>
					<Divider dashed class="divider" />
					<Row class="result-row">
						<Spin size="large" fix v-if="tableloadingShow"></Spin>
						<Col span="24" class="form-input" size="small">
						<Input suffix="ios-search" placeholder="请输入表名称" size="small" />
						</Col>
						<Col span="24" class="form-input table-list ele-scroll" size="small">
						<CellGroup>
							<Cell v-for="item in tables_data" :data-table="JSON.stringify(item)" :title="item.alias || item.tableName"
							 :label="item.tableName" class="draggable">
								<Icon type="md-grid" slot="icon" />
							</Cell>
						</CellGroup>
						</Col>
					</Row>
				</div>
				<div slot="right" style="height:100%;">
					<Split v-model="split2" min="50px" max="100px">
						<div slot="left" class="split-pane" style="height: 100%;">
							<div class="drop-area">
								<font size="3.5" style="padding-left:5px">数据表</font>
								<div class="dropDiv">
									<div class="center-font">
										<font size="3" style="font-style:oblique;color:#e98263">将表拖到此处</font>
									</div>
								</div>
								<div class="drop-area-edit">
									<RadioGroup v-model="connectType">
										<Radio label="0">实时</Radio>
										<Radio label="1">数据提取</Radio>
									</RadioGroup>
									<a href="javascript:void(0)" v-show="connectType==1" @click="openConnectSetting">编辑</a>
								</div>
							</div>
							<colList ref="colList"></colList>
						</div>
						<div slot="right" class="split-pane">
							<Row>
								<Col span="12" size="small">
								<font size="3.5" style="padding-left:5px">数据预览</font>
								</Col>
								<Col span="12" size="small" style="text-align: right">
								<Input v-model="showLines" suffix="ios-search" style="width: 140px" size="small" />行
								</Col>
							</Row>
							<Row style="padding-top:5px">
								<Spin size="large" fix v-if="dataloadingShow"></Spin>
								<Table class="ele-scroll preview-table" :columns="previewCols" :data="previewData" :height="tableHeight"></Table>
							</Row>
						</div>
					</Split>
				</div>
			</Split>
		</div>
		<Modal title="重命名" v-model="colRenameModal" on-ok="rename">
			<Input v-model="renameTitle"></Input>
		</Modal>
		<connect-setting ref="connectSetting"></connect-setting>
	</Modal>
</template>
<script>
	import * as dragUtils from '@/libs/dragUtils'
	import * as dbApi from '@/api/dataSource'
	import * as resApi from '@/api/resource'
	import connectSetting from '@/view/resource/components/modals/connSetting'
	import colList from '@/view/resource/components/col/col_list'
	import deleteIcon from '@/assets/images/u4511.png'
	export default {
		components: {
			connectSetting,
			colList
		},
		data() {
			return {
				curCategory: {
					id: [],
					name: []
				},
				showLines: 50,
				split1: 0.15,
				split2: 0.2,
				categoryList: [], //资源类别
				renameTitle: '',
				curEditColIndex: 0,
				resource: {}, //// 资源对象
				connectType: '0', //// 连接方式
				tableloadingShow: false, //左侧tablelist loading
				dataloadingShow: false, //右侧数据预览 loading
				modalLoading: true,
				datasourceId: '', //当前数据源id
				dsList: [], //数据源列表
				tables_data: [], //数据表列表
				tableHeight: document.body.clientHeight - 189,
				res_model: false,
				colRenameModal: false,
				previewCols: [],
				previewData: [],
				colTypeIcon: {
					date: require('@/assets/images/col-type/date.png'),
					varchar: require('@/assets/images/col-type/varchar.png'),
					datetime: require('@/assets/images/col-type/datetime.png'),
					float: require('@/assets/images/col-type/float.png'),
					int: require('@/assets/images/col-type/int.png'),
					index: require('@/assets/images/col-type/index.png'),
					pk: require('@/assets/images/col-type/pk.png')
				},
			}
		},
		mounted() {
			this.getDsList()
		},
		methods: {
			getDsList() {
				let searchParam = {
					currentPage: 1,
					pageSize: 100
				}
				dbApi.getDsList(searchParam).then(res => {
					if (res.success) {
						this.dsList = res.data.list
					}
				})
			},
			getTableList(data) {
				this.$store.commit('setDatasource', JSON.parse(data))
				this.tableloadingShow = true
				dbApi.getTables({
					dataSource: this.datasource_id
				}).then(res => {
					this.tableloadingShow = false
					if (res.success) {
						this.tables_data = res.data
						this.$nextTick(() => {
							dragUtils.setDragAndDrop(
								'.draggable',
								'.dropDiv',
								'drop-highlight',
								dom => {
									this.renderDropDiv(dom.find('.ivu-cell-title').text())
									this.getResourceObj(this.datasource_id, dom.data('table'))
								}
							)
						})
					}
				})
			},
			getResourceObj(datasourceId, table) {
				resApi.loadResObj({
					'datasourceId': this.datasource_id
				}, table).then(res => {
					if (res.success) {
						this.resource = res.data
						this.$store.dispatch('assignResObj', this.resource)
					} else {
						this.$Message.error({
							content: '获取资源对象失败',
							duration: 3
						})
					}
				})
			},
			// 渲染拖放区域页面
			renderDropDiv(tableAlias) {
				const _this = this
				const html = '<div class="drop-item">' +
					tableAlias +
					' <img class="del-icon" width="15" src="' + deleteIcon + '">' +
					'</div>'
				$('.dropDiv').html(html).removeClass('drop-highlight')
				$('.del-icon').unbind().click(() => {
					//_this.initData()
				})
			},
			// 获取预览数据内容
			getPreviewData(previewCols) {
				this.previewData = []
				this.previewCols = []
				previewCols.forEach(item => {
					if (item.status === '1') {
						this.previewCols.push({
							title: item.alias || item.col,
							key: item.col.toLowerCase(),
							tooltip: true,
							minWidth: 100,
							renderHeader: (h, params) => {
								return h('div', [
									h('img', {
										attrs: {
											src: item.changeType ? this.colTypeIcon[item.changeType] : this.colTypeIcon['varchar']
										},
										style: {
											width: '14px'
										},
										class: 'col-type-icon'
									}),
									h('div', item.alias || item.col)
								])
							}
						})
					}
				})


				this.dataloadingShow = true
				resApi.previewData(this.$store.state.resource.resource, {
					'limit': 50
				}).then(res => {
					this.previewData = res.data
					this.dataloadingShow = false
				}).catch(e => {
					this.dataloadingShow = false
				})
			},
			rename() {
				//this.$store.commit('setResourceName',this.renameTitle)
			},
			// 回显数据
			reviewData() {
				// this.getTableList(this.$store.state.resource.resData.dsId)
				// $('.category').find('input').val(this.$store.state.resource.res.categoryName)
				// if (this.$store.state.resource.resData.diy === '1') {
				// 	this.renderDropDiv('新自定义SQL')
				// } else {
				// 	this.renderDropDiv(this.$store.state.resource.resData.alias || this.$store.state.resource.resData.tableName)
				// }
			},
			// 关闭窗口并初始化数据
			closeModal() {
				setTimeout(() => {
					this.tables_data = []
					this.showLines = 50
					this.curCategory = {
						id: [],
						name: []
					}
					$('.category').find('input').val('')
					$('.dropDiv').empty()
				}, 10)
			},
			getParent(array, childIds, childNames, selectedId) {
				for (let i = 0; i < array.length; i++) {
					let item = array[i]
					if (Number(item.id) === Number(selectedId)) {
						childIds.push(item.id)
						childNames.push(item.title)
						return {
							id: childIds,
							name: childNames
						}
					}
					if (item.children && item.children.length > 0) {
						childIds.push(item.id)
						childNames.push(item.title)
						let rs = this.getParent(item.children, childIds, childNames, selectedId)
						if (rs) {
							return rs
						} else {
							childIds.remove(item.id)
							childNames.remove(item.title)
						}
					}
				}
			},
			changeCategory(val, selectData) {
				this.$store.commit('setResourceCategory', val[val.length - 1])
			},
			openConnectSetting() {
				this.$refs.connectSetting.modalShow = true
			},
			save() {
				if (!this.$store.state.resource.res.category) {
					this.modalLoading = false
					this.$Message.warning('请选择资源类别')
					this.$nextTick(() => {
						this.modalLoading = true
					})
					return false
				}
				resApi.saveRes(this.$store.state.resource).then(res => {
					if (res.success) {
						this.res_model = false
						this.$Message.success('保存成功')
						this.closeModal()
						this.$emit('qryResList', 1)
					} else {
						this.modalLoading = false
						this.$nextTick(() => {
							this.modalLoading = true
						})
					}
				})
			}
		},
		computed: {
			res_name: {
				get() {
					return this.$store.getters.res_name
				},
				set(value) {
					this.$store.commit('setResourceName', value)
				}
			},
			res_category: {
				get() {
					return this.$store.getters.res_category
				},
				set(value) {
					this.$store.commit('setResourceCategory', value)
				}
			},
			datasource_id(){
				return this.$store.getters.datasource_id
			},
			resourceCols_watch(){
				return this.$store.state.resource.resource.resourceCols
			}
		},

		watch: {
			categoryList: function () {
				setTimeout(() => {
					this.curCategory = this.getParent(this.categoryList, [], [], this.curCategory.id[0]) || {
						id: [],
						name: []
					}
					if (this.curCategory.id.length) {
						this.$store.state.resource.res.category = this.curCategory.id[this.curCategory.id.length - 1]
					}
				}, 100)
			},
			resourceCols_watch: function(n, o) {
				console.log(n)
				this.getPreviewData(n)
			}
		}
	}

</script>
<style>
	.split {
		height: 100%;
		border: 1px solid #dcdee2;
	}

	.split-pane {
		padding: 10px;
		height: 100%;
	}

	.dropDiv.drop-highlight {
		border: 3px solid #e98263;
	}

	.drop-area {
		height: 20%;
		position: relative;
	}

	.drop-area-edit {
		position: absolute;
		top: 0;
		right: 0;
	}

	.dropDiv {
		height: 85%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.drop-item {
		line-height: 30px;
		border: 1px solid #c3c3c3;
		padding: 0 10px;
		display: inline-block;
		position: relative;
	}

	.drop-item>.del-icon {
		position: absolute;
		top: -4px;
		right: -8px;
		display: none;
		cursor: pointer;
	}

	.drop-item:hover>.del-icon {
		display: block;
	}

	.center-area,
	.right-area {
		width: 50%;
		height: 100%;
		float: left;
	}

	.op-area {
		height: 80%;
		border-top: 1px dashed #c3c3c3;
	}

	.divider {
		margin: 10px 0 0;
	}

	.table-list {
		height: calc(100% - 108px);
		overflow-y: auto;
		overflow-x: hidden;
	}

	.result-row {
		#height: calc(100% - 58px);
		height: 100%;
	}

	.col-row {
		height: calc(100% - 15px);
		overflow: auto;
	}

	.modal-title {
		height: 32px;
		line-height: 32px;
		font-size: 20px;
		border-color: transparent;
	}

	.modal-title:hover {
		border: 1px solid #333;
	}

	.ivu-modal-header {
		padding: 12px 16px;
	}

	.ivu-dropdown-transfer {
		z-index: 9999999;
	}

	textarea.ivu-input {
		resize: none;
	}

	.ivu-dropdown-transfer {
		overflow: visible;
	}

	.col-type-icon {
		vertical-align: middle;
		margin-top: 3px;
		width: 14px;
		margin-right: 3px;
	}

	.col-list {
		padding-left: 5px;
	}

	.col-list .ivu-cell-icon {
		width: 65px;
	}

	.res-modal .ivu-modal-header {
		padding: 2px 16px;
	}

	.res-modal .ivu-modal-header p,
	.model-title-input input {
		height: 40px;
		line-height: 40px;
		overflow: visible;
		font-size: 20px;
	}

	.res-modal .ivu-cascader {
		display: inline-block;
		margin-left: 10px;
	}

	.model-title-input {
		width: 150px;
	}

	.model-title-input input {
		border-width: 0;
	}

	.model-title-input input:hover,
	.model-title-input input:focus {
		border-width: 1px;
	}

	.ivu-select-dropdown {
		max-height: 445px;
	}

</style>
