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
import addHtmlPopper from "../views/addHtmlPopper";
import Plot from "./Plot";
import dragPopper from "../views/dragPopper";
import SelectEntityBox from "../views/selectEntityBox";
import PolylineTrailMaterialProperty from "./PolylineTrailMaterialProperty"; //关系线条
import * as RadarsEffects from "./RadarsEffects" //雷达
import SimulatedSatellite from "./SimulatedSatellite" //轨迹线
import MergeCircles from "./MergeCircles" //融合
import {
  addHtmlPoper,
  addEntityLayer
} from "./addHtmlPoper" //自定义HTML poper
import {
  CircleWaveMaterialProperty
} from "./CesiumCircleWaveMaterial" //没有问题的雷达(不要删这个)
const _homePosition = [119.17968749999999, 25.522614647623293, 25000000];
let _instance = null;

class Main {
  legendData = null;
  popper = null;
  addHtmlPopper = null; //添加动态HTML
  selectEntityBoxArr = [] //选中的绿框效果
  dragPopperArr = [] //存储动态气泡框对象
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
    //测绘(开始时候禁用全局鼠标结束开启鼠标事件)
    this.plot = new Plot(this.viewer, {})
    this.viewer.scene.postRender.addEventListener(this.handlePostRender, this);
    this.emitter = emitter;
    window.gisvis = this;
    if (!_instance) {
      //监听
      this.initEventListener();
    }
    this.arrData = [] //绘制飞行的数据
    _instance = this;
    this.screenSpaceEvent.handleLeftClick();
    this.screenSpaceEvent.handleLeftCtrlClick();
    this.screenSpaceEvent.handleRightClick();
    this.screenSpaceEvent.handleWheel()
    //去除双击事件
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);


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
    emitter.on(EventType.POPPER_CREATE, this.createPopper, this);
    emitter.on(EventType.POPPER_HIDDEN, this.hiddenPopper, this);
    emitter.on(EventType.POPPER_SHOW, this.showPopper, this);
    emitter.on(EventType.POPPER_MOVE, this.movePopper, this);
    emitter.on(EventType.POPPER_REMOVE, this.removePopper, this);
    emitter.on(EventType.CREATE_HtmlPopper, this.createHtmlPopper, this); //绘制HTML 弹窗
    emitter.on(EventType.addAllBubbles, this.addAllBubbles, this); //添加所有可拖拽气泡
    emitter.on(EventType.deleteAllBubbles, this.deleteAllBubbles, this); //删除所有可拖拽气泡
    emitter.on(EventType.changeBubbleBoxColor, this.changeBubbleBoxColor, this); //拖拽气泡窗颜色更改
    emitter.on(EventType.RENDER_DATA, this.gisRender, this); //地图搜索/扩展等添加实体
    emitter.on(EventType.SCOPE_RENDER, this.gisScopeRender, this); //范围
    emitter.on(EventType.RADAR_RENDER, this.addCircleScan, this); //雷达扩散效果
    emitter.on(EventType.SCOPE_SEARCH, this.addRadarScan, this); //雷达扫描(漂移不准)
    emitter.on(EventType.Simulated_Satellite, this.simulatedSatelliteFun, this); //扫描
    emitter.on(EventType.MeasureLineSpace, this.measureLineSpace, this); //测量距离
    emitter.on(EventType.MeasureAreaSpace, this.measureAreaSpace, this); //测量面积
    emitter.on(EventType.drawingEntityFlightLine, this.drawingEntityFlightLine, this); //绘制实体飞行线段
    emitter.on(EventType.REMOVE_ALL_ENTITIES, this.removeAllEntities, this); //清空实体
    emitter.on(EventType.CREATE_Fly_LINES, this.createFlyLines, this); //关系线条
    emitter.on(EventType.CREATE_Fly_LINES_MANY, this.createFlyLinesMany, this); //扩展批量生成关系线条
    emitter.on(EventType.SET_ENTITIES_VISIBLE_BY_TYPE, this.setEntitiesVisibleByType, this); //点击图例显示图标
    emitter.on(EventType.FLY_TO_ENTITY, this.flyToEntity, this);
    emitter.on(EventType.SET_ATTACK_VISIBLE_BY_TYPE, this.setAttackVisibleByType, this);
    emitter.on(EventType.DELETE_ENTITIES_BY_ID, this.deleteEntitiesById, this); //删除
    emitter.on(EventType.DELETE_ENTITIES_BY_TYPE, this.deleteEntitiesByType, this);
    emitter.on(EventType.createSelectEntityBox, this.createSelectEntityBox, this); //绘制绿色选中框
    emitter.on(EventType.removeSelectEntityBox, this.removeSelectEntityBox, this); //删除绿色选中框
    emitter.on(EventType.hideSelectEntityBox, this.hideSelectEntityBox, this); //隐藏绿色选中框
    emitter.on(EventType.showSelectEntityBox, this.showSelectEntityBox, this); //显示绿色选中框
    emitter.on(EventType.mergeCircles, this.mergeCircles, this); //显示绿色选中框
  }
  createSelectEntityBox(params) {
    var {
      position,
      id
    } = params;
    var {
      x,
      y
    } = position;
    let obj = new SelectEntityBox({})
    obj.instance.position = {
      top: y + "px",
      left: x + "px"
    };
    obj.id = id
    this.selectEntityBoxArr.push(obj)
    if (this.selectEntityBoxArr.length >= 3) {
      this.selectEntityBoxArr[0].destroy()
      this.selectEntityBoxArr.splice(0, 1)
    }
  }
  removeSelectEntityBox() {
    this.selectEntityBoxArr.forEach(item => {
      item.destroy();
    })
    this.selectEntityBoxArr = []
  }
  hideSelectEntityBox() {
    this.selectEntityBoxArr.forEach(item => {
      item.instance.show = false
    })
  }
  showSelectEntityBox() {
    this.selectEntityBoxArr.forEach(item => {
      item.instance.show = true
    })
  }
  //点空白移除
  handleClickBlank() {
    this.removePopper();
    this.removeContextMenu();
    this.removeHtmlPopper()
    this.store.setSelectedEntity(null);
    this.viewer.selectedEntity = null;
  }
  removePopper() {
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
  }
  removeContextMenu() {
    if (this.contextMenu) {
      this.contextMenu.destroy();
      this.contextMenu = null;
    }
  }
  removeHtmlPopper() {
    if (this.addHtmlPopper) {
      this.addHtmlPopper.destroy();
      this.addHtmlPopper = null;
    }
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
  createPopper(params) {
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
  hiddenPopper() {
    if (this.popper) this.popper.instance.show = false;
    if (this.popper) this.popper.nowState = false //为了给旋转的时候加状态
  }
  showPopper() {
    if (this.popper) this.popper.instance.show = true;
    if (this.popper) this.popper.nowState = true //为了给旋转的时候加状态
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
    emitter.emit(EventType.CLICK_BLANK); //移动的时候避免取消报错
    //selectedEntity.id是传入的实体对象
    this.measureTool.movePoint(selectedEntity.id, {}, entity => {
      this.store.setMeasureType(null);
    });
  }
  //旋转调用
  handlePostRender() {
    let arr = gisvis.viewer.entities.values.filter(item => item.hasOwnProperty('entityId'))
    //追随地球经纬度
    if (this.dragPopperArr.length) {
      this.dragPopperArr.forEach((item, index) => {
        let state = arr.filter(ele => item.id === ele.id).length //判断能否找到匹配的，没找到说明该元素给单点删除了
        if (state) {
          let cartesian = arr.filter(ele => item.id === ele.id)[0].position.getValue();
          let position = this.viewer.scene.cartesianToCanvasCoordinates(cartesian);
          let {
            x,
            y
          } = position;
          item.instance.position = {
            top: y + "px",
            left: x + "px"
          };
          item.instance.$mount(); //重新计算位置
        } else {
          item.destroy()
          this.dragPopperArr.splice(index, 1)
        }
      })
    }
    if (this.selectEntityBoxArr.length) {
      this.selectEntityBoxArr.forEach((item, index) => {
        let state = arr.filter(ele => item.id === ele.id).length //判断能否找到匹配的，没找到说明该元素给单点删除了
        if (state) {
          let cartesian = arr.filter(ele => item.id === ele.id)[0].position.getValue();
          let position = this.viewer.scene.cartesianToCanvasCoordinates(cartesian);
          let {
            x,
            y
          } = position;
          item.instance.position = {
            top: y + "px",
            left: x + "px"
          };
        } else {
          item.destroy()
          this.selectEntityBoxArr.splice(index, 1)
        }
      })
    }
    if (!this.store.selectedEntity) {
      return
    }
    if (this.store.selectedEntity.id.position) {
      const cartesian = this.store.selectedEntity.id.position.getValue();
      const position = this.viewer.scene.cartesianToCanvasCoordinates(cartesian);
      const {
        x,
        y
      } = position;
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
      if (this.addHtmlPopper) {
        this.addHtmlPopper.instance.position = {
          top: y + "px",
          left: x + "px"
        };
      }
    }
  }
  //multiple 批量或者一个，批量找到所有基地的数据，一个传入右键选中的
  addAllBubbles({
    multiple,
    oneArr = [],
    properties = []
  }) {
    let arr = []
    if (multiple) {
      arr = gisvis.viewer.entities.values.filter(item => item.hasOwnProperty('entityId'))
    } else {
      arr = oneArr
    }
    arr.forEach((item) => {
      let obj = new dragPopper({
        data: {
          index: item.id //用id来标识每个唯一的面板
        }
      }) //用于对每个拖拽实体监听
      obj.id = item.id //用于地球旋转的时候比对信息
      obj.instance.info = {
          // ...item.properties.properties.getValue(),
          name: item.label.text
        } //传参
        !multiple ? obj.instance.checkedDragInfoProperties = properties : (obj.instance.checkedDragInfoProperties = [{
          name: '国家',
          value: item.properties.properties.getValue().国家
        }, {
          name: '经度',
          value: item.properties.lng.getValue()
        }, {
          name: '纬度',
          value: item.properties.lat.getValue()
        }])
      let cartesian = item.position.getValue(); //初始位置
      let position = this.viewer.scene.cartesianToCanvasCoordinates(cartesian);
      obj.instance.position = {
        top: position.y + "px",
        left: position.x + "px"
      };
      this.dragPopperArr.push(obj) //拖拽面板列表
    })
  }
  deleteAllBubbles() {
    this.dragPopperArr.forEach(item => {
      item.destroy();
    })
    this.dragPopperArr = [] //销毁实体就要清除数组内容，不然都是null，旋转的时候报异常
  }
  changeBubbleBoxColor(val) {
    this.dragPopperArr.forEach(item => {
      item.instance.bgColor = val
    })
  }
  /**
   * 显示Popper
   */
  createHtmlPopper(params) {
    var {
      position,
      name,
    } = params;
    if (!name) name = '未命名'
    var {
      x,
      y
    } = position;

    if (!this.addHtmlPopper) {
      this.addHtmlPopper = new addHtmlPopper({});
    }
    this.addHtmlPopper.instance.text = name;
    this.addHtmlPopper.instance.position = {
      top: y + "px",
      left: x + "px"
    };
    // let sStartFlog = false,
    //   s1 = 0.001,
    //   s2 = s1,
    //   s3 = s1,
    //   s4 = s1
    // setTimeout(() => sStartFlog = true, 300)
    // let rotation = Cesium.Math.toRadians(30);
    // let rotation2 = Cesium.Math.toRadians(30);
    //添加底座一 外环
    // this.viewer.entities.add({
    //   id: "BaseOuterRing",
    //   position: Cesium.Cartesian3.fromDegrees(105.26416540884085, 39.118028382212415),
    //   ellipse: {
    //     //3000是半径
    //     // semiMinorAxis : 3000, //直接这个大小 会有一个闪白的材质 因为cesium材质默认是白色 所以我们先将大小设置为0
    //     // semiMajorAxis : 3000,
    //     semiMinorAxis: new Cesium.CallbackProperty(function () {
    //       if (sStartFlog) {
    //         s1 = s1 + 3000 / 20;
    //         if (s1 >= 3000) {
    //           s1 = 3000;
    //         }
    //       }
    //       return s1;
    //     }, false),
    //     semiMajorAxis: new Cesium.CallbackProperty(function () {
    //       if (sStartFlog) {
    //         s2 = s2 + 3000 / 20;
    //         if (s2 >= 3000) {
    //           s2 = 3000
    //         }
    //       }
    //       return s2;
    //     }, false),
    //     material: "images/circle2.png",
    //     rotation: new Cesium.CallbackProperty(function () {
    //       rotation += 0.05;
    //       return rotation;
    //     }, false),
    //     stRotation: new Cesium.CallbackProperty(function () {
    //       rotation += 0.05;
    //       return rotation;
    //     }, false),
    //     zIndex: 2,
    //   }
    // });
    //添加底座二 内环
    // this.viewer.entities.add({
    //   id: "BaseInnerRing",
    //   position: Cesium.Cartesian3.fromDegrees(105.26416540884085, 39.118028382212415),
    //   ellipse: {
    //     semiMinorAxis: new Cesium.CallbackProperty(function () {
    //       if (sStartFlog) {
    //         s3 = s3 + 3000 / 20;
    //         if (s3 >= 3000 / 2) {
    //           s3 = 3000 / 2;
    //         }
    //       }
    //       return s3;
    //     }, false),
    //     semiMajorAxis: new Cesium.CallbackProperty(function () {
    //       if (sStartFlog) {
    //         s4 = s4 + 3000 / 20;
    //         if (s4 >= 3000 / 2) {
    //           s4 = 3000 / 2;
    //         }
    //       }
    //       return s4;
    //     }, false),
    //     material: "images/circle1.png",
    //     rotation: new Cesium.CallbackProperty(function () {
    //       rotation2 -= 0.03
    //       return rotation2
    //     }, false),
    //     stRotation: new Cesium.CallbackProperty(function () {
    //       rotation2 -= 0.03
    //       return rotation2
    //     }, false),
    //     zIndex: 3
    //   }
    // })
  }
  /**
   * 设置选中实体(这里是完整的结构数据)
   */
  setSelectedEntity(entity) {
    this.store.setSelectedEntity(entity);
    //地图转到背面的时候隐藏popper*********
    // this.viewer.scene.preRender.addEventListener(() => {
    //   if (this.store.selectedEntity) {
    //     let element = entity.id
    //     const p = Cesium.Cartesian3.fromDegrees(element.properties.lng, element.properties.lat, 0)
    //     let j = this.viewer.scene.camera.position, n = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(j).height;
    //     if (!(n += 1 * this.viewer.scene.globe.ellipsoid.maximumRadius, Cesium.Cartesian3.distance(j, p) > n)) {
    //       if (this.popper && this.popper.nowState) this.popper.instance.show = true;
    //       if (this.addHtmlPopper) this.addHtmlPopper.instance.show = true;
    //       this.viewer._selectionIndicator.viewModel.selectionIndicatorElement.getElementsByTagName('svg:svg')[0].style.display = 'block'
    //     } else {
    //       if (this.popper) this.popper.instance.show = false;
    //       if (this.addHtmlPopper) this.addHtmlPopper.instance.show = false;
    //       this.viewer._selectionIndicator.viewModel.selectionIndicatorElement.getElementsByTagName('svg:svg')[0].style.display = 'none'
    //     }
    //   }
    // })
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
   * 融合
   */
  mergeCircles() {
    //找所有实体里面有设置范围的并且颜色相同的融合
    let arr = gisvis.viewer.entities.values.filter(item => item.ellipse && item.ellipse.show.getValue() == true)
    let arrGroup = arr.map((item, index, array) => ({
      colorGroup: array.filter(ele => ele.ellipse.color == item.ellipse.color)
    })).filter((item, index, arr) => {
      let arrIds = arr.map(ele => ele.id)
      return arrIds.indexOf(item.id) == index
    })
    arrGroup.forEach((item, index) => {
      let merge = new MergeCircles({
        viewer,
        id: 'mergecircle' + index
      })
      item.colorGroup.forEach(ele => {
        merge.add({
          entity: ele,
          radius: 100000
        })
      })
    })
    // const e1 = viewer.entities.add({
    //   id: "merge-1",
    //   position: Cesium.Cartesian3.fromDegrees(110.0, 24.0, 0.0),
    //   billboard: {
    //     image: "images/location.png",
    //     scale: .2,
    //   },
    // })
    // const e2 = viewer.entities.add({
    //   id: "merge-2",
    //   position: Cesium.Cartesian3.fromDegrees(111.0, 24.0, 0.0),
    //   billboard: {
    //     image: "images/location.png",
    //     scale: .2,
    //   },
    // })
    // const e3 = viewer.entities.add({
    //   id: "merge-3",
    //   position: Cesium.Cartesian3.fromDegrees(110.5, 25.0, 0.0),
    //   billboard: {
    //     image: "images/location.png",
    //     scale: .2,
    //   },
    // })
    // const mc = new MergeCircles({
    //   viewer,
    //   id: 'mc1'
    // })
    // mc.add({
    //   entity: e1,
    //   radius: 100000
    // })
    // mc.add({
    //   entity: e2,
    //   radius: 100000
    // })
    // mc.add({
    //   entity: e3,
    //   radius: 150000
    // })
    // const e21 = viewer.entities.add({
    //   id: "merge-21",
    //   position: Cesium.Cartesian3.fromDegrees(112.0, 24.0, 0.0),
    //   billboard: {
    //     image: "images/location.png",
    //     scale: .2,
    //   },
    // })
    // const e22 = viewer.entities.add({
    //   id: "merge-22",
    //   position: Cesium.Cartesian3.fromDegrees(114.0, 24.0, 0.0),
    //   billboard: {
    //     image: "images/location.png",
    //     scale: .2,
    //   },
    // })
    // const e23 = viewer.entities.add({
    //   id: "merge-23",
    //   position: Cesium.Cartesian3.fromDegrees(113.5, 25.0, 0.0),
    //   billboard: {
    //     image: "images/location.png",
    //     scale: .2,
    //   },
    // })
    // const mc2 = new MergeCircles({
    //   viewer,
    //   id: 'mc2',
    //   color: "#00f",
    //   lineWidth: 2
    // })
    // mc2.add({
    //   entity: e21,
    //   radius: 100000
    // })
    // mc2.add({
    //   entity: e22,
    //   radius: 100000
    // })
    // mc2.add({
    //   entity: e23,
    //   radius: 150000
    // })
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
  //绘制HTML poper
  drawHTMLPoper() {
    addHtmlPoper(this.viewer, true)
    addEntityLayer({
      id: 'box5',
      position: [118.486419, 32.86446, 40000], //高度为 boxHeightMax
      element: `<div class='ysc-dynamic-layer ys-css3-box' id='box5'>
                <div class='line'></div>
                <div class='main'>
                    <div class="">风吹过已静下</div>
                    <div class="">将心意再还谁</div>
                </div>
              </div>`,
      offset: [10, -250],
      boxHeight: 20000, //中间立方体的高度
      boxHeightDif: 500, //中间立方体的高度增长差值，越大增长越快
      boxHeightMax: 40000, //中间立方体的最大高度
      boxSide: 10000, //立方体的边长
      boxMaterial: Cesium.Color.DEEPSKYBLUE.withAlpha(0.5),
      circleSize: 3000, //大圆的大小，小圆的大小默认为一半
    })
  }
  /**
   * 添加地图数据,每次先清除上次左键选中的效果
   */
  gisRender(gisData = {}) {
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
  addCircleScan({
    id,
    range
  }) {
    this.viewer.entities.getById(id).ellipse = {
      show: true,
      height: 0,
      semiMinorAxis: Number(range) * 500,
      semiMajorAxis: Number(range) * 500,
      material: new CircleWaveMaterialProperty({
        duration: 10e3,
        gradient: 0,
        color: new Cesium.Color(0.0, 1.0, 0.0, 1),
        count: 1
      })
    }
    // if (!this.viewer.entities.getById(id).ellipse) {
    //   this.viewer.entities.getById(id).ellipse = {
    //     show: true,
    //     height: 0,
    //     semiMinorAxis: 10000,
    //     semiMajorAxis: 10000,
    //     material: new CircleWaveMaterialProperty({
    //       duration: 2e3,
    //       gradient: 0,
    //       color: new Cesium.Color(0.0, 1.0, 0.0, 1),
    //       // new Cesium.Color(1.0, 0.0, 0.0, 1.0),红色
    //       count: 1
    //     })
    //   }
    // } else {
    //   //show是对象
    //   this.viewer.entities.getById(id).ellipse.show.setValue(!this.viewer.entities.getById(id).ellipse.show.getValue())
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
    const {
      firstPoint,
      cartesian
    } = obj
    this.arrData = []
    this.measureTool.drawingEntityFlightLine(arrData => {
      this.arrData = arrData
      this.arrData.splice(0, 0, firstPoint) //添加初始点坐标
    }, cartesian) //绘制的初始点坐标
  }
  /**
   * 轨迹飞行
   */
  simulatedSatelliteFun() {
    let time = 0 //拟定假的时间
    this.arrData.forEach(item => {
      item.height = this.arrData[0].height //默认高度
      item.time = time
      time += 200
    })
    sessionStorage.setItem('initTackData', JSON.stringify(this.arrData))
    console.log("绘制的飞行轨迹数据", JSON.parse(sessionStorage.getItem("initTackData")))
    this.simulatedSatellite.planFlying(this.viewer, JSON.parse(sessionStorage.getItem("initTackData")))
    VuexStore.state.map.airplaneEntity = this.simulatedSatellite.store.airplaneEntity //用于追随实体
    emitter.emit(EventType.StartTimeLine); //自动启用时间线
  }
  /**
   * 关系线
   */
  createFlyLines(data) {
    const center = data.center; //起始点
    const points = data.points; //终止点
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
    let material = new Cesium.PolylineTrailMaterialProperty({
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
    this.viewer.entities.resumeEvents(); //启动
  }
  /**
   * 扩展批量生成关系之前线条
   */
  createFlyLinesMany(data) {
    const center = data.center;
    const cities = data.points;
    const startPoint = Cesium.Cartesian3.fromDegrees(
      center.lon,
      center.lat,
      0
    );
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
    cities.map(city => {
      let material = new Cesium.PolylineTrailMaterialProperty({
        color: Cesium.Color.BLUE,
        duration: 3000,
        trailImage: "images/colors1.png" //动态图片
      });
      const endPoint = Cesium.Cartesian3.fromDegrees(city.lon, city.lat, 0);
      let ids = [center.id, city.id].join(",")
      // this.viewer.entities.add({
      //   position: endPoint,
      //   point: {
      //     pixelSize: city.size - 10,
      //     color: city.color
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
    });
    this.viewer.entities.resumeEvents();
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
      Cesium.Cartesian3.distance(startPoint, endPoint) / 2;
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
