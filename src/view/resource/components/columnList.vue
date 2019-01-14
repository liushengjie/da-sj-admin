<template>
	<div class="op-area">
		<Row>
			<Col span="12" size="small">
			<font size="3.5" style="padding-left:5px">字段</font>
			</Col>
			<Col span="12" size="small" style="text-align: right;padding-top:3px">
			<a href="javascript:void(0)" @click="showColList">清洗器({{$store.getters.procCount||0}})</a>
			</Col>
		</Row>

		<Row class="col-row ele-scroll">
			<Spin size="large" fix v-if="colloadingShow"></Spin>
			<Checkbox v-model="showHideCol">显示隐藏字段</Checkbox>
			<Col span="24" size="small" class="form-input col-list">
			<CellGroup>
				<Cell class="col-list" v-show="item.status==='1'||showHideCol" :disabled="item.status==='0'" v-for="(item, index) in $store.state.resource.resColList"
				 :title="item.col" :label="item.alias">
					<img class="col-type-icon" :src="colTypeIcon[item.changeType]" slot="icon">
					<img class="col-type-icon" :src="colTypeIcon.varchar" v-show="!item.changeType" slot="icon">
					<img class="col-type-icon" :src="colTypeIcon['pk']" slot="icon" v-if="item.pk==='1'">
					<img class="col-type-icon" :src="colTypeIcon['index']" slot="icon" v-if="item.idx==='1'">
					<Dropdown class="col-menu" slot="extra" trigger="click" transfer @on-click="showMenuModal($event, item)">
						<a href="javascript:void(0)">
							<Icon type="ios-arrow-down"></Icon>
						</a>
						<DropdownMenu slot="list" v-show="item.status==='1'">
							<DropdownItem name="addIndex">置为索引</DropdownItem>
							<DropdownItem name="rename">重命名</DropdownItem>
							<Dropdown name="changeType" placement="right-start" trigger="click" @on-click="showMenuModal($event, item)">
								<DropdownItem>
									转换数据类型
									<Icon type="ios-arrow-forward"></Icon>
								</DropdownItem>
								<DropdownMenu slot="list">
									<DropdownItem name="changeType-int" v-show="item.changeType!=='int'">整数</DropdownItem>
									<DropdownItem name="changeType-float" v-show="item.changeType!=='float'">小数</DropdownItem>
									<DropdownItem name="changeType-varchar" v-show="item.changeType!=='varchar'||!item.changeType">字符串</DropdownItem>
									<DropdownItem name="changeType-date" v-show="item.changeType!=='date'">日期</DropdownItem>
									<DropdownItem name="changeType-datetime" v-show="item.changeType!=='datetime'">日期时间</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							<DropdownItem name="dic"> 数据字典</DropdownItem>
							<DropdownItem v-if="item.changeType==='varchar'||!item.changeType" name="split"> 拆分</DropdownItem>
							<DropdownItem name="hide"> 隐藏</DropdownItem>
						</DropdownMenu>
						<DropdownMenu slot="list" v-show="item.status==='0'">
							<DropdownItem name="show">显示</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</Cell>
			</CellGroup>
			</Col>
		</Row>
		<split @addSplit="addSplit" :dsType="curDsType" :colName="curSplitName" ref="split"></split>
		<columnFilter :previewData="previewData" @renderColList="renderColList" :dsType="curDsType" :colList="$store.state.resource.resColList"
		 ref="colList"></columnFilter>
		<dictList ref="dictList" :curSplitName="curSplitName"></dictList>
	</div>
</template>
<script>
	import split from '@/view/resource/components/split'
	import columnFilter from '@/view/resource/components/columnFilter'
	import dictList from '@/view/resource/components/dictList'
	import * as resApi from '@/api/resource'
	export default {
		components: {
			split,
			columnFilter,
			dictList
		},
		props: ['curDsType', 'previewData'],
		data() {
			return {
				colloadingShow: false,
				showHideCol: false, // 显示隐藏字段
				curSplitIndex: 0,
				curSplitName: '',
				colTypeIcon: {
					date: require('@/assets/images/col-type/date.png'),
					varchar: require('@/assets/images/col-type/varchar.png'),
					datetime: require('@/assets/images/col-type/datetime.png'),
					float: require('@/assets/images/col-type/float.png'),
					int: require('@/assets/images/col-type/int.png'),
					index: require('@/assets/images/col-type/index.png'),
					pk: require('@/assets/images/col-type/pk.png')
				},
				colNameIndexObj: null
			}
		},
		methods: {
			showMenuModal(e, item) {
				this.curSplitName = item.col
				if (e === 'split') {
					this.$refs[e].modalShow = true
					if (!this.colNameIndexObj) {
						this.colNameIndexObj = new Object()
						this.$store.state.resource.resColList.forEach(col => {
							this.colNameIndexObj[col.col] = 1
						})
					}
				} else if (e === 'addIndex') {
					item.idx = '1'
				} else if (e === 'hide') {
					item.status = '0'
					this.renderColList()
				} else if (e === 'dic') {
					this.$refs.dictList.getDictList()
				} else if (e.includes('changeType-')) {
					item.changeType = e.split('-')[1]
				} else if (e === 'show') {
					item.status = '1'
					this.renderColList()
				}
				console.log(this.$store.state.resource.resColList)
			},
			addSplit(proc) {
				let originCol = this.$store.state.resource.resColList[this.curSplitIndex].originCol || this.curSplitName
				let newColName = originCol + '_' + this.colNameIndexObj[originCol]
				this.colNameIndexObj[originCol]++
				this.$store.state.resource.resColList.push({
					id: '',
					resId: '',
					origin: this.curSplitName,
					aliasId: '自定义拆分表格_' + this.curSplitName,
					colAlias: '自定义拆分表格_' + this.curSplitName,
					changeType: this.$store.state.resource.resColList[this.curSplitIndex].changeType,
					type: this.$store.state.resource.resColList[this.curSplitIndex].type,
					attr: '0',
					col: newColName,
					colCache: newColName,
					status: '1',
					proc: [proc]
				})
				console.log(JSON.stringify(this.$store.state.resource))
				this.renderColList()
			},
			renderColList() {
				this.$emit('renderColList', true)
			},
			showColList() {
				this.$refs.colList.colListShow = true
			}
		}
	}

</script>
<style>
	.ivu-cell-disabled .ivu-cell-label {
		color: #c5c8ce;
	}

</style>
