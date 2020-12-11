import mitt from "mitt";

let _instance = null;

const all = new Map();
const _emitter = mitt(all);
const EventType = {
  /** 【地图】 添加地图数据 */
  RENDER_DATA: "gis-render-data",
  /** 【地图】 鼠标右键 */
  RIGHT_CLICK: "gis-right-click",
  /** 【地图】 修改实体数据 */
  EDIT_CLICK_ENTITY: "gis-edit-click",
  /** 【地图】 绘制圆形区域 */
  SCOPE_RENDER: "gis-scope-render",
  /** 【地图】 扫描范围 */
  SCOPE_SEARCH: "gis-scope-search",
  /** 【地图】 轨迹飞行 */
  Simulated_Satellite: "gis-simulated-satellite",
  /** 【地图】 默认展开左下侧菜单 */
  MapLegend_Collapse: "gis-mapLegend-collapse",
  /** 【地图】 轨迹飞行事件线初始话 */
  StartTimeLine:'gis-startTime-line',
  /** 【地图】 测量距离 */
  MeasureLineSpace: "gis-measure-lineSpacee",
  /** 【地图】 测量距离 */
  MeasureAreaSpace: "gis-measure-areaSpace",
  /** 【地图】 绘制雷达效果 */
  RADAR_RENDER: "gis-radar-render",
  /** 【地图】 地图数据改变 */
  DATA_CHANGE: "data-change",
  /** 【地图】 绘制实体 */
  DRAW_ENTITIES: "draw-entities",
  /** 【图例】 图例数据改变 */
  LEGEND_DATA_CHANGE: "legend-data-change",
  /** 【地图】 选中实体 */
  SELECTED_ENTITY: "selected-entity",
  /** 【实体】 更新选中的实体属性 */
  UPDATE_SELECTED_ENTITY: "update-selected-entity",
  /** 【地图】 飞入到实体 */
  FLY_TO_ENTITY: "fly-to-entity",
  /** 【地图】 飞入到首页 */
  FLY_HOME: "fly-home",
  /** 【地图】 轨迹飞行飞机实体切换视图 */
  Air_Plane_View: "air_plane_view",
  /** 【地图】 清空所有实体 */
  REMOVE_ALL_ENTITIES: "remove-all-entities",
  /** 【实体】 通过类别设置实体可见性 */
  SET_ENTITIES_VISIBLE_BY_TYPE: "set-entities-visible-by-type",
  /** 【实体】 通过类别删除实体 */
  DELETE_ENTITIES_BY_TYPE: "delete-entities-by-type",
  /** 【实体】 通过类别设置实体攻击范围可见性 */
  SET_ATTACK_VISIBLE_BY_TYPE: "set-attack-visible-by-type",
  /** 【实体】 通过id删除实体 */
  DELETE_ENTITIES_BY_ID: "delete-entities-by-id",
  /** 【测量】 设置测量类型 */
  SET_MEASURE_TYPE: "set-measure-type",
  /** 【测量】 清空测量类型 */
  DELETE_MEASURE_TYPE: "delete-measure-type",
  /** 【图例】 图例着色改变 */
  COLOR_SHADER_CHANGE: "color-shader-change",
  /** 【Popper】 Popper显示 */
  POPPER_SHOW: "popper-show",
  /** 【Popper】 Popper移动 */
  POPPER_MOVE: "popper-move",
  /** 【Popper】 Popper移除 */
  POPPER_REMOVE: "popper-remove",
  /** 【地图】 点击地图空白 */
  CLICK_BLANK: "click-blank",
  /** 【地图】 点击实体 */
  CLICK_ENTITY: "click-entity",
  /** 【右键菜单】 右键菜单显示 */
  CONTEXT_MENU_SHOW: "content-menu-show",
  /** 【右键菜单】 右键菜单移除 */
  CONTEXT_MENU_REMOVE: "content-menu-remove",
  /** 【右键菜单】 右键菜单点击 */
  CONTEXT_MENU_CLICK: "content-menu-click",
  /** 【地图】 高亮相关实体 */
  HIGHLIGHT_RELATED_ENTITIES: "highlight-related-entities"
};

class EventEmitter {
  constructor(options = {}) {
    if (_instance) {
      return _instance;
    }

    _instance = this;
    window.EventEmitterInstance = this;
  }

  get all() {
    return all;
  }
  /**
   * 添加事件监听
   * @param {string} type
   * @param {function} handler
   * @param {object} context
   * @returns {function} bound function
   */
  on(type, handler, context) {
    // console.log("on -> type", type);
    const bound = handler.bind(context);

    _emitter.on(type, bound);

    return bound;
  }
  /**
   * 触发事件
   * @param {string} type
   * @param {any} event
   */
  emit(type, event) {
    // console.log("emit -> type", type, event);
    _emitter.emit(type, event);
  }
  /**
   * 移除事件
   * @param {string} type
   * @param {function} handler
   */
  off(type, handler) {
    _emitter.off(type, handler);
  }
  /**
   * 清空事件池
   */
  removeAll() {
    Object.keys(all).forEach(key => delete all[key]);
  }
}

const emitter = new EventEmitter();

export { EventType, emitter };

export default {
  EventType,
  emitter
};
