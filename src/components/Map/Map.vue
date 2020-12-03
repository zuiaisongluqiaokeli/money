<template>
  <div class="map">
    <div id="cesium" class="cesium"></div>
    <div class="left-side">
      <MapLegend />
    </div>
    <Timeline></Timeline>
    <GisInfoPanelDetail></GisInfoPanelDetail>
    <!-- <MapInfoPanel></MapInfoPanel> -->
    <LeftSideBar />
    <RangeSetting
      v-if="showRangeSetting"
      :close="() => (this.showRangeSetting = false)"
    ></RangeSetting>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import LeftSideBar from "./views/LeftSideBar/LeftSideBar";
import Main from "./src/Main";
import { listenMapEvents } from "./mapEventProxy";
import ContextMenu from "./views/ContextMenu/index";
import Timeline from "./views/TimeLine";
import RangeSetting from "./views/RangeSetting";
import sativis from "../../sati";
import { newExtendVertice } from "@/assets/api/expand";
import GisInfoPanelDetail from "./views/GisInfoPanelDetail"; //查看详情
import MapLegend from "./views/MapLegend"; //左下侧面板
import { emitter, EventType } from "./src/EventEmitter";
// import MapInfoPanel from "./views/MapInfoPanel"
const Cesium = window.Cesium;
let viewer = null;
let gisvis = null;

