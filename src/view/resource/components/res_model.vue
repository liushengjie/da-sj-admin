<template>
	<Modal class="full-model res-modal" v-model="res_model" fullscreen :z-index="900" :mask="false" @on-cancel="closeModal" @on-ok="save" :loading="modalLoading">
		<p slot="header">
            <Icon type="ios-information-circle"></Icon>
            <Input class="model-title-input" size="large" v-model="$store.state.resource.res.name"/>
            <Cascader class="category" placeholder="资源类别" size="small" style="display: inline-block" :data="categoryList" v-model="curCategory.id" @on-change="changeCategory"></Cascader>
        </p>
		<div class="split">
			<Split v-model="split1" min="50px" max="100px">
				<div slot="left" class="split-pane">
					<Row>
						<font size="3.5">数据源</font>
					</Row>
					<Row>
						<Col span="24" class="form-input" size="small">
						<Select v-model="curDs" placeholder="请选择数据源" @on-change="getTableList">
							<Option v-for="item in dsList" :value="item.id+'-'+item.type" :label="item.name">
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
                                <Cell v-for="item in tables_data" :data-id="item.alias_id" :title="item.alias || item.TABLE_NAME" :label="item.TABLE_NAME" class="draggable">
                                    <Icon type="md-grid" slot="icon"/>
                                </Cell>
                            </CellGroup>
						</Col>
						<Divider dashed class="divider"  v-show="show_diy_sql_btn"/>
						<Col span="24" size="small" v-show="show_diy_sql_btn">
						<CellGroup>
							<Cell title="SQL" label="新自定义SQL" class="draggable">
								<Icon type="ios-apps-outline" slot="icon" />
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
									<RadioGroup v-model="$store.state.resource.res.connectType">
										<Radio label="0">实时</Radio>
										<Radio label="1">数据提取</Radio>
									</RadioGroup>
									<a href="javascript:void(0)" v-show="$store.state.resource.res.connectType==1" @click="openExtractSetting">编辑</a>
								</div>
							</div>
                            <colList  @getPreviewData="getPreviewData" @renderColList="renderColList" :previewData="previewData" :curDsType="curDsType" ref="colList"></colList>
						</div>
						<div slot="right" class="split-pane">
							<Row>
								<Col span="12" size="small">
									<font size="3.5" style="padding-left:5px">数据预览</font>
								</Col>
								<Col span="12" size="small" style="text-align: right">
									<!--<Checkbox v-model="showHideCol">显示隐藏字段</Checkbox>-->
									<Input v-model="showLines" suffix="ios-search" style="width: 140px" size="small"/>行
								</Col>
							</Row>
							<Row style="padding-top:5px">
								<Spin size="large" fix v-if="dataloadingShow"></Spin>
								<Table class="ele-scroll preview-table" :columns="columns" :data="previewData" :height="tableHeight"></Table>
							</Row>
						</div>
					</Split>
				</div>
			</Split>
		</div>
		<Modal v-model="sqlModel" title="请输入SQL语句">
			<Input type="textarea" width="100%" :rows="4" v-model="$store.state.resource.resData.diySql"></Input>
			<div slot="footer">
				<Button style="float:left" @click="getPreviewDataBySql" :loading="loading">数据预览</Button>
				<Button @click="closeSQLDiag" type="default">取消</Button>
				<Button @click="getColsBySql" type="primary">确定</Button>
			</div>
		</Modal>
		<Modal title="重命名" v-model="colRenameModal" on-ok="rename">
			<Input v-model="renameTitle"></Input>
		</Modal>
        <preview ref="preview" @dataNumber="getPreviewDataBySql"></preview>
        <extract ref="extract"></extract>
	</Modal>
