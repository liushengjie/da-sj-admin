<template>
    <Modal class="full-model res-modal over-visible" :mask="false" v-model="modalShow" fullscreen :z-index="900" @on-cancel="closeModal" @on-ok="saveService" :loading="modalLoading">
        <p slot="header">
            <Icon type="ios-information-circle"></Icon>
            <Input class="model-title-input" v-model="$store.state.service.visData.name" size="large"/>
        </p>
        <div class="split">
            <Split v-model="split1" min="50px" max="100px">
                <div slot="left" class="split-pane">
                    <Row>
                        <font size="3.5">资源列表</font>
                    </Row>
                    <Tree :data="resList" :render="renderContent"></Tree>
                </div>
                <div slot="right" style="height:100%;">
                    <Split v-model="split2">
                        <div slot="left" class="ser-dropDiv" style="height:100%;">
                            <visNetwork ref="visNetwork" @getResDetail="getResDetail"></visNetwork>
                        </div>
                        <div slot="right" style="height:100%;">
                            <Split v-model="split3">
                                <div slot="left" style="height: 100%">
                                    <div style="height: 100%;overflow: auto">
                                        <div v-for="res in resDetail">
                                            <Card :title=res.data.name icon="ios-options" :padding="0" shadow style="width: 100%;height:33.3%">
                                                <CellGroup>
                                                    <Cell v-for="col in res.data.col" :title="col.name" :selected="col.show">
                                                        <Dropdown class="col-menu" slot="extra" trigger="click" transfer>
                                                            <a href="javascript:void(0)">
                                                                <Icon type="ios-arrow-down"></Icon>
                                                            </a>
                                                            <DropdownMenu slot="list">
                                                                <DropdownItem name="addIndex">置为索引</DropdownItem>
                                                                <DropdownItem name="rename">重命名</DropdownItem>
                                                                <DropdownItem name="dic"> 数据字典</DropdownItem>
                                                                <DropdownItem name="split"> 拆分</DropdownItem>
                                                                <DropdownItem name="hide"> 隐藏</DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </Cell>
                                                </CellGroup>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                                <div slot="right" style="height: 100%">
                                    <Card title="展示字段" icon="ios-options" :padding="0" shadow style="width: 100%;height:33.3%">
                                        <CellGroup>
                                        </CellGroup>
                                    </Card>
                                    <Card title="条件字段" icon="ios-options" :padding="0" shadow style="width: 100%;height:33.3%">
                                        <CellGroup>
                                        </CellGroup>
                                    </Card>
                                    <Card title="权限字段" icon="ios-options" :padding="0" shadow style="width: 100%;height:33.3%">
                                        <CellGroup>
                                        </CellGroup>
                                    </Card>
                                </div>
                            </Split>
                            
                        </div>
                    </Split>
                </div>
            </Split>
        </div>
    </Modal>
</template>
<script>
    import visNetwork from './visNetwork'
    import * as serApi from '@/api/service'
    import * as dragUtils from '@/view/resource/components/dragUtils'

    export default {
        components: {
            visNetwork
        },
        data() {
            return{
                serviceTitle: '默认',
                split1: 0.1,
                split2: 0.65,
                split3:0.35,
                modalShow: false,
                modalLoading: true,
                resList:[],
                resDetail: []
            }
        },
        methods: {
            getRes(res) {

            },
            saveService() {
                const targetNode = this.$refs.visNetwork.getTargetNode();
                if (!targetNode) {
                    this.$Message.error('结构体有误');
                    this.modalLoading = false;
                    this.$nextTick(()=>{
                        this.modalLoading = true;
                    });
                    return false;
                }
                serApi.generateQrySql(this.$refs.visNetwork.cy.json().elements,{
                    targetNode: targetNode
                }).then(response => {
                    this.modalShow = false;
                    this.$Message.success('保存成功')
                    this.closeModal();
                }).catch(e => {
                    this.modalLoading = false;
                    this.$nextTick(()=>{
                        this.modalLoading = true;
                    })
                })
            },
            //关闭弹窗,初始化数据
            closeModal() {
                this.$store.state.service = {
                    target: '',
                    visData: {
                        nodes: [],
                        edges: [],
                        service: [],
                        name: '默认服务名称'
                    },
                    resId: ''
                };
                this.resList = [];
                this.resDetail = [];
                if (this.$refs.visNetwork.cy) {
                    this.$refs.visNetwork.cy.destroy();
                    this.$refs.visNetwork.visNetwork = null;
                }
            },
            //整合树形的数据格式
            getTreeData(data) {
                data.forEach(item => {
                    if (item.children.length===0) {
                        item.children = item.data
                        item.children.forEach(child => {
                            child.title = child.res.name;
                        })
                    } else {
                        this.getTreeData(item.children)
                    }
                })
            },
            renderContent(h, { root, node, data }) {
                setTimeout(() => {
                    dragUtils.setDragAndDrop('.ser-draggable', '.ser-dropDiv', 'drop-highlight', (dom,evt) => {
                        let data = dom.data();
                        let pos = {}
                        pos[0] = evt.offsetX
                        pos[1] = evt.offsetY
                        this.$refs.visNetwork.addNode(data.res.name,pos,"res",[],data.res, data.col);
                    })
                },1000)
                let attr = {};
                if (!data.children) {
                    attr = {
                        'class': 'ser-draggable',
                        'data-res': JSON.stringify(data.res),
                        'data-col': JSON.stringify(data.resCol),
                    }
                }
                return h('span', {
                    attrs: attr,
                    style: {
                        'cursor': 'pointer'
                    }
                }, data.title);
            },
            getResDetail(node) {
                console.log(node)
                if (node.data.type === 'res') {
                    this.resDetail.push(node);
                } else {
                    this.resDetail.forEach(res => {
                        res.data.col.forEach(resCol => {
                            resCol.show = false
                            node.data.col.forEach(nodeCol => {
                                if (resCol.id === nodeCol.id) {
                                    resCol.show = true;
                                }
                            })
                        })
                    })
                }
                this.$forceUpdate()
                console.log(this.resDetail)
            }
        },
        watch: {
            modalShow() {
                if (this.modalShow) {
                    serApi.getResTree({
                        type: 'res',
                    }).then((response) => {
                        this.resList = response.data;
                        this.getTreeData(this.resList);
                    })
                }
            }
        },
        computed: {
            colList() {
                return this.$store.state.service.colList
            }
        }
    }
</script>
<style>
    .model-title-input input{
        height: 40px;
        line-height: 40px;
        overflow: visible;
        font-size: 20px;
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
    .split {
        height: 100%;
        border: 1px solid #dcdee2;
    }
    .res-modal .ivu-modal-body{
        overflow: visible;
    }
.ivu-dropdown-transfer{
    z-index:99999;
}
</style>