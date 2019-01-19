<template>
	<Modal v-model="modalShow" title="拆分" width="800" @on-ok="saveSplit">
		<div style="height: 200px;">
			<div class="split-type-list">
				<CellGroup @on-click="changeProc">
					<Cell v-for="func in functions" :selected="func.selected" :title="func.name" :name="JSON.stringify(func)"></Cell>
				</CellGroup>
			</div>
			<div class="split-type-list" style="width: 200px">
				描述
				<br>
				{{desc}}
			</div>
			<div class="split-type-list">
				<component :is="funcForm" :ref="funcForm"></component>
			</div>
		</div>
	</Modal>
</template>
<script>
	import splitFrom from '@/view/resource/components/col/form/split_form'
	import substrFrom from '@/view/resource/components/col/form/substr_form'

	export default {
		components: {
			splitFrom,
			substrFrom
		},
		props: ['functions', 'col'],
		data() {
			return {
				modalShow: false,
				desc: "",
				func: "",
				funcForm: "",
				funcParams: {}
			}
		},
		methods: {
			changeProc(id) {
				this.func = JSON.parse(id)
				this.desc = this.func.desc
				this.funcForm = this.func.id + "From"
			},
			saveSplit() {
				const processor = {
					'processName': this.func.id,
					'processCol': this.col.col,
					'params': JSON.stringify(this.$refs[this.func.id + "From"].params)
				}
				this.addCol(processor)
				this.reset()
				this.modalShow = false
			},
			addCol(processor) {
				var newCol = {
					"id": null,
					"resId": this.$store.state.resource.resource.resourceBody.id,
					"alias": '自定义拆分列_' + this.col.col,
					"colCache": this.func.id + '_' + this.col.col + '_' + this.$store.state.resource.resource.resourceBody.id,
					"type": this.col.type,
					"col": this.func.id + '_' + this.col.col,
					"origin": this.col.col,
					"pk": "0",
					"idx": "0",
					"dict": null,
					"status": "1",
					"changeType": this.col.changeType,
					"sort": this.col.sort,
					"colProcessor": [processor]
				}

				this.$store.commit('setResourceCol', newCol)
			},
			reset() {
				this.desc = ""
				this.func = ""
				this.funcForm = ""
				this.funcParams = ""
			}
		}
	}

</script>
<style>
	.split-type-list {
		display: inline-block;
		border-right: 1px solid #CCC;
		height: 100%;
		vertical-align: top;
		padding-left: 10px;
	}

	.split-type-list:nth-last-child(1) {
		border: none;
	}

</style>
