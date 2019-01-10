<template>
    <Modal :z-index="910" v-model="modalShow" title="抽取设置">
        <Row style="margin-top: -10px;">
            <Col col="24">
                订单
            </Col>
        </Row>
        <Form :model="formItem" :label-width="60">
            <FormItem label="抽取方式">
                <RadioGroup v-model="formItem.extractType">
                    <Radio label="1">全量抽取覆盖</Radio>
                    <Radio label="2">全量追加抽取</Radio>
                    <Radio label="3">增量抽取</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="抽取字段" v-show="formItem.extractType==3">
                <Select>
                    <Option value="1">发货日期</Option>
                    <Option value="2">222</Option>
                    <Option value="3">333</Option>
                </Select>
            </FormItem>
            <FormItem label="任务频率">
                <Select>
                    <Option value="1">小时</Option>
                    <Option value="2">天</Option>
                    <Option value="3">周</Option>
                </Select>
            </FormItem>
            <FormItem label="任务日期">
                <span>每 </span>
                <InputNumber :value="1"></InputNumber>
                <span> 小时</span>
            </FormItem>
            <FormItem label="任务时间">
                <InputNumber :value="1"></InputNumber>
                <span>：</span>
                <InputNumber :value="1"></InputNumber>
            </FormItem>
            <FormItem label="起止日期">
                <Row>
                    <Col span="11">
                    <FormItem>
                        <DatePicker type="date" placeholder="Select date"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col span="2" style="text-align: center">-</Col>
                    <Col span="11">
                    <FormItem>
                        <DatePicker type="date" placeholder="Select date"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
            </FormItem>
        </Form>
    </Modal>
</template>
<script>
export default {
  data () {
    return {
      modalShow: false,
      formItem: {}
    }
  }
}
</script>
<style>
    .extractForm{
        width: 330px;
    }
    .extractForm .ivu-form-item{
        margin-bottom:10px;
    }
</style>
