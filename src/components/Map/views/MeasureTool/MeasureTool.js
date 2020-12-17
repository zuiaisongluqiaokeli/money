import PointDrawer from "./src/PointDrawer";
import {
  emitter,
  EventType
} from "../../src/EventEmitter";
import measureTools from './src/measureTools'
import drawingFlightLine from './src/drawingFlightLine'
class MeasureTool {
  constructor(viewer = {}, options = {}) {
    this.viewer = viewer;
    this.options = options;
    this.pointDrawer = null;
    this.drawing = false;
    // this.setDefaultOptions();

    // this.initEventListener();

  }

  initEventListener() {
    emitter.on(
      EventType.DELETE_MEASURE_TYPE,
      this.handleMeasureTypeClear,
      this
    );
  }
  //绘制点
  measurePoint(options = {}, callback) {
    options = Object.assign(options, this.options);
    this.pointDrawer = new PointDrawer(this.viewer, options);
    this.pointDrawer.startDrawPoint(callback);

    return this.pointDrawer;
  }
  //测量距离
  measureLineSpace() {
    measureTools.measureLineSpace(this.viewer)
  }
  //测量面积
  measureAreaSpace() {
    measureTools.measureAreaSpace(this.viewer)
  }
  //绘制实体飞行线段
  drawingEntityFlightLine(callback,cartesian) {
    drawingFlightLine.measureLineSpace(this.viewer,callback,cartesian)
  }
  setDefaultOptions() {
    const {
      width,
      height
    } = this.options;

    if (!width && width !== 0) {
      this.options.width = 20;
    }
    if (!height && height !== 0) {
      this.options.height = 24;
    }
  }

  getOptionByKey(key) {
    return this.options[key];
  }
  /**
   * 移动已有的点
   */
  movePoint(entity, options = {}, callback) {
    Object.assign(options, this.options);
    this.pointDrawer = new PointDrawer(this.viewer, options);
    this.pointDrawer.entity = entity; //有实体不用初始化
    this.pointDrawer.firstPosition = entity.position.getValue(); 
    this.pointDrawer.firstLng = entity.properties.lng.getValue(); 
    this.pointDrawer.firstLat = entity.properties.lat.getValue();  
    this.pointDrawer.startDrawPoint(callback);

    return this.pointDrawer;
  }
  /**
   * 测量类型被清空时的处理
   */
  handleMeasureTypeClear() {
    if (this.drawing) {
      this.cancelDraw();
    }
  }

  cancelDraw() {
    // this.pointDrawer.cancelDraw();
  }
}

export default MeasureTool;
