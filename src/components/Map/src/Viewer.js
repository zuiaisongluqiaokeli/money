
let _instance = null;
const _imageryProvider =
  "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali";
// const _imageryProvider =
//   location.origin + '/map-resource/map-resource/imagery/{z}/{y}/{x}.jpg'
var token = '6c70bdd9f7f6968e0426350072bc945a'
// 服务域名
var tdtUrl = 'https://t{s}.tianditu.gov.cn/'
// 服务负载子域
var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
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
    // 抗锯齿
    viewer.scene.postProcessStages.fxaa.enabled = false
    // 水雾特效
    viewer.scene.globe.showGroundAtmosphere = true
    // 叠加国界服务
    var iboMap = new Cesium.UrlTemplateImageryProvider({
      url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
      subdomains: subdomains,
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      maximumLevel: 10,
    })
    viewer.imageryLayers.addImageryProvider(iboMap)
    // 叠加地形服务
    // var terrainUrls = new Array()
    // for (var i = 0; i < subdomains.length; i++) {
    //   var url =
    //     tdtUrl.replace('{s}', subdomains[i]) +
    //     'DataServer?T=elv_c&tk=' +
    //     token
    //   terrainUrls.push(url)
    // }
    // var provider = new Cesium.GeoTerrainProvider({
    //   urls: terrainUrls,
    // })

    // viewer.terrainProvider = provider
    // 叠加三维地名服务
    var wtfs = new Cesium.GeoWTFS({
      viewer,
      //三维地名服务，使用wtfs服务
      subdomains: subdomains,
      metadata: {
        boundBox: {
          minX: -180,
          minY: -90,
          maxX: 180,
          maxY: 90,
        },
        minLevel: 1,
        maxLevel: 20,
      },
      aotuCollide: true, //是否开启避让
      collisionPadding: [5, 10, 8, 5], //开启避让时，标注碰撞增加内边距，上、右、下、左
      serverFirstStyle: true, //服务端样式优先
      labelGraphics: {
        font: '28px sans-serif',
        fontSize: 28,
        fillColor: Cesium.Color.WHITE,
        scale: 0.5,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 5,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        showBackground: false,
        backgroundColor: Cesium.Color.RED,
        backgroundPadding: new Cesium.Cartesian2(10, 10),
        horizontalOrigin: Cesium.HorizontalOrigin.MIDDLE,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        eyeOffset: Cesium.Cartesian3.ZERO,
        pixelOffset: new Cesium.Cartesian2(0, 8),
      },
      billboardGraphics: {
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        eyeOffset: Cesium.Cartesian3.ZERO,
        pixelOffset: Cesium.Cartesian2.ZERO,
        alignedAxis: Cesium.Cartesian3.ZERO,
        color: Cesium.Color.WHITE,
        rotation: 0,
        scale: 1,
        width: 18,
        height: 18,
      },
    })
    //三维地名服务，使用wtfs服务
    wtfs.getTileUrl = function () {
      return tdtUrl + 'mapservice/GetTiles?lxys={z},{x},{y}&tk=' + token
    }
    wtfs.getIcoUrl = function () {
      return tdtUrl + 'mapservice/GetIcon?id={id}&tk=' + token
    }
    wtfs.initTDT([
      {
        x: 6,
        y: 1,
        level: 2,
        boundBox: { minX: 90, minY: 0, maxX: 135, maxY: 45 },
      },
      {
        x: 7,
        y: 1,
        level: 2,
        boundBox: { minX: 135, minY: 0, maxX: 180, maxY: 45 },
      },
      {
        x: 6,
        y: 0,
        level: 2,
        boundBox: { minX: 90, minY: 45, maxX: 135, maxY: 90 },
      },
      {
        x: 7,
        y: 0,
        level: 2,
        boundBox: { minX: 135, minY: 45, maxX: 180, maxY: 90 },
      },
      {
        x: 5,
        y: 1,
        level: 2,
        boundBox: { minX: 45, minY: 0, maxX: 90, maxY: 45 },
      },
      {
        x: 4,
        y: 1,
        level: 2,
        boundBox: { minX: 0, minY: 0, maxX: 45, maxY: 45 },
      },
      {
        x: 5,
        y: 0,
        level: 2,
        boundBox: { minX: 45, minY: 45, maxX: 90, maxY: 90 },
      },
      {
        x: 4,
        y: 0,
        level: 2,
        boundBox: { minX: 0, minY: 45, maxX: 45, maxY: 90 },
      },
      {
        x: 6,
        y: 2,
        level: 2,
        boundBox: { minX: 90, minY: -45, maxX: 135, maxY: 0 },
      },
      {
        x: 6,
        y: 3,
        level: 2,
        boundBox: { minX: 90, minY: -90, maxX: 135, maxY: -45 },
      },
      {
        x: 7,
        y: 2,
        level: 2,
        boundBox: { minX: 135, minY: -45, maxX: 180, maxY: 0 },
      },
      {
        x: 5,
        y: 2,
        level: 2,
        boundBox: { minX: 45, minY: -45, maxX: 90, maxY: 0 },
      },
      {
        x: 4,
        y: 2,
        level: 2,
        boundBox: { minX: 0, minY: -45, maxX: 45, maxY: 0 },
      },
      {
        x: 3,
        y: 1,
        level: 2,
        boundBox: { minX: -45, minY: 0, maxX: 0, maxY: 45 },
      },
      {
        x: 3,
        y: 0,
        level: 2,
        boundBox: { minX: -45, minY: 45, maxX: 0, maxY: 90 },
      },
      {
        x: 2,
        y: 0,
        level: 2,
        boundBox: { minX: -90, minY: 45, maxX: -45, maxY: 90 },
      },
      {
        x: 0,
        y: 1,
        level: 2,
        boundBox: { minX: -180, minY: 0, maxX: -135, maxY: 45 },
      },
      {
        x: 1,
        y: 0,
        level: 2,
        boundBox: { minX: -135, minY: 45, maxX: -90, maxY: 90 },
      },
      {
        x: 0,
        y: 0,
        level: 2,
        boundBox: { minX: -180, minY: 45, maxX: -135, maxY: 90 },
      },
    ])
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
    //地球缩放效果
    // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;//相机的高度的最小值
    // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000;  //相机高度的最大值
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
