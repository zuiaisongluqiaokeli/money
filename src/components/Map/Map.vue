<template>
    <div class="map">
        <div id="cesium" class="cesium"></div>
        <Timeline></Timeline>
        <GisInfoPanel></GisInfoPanel>
        <LeftSideBar></LeftSideBar>
        <RangeSetting v-if="showRangeSetting" :cancel="() => (this.showRangeSetting = false)"></RangeSetting>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import LeftSideBar from './views/LeftSideBar/LeftSideBar';
import Main from './src/Main';
import ContextMenu from './views/ContextMenu/index';
import Timeline from './views/TimeLine';
import RangeSetting from './views/ContextMenu/RangeSetting';
import GisInfoPanel from './views/GisInfoPanel';

const Cesium = window.Cesium;
let viewer = null;
let gisvis = null;

export default {
    components: {
        GisInfoPanel,
        RangeSetting,
        LeftSideBar,
        Timeline
    },
    provide: {
        provide: () => {
            return {
                gisvis,
                viewer
            };
        }
    },
    data() {
        return {
            showRangeSetting: false,
            legend: [],
            countCollection: {},
            entitiesVisibleCollection: {},
            attackAreaAvailableCollection: {},
            attackAreaAvailable: true,
            viewer: {},
            imageryProviderMap: [
                {
                    name: '卫星图',
                    url: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali',
                    iconUrl: 'images/weixing.png'
                },
                {
                    name: '行政区域图',
                    url: 'http://mt1.google.cn/vt/lyrs=m&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali',
                    iconUrl: 'images/xingzhengquyu.png'
                }
            ]
        };
    },

    computed: {
        ...mapState('canvasInfo', ['canvasType', 'clusterCacheKey', 'extendRecord']),
        ...mapState('map', ['gisRightSelectedEntity', 'gisEntities', 'rangeSetting', 'gisLabelShow', 'gisLines']),
        ...mapGetters('graphInfo', ['graphName']),
        ...mapGetters('map', ['gisEntityIds', 'gisLinesIds'])
    },

    mounted() {
        window.map = this;
        gisvis = new Main({ el: this.$el });
        ({ viewer } = gisvis); //向下传递
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this.$el.addEventListener('contextmenu', (event) => event.preventDefault());
        gisvis.emitter.on(
            EventType.RIGHT_CLICK,
            (params) => {
                const { entity, position, create } = params;
                this.changeGisRightSelectedEntity(entity);
                gisvis.contextMenu = new ContextMenu({}, this.$el);
                gisvis.contextMenu.instance.position = position;
            },
            gisvis
        );
        gisvis.emitter.on(
            EventType.CONTEXT_MENU_CLICK,
            (data) => {
                let { action } = data;
                switch (action) {
                    case 'expand':
                        // this.$store.commit('home/changeLoading',true)
                        this.changeLoading(true);
                        const vertice = this.gisRightSelectedEntity;
                        const types = [],
                            ids = this.gisEntities.map((v) => v.id);
                        this.$api.getNextMenu(parseInt(vertice.id), '拓展', vertice.level || 0, this.graphName).then((response) => {
                            let res = response.data;
                            res.object.menu.forEach((v) => {
                                types.push(v.name);
                            });
                            const rootState = this.$store.state;
                            let extendOpen = rootState.userInfo.frontendConfig.EXTEND_OPEN,
                                extendSize = rootState.userInfo.frontendConfig.EXTEND_SIZE,
                                time = {
                                    startTime: rootState.home.startTime,
                                    endTime: rootState.home.endTime
                                },
                                extendRecord = this.extendRecord[vertice.id],
                                count = (extendRecord && extendRecord.count) || 1,
                                virtualFlag = false,
                                virtualNum = rootState.userInfo.frontendConfig.VIRTUAL_NODE_NUMBER,
                                graphName = rootState.graphInfo.name,
                                expandFilter = {
                                    relationType: null,
                                    relationWeight: null,
                                    dimension: null,
                                    timeFilter: null,
                                    all: types
                                };
                            let id = vertice.id,
                                level = vertice.level || 0;
                            let subIds = ids.join(',');
                            let virtualCount = 1;
                            const clusterCacheKey = this.clusterCacheKey;
                            newExtendVertice(
                                extendSize,
                                extendOpen,
                                count,
                                id,
                                time.startTime,
                                time.endTime,
                                virtualFlag,
                                virtualNum,
                                clusterCacheKey,
                                level,
                                subIds,
                                types.join(','),
                                virtualCount,
                                graphName,
                                JSON.stringify(expandFilter)
                            ).then((res) => {
                                // this.$store.commit("home/changeLoading", false);
                                this.changeLoading(false);
                                if (res.data.success) {
                                    if (res.data.object) {
                                        let result = res.data.object;
                                        let entities = result.vertices.filter((v) => {
                                            return !this.gisEntityIds.includes(v.id);
                                        });
                                        this.updateGisEntities([].concat(entities, this.gisEntities));
                                        let lines = result.edges.filter((e) => {
                                            return !this.gisLinesIds.includes(e.id);
                                        });
                                        console.log(lines);
                                        this.updateGisLines([].concat(lines, this.gisLines));
                                        let gisData = {
                                            entities: entities,
                                            labelShow: this.gisLabelShow
                                        };
                                        gisvis.emitter.emit('gis-render-data', gisData);

                                        this.changeGisRightSelectedEntity(null);
                                    } else {
                                        this.$message.success({ message: '无拓展结果' });
                                    }
                                } else {
                                    this.$message.error({
                                        message: res.data.msg || res.data.errorMsg || '拓展失败',
                                        duration: 1500
                                    });
                                }
                            });
                        });
                        break;
                    case 'range-setting':
                        this.showRangeSetting = true;
                        break;
                    case 'range':
                        if (this.rangeSetting) {
                            console.log(this.rangeSetting);
                            this.rangeSearch();
                        } else {
                            // this.showRangeSetting = true;
                            this.$message.error({
                                message: '请先进行搜索范围设置',
                                duration: 1500
                            });
                        }
                        break;
                    case 'delete':
                        gisvis.viewer.entities.removeById(this.gisRightSelectedEntity.id);
                        if (gisvis.contextMenu) {
                            gisvis.contextMenu.destroy();
                            gisvis.contextMenu = null;
                        }
                        let tempEntities = this.gisEntities.filter((e) => e.id !== this.gisRightSelectedEntity.id);
                        this.updateGisEntities(tempEntities);
                        console.log(this.gisLines);
                        let tempLines = this.gisLines.filter(
                            (e) => e.source !== this.gisRightSelectedEntity.id && e.target !== this.gisRightSelectedEntity.id
                        );
                        this.updateGisLines(tempLines);
                        this.changeGisRightSelectedEntity(null);
                        break;
                    case 'scope':
                        console.log(this.gisEntities);
                        if (gisvis.viewer.entities.getById(this.gisRightSelectedEntity.id).ellipse) {
                            gisvis.viewer.entities
                                .getById(this.gisRightSelectedEntity.id)
                                .ellipse.show.setValue(
                                    !gisvis.viewer.entities.getById(this.gisRightSelectedEntity.id).ellipse.show.getValue()
                                );
                        } else {
                            let scopedEntities = [];
                            this.gisEntities.forEach((e) => {
                                if (e.id === this.gisRightSelectedEntity.id) {
                                    scopedEntities.push(e);
                                }
                            });
                            let params = {
                                entities: scopedEntities,
                                radius: 250,
                                color: '#ffcc33'
                            };
                            gisvis.emitter.emit('gis-scope-render', params);
                        }
                        if (gisvis.contextMenu) {
                            gisvis.contextMenu.destroy();
                            gisvis.contextMenu = null;
                        }

                        break;
                }
            },
            gisvis
        );
        // this.initMap();
    },

    beforeDestroy() {},

    methods: {
        test() {
            console.log('AMD YES');
        },
        /**
         * 初始化地图
         */
        initMap() {
            const imageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: this.imageryProviderMap[0].url
                // url: 'http://localhost:8080/map/{z}/{y}/{x}.jpg',
                // fileExtension: "jpg"
            });
            const maps = this.imageryProviderMap
                .map((provider) => {
                    provider.creationFunction = () =>
                        new Cesium.UrlTemplateImageryProvider({
                            url: provider.url
                        });
                    provider.toolTip = provider.name;

                    return provider;
                })
                .map((options) => new Cesium.ProviderViewModel(options));

            window.viewer = viewer = new Cesium.Viewer('cesium', {
                imageryProvider: imageryProvider,
                imageryProviderViewModels: maps,
                terrainProviderViewModels: [],
                // geocoder                 : new Cesium.GeocoderService({
                //   url: ''
                // }),
                animation: false,
                timeline: false,
                navigationHelpButton: false,
                // scene3DOnly: true,
                sceneModePicker: false,
                creditContainer: document.createElement('div'),
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                baseLayerPicker: false,
                infoBox: false
                // mapMode2D: Cesium.MapMode2D.ROTATE
            });

            // this.setHomeButton().flyHome();
        },
        /**
         * 范围搜索
         */
        rangeSearch() {
            // this.changeLoading(true);
            let vertices = this.gisEntities.filter((e) => e.id === this.gisRightSelectedEntity.id);
            //当前实体对象
            let vertex = vertices[0];
            let params = {
                lat: vertex.properties.latitude,
                lng: vertex.properties.longitude,
                scanColor: Cesium.Color.fromCssColorString('#00c6ab').withAlpha(0.8),
                radius: this.rangeSetting.range * 1000
            };

            gisvis.emitter.emit('gis-radar-render', params);
            if (gisvis.contextMenu) {
                gisvis.contextMenu.destroy();
                gisvis.contextMenu = null;
            }
            this.showRangeSetting = false;
            setTimeout(() => {
                this.$api
                    .getGisExpand(this.graphName, vertex, this.rangeSetting.range, this.rangeSetting.labels)
                    .then((res) => {
                        this.changeLoading(false);
                        if (res.data.success) {
                            if (res.data.object) {
                                let result = res.data.object;
                                let entities = result.vertices.filter((v) => {
                                    return !this.gisEntityIds.includes(v.id);
                                });
                                if (entities.length) {
                                    this.updateGisEntities([].concat(entities, this.gisEntities));
                                    let gisData = {
                                        entities: entities,
                                        labelShow: this.gisLabelShow
                                    };
                                    gisvis.emitter.emit('gis-render-data', gisData);
                                } else {
                                    gisvis.viewer.entities.removeById('marsRadarScan');
                                    // gisvis.viewer.scene.postProcessStages._stages.forEach(i => {
                                    //   i.enabled = false;
                                    // });
                                    this.$message.success({ message: '无搜索结果' });
                                }
                                this.updateGisEntities([].concat(entities, this.gisEntities));
                                let gisData = {
                                    entities: entities,
                                    labelShow: this.gisLabelShow
                                };
                                gisvis.emitter.emit('gis-render-data', gisData);

                                this.changeGisRightSelectedEntity(null);
                            } else {
                                // gisvis.viewer.scene.postProcessStages._stages.forEach(i => {
                                //   i.enabled = false;
                                // });
                                gisvis.viewer.entities.removeById('marsRadarScan');
                                this.$message.success({ message: '无搜索结果' });
                            }
                        } else {
                            gisvis.viewer.entities.removeById('marsRadarScan');
                            // gisvis.viewer.scene.postProcessStages._stages.forEach(i => {
                            //   i.enabled = false;
                            // });
                            this.$message.error({
                                message: res.data.msg || res.data.errorMsg || '搜索失败',
                                duration: 1500
                            });
                        }
                    })
                    .catch(() => {
                        gisvis.viewer.entities.removeById('marsRadarScan');
                        this.$message.error({
                            message: '服务端异常，请联系管理员',
                            duration: 1500
                        });
                    });
            }, 2000);
        },
        ...mapMutations('map', ['changeGisRightSelectedEntity', 'updateGisEntities', 'updateGisLines']),
        ...mapMutations('home', ['changeLoading'])
    }
};
</script>

<style lang="scss" scoped>
.map {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 3.58rem;
    left: 0;
    z-index: 10000;

    .cesium {
        height: calc(100% - 3.58rem);
    }
    /deep/ .cesium-viewer-timelineContainer {
        left: calc(3.58rem + 118px) !important;
        width: calc(100% - 3.58rem - 118px);
        .cesium-timeline-ticLabel {
            display: none;
        }
    }
}
</style>
