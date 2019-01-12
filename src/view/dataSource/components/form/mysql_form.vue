<template>
<div>
    <Modal :loading="true" :title="modalTitle" v-model="modalShow" :mask-closable="false" @on-cancel="close">
        <Form ref="dataForm" :model="submitParam" :labelWidth="90" :rules="ruleValidate">
            <FormItem label="源名称" prop="name">
                <Input placeholder="连接名称" v-model="submitParam.name"></Input>
            </FormItem>
            </FormItem>
            <FormItem label="IP地址" prop="ip">
                <Input placeholder="IP地址" v-model="submitParam.ip"></Input>
            </FormItem>
            <FormItem label="端口号" prop="port">
                <Input placeholder="端口号" v-model="submitParam.port"></Input>
            </FormItem>
            <FormItem label="数据库名称" prop="database">
                <Input placeholder="数据库名称" v-model="submitParam.database"></Input>
            </FormItem>
            <FormItem label="用户名" prop="username">
                <Input placeholder="用户名" v-model="submitParam.username"></Input>
            </FormItem>
            <FormItem label="密码" prop="pwd">
                <Input placeholder="密码" type="password" v-model="submitParam.pwd"></Input>
            </FormItem>
            <FormItem label="分布式事务">
                <RadioGroup v-model="submitParam.xa">
                    <Radio label="1">启用</Radio>
                    <Radio label="0">禁用</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button style="float:left" @click="testConn" :loading="loading">测试连接</Button>
            <Button @click="close" type="default">取消</Button>
            <Button @click="submitForm" type="primary">确定</Button>
        </div>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </Modal>
</div>
</template>

<script>
import * as dbApi from '@/api/dataSource'
export default {
    data() {
        return {
			datasourceType:0,
            spinShow: false,
            loading: false,
            modalShow: false, // 新建/编辑弹窗显示状态
            modalEdit: false,
            modalTitle: '新增', // 弹窗title(新增或编辑)
            submitParam: {},
            ruleValidate: {
                // 表单验证规则
                database: [{
                    required: true,
                    message: '数据库名称不能为空',
                    trigger: 'blur'
                }],
                ip: [{
                    required: true,
                    message: 'IP地址不能为空',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '连接名称不能为空',
                    trigger: 'blur'
                }],
                port: [{
                    required: true,
                    message: '端口号不能为空',
                    trigger: 'blur'
                }],
                pwd: [{
                    required: true,
                    message: '密码不能为空',
                    trigger: 'blur'
                }],
                username: [{
                    required: true,
                    message: '用户名不能为空',
                    trigger: 'blur'
                }]
            }
        }
    },
    mounted() {
    },
    methods: {
        // 表单提交
        submitForm() {
            this.$refs.dataForm.validate(valid => {
                // 提交前先进行表单验证
                if (valid) {
                    this.spinShow = true
                    this.connect(ret => {
                        if (ret) {
                            if (!this.modalEdit) {
                                dbApi.insertDs({'type':this.datasourceType},this.submitParam).then(res => {
									if (res.success) {
										this.$Message.success({
											content: '新增数据源成功',
											duration: 3
										})
										this.spinShow = false
										this.modalShow = false
										this.$parent.getDsList(1)
										this.resetForm()
									}
								})
                            } else {
                                dbApi.updateDs({'type':this.datasourceType},this.submitParam).then(res => {
                                    if (res.success) {
                                        this.$Message.success({
                                            content: '修改数据源成功',
                                            duration: 3
                                        })
                                        this.spinShow = false
                                        this.modalShow = false
                                        this.$parent.getDsList(1)
                                        this.resetForm()
                                    }
                                })
                            }
                        } else {
                            this.spinShow = false
                            this.$Message.error({
                                content: '数据源连接不成功，请检查数据源配置',
                                duration: 3
                            })
                        }
                    })
                }
            })
        },
        connect(cb) {
            dbApi.testConn({'type':this.datasourceType},this.submitParam).then(res => {
                if (res.success) {
                    cb(true)
                } else {
                    cb(false)
                }
            })
        },
        testConn() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.connect(ret => {
                        if (ret) {
                            this.$Message.success({
                                content: '数据源连接测试成功',
                                duration: 3
                            })
                            this.loading = false
                        } else {
                            this.$Message.error({
                                content: '数据源连接不成功，请检查数据源配置',
                                duration: 3
                            })
                            this.loading = false
                        }
                    })
                }
            })
        },
        close() {
            this.modalShow = false
            this.resetForm()
        },
        resetForm() {
            this.$refs.dataForm.resetFields()
        }
    }
}
</script>

<style>
.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
}

.vertical-center-modal .ivu-modal {
    top: 0;
}
</style>
