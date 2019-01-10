<template>
    <Modal :title="modalTitle" v-model="modalShow" width="1000">
        <Row>
            <font size="3.5">并集设置</font>
        </Row>
        <Row style="margin-top: 5px;">
            <Col span="2" style="line-height: 30px">
            选择合并集合:
            </Col>
            <Col span="8">
                <Select placeholder="选择合并集合" v-model="currentNode">
                    <Option v-for="item in nodeList" v-if="originRes.id!==item.id" v-model="item.id">
                        {{item.name}}
                    </Option>
                </Select>
            </Col>
        </Row>
        <div class="union-col">
            <div class="result-col">
                <div>结果集名称</div>
                <div v-for="item in resultCol">{{item}}</div>
            </div>
            <div class="origin-col">
                <div>{{originRes.name}}</div>
                <div  v-for="(item, index) in originRes.col">
                    <Select v-model="originColSelected[index]">
                        <Option v-for="item in originRes.col" v-model="item.id">{{item.name}}</Option>
                    </Select>
                </div>
            </div>
            <div class="curRes-col">
                <div>abc</div>
                <div v-for="item in curResCol">
                    <Select></Select>
                </div>
            </div>
            <div>
                <div></div>
                <div v-for="item in resultCol">
                    <Button type="error">删除</Button>
                </div>
            </div>
        </div>
        <Row style="margin-top: 5px;">
            <Col span="2" style="line-height: 30px">
                新结果集名称:
            </Col>
            <Col span="8">
                <Input placeholder="请输入结果集名称"/>
            </Col>
        </Row>
        <Row style="margin-top: 5px;">
            <Col span="2" style="line-height: 30px">
            &emsp;&emsp;数据去重:
            </Col>
            <Col span="8">
                <RadioGroup v-model="isUnique" type="button">
                    <Radio label="0">否</Radio>
                    <Radio label="1">是</Radio>
                </RadioGroup>
            </Col>
        </Row>
    </Modal>
</template>
<script>
    export default {
        props: ['originRes'],
        data() {
            return {
                modalShow: false,
                modalTitle: '交集',
                nodeList:[],
                currentNode: '',
                isUnique: '0',
                resultCol: new Array(),
                curResCol: ['合并列1(=)','合并列1(=)','合并列1(=)','合并列1(=)','合并列1(=)','合并列1(=)'],
                originColSelected: new Array()
            }
        },
        methods: {
            showModal() {
                this.modalShow = true;
                this.$nextTick(()=>{
                    this.modalTitle = '并集'+ this.originRes.name;
                    this.nodeList = this.$parent.getNodeByType();
                    console.log(this.originRes.col)
                    this.originRes.col.forEach((col, index) => {
                        this.originColSelected.push(col.id)
                        this.resultCol.push('合并列'+(index+1)+'(=)')
                    })
                })
            }
        }
    }
</script>
<style scoped="">
    .union-col{
        border:1px solid #ccc;
        margin-top: 3px;
    }
    .union-col>div{
        line-height: 40px;
        font-size: 14px;
    }
    .union-col>div:nth-child(1) {
        border-bottom:1px solid #ccc;
    }
    .union-col>div>div{
        display: inline-block;
        width: 100px;
        text-align: center;
    }
</style>