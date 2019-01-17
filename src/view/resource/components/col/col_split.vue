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
		props: ['functions'],
		data() {
			return {
				modalShow: false,
				desc: "",
				func:"",
				funcForm: "",
				funcParams:{}
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
					func: this.func,
					params: this.$refs[this.func.id + "From"].params
				}
				this.reset()
				console.log(processor)
			},
			reset(){
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
		padding-left:10px;
	}

	.split-type-list:nth-last-child(1) {
		border: none;
	}

</style>
