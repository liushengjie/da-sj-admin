<template>
	<div>
		<RadioGroup vertical v-model="params.type">
			<Radio label="0">
				左截取 <InputNumber :min="1" v-model="params.len"></InputNumber>
			</Radio>
			<Radio label="1">
				右截取 <InputNumber :min="1" v-model="params.len"></InputNumber>
			</Radio>
			<Radio label="2">
				自定义 <InputNumber :min="1" v-model="params.startIndex"></InputNumber> 列 至 <InputNumber v-model="params.endIndex"></InputNumber>
				列
			</Radio>
		</RadioGroup>
	</div>
</template>
<script>
	export default {
		mounted() {},
		data() {
			return {
				params: {
					subType: '0',
					startIndex: 1,
					endIndex: 1,
				}
			}
		}
	}

</script>
