<template>
	<Modal :loading="true" :title="modalTitle+'Excel'" v-model="modalShow" fullscreen @on-ok="submitForm">
		<Form :model="dsParam" :labelWidth="90" ref="dataForm">
			<FormItem label="源名称" prop="name">
				<Input placeholder="连接名称" v-model="dsParam.name"></Input>
			</FormItem>
			<FormItem label="Excel地址">
				<Upload ref="uploadVm" :data="dsParam" :before-upload="handleUpload" :on-success="uploadSuccess" :on-error="uploadError"
				 :default-file-list="defaultList" :action="uploadAction" type="drag">
					<Button icon="ios-cloud-upload-outline">点击上传文件或将文件拖拽至此处</Button>
				</Upload>
			</FormItem>
			<FormItem label="表头设置" prop="driver">
				<RadioGroup v-model="dsParam.driver" @on-change="changeDriver">
					<Radio label="first">把第一行作为表头</Radio>
					<Radio label="auto">自动生成表头</Radio>
				</RadioGroup>
			</FormItem>
		</Form>
		<Table :columns="columns" :data="tableData" :height="tableHeight"></Table>
		<RadioGroup type="button" size="large" v-show="tableTotalDatas.length" v-model="curSheet">
			<Radio :label="index" v-for="(item,index) in tableTotalDatas">
				{{item.sheetName}}
			</Radio>
		</RadioGroup>
	</Modal>
</template>

<script>
	import * as dbApi from '@/api/dataSource'
	import baseURL from '_conf/url'
	export default {
		props: ['dataMode'],
		data() {
			return {
				modalShow: false,
				tableHeight: document.body.clientHeight - 410,
				modalTitle: '新建',
				modalEdit: false,
				columns: [],
				defaultList: [], // 默认已上传列表，回显时使用
				dsParam: {
					dataMode: '0',
					name: '',
					driver: 'first',
					type: '3',
					database: '',
					username: 'admin',
					pwd: '123456',
					createUser: 'admin',
					xa: 0
				},
				uploadAction: baseURL + 'dataSource/uploadExcel',
				tableTotalDatas: [], // Excel表中所有Table内容
				tableData: [], // 当前渲染的table内容
				curSheet: 0 // 当前选中Sheet的 Index
			}
		},
		methods: {
			handleUpload() {
				this.$refs.uploadVm.clearFiles()
			},
			// 获取上传结果
			uploadSuccess(res) {
				this.dsParam.database = res.data.info
				this.getExcelDetail()
			},
			// 获取excel表内容
			getExcelDetail() {
				this.tableTotalDatas = [];
				this.tableData = [];
				this.columns = []
				dbApi.preloadExcel(this.dsParam).then(response => {
					if (response.success) {
						this.tableTotalDatas = response.data
						if (response.data.length) {
							this.renderTable(0)
						}
					}
				})
			},
			// 解析表格内容并渲染
			renderTable(index) {
				this.curSheet = index
				this.tableTotalDatas[index].headers.forEach((header, headerIndex) => {
					this.columns.push({
						title: header,
						key: 'row' + headerIndex
					})
					this.tableTotalDatas[index].dataList.forEach((data, dataIndex) => {
						if (!this.tableData[dataIndex]) {
							this.tableData[dataIndex] = new Object()
						}
						this.tableData[dataIndex]['row' + headerIndex] = data[headerIndex]
					})
				})
			},
			uploadError(e) {
				this.$Message.error('服务内部错误')
			},
			submitForm() {
				if (!this.modalEdit) {
					dbApi.insertDs(this.dsParam).then(res => {
						if (res.success) {
							this.$Message.success({
								content: '新增数据源成功',
								duration: 3
							})
							this.modalShow = false
							this.$parent.getDsList(1)
						}
					})
				} else {
					dbApi.updateDs(this.dsParam).then(res => {
						if (res.success) {
							this.$Message.success({
								content: '修改数据源成功',
								duration: 3
							})
							this.modalShow = false
							this.$parent.getDsList(1)
						}
					})
				}
			},
			//修改表头格式时  重新刷新预览表格
			changeDriver() {
				this.getExcelDetail()
			}
		},
		watch: {
			curSheet() { // 切换Sheet时修改table内容
				this.renderTable(this.curSheet)
			},
			modalShow() { // 初始化数据
				if (!this.modalShow) {
					this.$refs.dataForm.resetFields()
					this.dsParam.id = null
					this.columns = []
					this.tableTotalDatas = []
					this.tableData = []
					this.modalEdit = false
					this.modalTitle = '新建'
					this.$refs.uploadVm.clearFiles()
				} else if (this.modalEdit) {
					if (this.dsParam.database) {
						this.defaultList = [{
							name: this.dsParam.database.split('\\')[this.dsParam.database.split('\\').length - 1],
							url: ''
						}]
						this.getExcelDetail()
					}
				}
			},
			dataMode() {
				this.dsParam.dataMode = this.dataMode
			}
		}
	}

</script>

<style>

</style>
