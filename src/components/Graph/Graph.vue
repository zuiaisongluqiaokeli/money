<template>
    <!-- <transition name="el-zoom-in-center"> -->
    <div class="graph" :style="{ height: height }">
        <div :id="id" class="map-graph" :loading="loading"></div>
        <template>
            <transition-group name="el-fade-in-linear">
                <NodeInfo v-if="nodeInfoVisible" key="nodeInfo" :node-info="nodeInfo" @close="nodeInfoVisible = false" />
                <EdgeInfo v-if="edgeInfoVisible" key="edgeInfo" :edge-info="edgeInfo" @close="nodeInfoVisible = false" />
            </transition-group>
        </template>
    </div>
    <!-- </transition> -->
</template>

<script>
import networkConfigJson from './network.config.json';
import { Main } from '@dataexa/sati-engine';
import moment from 'moment';
// import { previewReasoningResult } from '@/services/basicKnowledge';
import NodeInfo from './components/NodeInfo';
import EdgeInfo from './components/EdgeInfo';

export default {
    components: { NodeInfo, EdgeInfo },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        //掉不同数据
        vertexId: {
            type: [String, Number],
            required: true
        },
        graphName: {
            type: String,
            required: true
        },
        //生成不同画布
        id: {
            type: String,
            default: 'graph-default'
        },
        height: {
            type: String,
            default: '700px'
        },
        infoData: {
            type: Object,
            default: {}
        }
    },
    provide: {
        provide() {
            return {
                graph: this.graph
            };
        }
    },

    data() {
        return {
            loading: true,
            graph: null,
            reasoningType: null,
            nodeInfoVisible: false,
            edgeInfoVisible: false,
            nodeInfo: null,
            edgeInfo: null,
        };
    },
    mounted() {
        this.initCanvas();
        this.renderInformationGraph();
    },

    methods: {
        /**
         * 图谱初始化
         */
        initCanvas() {
            this.graph = Main.network('#' + this.id, networkConfigJson); //配置图谱信息
            this.graph
                // 节点点击
                .on('click/node', ({ node }) => {
                    const { properties = {} } = node;

                    this.nodeInfo = { ...node, ...properties };
                    this.nodeInfoVisible = true;
                    this.edgeInfoVisible = false;
                })
                .on('click/edge', ({ edge }) => {
                    const { properties = {} } = edge;

                    this.edgeInfo = { ...edge, ...properties };
                    this.edgeInfoVisible = true;
                    this.nodeInfoVisible = false;
                })
                // 点击空白
                .on('click/blank', () => {
                    this.nodeInfo = null;
                    this.edgeInfo = null;
                    this.edgeInfoVisible = false;
                    this.nodeInfoVisible = false;
                })
                // 节点选择
                .on('select', (select) => {
                    // console.log("initCanvas -> select", select);
                })
                // 缩放
                .on('zoom', (zoom) => {
                    // console.log("initCanvas -> zoom", zoom);
                })
                .on('layout/start', () => {
                    // console.log("initCanvas -> layout/start");
                })
                .on('layout/end', () => {
                    // console.log("initCanvas -> layout/end");
                });
            this.graph.config.set('layout.type', 'simulation');
            window.addEventListener('resize', () => {
                this.$nextTick(() => {
                    const dom = document.getElementById(this.id);
                    const width = dom.offsetWidth;
                    const height = dom.offsetHeight;
                    this.graph.view.changeSize(width, height);
                    this.graph.view.render.service.fitView();
                });
            });
        },
        async renderInformationGraph() {
            this.graph.config.set('edge.label.enable', true);
            // const response = await previewReasoningResult(this.vertexId, this.reasoningType);
            this.infoData.edges.forEach((item) => {
                item.end = item.end.toString();
                item.id = item.id.toString();
                item.start = item.start.toString();
            });
            this.infoData.vertices.forEach((item) => {
                item.id = item.id.toString();
            });
            this.addToGraph(this.infoData);
            setTimeout(() => {
                const vertices = [...this.graph.nodes.values()];
                console.log(vertices);
                let vertice = [].concat(vertices).find((v) => v.labels.includes('root'));
                if (vertice) {
                    this.graph.view.layout.setRootNodes([vertice.id]);
                    this.graph.config.settings.edge.label.enable = true;
                    this.graph.view.fit();
                    this.loading = false;
                }
            }, 200);
        },
        /**
         * 增加图谱数据
         */
        addToGraph(graphData) {
            let { vertices: nodes, edges } = graphData;
            nodes = nodes || [];
            edges = edges || [];

            nodes.forEach((node) => {
                const { properties } = node;
                const { name } = properties;

                node.name = node.name || name || properties['名称'];
                // if (avatar) {
                //   // 'http://192.168.1.121:8765'
                //   // 通过操作记录等恢复的数据avatar已经经过转换,不能再转一次
                //   if (
                //     avatar.indexOf(
                //       "/server-app/api/gbasemanage/rest/manager/graph/db/pic/find-one?imgFile="
                //     ) > -1
                //   )
                //     return;
                //   properties.avatar =
                //     location.origin +
                //     "/server-app/api/gbasemanage/rest/manager/graph/db/pic/find-one?imgFile=" +
                //     properties.avatar;
                // }
            });
            edges.forEach((edge) => {
                edge.source = edge.start;
                edge.target = edge.end;
                edge.properties.name = edge.type;
                edge.properties.type = edge.type;
            });
            console.log('点', '边', nodes, edges);
            this.graph.put({
                nodes,
                edges
            });
        },
        /**
         * 拓展
         */
        async expand(id) {
            this.vertexId = id ? id : this.vertexId;
            const menus = await this.getTypeList();
            const types = menus.map((menu) => menu.name);
            const graphData = await this.graphExpand(types);

            this.addToGraph(graphData);
            // this.addToGraph(graphExpandJson.object);
        },
        getImageMapValue(image) {
            if (!table[image]) {
                return '';
            }
            return table[image];
        },

        /**
         * 获取类型
         */
        async getTypeList() {
            const graphName = this.graphName;
            const vertexId = this.vertexId;
            const level = 0;
            const parent = '拓展';
            const data = await nodeExpandRelationTypeList(graphName, vertexId, level, parent);
            const { success, object } = data;

            if (success) {
                return object.menu;
            }

            return [];
        },
        /**
         * 拓展数据
         */
        async graphExpand(types) {
            const params = {
                key: this.vertexId,
                graphName: this.graphName,
                startTime: moment().subtract(3, 'days').format('YYYY/MM/DD'),
                endTime: moment().format('YYYY/MM/DD'),
                clusterCacheKey: Date.now(),
                pageIndex: 1,
                pageSize: 30,
                virtualFlag: false,
                virtualLastId: '',
                clusterLastId: '',
                types: types,
                subIds: [String(this.vertexId)],
                virtualCount: 1,
                virtualNum: 10,
                expandFilter: {
                    relationType: null,
                    relationWeight: null,
                    dimension: null,
                    timeFilter: null,
                    all: types
                }
            };
            const data = await graphExpandByClassification(params);
            // const data = graphExpandJson;
            const { success, object, msg } = data;

            if (!success) {
                this.$message.error(msg);
            }

            return object || {};
        },
        /**
         * 清空图谱数据
         */
        clearGraph() {
            this.graph.clear();
        }
    }
};
</script>

<style lang="scss" scoped>
.graph {
    width: 100%;
    .map-graph {
        width: 100%;
        height: 100%;
        margin: auto;
        background-image: url('~@/assets/img/SketchpadBackground.png');
        border: 1px solid #dddddd;

        /deep/ .g6-tooltip {
            display: none;
        }
    }

    .close {
        position: absolute;
        top: 5rem;
        right: 24px;
        font-size: 32px;

        &.show-info {
            right: calc(30vw + 24px);
        }
    }
}
</style>
