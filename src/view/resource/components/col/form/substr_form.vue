<template>
    <div>
        <RadioGroup vertical v-model="form.type">
            <Radio label="0">
                左截取 <InputNumber :min="1" v-model="form.end"></InputNumber>
            </Radio>
            <Radio label="1">
                右截取 <InputNumber :min="1" v-model="form.begin"></InputNumber>
            </Radio>
            <Radio label="2">
                自定义 <InputNumber :min="1" v-model="form.customBegin"></InputNumber> 列 至 <InputNumber v-model="form.customEnd"></InputNumber> 列
            </Radio>
        </RadioGroup>
    </div>
</template>
<script>
export default {
  mounted () {
  },
  data () {
    return {
      form: {
        type: '0',
        begin: 1,
        end: 1,
        customBegin: 1,
        customEnd: 1
      }
      //                params: {
      //                    startColumn: 'left',
      //                    endColumn: 'right'
      //                }
    }
  },
  computed: {
    params () {
      let param = new Object()
      if (this.form.type === '0') {
        param.lr = 'left'
        param.len = this.form.end
      } else if (this.form.type === '1') {
        param.lr = 'right'
        param.len = this.form.begin
      } else {
        param.begin = this.form.customBegin
        param.end = this.form.customEnd
      }
      return param
    }
  }
}
</script>
