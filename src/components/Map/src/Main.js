import {
  emitter,
  EventType
} from "./EventEmitter";
import Viewer from "./Viewer";
import Drawer from "./Drawer";
import Store from "./Store";
import VuexStore from '@/store/index'
import MeasureTool from "../views/MeasureTool";
import ScreenSpaceEvent from "./ScreenSpaceEvent";
import ContextMenu from "../views/ContextMenu/index";
import Popper from "../views/Popper";
import PolylineTrailMaterialProperty from "./PolylineTrailMaterialProperty"; //关系
import * as RadarsEffects from "./RadarsEffects" //雷达
import SimulatedSatellite from "./SimulatedSatellite" //轨迹线
import CesiumCircleWaveMaterial from "./CesiumCircleWaveMaterial" //没有问题的雷达
const _homePosition = [119.17968749999999, 25.522614647623293, 25000000];
let _instance = null;

class Main {
  legendData = null;
  popper = null;

  constructor(options = {}) {
    if (_instance) {
      // return _instance;
    }
    const {
      homePosition = _homePosition, el
    } = options;
    this.el = el;
    this.homePosition = homePosition;
    this.viewer = new Viewer(options);
    this.viewer.scene.debugShowFramesPerSecond = true;
    this.store = new Store();
    this.drawer = new Drawer({
      viewer: this.viewer,
      store: this.store
    });
    this.simulatedSatellite = new SimulatedSatellite({
      store: this.store
    });
    //测量工具
    this.measureTool = new MeasureTool(this.viewer);
    this.screenSpaceEvent = new ScreenSpaceEvent({
      viewer: this.viewer,
      store: this.store,
    });
    this.viewer.scene.postRender.addEventListener(this.handlePostRender, this);
    this.emitter = emitter;
    window.gisvis = this;
    if (!_instance) {
      //监听
      this.initEventListener();
    }
    this.arrData = [] //绘制飞行的数据
    _instance = this;
    //监听
    this.screenSpaceEvent.handleLeftClick()
    this.screenSpaceEvent.handleRightClick()
    this.screenSpaceEvent.handleMiddleUp()
    this.screenSpaceEvent.handleMiddleDown()
    // this.screenSpaceEvent.handleMouseMove()
  }
  /**
   * 初始化事件监听
   */
  initEventListener() {
    emitter.on(EventType.CLICK_BLANK, this.handleClickBlank, this); //点空白移除
    emitter.on(EventType.CLICK_ENTITY, this.setSelectedEntity, this); //点实体右侧面板数据改变
    emitter.on(EventType.SET_MEASURE_TYPE, this.setMeasureType, this); //绘制点
    emitter.on(EventType.COLOR_SHADER_CHANGE, this.handleColorShader, this); //着色
    emitter.on(EventType.CONTEXT_MENU_REMOVE, this.removeContextMenu, this);
    emitter.on(EventType.CONTEXT_MENU_CLICK, this.clickContextMenuItem, this);
    emitter.on(EventType.POPPER_SHOW, this.showPopper, this); //名字提示语
    emitter.on(EventType.POPPER_MOVE, this.movePopper, this);
    emitter.on(EventType.POPPER_REMOVE, this.removePopper, this);
    emitter.on(EventType.RENDER_DATA, this.gisRender, this); //地图搜索/扩展等添加实体
    emitter.on(EventType.SCOPE_RENDER, this.gisScopeRender, this); //范围
    emitter.on(EventType.RADAR_RENDER, this.addCircleScan, this); //雷达
    emitter.on(EventType.SCOPE_SEARCH, this.addRadarScan, this); //雷达扫描
    emitter.on(EventType.Simulated_Satellite, this.simulatedSatelliteFun, this); //扫描
    emitter.on(EventType.MeasureLineSpace, this.measureLineSpace, this); //测量距离
    emitter.on(EventType.MeasureAreaSpace, this.measureAreaSpace, this); //测量面积
    emitter.on(EventType.drawingEntityFlightLine, this.drawingEntityFlightLine, this); //绘制实体飞行线段
    emitter.on(EventType.REMOVE_ALL_ENTITIES, this.removeAllEntities, this); //清空实体
    emitter.on(EventType.CREATE_Fly_LINES, this.createFlyLines, this); //关系之前线条
    emitter.on(EventType.SET_ENTITIES_VISIBLE_BY_TYPE, this.setEntitiesVisibleByType, this); //点击图例显示图标
    emitter.on(EventType.FLY_TO_ENTITY, this.flyToEntity, this);
    emitter.on(EventType.SELECTED_ENTITY, this.setSelectedEntity, this);
    emitter.on(EventType.SET_ATTACK_VISIBLE_BY_TYPE, this.setAttackVisibleByType, this);
    emitter.on(EventType.DELETE_ENTITIES_BY_ID, this.deleteEntitiesById, this); //删除
    emitter.on(EventType.DELETE_ENTITIES_BY_TYPE, this.deleteEntitiesByType, this);
  }
  handleClickBlank() {
    this.removePopper();
    this.removeContextMenu();
    emitter.emit(EventType.SELECTED_ENTITY, null);
  }
  /**
   * 通过类别删除实体
   */
  deleteEntitiesByType(type) {
    const {
      entitiesJsonCollection
    } = this.store;
    const ids = entitiesJsonCollection[type].map(({
      id
    }) => id);

    ids.forEach(id => this.viewer.entities.removeById(id));
    this.store.deleteDataById(ids);
    this.computeLegendData();
  }
  /**
   * 通过id删除实体
   */
  deleteEntitiesById(id) {
    this.viewer.entities.removeById(id);
    this.store.deleteDataById(id);
    this.computeLegendData();
  }
  /**
   * 显示Popper
   */
  showPopper(params) {
    var {
      position,
      name,
      canMove,
      create
    } = params;
    if (!name) name = '未命名'
    var {
      x,
      y
    } = position;

    if (!this.popper) {
      if (create) {
        this.popper = new Popper({
          data: {
            canMove,
            text: name
          }
        });
      } else {
        return;
      }
    }
    this.popper.instance.text = name;
    this.popper.instance.position = {
      top: y + "px",
      left: x + "px"
    };
  }
  /**
   * 移动Popper
   */
  movePopper() {
    //点击实体存储
    const {
      selectedEntity
    } = this.store;

    this.removePopper(); //删除当前可移动的popper
    emitter.emit(EventType.CLICK_BLANK);//移动的时候避免取消报错
    //selectedEntity.id是传入的实体对象
    this.measureTool.movePoint(selectedEntity.id, {}, entity => {
      this.store.setMeasureType(null);
    });
  }
  //静止滚动
  handlePostRender() {
    if (!this.store.selectedEntity) {
      return
    }
    if (this.store.selectedEntity.id.position) {
      const cartesian = this.store.selectedEntity.id.position.getValue();
      const position = this.viewer.scene.cartesianToCanvasCoordinates(cartesian);
      const { x, y } = position;
      if (this.popper) {
        this.popper.instance.position = {
          top: y + "px",
          left: x + "px"
        };
      }
      if (this.contextMenu) {
        this.contextMenu.instance.position = {
          top: y + "px",
          left: x + "px"
        };
      }
    }
  }
  /**
   * 移除Popper
   */
  removePopper() {
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
  }
  /**
   * 设置选中实体
   */
  setSelectedEntity(entity) {
    this.store.setSelectedEntity(entity);
    if (entity === null) {
      this.viewer.selectedEntity = null;
    }
  }
  /**
   * 右键菜单显示
   */
  showContextMenu(params) {
    const {
      position,
      create
    } = params;
    const {
      x,
      y
    } = position;
    console.log(this.contextMenu);
    if (!this.contextMenu) {
      if (create) {
        this.contextMenu = new ContextMenu({}, this.el);
      } else {
        return;
      }
    }

    this.contextMenu.instance.position = {
      top: y + "px",
      left: x + "px"
    };
  }
  /**
   * 移除Popper
   */
  removePopper() {
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
  }
  /**
   * 飞入到实体
   */
  flyToEntity(entity) {
    const {
      lng,
      lat,
      h = 1500
    } = entity;

    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lng, lat, h)
    });
  }
  /**
   * 右键菜单移除
   */
  removeContextMenu() {
    if (this.contextMenu) {
      this.contextMenu.destroy();
      this.contextMenu = null;
    }
  }
  /**
   * 清空实体
   */
  removeAllEntities() {
    this.viewer.entities.removeAll();
    this.viewer.selectedEntity = null;
    this.store.removeAllData();
    this.computeLegendData();
  }
  /**
   * 点击右键菜单中的某个选项
   * @param {object} data
   * @param {string} data.action 方法标识，目前data里只用到这个，后面可能会增加
   */
  clickContextMenuItem(data) {
    const {
      action
    } = data;
    console.log(action);
  }
  /**
   * 通过类别设置实体可见性
   */
  setEntitiesVisibleByType(payload) {
    const {
      type,
      value
    } = payload;
    const {
      entitiesJsonCollection
    } = this.store;
    const ids = entitiesJsonCollection[type].map(({
      id
    }) => id);
    const allEntities = this.getEntities();
    const collection = allEntities.filter(({
      id
    }) => ids.includes(id));

    collection.forEach(entity => {
      entity.show = value;
    });
    this.store.setEntityVisibleCollection(type, value);
    this.computeLegendData();
  }
  getEntities() {
    return this.viewer.entities.values;
  }
  /**
   * 通过类别设置实体攻击范围可见性
   */
  setAttackVisibleByType(payload) {
    const {
      type,
      value
    } = payload;
    const {
      entitiesJsonCollection
    } = this.store;
    const ids = entitiesJsonCollection[type].map(({
      id
    }) => id);
    const allEntities = this.getEntities();
    const collection = allEntities.filter(({
      id
    }) => ids.includes(id));

    collection.forEach(entity => {
      const {
        ellipse,
        polyline
      } = entity;

      if (ellipse) {
        ellipse.show = value;
      }
      if (polyline) {
        polyline.show = value;
      }
    });
    this.store.setAttackVisibleCollection(type, value);
    this.computeLegendData();
  }
  /**
   * 绘点
   */
  setMeasureType(type) {
    const {
      measureType
    } = this.store;

    this.store.setMeasureType(type);

    if (measureType) {
      this.measureTool.cancelDraw();
    }
    this.measureTool.measurePoint(type, entity => {
      // const { properties } = entity;
      // const values = properties.getValue();
      // const { lng, lat } = values;
      // const position = {
      //   x: lng,
      //   y: lat
      // };

      // this.store.setMeasureType(null);
      // emitter.emit(EventType.POPPER_SHOW, {
      //   position,
      //   canMove: true,
      //   create: true
      // });
    });
  }
  //测量距离 (如果是绘制航线默认带上第一点坐标，每次先清空上次绘制的数据)
  measureLineSpace() {
    this.measureTool.measureLineSpace()
  }
  //测量面积
  measureAreaSpace() {
    this.measureTool.measureAreaSpace()
  }
  /**
   * 添加地图数据,每次先清除上次左键选中的效果
   */
  gisRender(gisData = {}) {
    this.removePopper();
    this.drawer.drawEntities(gisData.entities, gisData.labelShow);
    //this.computeLegendData();
    emitter.emit(EventType.LEGEND_DATA_CHANGE, gisData.entities);
  }
  /**
   * 计算图例数据
   */
  computeLegendData() {
    const {
      data,
      entitiesJsonCollection,
      entitiesVisibleCollection,
      entitiesAttackAvailableCollection
    } = this.store;
    const entitiesCountryCollection = groupBy(data, "country");

    this.legendData = {
      entitiesCollection: data, //原本掉接口数据
      entitiesJsonCollection, //依据分类的
      entitiesVisibleCollection,
      entitiesAttackAvailableCollection,
      entitiesCountryCollection //依据国家
    };
    emitter.emit(EventType.LEGEND_DATA_CHANGE, this.legendData);
  }
  /**
   * 绘制圆形区域
   */
  gisScopeRender(scopedEntities) {
    const {
      entities,
      areaProperty,
      radius,
      color
    } = scopedEntities;
    this.drawer.drawScope(entities, areaProperty, radius, color);
  }
  /**
   * 图例着色改变
   */
  handleColorShader() {
    const {
      entitiesCountryCollection
    } = this.legendData;
    const entities = this.viewer.entities;
    Object.entries(entitiesCountryCollection).forEach(
      ([country, collection]) => {
        const color =
          colorControl.findColorByType(country) || colorControl.defaultColor;

        collection.forEach(({
          id
        }) => {
          const entity = entities.getById(id);
          const {
            ellipse,
            polyline
          } = entity;

          ellipse.material = Cesium.Color.fromCssColorString(color);
          polyline.material.color.setValue(
            Cesium.Color.fromCssColorString(color).withAlpha(1)
          );
        });
      }
    );
  }
  /**
   * 圆形扩大扫描圈
   */
  addCircleScan(id) {
    // let ScanPostStage = RadarsEffects.addCircleScan(this.viewer, val)
    // console.log("雷达", ScanPostStage)
    if (!this.viewer.entities.getById(id).ellipse) {
      this.viewer.entities.getById(id).ellipse = {
        show: true,
        height: 0,
        semiMinorAxis: 10000,
        semiMajorAxis: 10000,
        material: new Cesium.CircleWaveMaterialProperty({
          duration: 2e3,
          gradient: 0,
          color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
          count: 3
        })
      }
    } else {
      this.viewer.entities.getById(id).ellipse.show.setValue(!this.viewer.entities.getById(id).ellipse.show.getValue())
    }
    //判断该数组是否有属性，有的话就切换，没有就添加；没数组就增加内容
    // if (this.store.radarsData.every(item => item.name !== val.name)) {
    //   let ScanPostStage = RadarsEffects.addCircleScan(this.viewer, val)
    //   this.store.setallRadarsData(ScanPostStage)
    // } else {
    //   this.store.radarsData.filter(item => item.name !== val.name)
    //   this.store.radarsData.forEach(item => {
    //       if (item.name == val.name) {
    //         this.viewer.scene.postProcessStages.remove(item);
    //       }
    //     })
    // }
  }
  /**
   * 区域雷达扫描
   */
  addRadarScan(val) {
    RadarsEffects.addRadarScan(this.viewer, val)
  }
  /**
   * 绘制实体飞行线段
   */
  drawingEntityFlightLine(obj) {
    const { firstPoint, cartesian } = obj
    this.arrData = []
    this.measureTool.drawingEntityFlightLine(arrData => {
      this.arrData = arrData
      this.arrData.splice(0, 0, firstPoint)//添加初始点坐标
    }, cartesian)//绘制的初始点坐标
  }
  /**
   * 轨迹飞行
   */
  simulatedSatelliteFun() {
    let time = 0 //拟定假的时间
    this.arrData.forEach(item => {
      item.height = this.arrData[1].height //默认高度
      item.time = time
      time += 200
    })
    sessionStorage.setItem('initTackData', JSON.stringify(this.arrData))
    console.log("绘制的飞行轨迹数据", JSON.parse(sessionStorage.getItem("initTackData")))
    this.simulatedSatellite.planFlying(this.viewer, JSON.parse(sessionStorage.getItem("initTackData")))
    VuexStore.state.map.airplaneEntity = this.simulatedSatellite.store.airplaneEntity//用于追随实体
    emitter.emit(EventType.StartTimeLine);//自动启用时间线
  }
  /**
   * 关系线
   */
  createFlyLines(data) {
    const center = data.center; //起始点
    const points = data.points;//终止点
    const startPoint = Cesium.Cartesian3.fromDegrees(
      center.lon,
      center.lat,
      0
    );
    const ids = [center.id, points.id].join(",")
    //中心点
    // this.viewer.entities.add({
    //   position: startPoint,
    //   point: {
    //     pixelSize: center.size,
    //     color: center.color
    //   }
    // });
    //大批量操作时，临时禁用事件可以提高性能
    this.viewer.entities.suspendEvents();
    //散点
    let material = new PolylineTrailMaterialProperty({
      color: Cesium.Color.BLUE,
      duration: 3000,
      trailImage: "images/colors1.png" //动态图片
    });
    const endPoint = Cesium.Cartesian3.fromDegrees(points.lon, points.lat, 0);
    // this.viewer.entities.add({
    //   position: endPoint,
    //   point: {
    //     pixelSize: points.size,
    //     color: points.color
    //   }
    // });
    this.viewer.entities.add({
      id: ids,
      polyline: {
        positions: this.generateCurve(startPoint, endPoint),
        width: 2,
        material: material
      }
    });
    this.viewer.entities.resumeEvents();//启动
  }
  /**
   * 生成流动曲线
   * @param startPoint 起点
   * @param endPoint 终点
   * @returns {Array}
   */
  generateCurve(startPoint, endPoint) {
    let addPointCartesian = new Cesium.Cartesian3();
    Cesium.Cartesian3.add(startPoint, endPoint, addPointCartesian);
    let midPointCartesian = new Cesium.Cartesian3();
    Cesium.Cartesian3.divideByScalar(addPointCartesian, 2, midPointCartesian);
    let midPointCartographic = Cesium.Cartographic.fromCartesian(
      midPointCartesian
    );
    midPointCartographic.height =
      Cesium.Cartesian3.distance(startPoint, endPoint) / 5;
    let midPoint = new Cesium.Cartesian3();
    Cesium.Ellipsoid.WGS84.cartographicToCartesian(
      midPointCartographic,
      midPoint
    );
    let spline = new Cesium.CatmullRomSpline({
      times: [0.0, 0.5, 1.0],
      points: [startPoint, midPoint, endPoint]
    });
    let curvePoints = [];
    for (let i = 0, len = 200; i < len; i++) {
      curvePoints.push(spline.evaluate(i / len));
    }
    return curvePoints;
  }
}

export {
  Main
};

export default Main;
