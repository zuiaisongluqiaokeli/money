import Popper from "../../Popper";
import { getTransferredKeys, findTargetLegend } from "../../../src/Methods";
import { emitter, EventType } from "../../../src/EventEmitter";

class PointDrawer {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.options = options;
    this.handler = null;
    this.position = null;
    this.entity = null;

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
      this.entity.billboard.scaleByDistance = new Cesium.NearFarScalar(  //近值，近端放大率，远值，远端放大率） 给定距离视点的近值和远值，
        1.5e2,
        1.0,
        8.0e6,
        0.2
      );
      this.handler.destroy();
      this.handler = null;
      this.popper.destroy();
      this.popper = null;
      // 相机飞往该点
      let center = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        1000000
      );
      this.viewer.camera.flyTo({
        destination: center,
        duration: 2
      });
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

      // 空间坐标系转弧度，弧度转经纬度，经纬度再转空间坐标系（符合地球曲率的？）
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const cartesian3 = Cesium.Cartesian3.fromDegrees(longitude, latitude);

      this.position = cartesian3;

      if (this.entity === null) {  
        this.createPoint();
      } else {
        const values = this.entity.properties.getValue();
        const { id } = values;

        this.entity.position.setValue(cartesian3);

        // 有id的时候发送 
        if (id) {
          emitter.emit(EventType.UPDATE_SELECTED_ENTITY, {
            lng: longitude,
            lat: latitude
          });
        }
      }

      // 画布中的鼠标坐标
      const popperPosition = this.scene.cartesianToCanvasCoordinates(cartesian);
      const { x, y } = popperPosition;

      this.entity.properties.lng = longitude;
      this.entity.properties.lat = latitude;
      this.popper.instance.position = { top: y + "px", left: x + "px" };
      this.popper.instance.text = `经度:${longitude} \n\t 纬度:${latitude}`;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
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
      group
    } = this.options;
    const realCategory = group ? groupCategory : category;
    const targetLegend = findTargetLegend(realCategory);
    const { width, height } = targetLegend;
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

    const point = this.viewer.entities.add({
      id: performance.now(),
      entityId: "",
      position: this.position,
      billboard: {
        image: image,
        width: width,
        height: height
      },
      ellipse: {
        show: false,
        semiMajorAxis: 0,
        semiMinorAxis: 0
      },
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
      this.cancelDraw();
    }
  }

  cancelDraw() {
    this.viewer.entities.remove(this.entity);
    this.popper.destroy();
    this.handler.destroy();
  }
}

export default PointDrawer;
