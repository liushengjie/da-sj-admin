<template>
    <div style="height:100%;">
        <div id="mynetwork" style="height:100%;position: absolute;top:0;left: 0;width: 100%;"></div>
        <interSectModal ref="interSectModal" :originRes="currentNode"></interSectModal>
        <unionModal ref="unionModal" :originRes="currentNode"></unionModal>
        <filterModal ref="filterModal" :originRes="currentNode"></filterModal>
        <previewModal ref="previewModal"></previewModal>
    </div>
</template>
<script>
    import cytoscape from 'cytoscape';
    import klay from 'cytoscape-klay';
    import cxtmenu from 'cytoscape-cxtmenu';
    import interSectModal from './interSectModal'
    import unionModal from './unionModal'
    import filterModal from './filterModal'
    import previewModal from './previewModal'
    import res_icon from '@/assets/images/res_icon.png'
    import inter_icon from '@/assets/images/inter_icon.png'

    cytoscape.use( cxtmenu );
    cytoscape.use( klay );
    export default {
        components: {
            interSectModal,
            unionModal,
            previewModal,
            filterModal
        },
        data() {
            return {
                currentNode: '', //当前操作的节点
            }
        },
        mounted() {
        },
        methods: {
            initNetwork() {
                const _this = this;
                this.cy = cytoscape({
                    container: document.getElementById('mynetwork'),
                    boxSelectionEnabled: false,
                    autounselectify: true,
                    style:  cytoscape.stylesheet()
                        .selector('node')
                        .css({
                            'height': 45,
                            'width': 45,
                            'background-fit': 'cover',
                            'border-width': 0,
                            'background-opacity': 0,
                            'content': 'data(name)',
                            'text-valign': 'center',
                            "text-valign": "bottom",
                            "font-size": 12,
                            'color': 'white',
                            'text-outline-width': 2,
                            'text-outline-color': '#888',
                        })
                        .selector('edge')
                        .css({
                            'curve-style': 'bezier',
                            'width': 1,
                            'target-arrow-shape': 'triangle',
                            'line-color': '#ffaaaa',
                            'target-arrow-color': '#ffaaaa'
                        }).selector("[type='res']")
                        .css({
                            'background-image': res_icon
                        }).selector("[type='InterSect']")
                        .css({
                            'background-image': inter_icon
                        }).selector("[type='Filter']")
                        .css({
                            'background-image': inter_icon
                        }),
                });

                // this.cy.cxtmenu({
                //     selector: 'node',
                //     openMenuEvents: 'click',
                //     commands: [
                //         {
                //             content: '预览',
                //             select: function(ele){
                //                 console.log(ele.data())
                //                 _this.$refs.previewModal.showModal(_this.cy.json().elements,ele.data());
                //             }
                //         },{
                //             content: '预览',
                //             select: function(ele){
                //                 console.log(ele)
                //             }
                //         }
                //     ]
                // });
                this.cy.cxtmenu({
                    selector: 'node',
                    openMenuEvents: 'cxttap',
                    commands: [
                        {
                            content: '交集',
                            select: function(ele){
                                _this.currentNode = ele.data();
                                console.log(_this.currentNode)
                                _this.$refs.interSectModal.showModal();
                            }
                        },
                        {
                            content: '并集',
                            select: function(ele){
                                _this.currentNode = ele.data();
                                _this.$refs.unionModal.showModal();
                            }
                        },
                        {
                            content: '差集',
                            select: function(ele){
                                _this.currentNode = ele.data();
                                _this.$refs.unionModal.showModal();
                            }
                        },
                        {
                            content: '分组',
                            select: function(ele){
                                _this.currentNode = ele.data();
                                _this.$refs.unionModal.showModal();
                            }
                        },
                        {
                            content: '过滤',
                            select: function(ele){
                                _this.currentNode = ele.data();
                                _this.$refs.filterModal.showModal();
                            }
                        },
                        {
                            content: '删除',
                            select: function(ele){
                                _this.removeNode(ele.data().id)
                            }
                        }
                    ]
                });

                this.layout = {
                    name: 'klay',
                    fit: false,
                    klay: {
                        borderSpacing: 120,
                        spacing: 120, 
                    },
                }
                // this.cy.layout(this.layout).run();
                this.cy.on('tap', 'node', function(evt){
                    var node = evt.target;
                    console.log(node.data())
                    _this.$refs.previewModal.showModal(_this.cy.json().elements,node.data());
                });
            },

            addNode(name, pos=null, type, source=[], param, col){
                if (!this.cy) {
                    this.initNetwork();
                }
                var _node = {
                    group: "nodes",
                    data: { 
                        name: name,
                        type: type,
                        param: param,
                        col:col
                    }
                }
                if(pos){
                    var _pos = {
                        x : pos[0],
                        y : pos[1]
                    }
                    _node.position = _pos
                } 
                var _n = this.cy.add(_node)

                if(source.length > 0){  //如果来源大于0个 ，则画出edges
                    var _edges = []
                    source.forEach( s => {
                        _edges.push({
                            group: "edges",
                            data: { 
                                source: s,
                                target: _n.data().id
                            }
                        })
                    })
                    this.cy.add(_edges)
                    this.cy.style().update()
                    this.cy.layout(this.layout).run();
                }
                this.$emit('getResDetail', _node)
            },
            removeNode(nodeId){
                this.cy.remove(this.cy.$('#'+nodeId))
            },
            getNodeByType(type=''){
                let exp = type == '' ? "type" : "type='" + type + "'"
                var ret = []
                this.cy.filter('node['+exp+']').forEach(x => {
                    ret.push(x.data())
                })
                return ret
            },
            getTargetNode() {
                const ele = this.cy.json().elements;
                let targetNode = '';
                let count = 0;
                let sourceList = new Array();
                let targetList = new Array();
                ele.edges.some(edge => {
                    sourceList.push(edge.data.source);
                    targetList.push(edge.data.target);
                });
                ele.nodes.forEach(node => {
                    let flag = '';
                    if (!sourceList.includes(node.data.id)&&targetList.includes(node.data.id)) {
                        targetNode = node.data.id;
                        count++;
                    }
                });
                if (count === 1) {
                    return targetNode;
                } else {
                    return false;
                }
            }
        },
        watch: {
        }
    }
</script>

<style>
</style>