</template>
<script>
import * as dragUtils from '@/view/resource/components/dragUtils'
import * as dbApi from '@/api/dataSource'
import * as resApi from '@/api/resource'
import extract from '@/view/resource/components/extractSetting'
import colList from '@/view/resource/components/columnList'
import preview from '@/components/table/commonTable'
import deleteIcon from '@/assets/images/u4511.png'
export default {
  components: {
    preview,
    extract,
    colList
  },
  data () {
    return {
      tableloadingShow: false,
      dataloadingShow: false,
      loading: false,
      modalLoading: true,
      curCategory: {
			    id: [],
        name: []
      },
      curDs: '',
      curDsType: '',
      dsList: [],
      single: true,
      tables_data: [],
      tableHeight: document.body.clientHeight - 189,
      res_model: false,
      sqlModel: false,
      colRenameModal: false,
      showHideCol: false,
      showLines: 50,
      split1: 0.15,
      split2: 0.2,
      show_diy_sql_btn: false,
      colTypeIcon: {
        date: require('@/assets/images/col-type/date.png'),
        varchar: require('@/assets/images/col-type/varchar.png'),
        datetime: require('@/assets/images/col-type/datetime.png'),
        float: require('@/assets/images/col-type/float.png'),
        int: require('@/assets/images/col-type/int.png'),
        index: require('@/assets/images/col-type/index.png'),
        pk: require('@/assets/images/col-type/pk.png')
      },
      columns: [
        {
          title: ''
        }
      ],
      categoryList: [],
      previewData: [],
      renameTitle: '', // 重命名值
      curEditColIndex: 0 // 当前重命名列的索引值
    }
  },
  mounted () {
    this.getDsList()
  },
  methods: {
    getDsList () {
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
    getTableList (data) {
      const id = data.split('-')[0]
      const type = data.split('-')[1]
      if (!id) {
        return false
      }
      this.tableloadingShow = true
      this.$store.state.resource.resData.dsId = id
      this.dsList.forEach(item => {
        if (item.id === id) {
          this.curDsType = item.type
        }
      })
      dbApi.getTables({ dataSource: id }).then(res => {
        this.tableloadingShow = false
        if (res.success) {
          this.tables_data = res.data
          this.show_diy_sql_btn = type !== '3'
          this.$nextTick(() => {
            dragUtils.setDragAndDrop(
              '.draggable',
              '.dropDiv',
              'drop-highlight',
              dom => {
                this.renderDropDiv(dom.find('.ivu-cell-title').text())
                this.getCols(
                  dom.find('.ivu-cell-label').text(), dom.data('id')
                )
              }
            )
          })
        }
      })
    },
    // 渲染拖放区域页面
    renderDropDiv (tableAlias) {
      const _this = this
      const html = '<div class="drop-item">' +
                                tableAlias +
                                ' <img class="del-icon" width="15" src="' + deleteIcon + '">' +
                         '</div>'
      $('.dropDiv').html(html).removeClass('drop-highlight')
      $('.del-icon').unbind().click(() => {
        _this.initData()
      })
    },
    // 获取列内容列表
    getCols (tableName, aliasId) {
      this.$store.state.resource.resColList = []
      this.columns = []
      this.previewData = []
      if (tableName === '新自定义SQL') {
        this.sqlModel = true
        this.$store.state.resource.resData.tableName = ''
        this.$store.state.resource.resData.diy = '1'
        this.$store.state.resource.resData.diySql = ''
      } else {
        this.$refs.colList.colloadingShow = true
        const param = {
          dataSource: this.$store.state.resource.resData.dsId,
          tableName: tableName
        }
        this.$store.state.resource.resData.tableName = tableName
        this.$store.state.resource.resData.aliasId = aliasId
        this.$store.state.resource.resData.diy = '0'
        dbApi.getTableColumns(param).then(res => {
          this.$refs.colList.colloadingShow = false
          if (res.success) {
            const obj = {
              'id': '',
              'dic': '',
              'resId': '',
              'name': '',
              'type': '',
              'changeType': '',
              'attr': '0',
              'col': '',
              'pk': '0',
              'idx': '0',
              'proc': [],
              'colCache': '',
              'status': '1'
            }
            res.data.forEach((res, index) => {
              this.$store.state.resource.resColList.push($.extend({}, obj, res))
              this.$store.state.resource.resColList[index].colCache = this.$store.state.resource.resColList[index].col
            })
            console.log(this.$store.state.resource.resColList)
            this.renderColList()
          } else {
            this.$refs.colList.colloadingShow = false
          }
        }).catch(e => {
          this.$refs.colList.colloadingShow = false
        })
      }
    },
    getColsBySql () {
      this.sqlModel = false
      if (this.$store.state.resource.resData.diySql) {
        this.$refs.colList.colloadingShow = true
        dbApi.findColsBySQL({
          dataSource: this.$store.state.resource.resData.dsId,
          SQL: this.$store.state.resource.resData.diySql
        }).then(res => {
          this.$refs.colList.colloadingShow = false
          if (res.success) {
            this.$store.state.resource.resColList = res.data
            this.renderColList()
          }
        }).catch(e => {
          this.$refs.colList.colloadingShow = false
        })
      }
    },
    // 获取预览数据表头
    renderColList (isSplit) {
      this.columns = []
      if (!isSplit) {
        //                this.$store.state.resource.resColList = [];
        this.$store.state.resource.resFilterList = []
      }
      this.$store.state.resource.resColList.forEach(item => {
        if (item.status === '1') {
          this.columns.push({
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
      this.getPreviewData()
    },
    // 获取预览数据内容
    getPreviewData () {
      this.previewData = []
      this.dataloadingShow = true
      resApi.previewData(this.$store.state.resource, { 'limit': 50 }).then(res => {
        this.previewData = res.data
        this.dataloadingShow = false
      }).catch(e => {
        this.dataloadingShow = false
      })
    },
    rename () {
      this.$store.state.resource.resColList[
        this.curEditColIndex
      ].name = this.renameTitle
    },
    getPreviewDataBySql (refreshNum) {
      if (this.$store.state.resource.resData.diySql || refreshNum) {
        this.sqlModel = false
        this.$refs.preview.modelShow = true
        if (typeof refreshNum === 'object') {
          dbApi.findColsBySQL({
            dataSource: this.$store.state.resource.resData.dsId,
            SQL: this.$store.state.resource.resData.diySql
          }).then(res => {
            if (res.success) {
              res.data.forEach(item => {
                this.$refs.preview.tableColumns.tableCol.push({
                  title: item.alias || item.column_name,
                  key: item.column_name,
                  tooltip: true,
                  minWidth: 100
                })
              })
            }
          })
        }
        dbApi.preloadSQLData({
          dataSource: this.$store.state.resource.resData.dsId,
          sql: this.$store.state.resource.resData.diySql,
          limit: (typeof refreshNum) === 'object' ? 50 : refreshNum
        }).then(res => {
          if (res.success) {
            this.$refs.preview.tableColumns.tableData = res.data
          }
        })
      }
    },
    closeSQLDiag () {
      this.sqlModel = false
      this.$store.state.resource.resData.diySql = ''
      this.initData()
    },
    // 回显数据
    reviewData () {
      this.getTableList(this.$store.state.resource.resData.dsId)
      $('.category').find('input').val(this.$store.state.resource.res.categoryName)
      if (this.$store.state.resource.resData.diy === '1') {
        this.renderDropDiv('新自定义SQL')
      } else {
        this.renderDropDiv(this.$store.state.resource.resData.alias || this.$store.state.resource.resData.tableName)
      }
      this.renderColList(true)
    },
    // 关闭SQL窗口并初始化相关数据
    initData () {
      this.columns = []
      this.previewData = []
      this.curDs = ''
      $('.category').find('input').val('')
      $('.dropDiv').empty()
      this.$store.state.resource = {
        'res': {
          'id': '',
          'name': '默认资源名称',
          'category': '',
          'categoryList': '',
          'connectType': '0',
          'cacheTable': '',
          'num': 0,
          'createUser': '',
          'createTime': '',
          'status': '0',
          'updateTime': '',
          'schemaFlag': ''
        },
        'resData': {
          'id': '',
          'resId': '',
          'dsId': '',
          'tableName': '',
          'aliasId': '',
          'diy': '',
          'diySql': '',
          'createTime': ''
        },
        'resColList': [],
        'resFilterList': []
      }
    },
    // 关闭窗口并初始化数据
    closeModal () {
      setTimeout(() => {
        this.$store.state.resource.resData.dsId = 0
        this.tables_data = []
        this.show_diy_sql_btn = false
        this.showLines = 50
        this.showHideCol = false
        this.$store.state.resource.res.connectType = '0'
        this.curCategory = {
          id: [],
          name: []
        }
        this.initData()
        this.$store.state.resource.res.name = '默认资源名称'
      }, 10)
    },
    getParent (array, childIds, childNames, selectedId) {
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
    changeCategory (val, selectData) {
      this.$store.state.resource.res.category = val[val.length - 1]
      //            this.$store.state.resource.res.name = selectData[selectData.length-1].title;
    },
    openExtractSetting () {
      this.$refs.extract.modalShow = true
    },
    save () {
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
    },
    showSplit () {
      this.$refs.split.modalShow = true
    }
  },
  watch: {
    categoryList: function () {
      setTimeout(() => {
        this.curCategory = this.getParent(this.categoryList, [], [], this.curCategory.id[0]) || { id: [], name: [] }
        if (this.curCategory.id.length) {
          this.$store.state.resource.res.category = this.curCategory.id[this.curCategory.id.length - 1]
          //                    this.$store.state.resource.res.name = this.curCategory.name[this.curCategory.name.length-1];
        }
      }, 100)
    },
    res_model: function () {
      //            this.$store.state.resource = {
      //                "res": {
      //                    "id": "",
      //                    "name": "默认资源名称",
      //                    "category": "",
      //                    "connectType": "0",
      //                    "cache_name":"",
      //                    "num": 0,
      //                    "createUser": "",
      //                    "createTime": "",
      //                    "status": "0"
      //                },
      //                "resData": {
      //                    "id": "",
      //                    "resId": "",
      //                    "dsId": "",
      //                    "tableName": "",
      //                    "diy": "",
      //                    "diySql": "",
      //                    "createTime": ""
      //                },
      //                "resColList": []
      //            }
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
.drop-item > .del-icon {
    position: absolute;
    top: -4px;
    right: -8px;
    display: none;
    cursor: pointer;
}
.drop-item:hover > .del-icon {
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
    height: calc(100% - 58px);
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
.ivu-dropdown-transfer{
    overflow: visible;
}
.col-type-icon{
    vertical-align: middle;
    margin-top:3px;
    width: 14px;
    margin-right:3px;
}
.col-list{
    padding-left: 5px;
}
.col-list .ivu-cell-icon{
    width: 50px;
}
.res-modal .ivu-modal-header{
    padding:2px 16px;
}
.res-modal .ivu-modal-header p,
.model-title-input input{
    height: 40px;
    line-height: 40px;
	overflow: visible;
	font-size: 20px;
}
.res-modal .ivu-cascader{
    display: inline-block;
    margin-left:10px;
}
.model-title-input{
    width: 150px;
}
.model-title-input input {
    border-width:0;
}
.model-title-input input:hover,
.model-title-input input:focus{
    border-width:1px;
}
.ivu-select-dropdown{
    max-height:445px;
}
</style>
