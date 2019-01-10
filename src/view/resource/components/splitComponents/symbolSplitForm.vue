<template>
    <Form :label-width="75" v-model="params">
        <FormItem label="符号分隔符">
            <Input v-model="params.symbol" placeholder="-,;:..."/>
        </FormItem>
        <FormItem label="取">
            <InputNumber v-model="params.index"></InputNumber>
            <span> 列</span>
        </FormItem>
    </Form>
</template>
<script>
export default {
  data () {
    return {
      params: {
        symbol: '',
        index: 1
      }
    }
  }
}
</script>
