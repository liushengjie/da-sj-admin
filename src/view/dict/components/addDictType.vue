<template>
	<div>
		<Modal :loading="true" :title="modelTitle" v-model="modelShow" :mask-closable="false" @on-cancel="closeNewDiag"
			   draggable>
			<Form ref="dataForm" :model="typeParam" :labelWidth="90" :rules="ruleValidate">
				<FormItem label="类型名称" prop="typeName">
					<Input placeholder="类型名称" v-model="typeParam.typeName"></Input>
				</FormItem>
				<FormItem label="类型代码" prop="typeCode">
					<Input placeholder="类型代码" v-model="typeParam.typeCode"></Input>
				</FormItem>
				<FormItem label="备注" prop="remark">
					<Input placeholder="备注" v-model="typeParam.remark"></Input>
				</FormItem>
				<FormItem label="是否可用">
					<RadioGroup v-model="typeParam.enabled">
						<Radio label="1">启用</Radio>
						<Radio label="0">禁用</Radio>
					</RadioGroup>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button style="float:left" v-show="modelEdit" @click="delDiag" type="error">删除</Button>
				<Button @click="closeNewDiag" type="default">取消</Button>
				<Button @click="submitForm" type="primary">确定</Button>
			</div>
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Modal>
	</div>
</template>
<script>
import * as dbApi from '@/api/dataDict'

export default {
  data () {
    return {
      spinShow: false,
      loading: false,
      modelShow: false, // 新建/编辑弹窗显示状态
      modelEdit: false,
      modelTitle: '新增字典类型', // 弹窗title(新增或编辑)
      typeParam: {
        id: '',
        typeName: '',
        typeCode: '',
        remark: '',
        enabled: '1'

      },
      ruleValidate: {
        // 表单验证规则
        typeName: [
          {
            required: true,
            message: '类型名称不能为空',
            trigger: 'blur'
          }
        ],
        typeCode: [
          {
            required: true,
            message: '类型代码不能为空',
            trigger: 'blur'
          }
        ],
        remark: [
          {
            required: true,
            message: '备注不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {

  },
  methods: {
    // 表单提交
    submitForm () {
      this.$refs.dataForm.validate(valid => {
        // 提交前先进行表单验证
        if (valid) {
          this.spinShow = true
          if (!this.modelEdit) {
            dbApi.insertType(this.typeParam).then(res => {
              if (res.success) {
                this.spinShow = false
                this.$Message.success({
                  content: '新增类型成功',
                  duration: 3
                })
                this.modelShow = false
                this.resetForm()
                this.$parent.isEdit = false
                this.$parent.typeSearch.typeName = ''
                this.$parent.getTypeList()
              } else {
                this.$Message.error({
                  content: '新增类型失败',
                  duration: 3
                })
              }
            })
          } else {
            dbApi.updateType(this.typeParam).then(res => {
              if (res.success) {
                this.$Message.success({
                  content: '修改类型成功',
                  duration: 3
                })
                this.spinShow = false
                this.modelShow = false
                this.resetForm()
                this.$parent.isEdit = false
                this.$parent.typeSearch.typeName = ''
                this.$parent.getTypeList()
              } else {
                this.$Message.error({
                  content: '修改类型失败',
                  duration: 3
                })
              }
            })
          }
        }
      })
    },
    delDiag () {
      this.$parent.isEdit = false
      this.modelShow = false
      this.$parent.modal2 = true
    },
    closeNewDiag () {
      this.modelEdit = false
      this.$parent.isEdit = false
      this.modelShow = false
      this.resetForm()
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
    }
  }
}
</script>
<style>
	.form-item {
		line-height: 40px;
		text-align: center;
		font-size: 16px;
	}

	.form-input {
		line-height: 40px;
	}

	.vertical-center-modal {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.vertical-center-modal .ivu-modal {
		top: 0;
	}
</style>
