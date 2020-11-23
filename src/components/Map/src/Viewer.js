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

    const { imageryProvider = _imageryProvider } = options;

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
      shouldAnimate:true,
      animation: false,
      timeline: true,
      navigationHelpButton: false,
      sceneModePicker: true,
      creditContainer: document.createElement("div"),
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      baseLayerPicker: false,
      infoBox: false
    });
    // this.viewer.scene.debugShowFramesPerSecond =
    //   process.env.NODE_ENV === "development";
  }
}

export { Viewer };

export default Viewer;
