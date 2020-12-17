
import {
  emitter,
  EventType
} from "./EventEmitter";

let _instance = null;

class ScreenSpaceEvent {
  constructor(options) {
    if (_instance) {
      // return _instance;
    }

    this.viewer = options.viewer;
    this.store = options.store;

    _instance = this;
    // this.handleKeydownEvent = this.handleKeydown.bind(this);    //键盘按键
    // window.addEventListener("keydown", this.handleKeydownEvent);
  }
  /**
   * 左键单击处理
   */
  handleLeftClick() {
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    handler.setInputAction(async event => {
      const currentEntity = scene.pick(event.position);
      // 是否选中了中间的billboard
      // const { collection } = currentEntity || {};
      if (currentEntity && currentEntity.id.hasOwnProperty('entityId')) {
        emitter.emit(EventType.CLICK_ENTITY, currentEntity); //选中实体
        emitter.emit(EventType.MapLegend_Collapse); //展开已知位置面板
      } else {
        emitter.emit(EventType.CLICK_BLANK);
        return;
      }
      // if (!currentEntity || !collection) {
      //   emitter.emit(EventType.CLICK_BLANK);
      //   // emitter.emit(EventType.HIGHLIGHT_RELATED_ENTITIES, null);
      //   // this.viewer.selectedEntity = null;
      //   console.log('CLICK_BLANK')
      //   // emitter.emit(EventType.CONTEXT_MENU_REMOVE)
      //   return;
      // }else{
      //   emitter.emit(EventType.CLICK_ENTITY,currentEntity);
      // }

      const { id: entity } = currentEntity;
      // console.log("左键选择实体：", currentEntity, values);
      // // 设置选中实体
      // emitter.emit(EventType.SELECTED_ENTITY, entity);
      // emitter.emit(EventType.HIGHLIGHT_RELATED_ENTITIES, entity);


      //测量那些等不需要显示poper，只有后端数据才需要
      if (currentEntity.id.hasOwnProperty('entityId')) {
        //弹出Popper
        const cartesian = entity.position.getValue();
        const position = scene.cartesianToCanvasCoordinates(cartesian);
        emitter.emit(EventType.POPPER_SHOW, {
          position,
          name: currentEntity.id.label.text.getValue(),
          canMove: true,
          create: true
        });
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
      if (!currentEntity) return

      if (currentEntity && currentEntity.id.hasOwnProperty('entityId')) {
        const cartesian = currentEntity.id.position.getValue();
        const popperPosition = scene.cartesianToCanvasCoordinates(cartesian);
        const { x, y } = popperPosition;
        if (this.store.selectedEntity) {
          emitter.emit(EventType.RIGHT_CLICK, {
            entity: currentEntity,
            cartesian,
            position: {
              top: y + "px",
              left: x + "px"
            },
            create: true
          });
        }
        return;
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  /**
   * 鼠标移动处理
   */
  handleMouseMove() {
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(async event => {
      emitter.emit(EventType.POPPER_REMOVE);
      emitter.emit(EventType.CONTEXT_MENU_REMOVE);
      emitter.emit(EventType.CLICK_BLANK);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
  /**
   * 鼠标滑轮按下
   */
  handleMiddleDown() {
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(async event => {
      let svg = this.viewer._selectionIndicator.viewModel.selectionIndicatorElement.getElementsByTagName('svg:svg')[0];
      svg.innerHTML = `<svg t="1607600990577" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22099" width="64" height="64"><path d="M515.41504 815.49824C341.31968 815.49824 199.68 673.86368 199.68 499.76832s141.63968-315.73504 315.73504-315.73504c48.8192 0 95.62112 10.83904 139.10528 32.22016 2.01728 0.98816 4.02432 2.00192 6.016 3.03616a7.68512 7.68512 0 0 1 3.29216 10.35264 7.68512 7.68512 0 0 1-10.34752 3.28704c-1.89952-0.98304-3.80928-1.9456-5.72928-2.88768-41.35936-20.33664-85.87776-30.6432-132.33152-30.6432C349.78816 199.39328 215.04 334.14144 215.04 499.76832s134.74816 300.37504 300.37504 300.37504c165.62688 0 300.37504-134.74304 300.37504-300.37504 0-83.36896-35.09248-163.69152-96.27648-220.38528a7.68 7.68 0 0 1 10.43968-11.26912c64.31232 59.58656 101.1968 144.02048 101.1968 231.64928 0 174.10048-141.63968 315.73504-315.73504 315.73504z" p-id="22100" fill="#ffffff"></path><path d="M515.41504 875.22816c-207.03232 0-375.46496-168.42752-375.46496-375.46496s168.43264-375.46496 375.46496-375.46496S890.88 292.73088 890.88 499.7632s-168.43264 375.46496-375.46496 375.46496z m0-735.5648c-198.56384 0-360.10496 161.54112-360.10496 360.10496s161.54112 360.10496 360.10496 360.10496S875.52 698.33216 875.52 499.76832s-161.54112-360.10496-360.10496-360.10496z" p-id="22101" fill="#ffffff"></path><path d="M520.96 186.59328a5.12 5.12 0 0 1-10.24 0v-94.72a5.12 5.12 0 1 1 10.24 0v94.72zM520.96 907.65824a5.12 5.12 0 1 1-10.24 0v-94.72a5.12 5.12 0 1 1 10.24 0v94.72zM829.01504 504.88832a5.12 5.12 0 0 1 0-10.24h94.72a5.12 5.12 0 1 1 0 10.24h-94.72zM107.94496 504.88832a5.12 5.12 0 1 1 0-10.24h94.72a5.12 5.12 0 1 1 0 10.24h-94.72zM520.53504 472.74496a5.12 5.12 0 0 1-10.24 0V231.24992a5.12 5.12 0 1 1 10.24 0v241.49504zM520.53504 767.15008a5.12 5.12 0 0 1-10.24 0v-241.50016a5.12 5.12 0 1 1 10.24 0v241.50016zM541.87008 504.32a5.12 5.12 0 1 1 0-10.24h241.49504a5.12 5.12 0 1 1 0 10.24h-241.49504zM247.46496 504.32a5.12 5.12 0 1 1 0-10.24h241.50016a5.12 5.12 0 1 1 0 10.24H247.46496z" p-id="22102" fill="#ffffff"></path></svg>`//修改选择器外观
      svg.style.fill = 'white';
    }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
  }
  /**
   * 鼠标滑轮抬起
   */
  handleMiddleUp() {
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(async event => {
      let svg = this.viewer._selectionIndicator.viewModel.selectionIndicatorElement.getElementsByTagName('svg:svg')[0];
      svg.innerHTML = "<g transform=\"translate(80,80)\"><path data-bind=\"attr: { transform: _transform }\" d=\"M -34 -34 L -34 -11.25 L -30 -15.25 L -30 -30 L -15.25 -30 L -11.25 -34 L -34 -34 z M 11.25 -34 L 15.25 -30 L 30 -30 L 30 -15.25 L 34 -11.25 L 34 -34 L 11.25 -34 z M -34 11.25 L -34 34 L -11.25 34 L -15.25 30 L -30 30 L -30 15.25 L -34 11.25 z M 34 11.25 L 30 15.25 L 30 30 L 15.25 30 L 11.25 34 L 34 34 L 34 11.25 z\" transform=\"scale(1)\"></path></g>"//修改选择器外观
      svg.style.fill = '#BCBCBC';//还可以修改样式
    }, Cesium.ScreenSpaceEventType.MIDDLE_UP);
  }
  /**
   * 左键双击处理
   */
  handleDblclick() {
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    // TODO 好像有问题呢
    handler.setInputAction(event => {
      if (this.viewer.trackedEntity) {
        const position = this.viewer.trackedEntity.position.getValue();
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const lng = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);

        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lng, lat, 1500)
        });
        this.viewer.trackedEntity = null;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }
  /**
   * 处理按键事件
   */
  handleKeydown(event) {
    let selectionIndicatorContainer = document.getElementsByClassName(
      "cesium-viewer-selectionIndicatorContainer"
    );
    let selectionIndicator = new Cesium.SelectionIndicator(
      selectionIndicatorContainer[0],
      this.viewer.scene
    );
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    if (event.ctrlKey) {
      handler.setInputAction(async event => {
        const currentEntity = scene.pick(event.position);
        if (currentEntity && currentEntity.id.hasOwnProperty('entityId')) {
          var viewModel = selectionIndicator.viewModel;
          viewModel.animateAppear();
          viewer.clock.onTick.addEventListener(function (clock) {
            var time = clock.currentTime;
            var selectionIndicatorViewModel = selectionIndicator.viewModel;
            if (selectionIndicatorViewModel) {
              selectionIndicatorViewModel.position = currentEntity.id.position.getValue(time);
              selectionIndicatorViewModel.showSelection = true;
              selectionIndicatorViewModel.update();
            }
          });

        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    }
  }
}

export default ScreenSpaceEvent;
