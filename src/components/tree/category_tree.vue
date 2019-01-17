<template>
	<Card title="资源类型" icon="ios-options" :padding="0" shadow style="height: 90%;">
		<a href="#" slot="extra" @click.prevent="append">
			新建
		</a>
		<CellGroup>
			<Tree ref="tree" :data="category_data" style="padding-left:15px" @on-select-change="onChange"></Tree>
		</CellGroup>
	</Card>
</template>
<script>
	import * as commonApi from '@/api/common'
	export default {
		data() {
			return {
				category_data: []
			}
		},
		mounted() {
			this.getTree()
		},
		methods: {
			getTree() {
				let _this = this
				commonApi.getTree('res').then(res => {
					if (res.success) {
						_this.category_data = res.data
					}
				})
			},
			add(params, data) {
				if (params.content == undefined || params.content == '') {
					this.$Message.warning('请输入名称')
				} else {
					var pid = 0
					if (data) {
						pid = data.id
					}
					var addParam = {
						name: params.content,
						pid: pid,
						sort: 1,
						type: 'res'
					}
					commonApi.addCategory(addParam).then(res => {
						if (res.success) {
							this.$Message.success('保存成功')
							this.getTree()
						}
					})
				}
			},
			append() {
				if (this.$refs.tree.getSelectedNodes().length != 0) {
					var data = this.$refs.tree.getSelectedNodes()[0]
					data.expand = true
					const children = data.children || []
					children.push(this.renderNode(data))
					this.$set(data, 'children', children)
				} else {
					this.category_data.push(this.renderNode())
				}
			},
			onChange(node, e) {
				console.log(node)
				this.$store.state.resource.res.category = node[0].id
			},
			noadd(params) {
				const root = params.root
				const node = params.node
				const data = params.data
				const parentKey = root.find(el => el === node).parent
				const parent = root.find(el => el.nodeKey === parentKey).node
				const index = parent.children.indexOf(data)
				parent.children.splice(index, 1)
			},
			renderNode(data) {
				return {
					expand: true,
					render: (h, params) => {
						return h(
							'span', {
								style: {
									display: 'inline-block',
									width: '100%'
								}
							},
							[
								h('span', [
									h('Icon', {
										props: {
											type: 'ios-folder-outline'
										},
										style: {
											marginRight: '8px'
										}
									}),
									h('Input', {
										props: {
											placeholder: '输入名称',
											size: 'small',
											type: 'text',
											value: params.row
										},
										style: {
											width: '30%'
										},
										on: {
											input: event => {
												params.content = event
											}
										}
									})
								]),
								h(
									'span', {
										style: {
											display: 'inline-block',
											float: 'right',
											marginRight: '32px'
										}
									},
									[
										h('Button', {
											props: {
												icon: 'ios-checkmark',
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.add(params, data)
												}
											}
										}),
										h('Button', {
											props: {
												icon: 'ios-close',
												type: 'text',
												size: 'small'
											},
											on: {
												click: () => {
													this.noadd(params)
												}
											}
										})
									]
								)
							]
						)
					}
				}
			}
		}
	}

</script>
<style>
</style>
