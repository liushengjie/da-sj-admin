<template>
    <Modal :title="modalTitle" v-model="modalShow" width="1000" @on-ok="save" :loading="modalLoading" @on-cancel="initParam">
        <Row>
            <font size="3.5">交集条件设置</font>
        </Row>
        <Row>
            <Form>
                <Col span="6">
                <Select v-if="originRes" v-model="conditionParam.s_t.id" disabled>
                    <Option v-model="originRes.id">{{originRes.name}}</Option>
                </Select>
                </Col>
                <Col span="4">
                <Select placeholder="源结果集列" v-if="originRes" v-model="conditionParam.s_c.id" @on-change="getSc">
                    <Option  v-model="item.id" v-for="item in originRes.col">{{item.name}}</Option>
                </Select>
                </Col>
                <Col span="2">
                <Select v-model="conditionParam.symbol">
                    <Option value="=">等于(=)</Option>
                </Select>
                </Col>
                <Col span="6">
                <Select placeholder="目标结果集名称" v-model="conditionParam.t_t.id" @on-change="getTt">
                    <Option v-for="item in nodeList" v-if="originRes.id!==item.id" v-model="item.id">
                        {{item.name}}
                    </Option>
                </Select>
                </Col>
                <Col span="4" placeholder="目标列">
                <Select v-model="conditionParam.t_c.id" @on-change="getTc">
                    <Option v-for="item in targetColList" v-model="item.id">{{item.name}}</Option>
                </Select>
                </Col>
                <Col span="2" style="padding-left:5px;">
                <Button @click="addCondition">添加</Button>
                </Col>
            </Form>
        </Row>
        <Row>
            <font size="3.5">已添加对比条件</font>
        </Row>
        <div class="condition-list">
            <div class="no-condition-tip" v-show="param.condition.length===0">还未添加对比条件</div>
            <div class="condition-item" v-for="(item, index) in param.condition">
                <span>{{item.s_t.name}}-{{item.s_c.name}} = {{item.t_t.name}}-{{item.t_c.name}}</span>
                <img src="@/assets/images/delete.png" @click="removeCondition(index)">
            </div>
        </div>
        <Row>
            <font size="3.5">选择展示字段</font>
        </Row>
        <Row>
            <Col span="12">
                <div>{{originRes.name}}</div>
                <Select placeholder="选择显示字段" multiple v-model="s_c_show">
                    <Option  v-model="item.id" v-for="item in originRes.col">{{item.name}}</Option>
                </Select>
            </Col>
            <Col span="12">
                <div style="height: 18px">{{conditionParam.t_t.name}}</div>
                <Select placeholder="选择显示字段" multiple v-model="t_c_show">
                    <Option v-for="item in targetColList" v-model="item.id">{{item.name}}</Option>
                </Select>
            </Col>
        </Row>
        <Row style="margin-top: 5px;">
            <Col span="2" style="line-height: 30px">
                新结果集名称:
            </Col>
            <Col span="8">
                <Input placeholder="请输入结果集名称" v-model="newResName"/>
            </Col>
        </Row>
        <Row style="margin-top: 5px;">
            <Col span="2" style="line-height: 30px">
            &emsp;&emsp;连接方式:
            </Col>
            <Col span="8">
            <Select v-model="param.connection">
                <Option value="join">精确连接[AB精确匹配]</Option>
            </Select>
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
                modalLoading: true,
                nodeList: [],
                newResName: '',
                targetColList: [],
                s_c_show: [],//源节点展示字段列表
                t_c_show: [],//目标节点展示字段列表
                conditionParam: {
                    s_t: {
                        name: '',
                        id: ''
                    },
                    s_c: {
                        name: '',
                        id: ''
                    },
                    t_t: {
                        name: '',
                        id: ''
                    },
                    t_c: {
                        name: '',
                        id: ''
                    },
                    symbol: '='
                },
                param: {
                    connection: 'join',
                    condition: new Array()
                }
            }
        },
        methods:{
            showModal(){
                this.modalShow = true;
                this.$nextTick(()=>{
                    this.modalTitle = '交集'+ this.originRes.name;
                    this.nodeList = this.$parent.getNodeByType();
                    this.conditionParam.s_t = {
                        name: this.originRes.name,
                        id: this.originRes.id
                    };
                })
            },
            //获取所选源的字段属性
            getSc(id) {
                this.originRes.col.some(col => {
                    if (col.id === id) {
                        this.conditionParam.s_c.name = col.name;
                        return true
                    }
                })
            },
            //获取所选目标节点的属性
            getTt(id) {
                //目标节点改变,清空之前保存的条件列表
                this.param.condition = [];
                this.conditionParam.t_c.id = '';
                this.t_c_show = [];
                this.nodeList.some(node => {
                    if (node.id === id) {
                        this.conditionParam.t_t.name = node.name;
                        this.targetColList = node.col;
                        return true
                    }
                })
            },
            //获取所选目标节点的字段属性
            getTc(id) {
                this.targetColList.some(col => {
                    if (col.id === id) {
                        this.conditionParam.t_c.name = col.name;
                        return true
                    }
                })
            },
            //添加所选条件
            addCondition() {
                if (this.conditionParam.s_c.id&&this.conditionParam.t_c.id) {
                    //深度拷贝conditionParam对象并push到condition数组中
                    let data = new Object();
                    for (let key in this.conditionParam) {
                        if (typeof this.conditionParam[key] === 'object') {
                            data[key] = Object.assign({},this.conditionParam[key])
                        } else {
                            data[key] = this.conditionParam[key]
                        }
                    }
                    this.param.condition.push(data);
                } else {
                    this.$Message.error('请选择匹配字段')
                }
            },
            //删除条件
            removeCondition(index) {
                this.param.condition.splice(index, 1);
            },
            save() {
                let colList = new Array();
                this.s_c_show.forEach(id => {
                    this.originRes.col.some(col => {
                        if (col.id === id) {
                            colList.push({
                                id: col.id,
                                name: col.name,
                                sourceId: this.originRes.id
                            });
                            return true;
                        }
                    })
                });
                this.t_c_show.forEach(id => {
                    this.targetColList.forEach(col => {
                        if (col.id === id) {
                            colList.push({
                                id: col.id,
                                name: col.name,
                                sourceId: this.conditionParam.t_t.id
                            });
                            return true;
                        }
                    })
                })
                //字段验证
                let errorMessage;
                if (colList.length === 0) {
                    errorMessage = '请选择需要展示的字段';
                } else if (this.param.condition.length === 0) {
                    errorMessage = '请选择匹配字段';
                } else if (!this.newResName) {
                    errorMessage = '请输入结果集名称';
                }
                if (errorMessage) {
                    this.$Message.error(errorMessage);
                    this.modalLoading = false;
                    this.$nextTick(()=>{
                        this.modalLoading = true;
                    })
                } else {
                    this.$parent.addNode(this.newResName,null,'InterSect',[this.originRes.id,this.conditionParam.t_t.id], this.param, colList);
                    this.modalShow = false;
                    this.initParam();
                }
            },
            initParam() {
                this.targetColList = [];
                this.newResName = '';
                this.s_c_show = [];
                this.t_c_show = [];
                this.conditionParam = {
                    s_t: {
                        name: '',
                        id: ''
                    },
                    s_c: {
                        name: '',
                        id: ''
                    },
                    t_t: {
                        name: '',
                        id: ''
                    },
                    t_c: {
                        name: '',
                        id: ''
                    },
                    symbol: '='
                };
                this.param = {
                    connection: 'join',
                    condition: new Array()
                }
            }
        },
    }
</script>
<style scoped="">
    .condition-list{
        border:1px solid #CCC;
        height:100px;
        overflow: auto;
        padding:5px;
    }
    .condition-item{
        border: 1px solid #ccc;
        padding: 3px 20px 3px 3px;
        display: inline-block;
        margin:3px;
        position: relative;
    }
    .condition-item>img{
        width: 16px;
        position: absolute;
        top: 4px;
        right: 3px;
        cursor: pointer;
    }
</style>