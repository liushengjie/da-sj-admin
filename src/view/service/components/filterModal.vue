<template>
    <Modal :title="modalTitle" v-model="modalShow" :width="1000" @on-ok="save" :loading="modalLoading" @on-cancel="initParam">
        <Split v-model="split" style="height:300px;border: 1px solid #CCC;">
            <div slot="left">
                <Row>
                    <font size="3.5">设置过滤条件</font>
                </Row>
                <div class="condition-area">
                    <Row>
                        <div style="padding: 0 10px;">{{totalRelation}}</div>
                    </Row>
                    <Row>
                        <Col span="3">
                            <Select v-model="groupSymbol" transfer>
                                <Option value="and">且</Option>
                                <Option value="or">或</Option>
                            </Select>
                        </Col>
                        <Col span="3">
                            <Button icon="md-add-circle" @click="addGroup">添加组</Button>
                        </Col>
                    </Row>
                    <div class="condition-group" v-for="(item, groupIndex) in param.filter.group">
                        <Row v-if="groupIndex">{{item.relation}}</Row>
                        <Row>
                            <Col span="3">
                                <Select v-model="conditionSymbol[groupIndex]" transfer>
                                    <Option value="and">且</Option>
                                    <Option value="or">或</Option>
                                </Select>
                            </Col>
                            <Col span="3">
                                <Button icon="md-add" @click="addCondition(item,groupIndex)">添加条件</Button>
                            </Col>
                        </Row>
                        <div class="condition-list" v-for="(condition, conIndex) in item.condition" :key="conIndex">
                            <Row v-if="conIndex">{{condition.relation}}</Row>
                            <Row>
                                <Col span="6">
                                    <Select v-model="condition.col" @on-change="getColType(condition)" transfer>
                                        <Option v-model="col.id" v-for="col in originRes.col">{{col.name}}</Option>
                                    </Select>
                                </Col>
                                <Col span="4">
                                    <Select v-model="condition.symbol" transfer>
                                        <Option value="=">等于</Option>
                                        <Option value=">">大于</Option>
                                    </Select>
                                </Col>
                                <Col span="6" v-if="condition.type!=='datetime'&&condition.type!=='date'||condition.isOutParam">
                                    <Input  v-model="condition.val"/>
                                </Col>
                                <Col span="6" v-if="condition.type==='date'||condition.type==='datetime'&&!condition.isOutParam">
                                    <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" transfer @on-change="dateChange(condition, $event)"></DatePicker>
                                </Col>
                                <Col span="6" style="line-height: 32px">
                                    <Checkbox v-model="condition.isOutParam" @on-change="condition.val=''">
                                        <span>是否引入外部参数</span>
                                    </Checkbox>
                                </Col>
                                <Col span="2" v-if="conIndex">
                                    <Button icon="md-backspace" type="text" @click="deleteCondition(item, conIndex)"></Button>
                                </Col>
                            </Row>
                            <br>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="right" style="    padding: 10px;">
                <Row>
                    <font size="3.5">选择显示字段</font>
                </Row>
                <Select multiple v-model="colShowList">
                    <Option v-model="item.id" v-for="item in originRes.col">{{item.name}}</Option>
                </Select>
                <Row>
                    <font size="3.5">展示属性设置</font>
                </Row>
                <Row>
                    <Col span="6" style="vertical-align: middle;">
                        显示条数:
                    </Col>
                    <Col span="12">
                        <Input v-model="param.limit"/>
                    </Col>
                </Row>
                <Row>
                    <Col span="6" style="vertical-align: middle">
                        &emsp;&emsp;排序:
                    </Col>
                    <Col span="12">
                        <Select v-model="param.order">
                            <Option v-model="item.id" v-for="item in originRes.col">{{item.name}}</Option>
                        </Select>
                    </Col>
                </Row>
            </div>
        </Split>
        <Row style="margin-top: 5px;">
            <Col span="2" style="line-height: 30px">
            新结果集名称:
            </Col>
            <Col span="8">
            <Input placeholder="请输入结果集名称" v-model="newResName"/>
            </Col>
        </Row>
    </Modal>