export default {
  components: {
    GisInfoPanelDetail,
    RangeSetting,
    LeftSideBar,
    Timeline,
    MapLegend,
  },
  provide: {
    provide: () => {
      return {
        gisvis, //gisvis:gisvis 传出去对象
        viewer,
      };
    },
  },
  data() {
    return {
      showRangeSetting: false, //范围->设置
      rightEntityPosition:{}, //右键实体
      imageryProviderMap: [
        {
          name: "卫星图",
          url:
            "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",
          iconUrl: "images/weixing.png",
        },
        {
          name: "行政区域图",
          url:
            "http://mt1.google.cn/vt/lyrs=m&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",
          iconUrl: "images/xingzhengquyu.png",
        },
      ],
      // popper: null,
      // currentEntity: null,
    };
  },

  computed: {
    ...mapState("canvasInfo", [
      "canvasType",
      "clusterCacheKey",
      "extendRecord",
    ]),
    ...mapState("map", [
      "gisRightSelectedEntity",
      "gisEntities",
      "allEntityBackEnd",
      "rangeSetting",
      "gisLabelShow",
      "gisLines",
    ]),
    ...mapGetters("graphInfo", ["graphName"]),
    ...mapGetters("map", ["gisEntityIds", "gisLinesIds"]),
  },

  mounted() {
    window.map = this;
    gisvis = new Main({ el: this.$el });
    ({ viewer } = gisvis); //向下传递
    // viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    //   //取消右键点击事件
    //   Cesium.ScreenSpaceEventType.RIGHT_CLICK
    // );
    this.$el.addEventListener("contextmenu", (event) => event.preventDefault());
    //listenMapEvents(gisvis, this.changeGisRightSelectedEntity);
    gisvis.emitter.on(
      "gis-right-click",
      (params) => {
        const { entity, position, create,cartesian } = params;
        this.rightEntityPosition = cartesian
        this.changeGisRightSelectedEntity(entity.id); //右侧实体
        gisvis.contextMenu = new ContextMenu({}, this.$el);
        gisvis.contextMenu.instance.position = position;
      },
      gisvis
    );
    //点具体的项
    gisvis.emitter.on(
      "gis.context-menu-item-click",
      (data) => {
        let { action } = data;
        console.log("转盘数据", action);
        switch (action) {
          //扩展
          case "expand":
            // this.$store.commit('home/changeLoading',true)
            this.changeLoading(true);
            const vertice = this.gisRightSelectedEntity;
            const types = [], //所有名称
              ids = this.allEntityBackEnd.map((v) => v.id);
            this.$api
              .getNextMenu(
                parseInt(vertice.id),
                "拓展",
                vertice.level || 0,
                this.graphName
              )
              .then((response) => {
                let res = response.data;
                res.object.menu.forEach((v) => {
                  types.push(v.name);
                });
                const rootState = this.$store.state;
                let extendOpen = rootState.userInfo.frontendConfig.EXTEND_OPEN,
                  extendSize = rootState.userInfo.frontendConfig.EXTEND_SIZE,
                  time = {
                    startTime: rootState.home.startTime,
                    endTime: rootState.home.endTime,
                  },
                  extendRecord = this.extendRecord[vertice.id], //扩展记录
                  count = (extendRecord && extendRecord.count) || 1,
                  virtualFlag = false,
                  virtualNum =
                    rootState.userInfo.frontendConfig.VIRTUAL_NODE_NUMBER,
                  graphName = rootState.graphInfo.name,
                  expandFilter = {
                    relationType: null,
                    relationWeight: null,
                    dimension: null,
                    timeFilter: null,
                    all: types,
                  };
                let id = vertice.id,
                  level = vertice.level || 0;
                let subIds = ids.join(",");
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
                  types.join(","),
                  virtualCount,
                  graphName,
                  JSON.stringify(expandFilter)
                ).then((res) => {
                  // this.$store.commit("home/changeLoading", false);
                  this.changeLoading(false);
                  if (res.data.success) {
                    if (res.data.object) {
                      let result = res.data.object;
                      // let entities = result.vertices.filter((v) => {
                      //   return !this.gisEntityIds.includes(v.id);
                      // });
                      // this.updateGisEntities(
                      //   [].concat(entities, this.gisEntities)
                      // );
                      // let lines = result.edges.filter((e) => {
                      //   return !this.gisLinesIds.includes(e.id);
                      // });
                      // console.log(lines);
                      // this.updateGisLines([].concat(lines, this.gisLines));
                      result.vertices.forEach((item) => {
                        item.properties.latitude = item.properties.纬度;
                        item.properties.longitude = item.properties.经度;
                      });
                      let gisData = {
                        entities: result.vertices,
                        labelShow: true,
                      };
                      gisvis.emitter.emit("gis-render-data", gisData);
                      this.$message.success({ message: "扩展成功" });
                      gisvis.emitter.emit(EventType.LEGEND_DATA_CHANGE, []);
                      this.changeGisRightSelectedEntity(null);
                    } else {
                      this.$message.success({ message: "无拓展结果" });
                    }
                  } else {
                    this.$message.error({
                      message: res.data.msg || res.data.errorMsg || "拓展失败",
                      duration: 1500,
                    });
                  }
                });
              });
            break;
          //范围搜索（打开半径弹窗）
          case "scopeSearch":
            this.showRangeSetting = true;
            break;
          //删除
          case "delete":
            gisvis.emitter.emit(EventType.CLICK_BLANK);
            gisvis.viewer.entities.removeById(this.gisRightSelectedEntity.id);
            this.removeEntityBackEnd(this.gisRightSelectedEntity.id);
            gisvis.emitter.emit(EventType.LEGEND_DATA_CHANGE, []);
            if (gisvis.contextMenu) {
              gisvis.contextMenu.destroy();
              gisvis.contextMenu = null;
            }
            if (gisvis.popper) {
              gisvis.popper.destroy();
              gisvis.popper = null;
            }
            // let tempEntities = this.gisEntities.filter(
            //   (e) => e.id !== this.gisRightSelectedEntity.id
            // );
            // this.updateGisEntities(tempEntities);
            // let tempLines = this.gisLines.filter(
            //   (e) =>
            //     e.source !== this.gisRightSelectedEntity.id &&
            //     e.target !== this.gisRightSelectedEntity.id
            // );
            // this.updateGisLines(tempLines);
            //this.changeGisRightSelectedEntity(null);
            break;
          //范围切换
          case "scopeChange":
            if (
              gisvis.viewer.entities.getById(this.gisRightSelectedEntity.id)
                .ellipse
            ) {
              let showState = gisvis.viewer.entities
                .getById(this.gisRightSelectedEntity.id)
                .ellipse.show.getValue();
              gisvis.viewer.entities
                .getById(this.gisRightSelectedEntity.id)
                .ellipse.show.setValue(!showState);
              //重新渲染左侧
              this.setAttackShow({
                id: this.gisRightSelectedEntity.id,
                change: !showState,
              });
            } else {
              let params = {
                entities: [{ id: this.gisRightSelectedEntity.id }],
                radius: 200,
                color: "#ffcc33",
              };
              gisvis.emitter.emit("gis-scope-render", params);
              this.setAttackShow({
                id: this.gisRightSelectedEntity.id,
                change: true,
              });
            }
            gisvis.emitter.emit(EventType.LEGEND_DATA_CHANGE, []);
            break;
          //雷达
          case "radarShow":
            gisvis.emitter.emit(EventType.RADAR_RENDER, {
              lon: this.gisRightSelectedEntity.properties.lng.getValue(),
              lat: this.gisRightSelectedEntity.properties.lat.getValue(), //纬度
              r: 1500,
              scanColor: new Cesium.Color(1.0, 0.0, 0.0, 1),
              interval: 4000, //时间
              name: this.gisRightSelectedEntity.id.toString(), //只能标识名字，用名字当作ID
            });
            break;
          //飞机轨迹线
          case "SimulatedSatellite":
            break;
          //轨迹飞行开始
          case "range":
            gisvis.emitter.emit(EventType.CLICK_BLANK);
            //作为起始点
            gisvis.emitter.emit(EventType.MeasureLineSpace, {
              firstPoint: {
                longitude: this.gisRightSelectedEntity.properties.getValue()
                  .lng,
                latitude: this.gisRightSelectedEntity.properties.getValue().lat,
                height: 1000,
              },
              cartesian:[{...this.rightEntityPosition}],
              state:'fly'
            });

            break;
          case "range-setting":
            gisvis.viewer.entities.getById(
              this.gisRightSelectedEntity.id
            ).show = false; //隐藏右键轨迹飞行动画结束显示
            gisvis.emitter.emit(EventType.Simulated_Satellite);
            break;
        }
        if (gisvis.contextMenu) {
          gisvis.contextMenu.destroy();
          gisvis.contextMenu = null;
        }
      },
      gisvis
    );
    // this.initMap();
  },

  beforeDestroy() {},

  methods: {
    /**
     * 初始化地图
     */
    initMap() {
      const imageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: this.imageryProviderMap[0].url,
        // url: 'http://localhost:8080/map/{z}/{y}/{x}.jpg',
        // fileExtension: "jpg"
      });
      const maps = this.imageryProviderMap
        .map((provider) => {
          provider.creationFunction = () =>
            new Cesium.UrlTemplateImageryProvider({
              url: provider.url,
            });
          provider.toolTip = provider.name;

          return provider;
        })
        .map((options) => new Cesium.ProviderViewModel(options));

      window.viewer = viewer = new Cesium.Viewer("cesium", {
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
        creditContainer: document.createElement("div"),
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        baseLayerPicker: false,
        infoBox: false,
        // mapMode2D: Cesium.MapMode2D.ROTATE
      });

      // this.setHomeButton().flyHome();
    },
    /**
     * 范围搜索
     */
    rangeSearch() {
      // this.changeLoading(true);
      let vertices = this.gisEntities.filter(
        (e) => e.id === this.gisRightSelectedEntity.id
      );
      //当前实体对象
      let vertex = vertices[0];
      let params = {
        lat: vertex.properties.latitude,
        lng: vertex.properties.longitude,
        scanColor: Cesium.Color.fromCssColorString("#00c6ab").withAlpha(0.8),
        radius: this.rangeSetting.range * 1000,
      };

      gisvis.emitter.emit("gis-radar-render", params);
      if (gisvis.contextMenu) {
        gisvis.contextMenu.destroy();
        gisvis.contextMenu = null;
      }
      this.showRangeSetting = false;
      setTimeout(() => {
        this.$api
          .getGisExpand(
            this.graphName,
            vertex,
            this.rangeSetting.range,
            this.rangeSetting.labels
          )
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
                    labelShow: this.gisLabelShow,
                  };
                  gisvis.emitter.emit("gis-render-data", gisData);
                } else {
                  gisvis.viewer.entities.removeById("marsRadarScan");
                  // gisvis.viewer.scene.postProcessStages._stages.forEach(i => {
                  //   i.enabled = false;
                  // });
                  this.$message.success({ message: "无搜索结果" });
                }
                this.updateGisEntities([].concat(entities, this.gisEntities));
                let gisData = {
                  entities: entities,
                  labelShow: this.gisLabelShow,
                };
                gisvis.emitter.emit("gis-render-data", gisData);

                this.changeGisRightSelectedEntity(null);
              } else {
                // gisvis.viewer.scene.postProcessStages._stages.forEach(i => {
                //   i.enabled = false;
                // });
                gisvis.viewer.entities.removeById("marsRadarScan");
                this.$message.success({ message: "无搜索结果" });
              }
            } else {
              gisvis.viewer.entities.removeById("marsRadarScan");
              // gisvis.viewer.scene.postProcessStages._stages.forEach(i => {
              //   i.enabled = false;
              // });
              this.$message.error({
                message: res.data.msg || res.data.errorMsg || "搜索失败",
                duration: 1500,
              });
            }
          })
          .catch(() => {
            gisvis.viewer.entities.removeById("marsRadarScan");
            this.$message.error({
              message: "服务端异常，请联系管理员",
              duration: 1500,
            });
          });
      }, 2000);
    },
    ...mapMutations("map", [
      "changeGisRightSelectedEntity",
      "updateGisEntities",
      "updateGisLines",
      "removeEntityBackEnd",
      "setAttackShow",
    ]),
    ...mapMutations("home", ["changeLoading"]),

    /**
     * 隐藏地图，清除DOM
     */
    // hideMap() {
    //   if (this.currentEntity) {
    //     this.setSelectedEntity(null);
    //     this.currentEntity = null;

    //     if (this.popper) {
    //       this.removePopper();
    //     }

    //     viewer.selectedEntity = null;
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.left-side {
  position: absolute;
  left: calc(3.58rem + 8px);
  bottom: 120px;
  color: #4c4c4c;
  border-radius: 4px;
  user-select: none;
  overflow: hidden;
}
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
/deep/ .cesium-performanceDisplay-defaultContainer {
  position: absolute;
  top: 10px;
  right: 10px;
  text-align: right;
}
/deep/ .cesium-viewer-toolbar {
  display: block;
  position: absolute;
  top: 17px;
  right: 94px;
}
</style>
