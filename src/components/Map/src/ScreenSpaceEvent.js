import {
  emitter,
  EventType
} from "./EventEmitter";
import VuexStore from '@/store/index'
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
    this.leftHandler = null;
    this.rightHander = null;
    this.leftCtrllHander = null;
    this.mouseWheel = null;
  }
  /**
   * 初始化鼠标事件
   */
  initEvent() {
    this.handleLeftClick();
    this.handleLeftCtrlClick();
    this.handleRightClick();
    this.handleWheel()
  }
  /**
   * 销毁鼠标事件
   */
  clearEvent() {
    if (this.leftHandler) {
      this.leftHandler.destroy();
      this.leftHandler = null;
    }
    if (this.rightHander) {
      this.rightHander.destroy();
      this.rightHander = null;
    }
    if (this.leftCtrllHander) {
      this.leftCtrllHander.destroy();
      this.leftCtrllHander = null;
    }
    if (this.mouseWheel) {
      this.mouseWheel.destroy();
      this.mouseWheel = null;
    }
  }
  /**
   * 左键单击处理
   */
  handleLeftClick() {
    if (this.leftHandler) return;
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    this.leftHandler = handler;
    handler.setInputAction(async event => {
      const currentEntity = scene.pick(event.position);
      //entityId用来标记是否是后端拿到的点而不是地图上的点(比如飞机/关系线这些点)
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

      const {
        id: entity
      } = currentEntity;
      // emitter.emit(EventType.HIGHLIGHT_RELATED_ENTITIES, entity);
      if (currentEntity.id.hasOwnProperty('entityId')) {
        //弹出Popper
        const cartesian = entity.position.getValue();
        const position = scene.cartesianToCanvasCoordinates(cartesian);
        emitter.emit(EventType.POPPER_CREATE, {
          position,
          name: currentEntity.id.label.text.getValue(),
          canMove: true,
          create: true
        });
        //点击该店出现动态气泡选中的效果
        // emitter.emit(EventType.CREATE_HtmlPopper, {
        //   position,
        //   name: currentEntity.id.label.text.getValue(),
        // });
      }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  handleLeftUp() {
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(async event => {
      document.body.style.cursor = "default";
    })
  }
  /**
   * 右键单击处理
   */
  handleRightClick() {
    if (this.rightHander) return;
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    this.rightHander = handler;
    handler.setInputAction(async event => {
      const currentEntity = scene.pick(event.position);
      if (!currentEntity) return

      if (currentEntity && currentEntity.id.hasOwnProperty('entityId')) {
        const cartesian = currentEntity.id.position.getValue();
        const popperPosition = scene.cartesianToCanvasCoordinates(cartesian);
        const {
          x,
          y
        } = popperPosition;
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
  handleWheel() {
    if (this.mouseWheel) return;
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    this.mouseWheel = handler;
    handler.setInputAction(async event => {
      document.body.style.cursor = "url(./BullEye.ico),auto";
      setTimeout(() => {
        document.body.style.cursor = 'default'
      }, 500);
    }, Cesium.ScreenSpaceEventType.WHEEL);
  }

  /**
   * 左键双击处理
   */
  handleDoubleclick() {
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    // TODO 好像有问题呢
    handler.setInputAction(event => {
      // if (this.viewer.trackedEntity) {
      //   const position = this.viewer.trackedEntity.position.getValue();
      //   const cartographic = Cesium.Cartographic.fromCartesian(position);
      //   const lng = Cesium.Math.toDegrees(cartographic.longitude);
      //   const lat = Cesium.Math.toDegrees(cartographic.latitude);

      //   this.viewer.camera.flyTo({
      //     destination: Cesium.Cartesian3.fromDegrees(lng, lat, 1500)
      //   });
      //   this.viewer.trackedEntity = null;
      // }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }
  /**
   * 鼠标左键+ctrl
   */
  handleLeftCtrlClick() {
    if (this.leftCtrllHander) return;
    const {
      scene
    } = this.viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    this.leftCtrllHander = handler;
    handler.setInputAction(async event => {
      const currentEntity = scene.pick(event.position);
      //entityId用来标记是否是后端拿到的点而不是地图上的点(比如飞机/关系线这些点)
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

      const {
        id: entity
      } = currentEntity;
      // emitter.emit(EventType.HIGHLIGHT_RELATED_ENTITIES, entity);
      if (currentEntity.id.hasOwnProperty('entityId')) {
        //弹出Popper
        const cartesian = entity.position.getValue();
        const position = scene.cartesianToCanvasCoordinates(cartesian);
        emitter.emit(EventType.POPPER_CREATE, {
          position,
          name: currentEntity.id.label.text.getValue(),
          canMove: true,
          create: true
        });
        //点击该店出现动态气泡选中的效果
        // emitter.emit(EventType.CREATE_HtmlPopper, {
        //   position,
        //   name: currentEntity.id.label.text.getValue(),
        // });
        //绘制绿色选中框
        emitter.emit(EventType.createSelectEntityBox, {
          position,
          id: currentEntity.id.entityId,
        });
        sessionStorage.setItem('checkSelectEntityBox', JSON.stringify(true))
      }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK, Cesium.KeyboardEventModifier.CTRL);
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
