<template>
    <div>
           起止日期  <DatePicker v-model="date" @on-change="changeDate" type="daterange" placement="bottom-end" placeholder="请选择起止日期" style="width: 200px"></DatePicker>
    </div>
</template>
<script>
export default {
  mounted () {
  },
  data () {
    return {
      date: '',
      daterange: []
    }
  },
  methods: {
    changeDate (date) {
      this.daterange = date.toString().replace(/-/g, '').split(',')
    }
  },
  watch: {
    daterange () {
    }
  },
  computed: {

  }
}
</script>
