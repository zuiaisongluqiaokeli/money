import PointDrawer from "./src/PointDrawer";
import unknownlocationDrawer from "./src/unknownlocationDrawer"
import { emitter, EventType } from "../../src/EventEmitter";

class MeasureTool {
  constructor(viewer = {}, options = {}) {
    this.viewer = viewer;
    this.options = options;
    this.pointDrawer = null;
    this.unknownlocationDrawer = null
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
  //未知位置绘制点
  unknownlocationPoint(options = {}, callback) {
    options = Object.assign(options, this.options);
    this.unknownlocationDrawer = new unknownlocationDrawer(this.viewer, options);
    this.unknownlocationDrawer.startDrawPoint(callback);

    return this.unknownlocationDrawer;
  }
  setDefaultOptions() {
    const { width, height } = this.options;

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
    this.pointDrawer.entity = entity;
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
