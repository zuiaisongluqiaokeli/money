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
      shouldAnimate: true,
      animation: false,
      timeline: true,
      navigationHelpButton: false,
      selectionIndicator: true,//移除靶
      sceneModePicker: true, //切换二维
      creditContainer: document.createElement("div"),
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      baseLayerPicker: false, //去掉基础图层
      infoBox: false
    });
    //靶子
    // let svg = this.viewer._selectionIndicator.viewModel.selectionIndicatorElement.getElementsByTagName('svg:svg')[0];
    // svg.innerHTML = `<svg t="1607600990577" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22099" width="64" height="64"><path d="M515.41504 815.49824C341.31968 815.49824 199.68 673.86368 199.68 499.76832s141.63968-315.73504 315.73504-315.73504c48.8192 0 95.62112 10.83904 139.10528 32.22016 2.01728 0.98816 4.02432 2.00192 6.016 3.03616a7.68512 7.68512 0 0 1 3.29216 10.35264 7.68512 7.68512 0 0 1-10.34752 3.28704c-1.89952-0.98304-3.80928-1.9456-5.72928-2.88768-41.35936-20.33664-85.87776-30.6432-132.33152-30.6432C349.78816 199.39328 215.04 334.14144 215.04 499.76832s134.74816 300.37504 300.37504 300.37504c165.62688 0 300.37504-134.74304 300.37504-300.37504 0-83.36896-35.09248-163.69152-96.27648-220.38528a7.68 7.68 0 0 1 10.43968-11.26912c64.31232 59.58656 101.1968 144.02048 101.1968 231.64928 0 174.10048-141.63968 315.73504-315.73504 315.73504z" p-id="22100" fill="#ffffff"></path><path d="M515.41504 875.22816c-207.03232 0-375.46496-168.42752-375.46496-375.46496s168.43264-375.46496 375.46496-375.46496S890.88 292.73088 890.88 499.7632s-168.43264 375.46496-375.46496 375.46496z m0-735.5648c-198.56384 0-360.10496 161.54112-360.10496 360.10496s161.54112 360.10496 360.10496 360.10496S875.52 698.33216 875.52 499.76832s-161.54112-360.10496-360.10496-360.10496z" p-id="22101" fill="#ffffff"></path><path d="M520.96 186.59328a5.12 5.12 0 0 1-10.24 0v-94.72a5.12 5.12 0 1 1 10.24 0v94.72zM520.96 907.65824a5.12 5.12 0 1 1-10.24 0v-94.72a5.12 5.12 0 1 1 10.24 0v94.72zM829.01504 504.88832a5.12 5.12 0 0 1 0-10.24h94.72a5.12 5.12 0 1 1 0 10.24h-94.72zM107.94496 504.88832a5.12 5.12 0 1 1 0-10.24h94.72a5.12 5.12 0 1 1 0 10.24h-94.72zM520.53504 472.74496a5.12 5.12 0 0 1-10.24 0V231.24992a5.12 5.12 0 1 1 10.24 0v241.49504zM520.53504 767.15008a5.12 5.12 0 0 1-10.24 0v-241.50016a5.12 5.12 0 1 1 10.24 0v241.50016zM541.87008 504.32a5.12 5.12 0 1 1 0-10.24h241.49504a5.12 5.12 0 1 1 0 10.24h-241.49504zM247.46496 504.32a5.12 5.12 0 1 1 0-10.24h241.50016a5.12 5.12 0 1 1 0 10.24H247.46496z" p-id="22102" fill="#ffffff"></path></svg>`//修改选择器外观
    // svg.style.fill = 'white';//还可以修改样式
    //设置鹰眼图中球属性
    window.viewer1 = new Cesium.Viewer('eye', {
      imageryProvider: imageryProvider,
      shouldAnimate: true,
      animation: false,
      timeline: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      creditContainer: document.createElement("div"),
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      baseLayerPicker: false, //去掉基础图层
      infoBox: false
    });
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;//相机的高度的最小值
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000;  //相机高度的最大值
    let control = window.viewer1.scene.screenSpaceCameraController;
    control.enableRotate = false;
    control.enableTranslate = false;
    control.enableZoom = false;
    control.enableTilt = false;
    control.enableLook = false;
    let syncViewer = function () {
      window.viewer1.camera.flyTo({
        destination: viewer.camera.position,
        orientation: {
          heading: viewer.camera.heading,
          pitch: viewer.camera.pitch,
          roll: viewer.camera.roll
        },
        duration: 0.0
      });
    };
    //鹰眼同步
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(0, 0),
      label: {
        text: new Cesium.CallbackProperty(function () {
          syncViewer();
          return "";
        }, true)
      }
    })
    //罗盘
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
