import { emitter, EventType } from "./EventEmitter";
import { difference } from "lodash";

// 目前支持20种颜色
const colorSet = [
  "#FF000A",
  "#AFF1FF",
  "#91D5FF",
  "#87E8DE",
  "#B7EB8F",
  "#FFBB96",
  "#FFADD2",
  "#D3ADF7",
  "#FFA39E",
  "#97A9EE",
  "#FE9438",
  "#85ADFE",
  "#FD8C71",
  "#FB588E",
  "#30CBA1",
  "#FAD337",
  "#73CCF3",
  "#67B8DC",
  "#8CC938",
  "#D796F2"
].map(color =>
  Cesium.Color.fromCssColorString(color)
    .withAlpha(0.37)
    .toCssColorString()
);
//选择的第一个颜色
const [defaultColor] = colorSet;

class ColorControl {
  shaderMap = {};
  usedColorSet = [];
  defaultColor = defaultColor;

  constructor() {
    window.ColorControlInstance = this;

    this.initEventListener();
  }
  /**
   * 初始化事件监听
   */
  initEventListener() {
    emitter.on(EventType.REMOVE_ALL_ENTITIES, this.clear, this);
  }
  /**
   * 计算着色列表
   */
  computeShaderMap(data) {
    const shaderMap = this.shaderMap;
    const { entitiesCountryCollection } = data;

    this.shaderMap = {};
    Object.keys(entitiesCountryCollection).forEach(key => {
      const include = Object.keys(shaderMap).includes(key);

      this.shaderMap[key] = include ? shaderMap[key] : this.requireColor();
    });
  }
  /**
   * 设置着色
   */
  setShader(key, color = this.defaultColor) {
    this.shaderMap[key] = color;
    this.addUsedColor(color);
  }
  /**
   * 添加着色
   */
  addShader(data = {}) {
    Object.entries(data).forEach(entry => {
      const [country, color = this.requireColor()] = entry;

      this.setShader(country, color);
    });
    emitter.emit(EventType.COLOR_SHADER_CHANGE);
  }
  /**
   * 更新着色
   */
  updateShader() {}
  /**
   * 在颜色池中取一种未使用的颜色
   */
  requireColor() {
    const unused = difference(colorSet, this.usedColorSet);
    const [color = this.defaultColor] = unused;

    this.addUsedColor(color);

    return color;
  }
  /**
   * 添加正在使用的颜色
   */
  addUsedColor(color) {
    if (!this.usedColorSet.includes(color)) {
      this.usedColorSet.push(color);
    }
  }
  /**
   * 释放一种正在使用的颜色
   */
  releaseColor() {}
  /**
   * 通过类型释放一种正在使用的颜色
   */
  releaseColorByType(type) {}
  /**
   * 重置
   */
  clear() {
    this.shaderMap = {};
    this.usedColorSet = [];
  }
  /**
   * 根据类型获取一种颜色，没有则返回新的颜色
   */
  getColorByType(type) {
    const color = this.findColorByType(type);

    return color ? color : this.requireColor();
  }
  /**
   * 根据类型找到颜色
   */
  findColorByType(type) {
    if (Object.keys(this.shaderMap).includes(type)) {
      return this.shaderMap[type];
    }
  }
  /**
   * 得到着色列表
   */
  getShaderMap() {
    return this.shaderMap;
  }
  /**
   * 得到颜色列表
   */
  getColorSet() {
    return colorSet;
  }
}

const colorControl = new ColorControl();

export { colorControl };

export default colorControl;
