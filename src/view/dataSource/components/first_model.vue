<template>
	<div class="">
		<Modal v-model="modelShow" :title="modelTitle" :loading="loading" width="800">
			<Divider orientation="left">关系型数据源</Divider>
			<ul class="WH100 disRow">
				<li v-for="form in relationData" @click="openForm(form.name,form.page)">
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
				<li v-for="form in noSQLData" @click="openForm(form.name,form.page)">
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
				<li v-for="form in bigData" @click="openForm(form.name,form.page)">
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
				<li v-for="form in graphData" @click="openForm(form.name,form.page)">
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
				<li v-for="form in flowData" @click="openForm(form.name,form.page)">
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
	import png1 from '@/assets/images/icon_fileType/1.svg'
	import png2 from '@/assets/images/icon_fileType/2.svg'
	import png3 from '@/assets/images/icon_fileType/3.svg'
	import png4 from '@/assets/images/icon_fileType/4.svg'
	import png5 from '@/assets/images/icon_fileType/5.svg'
	import png6 from '@/assets/images/icon_fileType/6.svg'
	import png7 from '@/assets/images/icon_fileType/7.svg'
	import png8 from '@/assets/images/icon_fileType/8.svg'
	import png9 from '@/assets/images/icon_fileType/9.svg'
	import png10 from '@/assets/images/icon_fileType/10.svg'
	import png11 from '@/assets/images/icon_fileType/11.svg'
	import png12 from '@/assets/images/icon_fileType/12.svg'
	import png13 from '@/assets/images/icon_fileType/13.svg'
	import png14 from '@/assets/images/icon_fileType/14.svg'
	import png15 from '@/assets/images/icon_fileType/15.svg'
	import png16 from '@/assets/images/icon_fileType/16.svg'
	import png17 from '@/assets/images/icon_fileType/17.svg'
	import png18 from '@/assets/images/icon_fileType/18.svg'
	import png19 from '@/assets/images/icon_fileType/19.svg'
	import png20 from '@/assets/images/icon_fileType/20.svg'
	import png21 from '@/assets/images/icon_fileType/21.svg'
	import png22 from '@/assets/images/icon_fileType/22.svg'

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
				relationData: [{
						name: 'MySQL',
						img: png2,
						page: "MYSQLForm"
					},
					{
						name: 'ORACLE',
						img: png4,
						page: '2'
					},
					{
						name: 'SQL SERVER',
						img: png10,
						page: '2'
					},
					{
						name: 'DB2',
						img: png11,
						page: '2'
					}
				],
				noSQLData: [{
						name: 'Excel',
						img: png1,
						page: '0'
					},
					{
						name: 'CSV',
						img: png15,
						page: '1'
					},
					{
						name: 'FTP',
						img: png22,
						page: '2'
					},
					{
						name: 'MONGODB',
						img: png9,
						page: '2'
					}
				],
				bigData: [{
					name: 'HIVE',
					img: png3,
					page: '0'
				}, {
					name: 'SPARK',
					img: png6,
					page: '0'
				}, {
					name: 'IMPALA',
					img: png8,
					page: '0'
				}],
				graphData: [{
					name: 'NEO4J',
					img: png1,
					page: '0'
				}],
				flowData: [{
						name: 'API-RESFUL',
						img: png21,
						page: '0'
					},
					{
						name: 'KAFKA',
						img: png2,
						page: '1'
					},
					{
						name: 'ACTIVIMQ',
						img: png4,
						page: '2'
					},
					{
						name: 'RABBITMQ',
						img: png4,
						page: '2'
					}
				],

			}
		},
		mounted() {
			const _this = this
		},
		methods: {
			openForm: function (name, page, isEdit, dsParam) {
				if (isEdit) {
					eval("this.$refs." + page).modalEdit = true
					eval("this.$refs." + page).dsParam = Object.assign({}, dsParam)
					eval("this.$refs." + page).modalTitle = '编辑'
				}else{
					this.modelShow = false
				}
				eval("this.$refs." + page).modalShow = true
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
