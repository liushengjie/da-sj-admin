<template>
    <Modal v-model="modelShow" width="80%" height="600" draggable title="表详情">
        <Table :columns="columns" border :data="tableDetail"></Table>
    </Modal>
</template>
<script>
import * as dbApi from '@/api/dataSource'
export default {
  data () {
    return {
      modelShow: false,
      curLineIndex: -1,
      columns: [
        {
          title: '列名',
          sortable: true,
          render: (h, params) => {
            return h('div', params.row.column_name || params.row.COLUMN_NAME)
          }
        },
        {
          title: '列别名',
          sortable: true,
          className: 'edit-col',
          key: 'alias',
          render: (h, params) => {
            if (this.curLineIndex === 'alias' + params.index) {
              return h('Input', {
                props: {
                  placeholder: '输入列别名',
                  size: 'small',
                  value: params.row.alias
                },
                on: {
                  'on-blur': (event) => {
                    this.tableDetail[params.index].alias = event.target.value
                    this.curLineIndex = -1
                    this.updateTable(this.tableDetail[params.index])
                  },
                  'on-keyup': (event) => {
                    if (event.code == 'Enter') {
                      this.tableDetail[params.index].alias = event.target.value
                      this.curLineIndex = -1
                    }
                  }
                }
              })
            } else {
              return h('div', {
                style: {
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  'align-items': 'center'
                },
                on: {
                  dblclick: () => {
                    this.curLineIndex = 'alias' + params.index
                  }
                }
              }, params.row.alias)
            }
          }
        },
        {
          title: '类型',
          sortable: true,
          key: 'column_type',
          render: (h, params) => {
            return h('div', params.row.column_type || params.row.COLUMN_TYPE)
          }
        },
        {
          title: '备注',
          sortable: true,
          className: 'edit-col',
          key: 'column_comment',
          render: (h, params) => {
            console.log(params)
            if (this.curLineIndex === 'remark' + params.index) {
              return h('Input', {
                props: {
                  placeholder: '输入备注',
                  size: 'small',
                  value: params.row.remark || params.row.column_comment || params.row.COLUMN_COMMENT
                },
                on: {
                  'on-blur': (event) => {
                    this.tableDetail[params.index].remark = event.target.value
                    this.curLineIndex = -1
                    this.updateTable(this.tableDetail[params.index])
                  },
                  'on-keyup': (event) => {
                    if (event.code == 'Enter') {
                      this.tableDetail[params.index].remark = event.target.value
                      this.curLineIndex = -1
                    }
                  }
                }
              })
            } else {
              return h('div', {
                style: {
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  'align-items': 'center'
                },
                on: {
                  dblclick: () => {
                    this.curLineIndex = 'remark' + params.index
                  }
                }
              }, params.row.remark || params.row.column_comment || params.row.COLUMN_COMMENT)
            }
          }
        },
        {
          title: '是否可为空',
          sortable: true,
          key: 'column_nullable',
          render: (h, params) => {
            return h('div', params.row.column_nullable || params.row.COLUMN_NULLABLE)
          }
        }
      ],
      tableDetail: [],
      curDsId: 0,
      curTableData: null
    }
  },
  methods: {
    getTableData (dsId, tableData) {
      this.curDsId = dsId
      this.curTableData = tableData
      const param = {
        dataSource: dsId,
        tableName: tableData.TABLE_NAME
      }
      dbApi.getTableColumns(param).then(res => {
        if (res.success) {
          this.tableDetail = res.data
          this.modelShow = true
        }
      })
    },
    updateTable (data) {
      let param = {
        type: '2',
        datasource: this.curDsId,
        tablename: this.curTableData.TABLE_NAME,
        alias: data.alias || '',
        remark: data.remark || '',
        colname: data.column_name || data.COLUMN_NAME
      }
      let api = 'addAlias'
      if (data.aliasid) {
        param.id = data.aliasid
        api = 'updateAlias'
      }
      dbApi[api](param).then(res => {
        if (res.success) {
          this.$Message.success('修改成功')
        }
        this.getTableData(this.curDsId, this.curTableData)
      })
    }
  }
}
</script>
<style>
</style>
