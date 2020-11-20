import { emitter, EventType } from "./EventEmitter";
import Viewer from "./Viewer";
import Drawer from "./Drawer";
import Store from "./Store";
import MeasureTool from "../views/MeasureTool";
import ScreenSpaceEvent from "./ScreenSpaceEvent";
import ContextMenu from "../views/ContextMenu/index";
import Popper from "../views/Popper";
const _homePosition = [119.17968749999999, 25.522614647623293, 25000000];

let _instance = null;

class Main {
  legendData = null;
  popper = null;

  constructor(options = {}) {
    if (_instance) {
      // return _instance;
    }

    const { homePosition = _homePosition, el } = options;

    this.el = el;
    this.homePosition = homePosition;

    this.viewer = new Viewer(options);
    this.viewer.scene.debugShowFramesPerSecond = true;
    this.store = new Store();
    this.drawer = new Drawer({
      viewer: this.viewer,
      store: this.store
    });
    //测量工具
    this.measureTool = new MeasureTool(this.viewer);
    this.screenSpaceEvent = new ScreenSpaceEvent({
      viewer: this.viewer
    });

    this.emitter = emitter;
    window.gisvis = this;
    if (!_instance) {
      this.initEventListener();
    }

    _instance = this;
  }
  /**
   * 初始化事件监听
   */
  initEventListener() {
    emitter.on(EventType.CLICK_BLANK, this.handleClickBlank, this); //点空白移除
    emitter.on(EventType.CLICK_ENTITY, this.setSelectedEntity, this); //点实体右侧面板数据改变
    emitter.on(EventType.SET_MEASURE_TYPE, this.setMeasureType, this); //绘制点
    emitter.on(EventType.COLOR_SHADER_CHANGE, this.handleColorShader, this); //着色
    // emitter.on(EventType.CONTEXT_MENU_SHOW, this.showContextMenu, this);
    emitter.on(EventType.CONTEXT_MENU_REMOVE, this.removeContextMenu, this);
    emitter.on(EventType.CONTEXT_MENU_CLICK, this.clickContextMenuItem, this);
    emitter.on(EventType.POPPER_SHOW, this.showPopper, this); //名字提示语
    emitter.on(EventType.POPPER_MOVE, this.movePopper, this);
    emitter.on(EventType.POPPER_REMOVE, this.removePopper, this);
    emitter.on(EventType.RENDER_DATA, this.gisRender, this); //地图搜索/扩展等添加实体
    emitter.on(EventType.SCOPE_RENDER, this.gisScopeRender, this); //范围
    emitter.on(EventType.RADAR_RENDER, this.gisRadarRender, this); //雷达
    emitter.on(EventType.REMOVE_ALL_ENTITIES, this.removeAllEntities, this); //清空实体
    emitter.on(
      EventType.SET_ENTITIES_VISIBLE_BY_TYPE,
      this.setEntitiesVisibleByType,
      this
    ); //点击图例显示图标
    emitter.on(EventType.FLY_TO_ENTITY, this.flyTo, this);
    emitter.on(EventType.SELECTED_ENTITY, this.setSelectedEntity, this);
    emitter.on(
      EventType.SET_ATTACK_VISIBLE_BY_TYPE,
      this.setAttackVisibleByType,
      this
    );
    emitter.on(EventType.DELETE_ENTITIES_BY_ID, this.deleteEntitiesById, this); //删除
    emitter.on(
      EventType.DELETE_ENTITIES_BY_TYPE,
      this.deleteEntitiesByType,
      this
    );
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
    const { entitiesJsonCollection } = this.store;
    const ids = entitiesJsonCollection[type].map(({ id }) => id);

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
    const { position, name, canMove, create } = params;
    const { x, y } = position;

    if (!this.popper) {
      if (create) {
        this.popper = new Popper({
          data: {
            canMove
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
    const { selectedEntity } = this.store;

    this.removePopper();
    this.measureTool.movePoint(selectedEntity.id, {}, entity => {
      const { properties } = entity;
      const values = properties.getValue();
      const { lng, lat } = values;
      const position = {
        x: lng,
        y: lat
      };

      this.store.setMeasureType(null);
      emitter.emit(EventType.POPPER_SHOW, {
        position,
        canMove: true,
        create: true
      });
    });
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
    const { position, create } = params;
    const { x, y } = position;
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
  flyTo(entity) {
    const { lng, lat, h = 10000000 } = entity;

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
    const { action } = data;
    console.log(action);
  }
  /**
   * 通过类别设置实体可见性
   */
  setEntitiesVisibleByType(payload) {
    const { type, value } = payload;
    const { entitiesJsonCollection } = this.store;
    const ids = entitiesJsonCollection[type].map(({ id }) => id);
    const allEntities = this.getEntities();
    const collection = allEntities.filter(({ id }) => ids.includes(id));

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
    const { type, value } = payload;
    const { entitiesJsonCollection } = this.store;
    const ids = entitiesJsonCollection[type].map(({ id }) => id);
    const allEntities = this.getEntities();
    const collection = allEntities.filter(({ id }) => ids.includes(id));

    collection.forEach(entity => {
      const { ellipse, polyline } = entity;

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
    const { measureType } = this.store;

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
    debugger
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
    const { entities, areaProperty, radius, color } = scopedEntities;
    this.drawer.drawScope(entities, areaProperty, radius, color);
  }
  /**
   * 图例着色改变
   */
  handleColorShader() {
    const { entitiesCountryCollection } = this.legendData;
    const entities = this.viewer.entities;

    Object.entries(entitiesCountryCollection).forEach(
      ([country, collection]) => {
        const color =
          colorControl.findColorByType(country) || colorControl.defaultColor;

        collection.forEach(({ id }) => {
          const entity = entities.getById(id);
          const { ellipse, polyline } = entity;

          ellipse.material = Cesium.Color.fromCssColorString(color);
          polyline.material.color.setValue(
            Cesium.Color.fromCssColorString(color).withAlpha(1)
          );
        });
      }
    );
  }
  /**
   * 雷达
   */
  gisRadarRender(params) {
    console.log("radar-render");
    const { lat, lng, scanColor, radius } = params;
    this.drawer.marsRadarScan(lat, lng, scanColor, radius);
    // var CartographicCenter = new Cesium.Cartographic(
    //   Cesium.Math.toRadians(lng),
    //   Cesium.Math.toRadians(lat),
    //   0
    // );
    // // var scanColor = Cesium.Color.fromCssColorString("#00c6ab").withAlpha(0.8);
    // this.drawer.AddRadarScanPostStage(
    //   this.viewer,
    //   CartographicCenter,
    //   radius,
    //   scanColor,
    //   2000
    // );
  }
}

export { Main };

export default Main;
