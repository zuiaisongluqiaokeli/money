import Popper from "../../Popper";
import { emitter, EventType } from "../../../src/EventEmitter";
import VuexStore from '@/store/index'
class PointDrawer {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.options = options;
    this.handler = null;
    this.position = null;
    this.entity = null;
    this.firstPosition = null;
    this.firstLng = null;
    this.firstLat = null;
    ({ scene: this.scene, clock: this.clock } = this.viewer);
    ({
      canvas: this.canvas,
      camera: this.camera,
      globe: this.globe
    } = this.scene);
    ({ ellipsoid: this.ellipsoid } = this.globe);

    this.handleKeydownEvent = null;
    this.popper = new Popper();
  }
  /**
   * 开始绘制，移动绘制，左键结束。绘制过程中也可以退出绘制
   */
  async startDrawPoint(callback) {
    this.handleKeydownEvent = this.handleKeydown.bind(this);    //键盘按键
    window.addEventListener("keydown", this.handleKeydownEvent);
    this.handler = new Cesium.ScreenSpaceEventHandler(this.canvas); //鼠标点击事件

    // 给实体传递点击的坐标
    this.handler.setInputAction(event => {
      window.removeEventListener("keydown", this.handleKeydownEvent);

      const { position } = event;

      if (!Cesium.defined(position)) {
        return;
      }

      const ray = this.camera.getPickRay(position);

      if (!Cesium.defined(ray)) {
        return;
      }

      const cartesian = this.globe.pick(ray, this.scene);  //viewer.scene.globe.pick(ray, viewer.scene);识取坐标

      if (!Cesium.defined(cartesian)) {
        return;
      }

      // 空间坐标系转弧度，弧度转经纬度，经纬度再转空间坐标系（不带高度的）
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const cartesian3 = Cesium.Cartesian3.fromDegrees(longitude, latitude);

      this.position = cartesian3;
      this.entity.position.setValue(cartesian3);
      this.handler.destroy();
      this.handler = null;
      this.popper.destroy();
      this.popper = null;
      //Map.mutations.updateGisEntities([].concat([this.entity], Map.state.gisEntities))
      // 相机飞往该点
      // let center = Cesium.Cartesian3.fromDegrees(
      //   longitude,
      //   latitude,
      //   1500
      // );
      // this.viewer.camera.flyTo({
      //   destination: center,
      //   duration: 2
      // });
      VuexStore.state.map.isCover = false
      callback(this.entity);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 鼠标移动的时候
    this.handler.setInputAction(event => {
      const { endPosition } = event;

      if (!Cesium.defined(endPosition)) {
        return;
      }
      const ray = this.camera.getPickRay(endPosition);
      if (!Cesium.defined(ray)) {
        return;
      }
      const cartesian = this.globe.pick(ray, this.scene);

      if (!Cesium.defined(cartesian)) {
        return;
      }
      // 空间坐标系转弧度，弧度转经纬度，经纬度再转空间坐标系（符合地球曲率的？） 解决鼠标位置与真实位置的误差
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const alt = Math.abs(cartographic.height) * 10000;
      const cartesian3 = Cesium.Cartesian3.fromDegrees(longitude, latitude);
      this.position = cartesian3;
      if (this.entity === null) {
        this.createPoint();
      } else {
        // const values = this.entity.properties.getValue();
        // const { id } = values;
        this.entity.position.setValue(cartesian3);
        // 有id的时候发送 
        // if (id) {
        //   emitter.emit(EventType.UPDATE_SELECTED_ENTITY, {
        //     lng: longitude,
        //     lat: latitude
        //   });
        // }
      }
      // 画布中的鼠标坐标
      const popperPosition = this.scene.cartesianToCanvasCoordinates(cartesian);
      const { x, y, z } = popperPosition;

      this.entity.properties.lng = longitude;
      this.entity.properties.lat = latitude;
      this.popper.instance.position = { top: y + 20 + "px", left: x + "px" };
      this.popper.instance.text = `经度: ${longitude} \n\t 纬度: ${latitude}\n\t高度: ${alt} `;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 鼠标右键取消绘制展开面板
    this.handler.setInputAction(event => {
      this.cancelDraw();
      emitter.emit(EventType.MapLegend_Collapse);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  /**
   * 绘制一个新点
   */
  createPoint() {
    const {
      image,
      groupCategory,
      groupType,
      category,
      type,
      group,
      name
    } = this.options;
    const realCategory = group ? groupCategory : category;
    const properties = {
      id: "",
      name: "",
      lng: "",
      lat: ""
    };

    Object.assign(
      properties,
      group
        ? {
          groupCategory,
          groupType,
          group,
          country: ""
        }
        : {
          category,
          type,
          deployment: [],
          membership: {}
        }
    );
    //如果是未知位置的标记，需要带上后端的id，实体id，状态
    let mapId
    if (this.options.hasOwnProperty('id')) {
      mapId = this.options.id
    } else {
      mapId = performance.now()
    }
    let entityId
    if (this.options.hasOwnProperty('id')) {
      entityId = this.options.id
    } else {
      entityId = ""
    }
    const point = this.viewer.entities.add({
      id: mapId,
      entityId: entityId,
      position: this.position,//null
      billboard: {
        image: "img/location.png",
        width: 25,
        height: 25,
        color: Cesium.Color.fromCssColorString("#ffcc33"),
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
        pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
          1.5e2, 1.0, 8.0e6, 0.2
        )
      },
      // model: {
      //   uri: "Cesium/Cesium3D/ShanghaiPudong.gltf",
      //   minimumPixelSize: 60
      // },
      newAdd: true,  //标记或者未知位置添加时候的标记
      label: {
        show: this.options.labelShow,
        text: this.options.hasOwnProperty('name') && this.options.name || '暂无名称',
        pixelOffset: new Cesium.Cartesian2(0, 24),
        font: "15px sans-serif",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: Cesium.Color.fromCssColorString(window.mapType === 'satellite' ? "#000000" : "#ffffff"),
        outlineColor: Cesium.Color.fromCssColorString(window.mapType === 'satellite' ? "#ffffff" : "#000000"),
        outlineWidth: 4,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
        pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
          1.5e2, 1.0, 8.0e6, 0.2
        )
      },
      // ellipse: {
      //   show: false,
      //   semiMajorAxis: 0,
      //   semiMinorAxis: 0
      // },
      // properties: { properties: { ...properties }, id: entityId, avatar: image, name: groupCategory }
      properties: properties
    });

    this.entity = point;
  }
  /**
   * 处理按键事件
   */
  handleKeydown(event) {
    const { key } = event;

    if (key === "Escape") {
      window.removeEventListener("keydown", this.handleKeydownEvent);
      emitter.emit(EventType.MapLegend_Collapse);
      this.cancelDraw();
    }
  }

  cancelDraw() {
    //标记或者未知位置的直接删除 //移动实体的不能删除
    if (this.entity.newAdd) this.viewer.entities.remove(this.entity); //删除当前实体
    else { //已知位置的移动取消就变为刚开始的位置
      this.entity.position.setValue(this.firstPosition);
      this.entity.properties.lng.setValue(this.firstLng);
      this.entity.properties.lat.setValue(this.firstLat);
    }
    this.entity = null;
    if (this.popper) this.popper.destroy();
    this.handler.destroy();
    VuexStore.state.map.isCover = false
  }
}

export default PointDrawer;
