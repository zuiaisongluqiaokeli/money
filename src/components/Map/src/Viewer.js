let _instance = null;

const _imageryProvider =
  "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali";
// 'map/s/{z}/{y}/{x}.jpg'
// 'map/s/{z}/{y}/{x}.png'
class Viewer {
  viewer = null;

  constructor(options = {}) {
    if (_instance) {
      // return _instance;
    }

    const {
      imageryProvider = _imageryProvider
    } = options;

    this.imageryProvider = imageryProvider;

    window.ViewerInstance = this;

    this.initMap();
    _instance = this.viewer;

    return this.viewer;
  }
  /**
   * 初始化地图
   */
  initMap() {
    const imageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: this.imageryProvider
    });
    window.viewer = this.viewer = new Cesium.Viewer("cesium", {
      imageryProvider: imageryProvider,
      shouldAnimate: true, //去除水印
      animation: false,
      timeline: true,
      navigationHelpButton: false,
      sceneModePicker: true,
      creditContainer: document.createElement("div"),
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      baseLayerPicker: false, //去掉基础图层
      infoBox: false
    });
    var options = {};
    // 用于启用或禁用罗盘。
    options.enableCompass = true;
    // 用于启用或禁用缩放控件。
    options.enableZoomControls = true;
    // 用于启用或禁用距离图例。
    options.enableDistanceLegend = true;
    // 用于启用或禁用指南针外环。
    options.enableCompassOuterRing = true;
    this.viewer.extend(Cesium.viewerCesiumNavigationMixin, options);

  }
}

export {
  Viewer
};

export default Viewer;
