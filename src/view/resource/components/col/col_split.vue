<template>
    <Modal v-model="modalShow" title="拆分" width="800" @on-ok="saveSplit">
        <div style="height: 200px;">
            <div class="split-type-list">
                <CellGroup @on-click="changeProc">
                    <Cell  v-for="proc in procList" :selected="proc.selected" :title="proc.name" :name="proc.id"></Cell>
                </CellGroup>
            </div>
            <div class="split-type-list" style="width: 200px">
                描述
                <br>
                {{curDescription}}
            </div>
            <div class="split-type-list">
                <splitFrom ref="split_symbol" v-if="curProcId === 'split_symbol'||curProcId==='split_symbol_excel'"></splitFrom>
                <substrFrom ref="split_cut" v-if="curProcId === 'split_cut'||curProcId === 'split_cut_excel'"></substrFrom>
            </div>
        </div>
    </Modal>
</template>
<script>
import splitFrom from '@/view/resource/components/col/form/split_form'
import substrFrom from '@/view/resource/components/col/form/substr_form'
import * as procApi from '@/api/processor'
export default {
  components: {
    splitFrom,
    substrFrom
  },
  props: ['datasoureType'],
  data () {
    return {
      modalShow: false,
      procList: [],
      curDescription: '',
      curProcId: ''
    }
  },
  methods: {
    changeProc (id) {
      this.curProcId = id
      this.procList.forEach((proc, index) => {
        proc.selected = proc.id === id
        if (proc.id === id) {
          this.curDescription = proc.content
        }
      })
      console.log(this.procList)
    },
    saveSplit () {
      let ref = this.curProcId
      switch (this.curProcId) {
        case 'split_cut_excel': ref = 'split_cut'; break
        case 'split_symbol_excel': ref = 'split_symbol'; break
      }
      const proc = {
        procId: this.curProcId,
        params: JSON.stringify(this.$refs[ref].params)
      }
      this.$emit('addSplit', proc)
    }
  },
  watch: {
    modalShow: function () {
      if (this.modalShow) {
        const param = {
          datasourceType: this.datasoureType,
          procType: 'col',
        }
        procApi.fetchAvailableFunc(param).then(res => {
          console.log(res)
          if (res.success) {
            this.procList = res.data
          }
        })
      } else { // 窗口关闭时清空数据
        this.curProcId = ''
      }
    }
  }
}
</script>
<style>
    .split-type-list{
        display: inline-block;
        border-right:1px solid #CCC;
        height: 100%;
        vertical-align: top;
    }
    .split-type-list:nth-last-child(1) {
        border:none;
    }
</style>
