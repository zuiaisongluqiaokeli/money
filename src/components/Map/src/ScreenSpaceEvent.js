import { emitter, EventType } from './EventEmitter';

let _instance = null;

class ScreenSpaceEvent {
    constructor(options) {
        this.viewer = options.viewer;
        _instance = this;
        this.handleLeftClick();
        this.handleRightClick();
    }
    /**
     * 左键单击处理
     */
    handleLeftClick() {
        const { scene } = this.viewer;
        const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        handler.setInputAction(async event => {
            const currentEntity = scene.pick(event.position);
            if (currentEntity && this.viewer.entities.getById(currentEntity.id.id)) {
                emitter.emit(EventType.CLICK_ENTITY, currentEntity);
            } else {
                emitter.emit(EventType.CLICK_BLANK);
                return;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    /**
     * 右键单击处理
     */
    handleRightClick() {
        const { scene } = this.viewer;
        const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

        handler.setInputAction(async event => {
            const currentEntity = scene.pick(event.position);
            if (!currentEntity) return;
            const { id: entity } = currentEntity;
            const cartesian = entity.position.getValue();
            const popperPosition = scene.cartesianToCanvasCoordinates(cartesian);
            const { x, y } = popperPosition;
            if (currentEntity && this.viewer.entities.getById(currentEntity.id.id)) {
                emitter.emit(EventType.RIGHT_CLICK, {
                    entity: currentEntity.id,
                    position: { top: y + 'px', left: x + 'px' },
                    create: true
                });
                return;
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    /**
     * 左键双击处理
     */
    handleDblclick() {
        const { scene } = this.viewer;
        const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(event => {
            if (this.viewer.trackedEntity) {
                const position = this.viewer.trackedEntity.position.getValue();
                const cartographic = Cesium.Cartographic.fromCartesian(position);
                const lng = Cesium.Math.toDegrees(cartographic.longitude);
                const lat = Cesium.Math.toDegrees(cartographic.latitude);

                this.viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(lng, lat, 10000.0)
                });
                this.viewer.trackedEntity = null;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
}

export default ScreenSpaceEvent;
