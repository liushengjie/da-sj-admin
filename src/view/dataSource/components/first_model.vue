<template>
	<div class="">
		<Modal v-model="modelShow" :title="modelTitle" :loading="loading" width="800">
			<Divider orientation="left">关系型数据源</Divider>
			<ul class="WH100 disRow">
				<li v-for="form in relationData" @click="openForm(form.name,form.page,form.code)">
					<Card class="card" :padding=5>
						<p slot="title">
							{{form.name}}
						</p>
						<img class="WH100" :src="form.img" />
					</Card>
				</li>
			</ul>
			<Divider orientation="left">非关系型数据源</Divider>
			<ul class="WH100 disRow">
				<li v-for="form in noSQLData" @click="openForm(form.name,form.page,form.code)">
					<Card class="card" :padding=5>
						<p slot="title">
							{{form.name}}
						</p>
						<img class="WH100" :src="form.img" />
					</Card>
				</li>
			</ul>
			<Divider orientation="left">大数据数据源</Divider>
			<ul class="WH100 disRow">
				<li v-for="form in bigData" @click="openForm(form.name,form.page,form.code)">
					<Card class="card" :padding=5>
						<p slot="title">
							{{form.name}}
						</p>
						<img class="WH100" :src="form.img" />
					</Card>
				</li>
			</ul>
			<Divider orientation="left">图数据源</Divider>
			<ul class="WH100 disRow">
				<li v-for="form in graphData" @click="openForm(form.name,form.page,form.code)">
					<Card class="card" :padding=5>
						<p slot="title">
							{{form.name}}
						</p>
						<img class="WH100" :src="form.img" />
					</Card>
				</li>
			</ul>
			<Divider orientation="left">流式数据源</Divider>
			<ul class="WH100 disRow">
				<li v-for="form in flowData" @click="openForm(form.name,form.page,form.code)">
					<Card class="card" :padding=5>
						<p slot="title">
							{{form.name}}
						</p>
						<img class="WH100" :src="form.img" />
					</Card>
				</li>
			</ul>
			<Divider orientation="left">数据源</Divider>
			<ul class="WH100 disRow">
				<li v-for="form in defaultData" @click="openForm(form.name,form.page,form.code)">
					<Card class="card" :padding=5>
						<p slot="title">
							{{form.name}}
						</p>
						<img class="WH100" :src="form.img" />
					</Card>
				</li>
			</ul>
		</Modal>
		<MYSQLForm ref="MYSQLForm"></MYSQLForm>
	</div>
</template>
<script>

	import MYSQLForm from '@/view/dataSource/components/form/mysql_form'


	export default {
		components: {
			MYSQLForm,
		},
		data() {
			return {
				modelTitle: '新建',
				modelShow: false,
				loading: true,
				relationData: [],
				noSQLData: [],
				graphData:[],
				bigData: [],
				flowData: [],
				defaultData:[],
			}
		},
		mounted() {
			const _this = this

		},
		methods: {
			show: function (dataSourceList) {
				this.reset();
				dataSourceList.forEach(d => {
					try {
						d.img = require('@/assets/images/icon_fileType/'+d.name+'.svg')
					}
					catch(err){
						d.img = require('@/assets/images/icon_fileType/default.svg')
					}

					d.page = d.name + "Form"
					if(d.cat == 'relationData'){
						this.relationData.push(d)
					}else if(d.cat == 'noSQLData'){
						this.noSQLData.push(d)
					}else if(d.cat == 'graphData'){
						this.graphData.push(d)
					}else if(d.cat == 'bigData'){
						this.bigData.push(d)
					}else if(d.cat == 'flowData'){
						this.flowData.push(d)
					}else{
						this.defaultData.push(d)
					}
				})
				this.modelTitle = '新增'
				this.modelShow = true
			},
			openForm: function (name, page, typeCode, isEdit, submitParam) {
				try {
					if(typeCode){
						console.log("请检查datasource的typeCode类型！！！！")
					}
					eval("this.$refs." + page).datasourceType = typeCode
					if (isEdit) {
						eval("this.$refs." + page).modalEdit = true
						eval("this.$refs." + page).submitParam = Object.assign({}, submitParam)
						eval("this.$refs." + page).modalTitle = '编辑'
					}else{
						this.modelShow = false
					}
					eval("this.$refs." + page).modalShow = true
				}catch (err){
					this.$Message.error({
						content: '无法找到表单信息，请检查配置',
						duration: 3
					})
				}

			},
			reset: function(){
				this.relationData = [];
				this.noSQLData = [];
				this.graphData = [];
				this.bigData = [];
				this.flowData = [];
				this.defaultData = [];
			}
		}
	}

</script>
<style>
	.disRow>li {
		list-style: none;
		margin-left: 20px;
		margin-right: 60px;
		box-sizing: border-box;
	}

	.WH100 {
		width: 100%;
		height: 100%;
	}

	.disColumn {
		display: flex;
		display: -webkit-flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.disRow {
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.ivu-card-head p,
	.ivu-card-head-inner {
		display: flex;
		display: -webkit-flex;
	}

	.card {
		width: 90px;
		height: 90px;
	}

	.ivu-card-head p {
		justify-content: center;
		align-items: center;
		font-size: 1px
	}

	.ivu-card-head {
		padding: 1px
	}

</style>
