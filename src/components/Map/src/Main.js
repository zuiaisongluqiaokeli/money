import { emitter, EventType } from './EventEmitter';
import Viewer from './Viewer';
import Drawer from './Drawer';
import Store from './Store';
import MeasureTool from '../views/MeasureTool';
import ScreenSpaceEvent from './ScreenSpaceEvent';
import ContextMenu from '../views/ContextMenu/index';

const _homePosition = [119.17968749999999, 25.522614647623293, 25000000];

let _instance = null;

class Main {
    legendData = null;
    popper = null;

    constructor(options = {}) {
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
        emitter.on(EventType.CLICK_BLANK, this.removeContextMenu, this); //点空白移除
        emitter.on(EventType.SET_MEASURE_TYPE, this.setMeasureType, this); //绘制点
        emitter.on(EventType.COLOR_SHADER_CHANGE, this.handleColorShader, this); //着色
        emitter.on(EventType.RENDER_DATA, this.gisRender, this); //地图搜索/扩展等添加实体
        emitter.on(EventType.SCOPE_RENDER, this.gisScopeRender, this); //范围
        emitter.on(EventType.RADAR_RENDER, this.gisRadarRender, this); //雷达
    }
    /**
     * 右键转盘移除
     */
    removeContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.destroy();
            this.contextMenu = null;
        }
    }
    /**
     * 绘点
     */
    setMeasureType(type) {
        // const { measureType } = this.store;

        // this.store.setMeasureType(type);

        // if (measureType) {
        //   this.measureTool.cancelDraw();
        // }
        //选中一个节点开始绘制一次，等待点击左键回调出来函数，结束绘制
        this.measureTool.measurePoint(type, entity => {
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
     * 添加地图数据
     */
    gisRender({ entities, labelShow }) {
        this.drawer.drawEntities(entities, labelShow);
    }
    /**
     * 绘制圆形区域
     */
    gisScopeRender({ entities, areaProperty, radius, color }) {
        this.drawer.drawScope(entities, areaProperty, radius, color);
    }
    /**
     * 图例着色改变
     */
    handleColorShader() {
        const { entitiesCountryCollection } = this.legendData;
        const entities = this.viewer.entities;

        Object.entries(entitiesCountryCollection).forEach(([country, collection]) => {
            const color = colorControl.findColorByType(country) || colorControl.defaultColor;

            collection.forEach(({ id }) => {
                const entity = entities.getById(id);
                const { ellipse, polyline } = entity;

                ellipse.material = Cesium.Color.fromCssColorString(color);
                polyline.material.color.setValue(Cesium.Color.fromCssColorString(color).withAlpha(1));
            });
        });
    }
    /**
     * 雷达
     */
    gisRadarRender({ lat, lng, scanColor, radius }) {
        this.drawer.marsRadarScan(lat, lng, scanColor, radius);
    }
}

export { Main };

export default Main;
