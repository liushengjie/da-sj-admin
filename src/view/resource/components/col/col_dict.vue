<template>
	<Modal v-model="modalShow" class-name="vertical-center-modal" title="数据字典">
		<CellGroup @on-click="saveDict">
			<Cell v-for="item in dictList" :title="item.type_name" :name="item.typecode"></Cell>
		</CellGroup>
	</Modal>
</template>
<script>
	import * as dictApi from '@/api/dataDict'
	export default {
		props: ['curSplitName'],
		data() {
			return {
				modalShow: false,
				dictList: []
			}
		},
		methods: {
			getDictList() {
				this.dictList = []
				dictApi.getTypeList({}).then(res => {
					this.dictList = res.data
					this.modalShow = true
				})
			},
			saveDict(id) {
				this.$store.state.resource.resColList.forEach(col => {
					console.log(col.col, this.curSplitName)
					if (col.col === this.curSplitName) {
						col.dic = id
					}
				})
				this.modalShow = false
			}
		}
	}

</script>
