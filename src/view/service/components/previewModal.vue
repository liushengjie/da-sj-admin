<template>
    <div>
        <Modal v-model="modalShow" :width="1000">
            <div slot="header" style="height: 20px;line-height: 20px;padding-right: 20px;">
                <Col span="12" size="small">
                <font size="3.5" style="padding-left:5px">数据预览</font>
                </Col>
                <Col span="12" size="small" style="text-align: right">
                <Input v-model="limit" suffix="ios-search" style="width: 140px" size="small"/>行
                </Col>
            </div>
            <Table :columns="columns" :data="previewData"></Table>
            <div slot="footer">
                <Button style="float:left" @click="showDebug">查看调试日志</Button>
                <Button @click="closeNewDiag" type="default">取消</Button>
            </div>
        </Modal>
        <Modal
            v-model="debugModel"
            title="调试日志">
            <pre id="debugLog"></pre>
        </Modal>
    </div>
    
</template>
<script>
    import * as serApi from '@/api/service'
    import sqlFormatter from "sql-formatter";
    export default {
        data() {
            return {
                modalShow: false,
                limit: 50,
                columns: [],
                previewData: [],
                debugModel:false,
                elements:{},
                target:{}
            }
        },
        methods:{
            showDebug(){
                serApi.debugLog(this.elements, {targetNode: this.target.id}).then(res => {
                    var debugLog = res.data;
                    console.log(sqlFormatter.format(debugLog))
                    $("#debugLog").html(sqlFormatter.format(debugLog))
                    this.debugModel = true
                })
            },
            closeNewDiag(){
                this.modalShow = false
            },
            showModal(json, targetNode) {
                this.columns = []
                this.elements = json
                this.target = targetNode
                targetNode.col.forEach(col => {
                    this.columns.push({
                        title: col.name,
                        key: col.id.toUpperCase(),
                        tooltip: true,
                        minWidth: 100,
                    })
                });
                serApi.previewData(json, {targetNode: targetNode.id,limit: this.limit}).then(res => {
                    this.previewData = res.data;
                    this.modalShow = true;
                })
            }
        }
    }
</script>
<style>
pre {
    width: 100%;
    height: auto;
    word-wrap:break-word;
    word-break:break-all;
    overflow:scroll;
}
</style>