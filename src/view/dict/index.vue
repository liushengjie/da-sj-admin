<template>
	<div>
		<Row>
			<Col span="4" style="padding-top: 10px;padding-left:10px;background: #f8f8f9">
				<Card :padding="0" shadow style="height: 90%;">
					<Input v-model="typeSearch.typeName" search enter-button placeholder="输入搜索字典项类别"
						   @on-search="searchDict"/>
					<div class="add-action">
						<Button icon="md-add" :size="buttonSize" @click="showNewTypeModel" class="add-type">新建</Button>
					</div>
					<CellGroup @on-click="callClick">
						<Cell v-for="item in typeList" :title="item.type_name" :name="item">
							<Icon type="ios-construct" slot="icon" @click="editType(item)"/>
						</Cell>
					</CellGroup>
				</Card>
			</Col>
			<Col span="20">
				<div style="padding: 10px">
					<div style="display: flex;margin-bottom: 10px;align-items: center">
						<Input v-model="resSearch.name" style="width: 25%;" search enter-button placeholder="查询字典说明"
							   @on-search="searchTypeRes"/>
						<Button icon="md-add" :size="buttonSize" @click="showNewRes" class="add-item">添加字典项</Button>
						<Button icon="md-exit" :size="buttonSize" @click="showUploadModel" class="add-item">导入字典项
						</Button>
						<Button icon="md-download" :size="buttonSize" @click="showNewModel" class="add-item">下载模板
						</Button>
						<span style="display: flex;margin-left: 10px;">字典类别：
							<span style="font-weight: bold">{{selectedType.type_name}}</span>
						</span>
					</div>
					<Table highlight-row border :columns="columns" :data="tables_data" :height="tableHeight"
						   :loading="loading"></Table>
				</div>
			</Col>
		</Row>
		<tableDetail ref="tableDetail"></tableDetail>
		<typeModel ref="typeModel"></typeModel>
		<resModel ref="resModel"></resModel>
		<Modal v-model="modal2" width="360">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="ios-information-circle"></Icon>
				<span>提示</span>
			</p>
			<div style="text-align:center">
				<p>确定要删除: <span style="font-weight: bold">{{editedType.type_name}}</span> 吗?</p>
			</div>
			<div slot="footer">
				<Button type="error" size="large" long :loading="modal2_loading" @click="delType">删除</Button>
			</div>
		</Modal>
		<Modal v-model="modal3" width="360">
			<p slot="header" style="color:#f60;text-align:center">
				<Icon type="ios-information-circle"></Icon>
				<span>提示</span>
			</p>
			<div style="text-align:center">
				<p>确定要删除: <span style="font-weight: bold">{{selectRes.name}}</span> 吗?</p>
			</div>
			<div slot="footer">
				<Button type="error" size="large" long :loading="modal3_loading" @click="delRes">删除</Button>
			</div>
		</Modal>
		<Modal v-model="modal4" width="360">
			<p slot="header" style="text-align:center">
				<span>{{this.selectedType.type_name}}-导入字典</span>
			</p>
			<div style="text-align:left">
				<Upload
					:data="uploadData"
					:before-upload="handleUpload"
					action="http://10.3.242.59:3066/resDict/uploadExcel">
					<Button icon="ios-cloud-upload-outline">选择文件</Button>
					<span v-if="file !== null">&nbsp;&nbsp;&nbsp;文件名:{{ file.name }} </span>
				</Upload>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" long :loading="modal4_loading" @click="upload">上传</Button>
			</div>
		</Modal>
	</div>
