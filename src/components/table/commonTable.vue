<template>
	<Modal v-model="modelShow" width="800" height="500" title="数据预览" draggable>
		<Table :data="tableColumns.tableData" :columns="tableColumns.tableCol" stripe height=500></Table>
		<Input v-model="value11" placeholder="50" >
	        <span slot="prepend">查看数据条数：</span>
	        <Button slot="append" icon="ios-search" @click="searchNum(value11)"></Button>
	    </Input>
        <div slot="footer">
            <Button @click="modelShow=false">关闭</Button>
        </div>
	</Modal>
</template>
<script>
export default {
  name: 'popList',
  //		props: ["tableColumns"],
  data () {
    return {
      modelShow: false,
      value11: '50',
      tableColumns: {
        tableData: [],
        tableCol: []
      }
    }
  },
  methods: {
    searchNum: function (num) {
      const _this = this
      if (num > 0) {
        _this.$emit('dataNumber', num)
      }
    }
  }
}
</script>
<style>
	.ivu-modal-body {
		position: relative;
	}
	.ivu-input-group {
		position: absolute;
		top: -40px;
		width: 200px;
		right: 60px;
	}
</style>
