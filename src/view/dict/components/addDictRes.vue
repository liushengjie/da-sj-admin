<template>
	<div>
		<Modal :loading="true" :title="modelTitle" v-model="modelShow" :mask-closable="false" @on-cancel="closeNewDiag"
			   draggable>
			<Form ref="dataForm" :model="resParam" :labelWidth="90" :rules="ruleValidate">
				<FormItem label="字典项" prop="code">
					<Input placeholder="字典项" v-model="resParam.code"></Input>
				</FormItem>
				<FormItem label="字典说明" prop="name">
					<Input placeholder="字典说明" v-model="resParam.name"></Input>
				</FormItem>
				<FormItem label="描述" prop="remark">
					<Input placeholder="描述" v-model="resParam.remark"></Input>
				</FormItem>
				<FormItem label="是否有效">
					<RadioGroup v-model="resParam.enabled">
						<Radio label="1">启用</Radio>
						<Radio label="0">禁用</Radio>
					</RadioGroup>
				</FormItem>
			</Form>
			<div slot="footer">
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
      resParam: {
        id: '',
        code: '',
        codeType: '',
        name: '',
        remark: '',
        enabled: '1'

      },
      ruleValidate: {
        // 表单验证规则
        code: [
          {
            required: true,
            message: '字典项不能为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '字典说明不能为空',
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
            this.resParam.codeType = this.$parent.selectedType.typecode
            dbApi.insertRes(this.resParam).then(res => {
              this.spinShow = false
              if (res.success) {
                this.$Message.success({
                  content: '新增字典资源成功',
                  duration: 3
                })
                this.modelShow = false
                this.resetForm()
                this.$parent.getResList()
              } else {
                this.$Message.error({
                  content: '新增字典资源失败',
                  duration: 3
                })
              }
            })
          } else {
            dbApi.updateRes(this.resParam).then(res => {
              this.spinShow = false
              if (res.success) {
                this.$Message.success({
                  content: '修改成功',
                  duration: 3
                })
                this.modelShow = false
                this.modelEdit = false
                this.resetForm()
                this.$parent.getResList()
              } else {
                this.$Message.error({
                  content: '修改失败',
                  duration: 3
                })
              }
            })
          }
        }
      })
    },
    closeNewDiag () {
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