</template>
<style>
	.add-action {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.add-type {
		width: 80%;
		margin: 10px 10px;
	}

	.add-item {
		width: 15%;
		margin-left: 10px;
	}

	.ivu-upload {
		display: flex;
		align-items: center;
	}
</style>
<script>
import * as dbApi from '@/api/dataDict'
import typeModel from '@/view/dict/components/addDictType'
import resModel from '@/view/dict/components/addDictRes'
import tableDetail from '@/view/dataRepo/components/tableDetail'
import Axios from 'axios'

export default {
  components: {
    typeModel, resModel, tableDetail
  },
  data () {
    return {

      file: null,
      uploadData: { codeType: '' },

      modal2: false,
      modal2_loading: false,

      modal3: false,
      modal3_loading: false,

      modal4: false,
      modal4_loading: false,

      isEdit: false,
      selectedType: {
        type_name: '无'
      },
      editedType: {},
      typeSearch: {
        typeName: ''
      },
      resSearch: {
        name: ''
      },

      selectRes: {},

      buttonSize: 'middle',
      typeList: [],
      dsList: [],
      tableHeight: document.body.clientHeight - 84,
      columns: [
        {
          title: '字典项',
          key: 'code'
        },
        {
          title: '字典说明',
          key: 'name',
          className: 'edit-col'
        },
        {
          title: '描述',
          key: 'remark',
          sortable: false
        },
        // {
        // 	title: '最后更新时间',
        // 	key: 'UPDATE_TIME',
        // 	sortable: false,
        // },
        {
          title: '是否有效',
          key: 'enabled',
          // className: 'edit-col',

          width: 150,
          align: 'center',
          render: (h, params) => {
            if (params.row.enabled === '1') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'md-checkmark'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showEditResModel(params)
                    }
                  }
                })
              ])
            } else {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'md-close'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showEditResModel(params)
                    }
                  }
                })
              ])
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
                    this.showEditResModel(params)
                  }
                }
              }),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'ios-trash-outline'
                },
                on: {
                  click: () => {
                    this.deleteResAlert(params)
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
      curLineIndex: -1 // 当前table编辑行index
    }
  },
  mounted () {
    this.getTypeList()
  },
  methods: {

    // 弹出新建弹窗
    showNewTypeModel () {
      this.$refs.typeModel.modelTitle = '新增'
      this.$refs.typeModel.modelShow = true
    },
    editType (type) {
      this.isEdit = true
      console.log(type)
      this.$refs.typeModel.typeParam = {
        id: type.res_dict_typeid,
        typeName: type.type_name,
        typeCode: type.typecode,
        remark: type.remark,
        enabled: type.enabled
      }
      this.editedType = type
      this.$refs.typeModel.modelEdit = true
      this.$refs.typeModel.modelTitle = '编辑'
      this.$refs.typeModel.modelShow = true
    },
    delType () {
      if (this.editedType) {
        this.modal2_loading = true
        let param = { id: this.editedType.res_dict_typeid }
        dbApi.delType(param).then(res => {
          console.log(res)
          this.modal2_loading = false
          this.modal2 = false
          this.editedType = {}
          if (res.success) {
            this.$Message.success('删除成功')
            this.getTypeList()
          } else {
            this.$Message.error({
              content: '删除失败',
              duration: 3
            })
          }
        },
        error => {
        }
        )
      }
    },
    getTypeList () {
      let typeName = {}
      if (this.typeSearch.typeName) {
        typeName = this.typeSearch
      }
      dbApi.getTypeList(typeName).then(res => {
        console.log(res)
        if (res.success) {
          this.typeList = res.data
          console.log(this.typeList)
        } else {
          this.$Message.error({
            content: '获取数据失败',
            duration: 3
          })
        }
      },
      error => {
      }
      )
    },

    searchDict () {
      this.getTypeList()
    },

    // 资源操作
    callClick (name) {
      if (this.isEdit) return
      console.log(name)
      this.selectedType = name
      this.uploadData.codeType = name.typecode
      this.getResList()
    },
    getResList () {
      this.loading = true
      var searchParam = {
        codeType: this.selectedType.typecode
      }
      dbApi.getTypeResList(searchParam).then(res => {
        if (res.success) {
          this.tables_data = res.data
          this.loading = false
        }
      },
      error => {
      }
      )
    },
    searchTypeRes () {
      let resName = {}
      if (!this.resSearch.name) {
        this.$Message.warning({
          content: '搜索内容不能为空',
          duration: 2
        })
        return
      }
      resName = this.resSearch
      this.loading = true
      dbApi.getTypeResList(resName).then(res => {
        this.loading = false
        if (res.success) {
          if (res.success) {
            this.tables_data = res.data
          }
        } else {
          this.$Message.error({
            content: '获取数据失败',
            duration: 3
          })
        }
      },
      error => {
      }
      )
    },
    showNewRes () {
      if (this.selectedType.type_name === '无') {
        this.$Message.warning('请选择字典类型')
        return
      }
      this.$refs.resModel.modelTitle = this.selectedType.type_name + '-新增'
      this.$refs.resModel.modelShow = true
    },
    showEditResModel (params) {
      this.selectRes = params.row
      this.$refs.resModel.modelTitle = '编辑'
      this.$refs.resModel.resParam.id = this.selectRes.resdictid
      this.$refs.resModel.resParam.code = this.selectRes.code
      this.$refs.resModel.resParam.name = this.selectRes.name
      this.$refs.resModel.resParam.remark = this.selectRes.remark
      this.$refs.resModel.resParam.enabled = this.selectRes.enabled
      this.$refs.resModel.resParam.codeType = this.selectRes.code_type

      this.$refs.resModel.modelEdit = true
      this.$refs.resModel.modelShow = true
    },
    deleteResAlert (params) {
      this.selectRes = params.row
      this.modal3 = true
    },
    delRes () {
      this.modal3_loading = true
      dbApi.delRes({ id: this.selectRes.resdictid }).then(res => {
        this.modal3_loading = false
        this.modal3 = false
        if (res.success) {
          this.$Message.success('删除成功')
          this.getResList()
        } else {
          this.$Message.error({
            content: '删除失败',
            duration: 3
          })
        }
      },
      error => {
      }
      )
    },

    showUploadModel () {
      if (!this.uploadData.codeType) {
        this.$Message.warning({
          content: '请选择字典类型',
          duration: 3
        })
        return
      }
      this.modal4 = true
    },

    handleUpload (file) {
      this.file = file
      return false
    },
    upload () {
      if (!this.uploadData.codeType) {
        this.$Message.warning({
          content: '请选择文件',
          duration: 3
        })
      }
      if (!this.file) {
        this.$Message.warning({
          content: '请选择文件',
          duration: 3
        })
        return
      }
      this.modal4_loading = true

      let param = new FormData() // 创建form对象
      param.append('file', this.file)// 通过append向form对象添加数据
      param.append('codeType', this.uploadData.codeType)// 通过append向form对象添加数据
      console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      } // 添加请求头
      Axios.post('http://10.3.242.59:3066/resDict/uploadExcel', param, config)
        .then(response => {
          this.modal4_loading = false
          this.modal4 = false
          if (response.data.success) {
            this.$Message.success('导入成功')
            this.file = null
            this.getResList()
          } else {
            this.$Message.error({
              content: '导入失败',
              duration: 3
            })
          }
        })
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