</template>
<script>
    export default {
        props: ['originRes'],
        data(){
            return {
                split: 0.65,
                modalTitle: '过滤',
                modalShow: false,
                modalLoading: true,
                colShowList: [], //展示字段id列表
                newResName: '',
                param:{
                    filter:{
                        group:[
                            {
                                condition:[{
                                    col:'',
                                    val:'',
                                    symbol:'',
                                    type: '',
                                    isOutParam: false,
                                    relation: ''
                                }],
                                relation: ''
                            }
                        ],
                    },
                    order: '',
                    limit: ''
                },
                conditionSymbol: ['and'],
                groupSymbol: 'and'
            }
        },
        methods: {
            showModal() {
                this.modalShow = true;
            },
            addCondition(group, index) {
                group.condition.push({
                    col:'',
                    val:'',
                    symbol:'',
                    type: '',
                    isOutParam: false,
                    relation: this.conditionSymbol[index]
                });
//                this.getRelation(group, 'condition');
                console.log(this.param.filter.group)
            },
            //添加组
            addGroup() {
                this.param.filter.group.push({
                    condition:[{
                        col:'',
                        val:'',
                        symbol:'',
                        type: '',
                        isOutParam: false,
                        relation: ''
                    }],
                    relation: this.groupSymbol
                });
                this.conditionSymbol.push('and')
                //relation拼接
//                this.getRelation(this.param.filter, 'group');
            },
            //拼接relation
            getRelation(obj,key) {
                obj.relation = '';
                obj[key].forEach((item, index) => {
                    if (!index) {
                        obj.relation += item.id;
                    } else {
                        obj.relation += ' ' + item.relationSymbol + ' ' + item.id;
                    }
                });
                console.log(obj)
            },
            //获取所选字段的类型
            getColType(obj) {
                obj.value = '';
                this.originRes.col.some(item => {
                    if (item.id ===obj.col) {
                        obj.type = item.type;
                        return true;
                    }
                })
            },
            save() {
                let colList = new Array();
                this.colShowList.forEach(id => {
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
                this.$parent.addNode(this.newResName,null,'Filter',[this.originRes.id], this.param, colList);
                this.modalShow = false;
                this.initParam();
            },
            //监听日期改变
            dateChange(condition, val) {
                condition.val = val.join('-')
            },
            deleteCondition(group, conIndex) {
                group.condition.splice(conIndex, 1);
                console.log(group)
//                this.getRelation(group, 'condition');
            },
            initParam() {
                this.param = {
                    filter:{
                        group:[
                            {
                                condition:[{
                                    col:'',
                                    val:'',
                                    symbol:'',
                                    type: '',
                                    isOutParam: false,
                                    relation: ''
                                }],
                                relation: ''
                            }
                        ],
                    },
                    order: '',
                    limit: ''
                };
                this.newResName = '';
                this.conditionSymbol = ['and'];
                this.groupSymbol = 'and';
                this.colShowList = []
            }
        },
        computed: {
            totalRelation: function() {
                let totalRelation = '';
                this.param.filter.group.forEach((group, groupIndex) => {
                    let relation = '';
                    if (groupIndex) totalRelation += ' ' + group.relation + ' ';
                    group.condition.forEach((condition, conIndex) => {
                        if (conIndex) relation += ' ' + condition.relation + ' ';
                        relation += condition.col + ' ' + condition.symbol + ' ' + condition.val;
                    })
                    totalRelation += '(' + relation + ')';
                })
                return totalRelation
            }
        }
    }
</script>
<style scoped>
    .condition-group{
        padding:10px;
        margin:3px;
        border:1px solid #ccc;
    }
    .condition-list{
        margin:3px 0;
    }
    .left-pane>div{
        height: 100%;
    }
    .condition-area{
        height: calc(100% - 24px);
        overflow: auto;
    }
</style>
