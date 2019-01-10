<template>
    <div>
        值
        <Select v-model="equal" style="width: 80px">
            <Option value="yes">等于</Option>
            <Option value="no">不等于</Option>
        </Select>
        <Select class="filter-select" v-model="content" multiple  filterable @on-change="change" style="max-width: 300px">
            <Option v-for="item in previewData" :value="item[curColName.toLowerCase()] || ''" :label="item[curColName]"></Option>
        </Select>
    </div>
</template>
<script>
export default {
  props: ['previewData', 'curColName'],
  data () {
    return {
      equal: 'yes',
      content: []
    }
  },
  methods: {
    change (val) {
      console.log(val)
    }
  },
  watch: {

  }
}
</script>
<style>
    .filter-select .ivu-select-dropdown{
        max-height:100%;
    }
    .filter-select .ivu-select-dropdown-list{
        max-height: 100%;
        overflow: auto;
    }
</style>
