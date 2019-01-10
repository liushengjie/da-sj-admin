<template>
    <div style="position:relative;">
        <Tabs class="tabs">
            <TabPane label="服务" name="0"></TabPane>
            <TabPane label="场景" name="1"></TabPane>
        </Tabs>
        <Row>
            <Col span="2" class="form-item">
            源名称</Col>
            <Col span="5" class="form-input">
            <Input placeholder="名称"></Input>
            </Col>
            <Col span="2" class="form-item">
            源类型</Col> 
            <Col span="5" class="form-input">
            <Select placeholder="全部">
                <Option value="">全部</Option>
            </Select>
            </Col>
            <Col span="4" class="form-item">
            <Button type="primary" icon="ios-search" @click="getDsList(1)">查询</Button>
            &emsp;
            <Button type="primary" icon="md-add" @click="showNewModal">新建</Button>
            </Col>
        </Row>
        <div style="padding:20px"> 
            <Table :height="tableHeight" :columns="tableColumns"></Table>
        </div>

        <serviceModal ref="serviceModal"></serviceModal>
    </div>
</template>

<script>
    import vis from 'vis'
    import svg from '@/assets/svg-menu.svg'
    import serviceModal from './components/serviceModal'

    export default {
        components: {
            serviceModal,
        },
        data() {
            return {
                tableHeight: document.body.clientHeight - 205,
                tableColumns: [
                    {
                        title: '服务名称',
                        key: 'name',
                        sortable: true
                    },
                    {
                        title: '场景',
                        key: 'category_name'
                    },
                    {
                        title: '来源数据源',
                        key: 'ds_name',
                        sortable: true
                    },
                    {
                        title: '连接方式',
                        key: 'connect_type_name'
                    },
                    {
                        title: '数据量',
                        key: 'num'
                    },
                    {
                        title: '状态',
                        key: 'status_name'
                    },
                    {
                        title: '时间',
                        key: 'create_time_str'
                    },
                    {
                        title: '操作',
                        key: 'address',
                        render: (h, params) => {
                            return h('a', {
                            on: {
                                click: () => {
                                this.getResDetail(params.row.id)
                                }
                            }
                            }, '编辑')
                        }
                    }
                ],
            }
        },
        mounted() {
            document.oncontextmenu= ()=>{
                return false;
            };
        },
        methods: {
            showNewModal() {
                this.$refs.serviceModal.modalShow = true;
            }
        }

    }
</script>

<style>

    .iframe-svg {
        border: none;
        width: 200px;
        height: 200px;
        position: absolute;
    }
</style>
