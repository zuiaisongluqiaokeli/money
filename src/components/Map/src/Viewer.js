let _instance = null;

const _imageryProvider = 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali';
class Viewer {
    viewer = null;

    constructor(options = {}) {
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
        window.viewer = this.viewer = new Cesium.Viewer('cesium', {
            imageryProvider: imageryProvider,
            shouldAnimate: true,
            animation: false,
            timeline: true,
            navigationHelpButton: false,
            sceneModePicker: false,
            creditContainer: document.createElement('div'),
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            baseLayerPicker: false,
            infoBox: false
        });
    }
}

export { Viewer };

export default Viewer;
