<template>
  <div class="map" id="mapMap">
    <!-- 鹰眼图模式 -->
    <div id="eye" v-show="$store.state.map.eyeMap"></div>
    <div id="cesium" class="cesium"></div>
    <!-- 左下侧分组数据信息 -->
    <MapLegend />
    <!-- 时间轴 -->
    <Timeline></Timeline>
    <!-- 右侧展示详细面板信息 -->
    <GisInfoPanelDetail></GisInfoPanelDetail>
    <!-- <MapInfoPanel></MapInfoPanel> -->
    <!-- 左侧菜单栏 -->
    <LeftSideBar />
    <!-- 搜索范围设置弹窗 -->
    <RangeSetting v-if="showRangeSetting" :close="() => (this.showRangeSetting = false)"></RangeSetting>
    <!-- 拖拽面板设置选用的属性 -->
    <DragInfo v-if="showDragInfo" @close="() => (this.showDragInfo = false)" @checkList="checkList"></DragInfo>
    <!-- 按类型 -->
    <typeExpand></typeExpand>
    <!-- 按维度 -->
    <dimensionExpand></dimensionExpand>
    <!-- 动态气泡框组件插入该标签-->
    <div class="popperWrap" id="popperWrap"></div>
    <!-- 测绘工具 -->
    <PlotPanel v-if="showPlotPanel" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import LeftSideBar from './views/LeftSideBar/LeftSideBar'
