<template>
    <div>
        是否非空
        <RadioGroup v-model="isNotNull">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
        </RadioGroup>
    </div>
</template>
<script>
export default {
  data () {
    return {
      isNotNull: '0'
    }
  }
}
</script>