import Main from './src/Main'
import { listenMapEvents } from './mapEventProxy'
import ContextMenu from './views/ContextMenu/index'
import Timeline from './views/TimeLine'
import RangeSetting from './views/RangeSetting'
import typeExpand from './views/typeExpand'
import dimensionExpand from './views/dimensionExpand'
import sativis from '../../sati'
import { newExtendVertice } from '@/assets/api/expand'
import PlotPanel from './views/LeftSideBar/components/PlotPanel'
import GisInfoPanelDetail from './views/GisInfoPanelDetail' //查看详情
import MapLegend from './views/MapLegend' //左下侧面板
import DragInfo from './views/DragInfo' //拖拽面板设置选用的属性
import { emitter, EventType } from './src/EventEmitter'
// import MapInfoPanel from "./views/MapInfoPanel"
const Cesium = window.Cesium
let viewer = null
let gisvis = null
let trackedEntity = null
export default {
  components: {
    GisInfoPanelDetail,
    RangeSetting,
    typeExpand,
    dimensionExpand,
    LeftSideBar,
    Timeline,
    MapLegend,
    PlotPanel,
    DragInfo,
  },
  provide: {
    provide: () => {
      return {
        gisvis, //gisvis:gisvis 传出去对象
        viewer,
      }
    },
  },
  data() {
    return {
      drawingEntityFlightLine: false, //设置轨迹飞行线
      showRangeSetting: false, //范围->设置
      showDragInfo: false, //拖拽面板设置选用的属性
      showPlotPanel: false, //测绘工具
      rightEntityPosition: {}, //右键实体
      checkListDragInfo: [], //选中的属性给拖拽面板呈现
      imageryProviderMap: [
        {
          name: '卫星图',
          url:
            'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali',
          iconUrl: 'images/weixing.png',
        },
        {
          name: '行政区域图',
          url:
            'http://mt1.google.cn/vt/lyrs=m&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali',
          iconUrl: 'images/xingzhengquyu.png',
        },
      ],
      // popper: null,
      // currentEntity: null,
    }
  },

  computed: {
    ...mapState('canvasInfo', [
      'canvasType',
      'clusterCacheKey',
      'extendRecord',
    ]),
    ...mapState('map', [
      'gisRightSelectedEntity',
      'gisEntities',
      'allEntityBackEnd',
      'rangeSetting',
      'gisLabelShow',
      'gisLines',
    ]),
    ...mapGetters('graphInfo', ['graphName']),
    ...mapGetters('map', ['gisEntityIds', 'gisLinesIds']),
  },
  mounted() {
    window.map = this
    gisvis = new Main({ el: this.$el })
    ;({ viewer } = gisvis) //向下传递
    // viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    //   //取消右键点击事件
    //   Cesium.ScreenSpaceEventType.RIGHT_CLICK
    // );
    this.$el.addEventListener('contextmenu', (event) => event.preventDefault())
    //gisvis.emitter.emit(EventType.DrawHTMLPoper)
    //listenMapEvents(gisvis, this.changeGisRightSelectedEntity);
    gisvis.emitter.on(
      EventType.isShowPlotPanel,
      (val) => {
        this.showPlotPanel = val
      },
      this
    )
    gisvis.emitter.on(
      'gis-right-click',
      (params) => {
        const { entity, position, create, cartesian } = params
        this.rightEntityPosition = cartesian
        this.changeGisRightSelectedEntity(entity.id) //右侧实体
        gisvis.emitter.emit(EventType.POPPER_HIDDEN)
        gisvis.contextMenu = new ContextMenu({}, this.$el)
        gisvis.contextMenu.instance.position = position
      },
      gisvis
    )
    //点具体的项
    gisvis.emitter.on(
      'gis.context-menu-item-click',
      (data) => {
        let { action } = data
        switch (action) {
          //扩展
          case 'expand':
            // this.$store.commit('home/changeLoading',true)
            this.changeLoading(true)
            const vertice = this.gisRightSelectedEntity
            const types = [], //所有名称
              ids = this.allEntityBackEnd.map((v) => v.id)
            this.$api
              .getNextMenu(
                parseInt(vertice.id),
                '拓展',
                vertice.level || 0,
                this.graphName
              )
              .then((response) => {
                let res = response.data
                res.object.menu.forEach((v) => {
                  types.push(v.name)
                })
                const rootState = this.$store.state
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
                  }
                let id = vertice.id,
                  level = vertice.level || 0
                let subIds = ids.join(',')
                let virtualCount = 1
                const clusterCacheKey = new Date().getTime()
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
                  this.changeLoading(false)
                  if (res.data.success) {
                    if (res.data.object) {
                      let result = res.data.object
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
                        item.id = Number(item.id) //有的是字符串的达不到去重的效果
                        if (
                          item.properties.hasOwnProperty('经度') &&
                          item.properties.经度
                        ) {
                          item.properties.longitude = item.properties.经度 //绘图用
                          item.properties.latitude = item.properties.纬度
                        } else if (
                          item.properties.hasOwnProperty('longitude') &&
                          item.properties.longitude
                        ) {
                          item.properties.longitude = item.properties.longitude //绘图用
                          item.properties.latitude = item.properties.latitude
                        } else {
                          item.properties.longitude = undefined
                          item.properties.latitude = undefined
                        }
                        if (
                          (item.properties.hasOwnProperty('分类名称') &&
                            item.properties.分类名称) ||
                          (item.properties.hasOwnProperty('实体分类') &&
                            item.properties.实体分类)
                        ) {
                          item.properties.实体分类 =
                            (item.properties.hasOwnProperty('实体分类') &&
                              item.properties.实体分类) ||
                            (item.properties.hasOwnProperty('分类名称') &&
                              item.properties.分类名称)
                        } else {
                          item.properties.实体分类 = '暂未分类'
                        }
                      })
                      //去处当前被扩展点
                      result.vertices = result.vertices.filter(
                        (item) => item.id != vertice.id
                      )
                      let gisData = {
                        entities: result.vertices,
                        labelShow: this.gisLabelShow,
                      }
                      gisvis.emitter.emit('gis-render-data', gisData)
                      this.$message.success({ message: '扩展成功' })
                      gisvis.emitter.emit(EventType.LEGEND_DATA_CHANGE, [])
                      this.changeGisRightSelectedEntity(null)
                      //对数据划分哪个是起点哪个是终点,如果有关系就不再二次加关系
                      let arrIds = []
                      arrIds = gisvis.viewer.entities.values
                        .filter((ele) => {
                          let id = ele.id.toString()
                          return id.split(',').length > 1
                        })
                        .map((item) => item.id)
                      arrIds.push('001,0002') //给个初始值为了循环
                      let center = {}
                      let points = []
                      //对扩展的数据过滤出来有经纬度的才画线
                      result.vertices = result.vertices.filter(
                        (item) => item.properties.latitude
                      )
                      result.vertices.forEach((element) => {
                        if (
                          arrIds.every(
                            (item) =>
                              item
                                .split(',')
                                .filter((ele) =>
                                  [vertice.id, element.id].some(
                                    (valueId) => ele == valueId
                                  )
                                ).length != 2
                          )
                        ) {
                          center = {
                            id: vertice.id,
                            lon: Number(vertice.properties.lng.getValue()),
                            lat: Number(vertice.properties.lat.getValue()),
                            size: 5,
                            color: Cesium.Color.YELLOW,
                          }
                          points.push({
                            id: element.id,
                            lon: Number(element.properties.longitude),
                            lat: Number(element.properties.latitude),
                            size: 5,
                            color: Cesium.Color.YELLOW,
                          })
                        }
                      })
                      gisvis.emitter.emit(EventType.CREATE_Fly_LINES_MANY, {
                        center,
                        points,
                      })
                    } else {
                      this.$message.success({ message: '无拓展结果' })
                    }
                  } else {
                    this.$message.error({
                      message: res.data.msg || res.data.errorMsg || '拓展失败',
                      duration: 1500,
                    })
                  }
                })
              })
            break
          //按类型
          case 'expandType':
            this.changeLoading(true)
            this.$api
              .getNextMenu(
                this.gisRightSelectedEntity.id,
                '拓展',
                0,
                this.graphName
              )
              .then((response) => {
                let res = response.data
                if (res.object.menu && !res.object.menu.length) {
                  return (
                    !this.changeLoading(false) &&
                    this.$message.error({
                      message: '当前节点无相关关系',
                      duration: 1500,
                    })
                  )
                }
                this.changeMenuType(res.object.menu)
                this.changeLoading(false)
                this.changeTypeExpandShow(true)
              })
            break
          //按维度
          case 'expandLatitude':
            this.changeDimensionExpandShow(true)
            break
          //范围搜索（打开半径弹窗）
          case 'scopeSearch':
            this.showRangeSetting = true
            //静态雷达效果（类似网状）
            // new Cesium.RadarPrimitive(viewer, {
            //   position: Cesium.Cartesian3.fromDegrees(117.224, 31.819, 128),
            //   angle: 50,
            //   radius: 300000,
            //   color: { red: 1, green: 0, blue: 0, alpha: 0.4 },
            //   lineColor: { red: 1, green: 1, blue: 1, alpha: 0.9 },
            // })
            break
          //删除(删点删关系线删全局数据重新分组)
          case 'delete':
            gisvis.emitter.emit(EventType.CLICK_BLANK)
            gisvis.viewer.entities.removeById(this.gisRightSelectedEntity.id)
            this.removeEntityBackEnd(this.gisRightSelectedEntity.id)
            //批量删除存在的关系线
            let arrLine = []
            gisvis.viewer.entities.values.forEach((ele) => {
              let id = ele.id.toString()
              if (
                id.split(',').length > 1 &&
                ele.id
                  .split(',')
                  .includes(this.gisRightSelectedEntity.id.toString())
              ) {
                arrLine.push(ele)
              }
            })
            arrLine.forEach((item) => {
              gisvis.viewer.entities.removeById(item.id)
            })
            //每次删除之前的范围设置的圆圈
            let deleteLabelArr = []
            gisvis.viewer.entities.values.forEach((ele) => {
              let id = ele.id.toString()
              if (
                id.split(',').length > 1 &&
                ele.id.split(',').includes('显示范围') &&
                ele.id
                  .split(',')
                  .includes(this.gisRightSelectedEntity.id.toString())
              ) {
                deleteLabelArr.push(ele)
              }
            })
            deleteLabelArr.forEach((item) => {
              gisvis.viewer.entities.removeById(item.id)
            })
            if (gisvis.contextMenu) {
              gisvis.contextMenu.destroy()
              gisvis.contextMenu = null
            }
            if (gisvis.popper) {
              gisvis.popper.destroy()
              gisvis.popper = null
            }
            if (gisvis.addHtmlPopper) {
              gisvis.addHtmlPopper.destroy()
              gisvis.addHtmlPopper = null
            }
            gisvis.emitter.emit(EventType.LEGEND_DATA_CHANGE, [])
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
            break
          //范围切换（有就切换没有就创建重新分组渲染）
          case 'scopeChange':
            if (
              gisvis.viewer.entities.getById(this.gisRightSelectedEntity.id)
                .ellipse
            ) {
              let showState = gisvis.viewer.entities
                .getById(this.gisRightSelectedEntity.id)
                .ellipse.show.getValue()
              gisvis.viewer.entities
                .getById(this.gisRightSelectedEntity.id)
                .ellipse.show.setValue(!showState)
              //重新渲染左侧
              this.setAttackShow({
                id: this.gisRightSelectedEntity.id,
                change: !showState,
              })
            } else {
              let params = {
                entities: [{ id: this.gisRightSelectedEntity.id }],
                areaProperty: null,
                radius: 200,
                color: '#ffcc33',
              }
              gisvis.emitter.emit('gis-scope-render', params)
              this.setAttackShow({
                id: this.gisRightSelectedEntity.id,
                change: true,
              })
            }
            gisvis.emitter.emit(EventType.LEGEND_DATA_CHANGE, [])
            break
          //雷达扩散效果
          case 'radarShow':
            // gisvis.emitter.emit(EventType.RADAR_RENDER, {
            //   lon: this.gisRightSelectedEntity.properties.lng.getValue(),
            //   lat: this.gisRightSelectedEntity.properties.lat.getValue(), //纬度
            //   r: 1500,
            //   scanColor: new Cesium.Color(1.0, 0.0, 0.0, 1),
            //   interval: 4000, //时间
            //   name: this.gisRightSelectedEntity.id.toString(), //只能标识名字，用名字当作ID
            // });
            gisvis.emitter.emit(EventType.RADAR_RENDER, {
              id: this.gisRightSelectedEntity.id,
              range: 10000,
            })
            break
          //飞机轨迹线
          case 'SimulatedSatellite':
            break
          //轨迹飞行开始
          case 'range':
            //作为起始点坐标
            gisvis.emitter.emit(EventType.drawingEntityFlightLine, {
              firstPoint: {
                longitude: this.gisRightSelectedEntity.properties.lng.getValue(),
                latitude: this.gisRightSelectedEntity.properties.lat.getValue(),
                height: 10000,
              },
              cartesian: [{ ...this.rightEntityPosition }],
              state: 'fly',
            })
            this.drawingEntityFlightLine = true
            break
          //轨迹飞行
          case 'range-setting':
            if (!this.drawingEntityFlightLine) {
              this.$message.info('请先设置轨迹飞行线')
              return
            }
            this.drawingEntityFlightLine = false
            gisvis.emitter.emit(EventType.CLICK_BLANK)
            gisvis.viewer.entities.getById(
              this.gisRightSelectedEntity.id
            ).show = false //隐藏右键轨迹飞行动画结束显示
            gisvis.emitter.emit(EventType.Simulated_Satellite)
            break
          //一键部署
          case 'oneDeployment':
            gisvis.emitter.emit(EventType.CLICK_BLANK)
            gisvis.emitter.emit(EventType.SET_MEASURE_TYPE, {
              group: '基地',
              groupCategory: '基地',
              groupType: '基地',
              image: 'images/facility.png',
            })
            this.$message.success('已成功创建关联部署点')
            break
          //信息切换
          case 'scopeInfoShow':
            this.showDragInfo = true

            break
          case 'scopeInfoHidden':
            gisvis.emitter.emit(
              EventType.deleteOneBubbles,
              this.gisRightSelectedEntity.id
            )
        }
        //判断显示条件,除了这几个其余操作完成气泡都显示，这几个等弹窗确定完才显示气泡
        if (
          action != 'scopeSearch' &&
          action != 'expandLatitude' &&
          action != 'expandType' &&
          action != 'scopeInfoShow'
        ) {
          gisvis.emitter.emit(EventType.POPPER_SHOW)
        }
        if (gisvis.contextMenu) {
          gisvis.contextMenu.destroy()
          gisvis.contextMenu = null
        }
      },
      gisvis
    )
  },
  methods: {
    checkList(val) {
      this.checkListDragInfo = val
    },
    ...mapMutations('map', [
      'changeGisRightSelectedEntity',
      'changeDimensionExpandShow',
      'updateGisEntities',
      'updateGisLines',
      'removeEntityBackEnd',
      'setAttackShow',
      'changeTypeExpandShow',
      'changeMenuType',
    ]),
    ...mapMutations('home', ['changeLoading']),
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
}
</script>

<style lang="scss" scoped>
#eye {
  position: absolute;
  width: 15%;
  height: 20%;
  bottom: 12%;
  left: 3.3%;
  z-index: 999;
  border: solid blue 1px;
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
  top: 10%;
  right: 8px;
}
</style>
