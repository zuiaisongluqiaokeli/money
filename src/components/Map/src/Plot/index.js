import GlobeTracker from "./lib/GlobeTracker";
import circle_red_img from "./images/circle_red.png";
import circle_center_img from "./images/circle_center.png";

//viewer
var viewer = null;
//tracker
var tracker = null;

var cbPreDo = () => {};
var cbBackDo = () => {};

var clearEvent = () => {};

//图层名称
var layerId = "globeDrawerDemoLayer";
//全局变量，用来记录shape坐标信息
var shapeDic = {};
//编辑或删除标识,1为编辑，2为删除
var flag = 0;

class Plot {
  constructor(cViewer, options) {
    let {
      cbPre = () => {}, cbBack = () => {}
    } = options;
    this.cbPre = cbPre;
    this.cbBack = cbBack;
    this.viewer = cViewer;
    cbPreDo = this.cbPre;
    cbBackDo = this.cbBack;
    clearEvent = this.clearEvent.bind(this);

    viewer = this.viewer;
    this.tracker = new GlobeTracker(cViewer);
    tracker = this.tracker;
    window.shapeDic = shapeDic;
    this.shapeDic = shapeDic;

    this.leftHander = null;
  }

  /**
   * 初始化鼠标事件
   */
  initEvent() {
    this.bindGloveEvent(this.viewer);
  }

  /**
   * 销毁鼠标事件
   */
  clearEvent() {
    if (this.leftHander) {
      this.leftHander.destroy();
      this.leftHander = null;
    }
  }

  /**
   * 画多边形
   */
  drawPolygon() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.trackPolygon(
      function (positions) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          positions,
          shapeType: "Polygon",
        };
        showPolygon(objId, positions);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制折线
   */
  drawPolyline() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.trackPolyline(
      function (positions) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          positions,
          shapeType: "Polyline",
        };
        showPolyline(objId, positions);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制矩形
   */
  drawRectangle() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.trackRectangle(
      function (positions) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          positions,
          shapeType: "Rectangle",
        };
        showRectangle(objId, positions);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制圆形
   */
  drawCircle() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.trackCircle(
      function (positions) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          positions,
          shapeType: "Circle",
        };
        showCircle(objId, positions);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制点
   */
  drawPoint() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.trackPoint(
      function (position) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          position,
          shapeType: "Point",
        };
        showPoint(objId, position);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制点
   */
  drawLabel() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.trackLabel(
      function (position, label) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          position,
          shapeType: "Label",
          label,
        };
        showLabel(objId, position, label);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制缓冲区
   */
  drawBufferLine() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.trackBufferLine(
      function (positions, radius) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          positions: positions,
          radius: radius,
          shapeType: "BufferLine",
        };
        showBufferLine(objId, positions, radius);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }
  /**
   * 绘制经纬度，海拔
   */
  posMeasure() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.pickPosition(
      function (position, lonLat) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          position,
          lonLat,
          shapeType: "PosMeasure",
        };
        showPosMeasure(objId, position, lonLat);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制折线距离
   */
  spaceDisMeasure() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.pickSpaceDistance(
      function (positions, rlt) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          positions,
          rlt,
          shapeType: "SpaceDisMeasure",
        };
        showSpaceDisMeasure(objId, positions, rlt);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  stickDisMeasure() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.pickStickDistance(
      function (positions, rlt) {
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制多边形面积
   */
  areaMeasure() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.pickArea(
      function (positions, rlt) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          positions,
          rlt,
          shapeType: "AreaMeasure",
        };
        showAreaMeasure(objId, positions, rlt);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制普通箭头
   */
  straightArrow() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.trackStraightArrow(
      function (positions) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          positions,
          shapeType: "StraightArrow",
        };
        showStraightArrow(objId, positions);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制攻击箭头
   */
  attackArrow() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.trackAttackArrow(
      function (positions, custom) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          custom: custom,
          positions: positions,
          shapeType: "AttackArrow",
        };
        showAttackArrow(objId, positions);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制钳击箭头
   */
  pincerArrow() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.trackPincerArrow(
      function (positions, custom) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          custom: custom,
          positions: positions,
          shapeType: "PincerArrow",
        };
        showPincerArrow(objId, positions);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 绘制圆形面积
   */
  circleMeasure() {
    let _this = this;
    _this.cbPre();
    flag = 0;
    _this.tracker.pickCirCleArea(
      function (positions) {
        var objId = new Date().getTime();
        shapeDic[objId] = {
          positions,
          shapeType: "CircleMeasure",
        };
        showCircleMeasure(objId, positions);
        _this.cbBack();
      },
      function () {
        _this.cbBack();
      }
    );
  }

  /**
   * 编辑图形
   */
  editShape() {
    this.cbPre();
    this.initEvent();

    layer.msg("点击要编辑的图形！");
    flag = 1;
    //清除标绘状态
    this.tracker.clear();
  }

  /**
   * 删除图形
   */
  deleteShape() {
    this.cbPre();
    this.initEvent();

    layer.msg("点击要删除的图形！");
    flag = 2;
    //清除标绘状态
    this.tracker.clear();
  }

  /**
   * 绑定cesiu事件
   * @param {*} viewer
   */
  bindGloveEvent(viewer) {
    let _this = this;
    if (_this.leftHander) return;
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    _this.leftHander = handler;
    handler.setInputAction(function (movement) {
      var pick = viewer.scene.pick(movement.position);
      if (!pick) {
        return;
      }
      var obj = pick.id;
      if (!obj || !obj.layerId || flag == 0) {
        return;
      }
      var objId = obj.objId;
      //flag为编辑或删除标识,1为编辑，2为删除
      if (flag == 1) {
        switch (obj.shapeType) {
          case "Polygon":
            flag = 0;
            editPolygon(objId);
            break;
          case "Polyline":
            flag = 0;
            editPolyline(objId);
            break;
          case "Rectangle":
            flag = 0;
            editRectangle(objId);
            break;
          case "Circle":
            flag = 0;
            editCircle(objId);
            break;
          case "Point":
            flag = 0;
            editPoint(objId);
            break;
          case "Label":
            flag = 0;
            editLabel(objId);
            break;
          case "BufferLine":
            flag = 0;
            editBufferLine(objId);
            break;
          case "StraightArrow":
            flag = 0;
            editStraightArrow(objId);
            break;
          case "AttackArrow":
            flag = 0;
            editAttackArrow(objId);
            break;
          case "PincerArrow":
            flag = 0;
            editPincerArrow(objId);
            break;
          case "PosMeasure":
            flag = 0;
            editPosMeasure(objId);
            break;
          case "CircleMeasure":
            flag = 0;
            editCircleMeasure(objId);
            break;
          case "AreaMeasure":
            flag = 0;
            editAreaMeasure(objId);
            break;
          case "SpaceDisMeasure":
            flag = 0;
            editSpaceDisMeasure(objId);
            break;
          default:
            break;
        }
      } else if (flag == 2) {
        deleteEntityById(objId);
        _this.cbBack();
        _this.clearEvent();
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * 格式化所有图形
   */
  shapeFormat() {
    return JSON.parse(JSON.stringify(this.shapeDic));
  }

  /**
   * 解析所有图形
   */
  shapeParse(shapeDic = {}) {
    for (let key in shapeDic) {
      doParse(key, shapeDic[key]);
    }
  }

  /**
   * 清除图形
   */
  clear() {
    doClear();
  }
}

export default Plot;

function showPolygon(objId, positions) {
  var material = Cesium.Color.fromCssColorString("#ff0").withAlpha(0.5);
  var outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#00f").withAlpha(0.7),
  });
  var outlinePositions = [].concat(positions);
  outlinePositions.push(positions[0]);
  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "Polygon",
    polyline: {
      positions: outlinePositions,
      clampToGround: true,
      width: 2,
      material: outlineMaterial,
    },
    polygon: new Cesium.PolygonGraphics({
      hierarchy: positions,
      asynchronous: false,
      material: material,
    }),
  };
  var entity = viewer.entities.add(bData);
}

function showPolyline(objId, positions) {
  var material = new Cesium.PolylineGlowMaterialProperty({
    glowPower: 0.25,
    color: Cesium.Color.fromCssColorString("#00f").withAlpha(0.9),
  });
  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "Polyline",
    polyline: {
      positions: positions,
      clampToGround: true,
      width: 8,
      material: material,
    },
  };
  var entity = viewer.entities.add(bData);
}

function showRectangle(objId, positions) {
  var material = Cesium.Color.fromCssColorString("#ff0").withAlpha(0.5);
  var outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#00f").withAlpha(0.7),
  });
  var rect = Cesium.Rectangle.fromCartesianArray(positions);
  var arr = [
    rect.west,
    rect.north,
    rect.east,
    rect.north,
    rect.east,
    rect.south,
    rect.west,
    rect.south,
    rect.west,
    rect.north,
  ];
  var outlinePositions = Cesium.Cartesian3.fromRadiansArray(arr);
  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "Rectangle",
    polyline: {
      positions: outlinePositions,
      clampToGround: true,
      width: 2,
      material: outlineMaterial,
    },
    rectangle: {
      coordinates: rect,
      material: material,
    },
  };
  var entity = viewer.entities.add(bData);
}

function showCircle(objId, positions) {
  var material = Cesium.Color.fromCssColorString("#ff0").withAlpha(0.5);
  var outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#f00").withAlpha(0.7),
  });
  var radiusMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#00f").withAlpha(0.7),
  });
  var pnts = tracker.circleDrawer._computeCirclePolygon(positions);
  var dis = tracker.circleDrawer._computeCircleRadius3D(positions);
  dis = (dis / 1000).toFixed(3);
  var text = dis + "km";
  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "Circle",
    position: positions[0],
    label: {
      text: text,
      font: "16px Helvetica",
      fillColor: Cesium.Color.SKYBLUE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      eyeOffset: new Cesium.ConstantProperty(
        new Cesium.Cartesian3(0, 0, -9000)
      ),
      pixelOffset: new Cesium.Cartesian2(16, 16),
    },
    billboard: {
      image: circle_center_img,
      eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
    polyline: {
      positions: positions,
      clampToGround: true,
      width: 2,
      material: radiusMaterial,
    },
    polygon: new Cesium.PolygonGraphics({
      hierarchy: pnts,
      asynchronous: false,
      material: material,
    }),
  };
  var entity = viewer.entities.add(bData);

  var outlineBdata = {
    layerId: layerId,
    objId: objId,
    shapeType: "Circle",
    polyline: {
      positions: pnts,
      clampToGround: true,
      width: 2,
      material: outlineMaterial,
    },
  };
  var outlineEntity = viewer.entities.add(outlineBdata);
}

function showPoint(objId, position) {
  var entity = viewer.entities.add({
    layerId: layerId,
    objId: objId,
    shapeType: "Point",
    position: position,
    billboard: {
      image: circle_red_img,
      eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
}

function showLabel(objId, position, label) {
  var entity = viewer.entities.add({
    layerId: layerId,
    objId: objId,
    shapeType: "Label",
    position: position,
    label: {
      text: label,
      font: '16px "微软雅黑", Arial, Helvetica, sans-serif, Helvetica',
      fillColor: Cesium.Color.RED,
      outlineColor: Cesium.Color.SKYBLUE,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      pixelOffset: new Cesium.Cartesian2(0, -20),
    },
    billboard: {
      image: circle_red_img,
      eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
}

function showBufferLine(objId, positions, radius) {
  var buffer = tracker.bufferLineDrawer.computeBufferLine(positions, radius);
  var material = Cesium.Color.fromCssColorString("#ff0").withAlpha(0.5);
  var lineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#00f").withAlpha(0.7),
  });
  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "BufferLine",
    polygon: new Cesium.PolygonGraphics({
      hierarchy: buffer,
      asynchronous: false,
      material: material,
    }),
    polyline: {
      positions: positions,
      clampToGround: true,
      width: 2,
      material: lineMaterial,
    },
  };
  var entity = viewer.entities.add(bData);
}

function showStraightArrow(objId, positions) {
  var material = Cesium.Color.fromCssColorString("#ff0").withAlpha(0.5);
  var outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#f00").withAlpha(0.7),
  });
  var outlinePositions = [].concat(positions);
  outlinePositions.push(positions[0]);
  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "StraightArrow",
    polyline: {
      positions: outlinePositions,
      clampToGround: true,
      width: 2,
      material: outlineMaterial,
    },
    polygon: new Cesium.PolygonGraphics({
      hierarchy: positions,
      asynchronous: false,
      material: material,
    }),
  };
  var entity = viewer.entities.add(bData);
}

function showAttackArrow(objId, positions) {
  var material = Cesium.Color.fromCssColorString("#ff0").withAlpha(0.5);
  var outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#f00").withAlpha(0.7),
  });
  var outlinePositions = [].concat(positions);
  outlinePositions.push(positions[0]);
  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "AttackArrow",
    polyline: {
      positions: outlinePositions,
      clampToGround: true,
      width: 2,
      material: outlineMaterial,
    },
    polygon: new Cesium.PolygonGraphics({
      hierarchy: positions,
      asynchronous: false,
      material: material,
    }),
  };
  var entity = viewer.entities.add(bData);
}

function showPincerArrow(objId, positions) {
  var material = Cesium.Color.fromCssColorString("#ff0").withAlpha(0.5);
  var outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#f00").withAlpha(0.7),
  });
  var outlinePositions = [].concat(positions);
  outlinePositions.push(positions[0]);
  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "PincerArrow",
    polyline: {
      positions: outlinePositions,
      clampToGround: true,
      width: 2,
      material: outlineMaterial,
    },
    polygon: new Cesium.PolygonGraphics({
      hierarchy: positions,
      asynchronous: false,
      material: material,
    }),
  };
  var entity = viewer.entities.add(bData);
}

function showSpaceDisMeasure(objId, positions, rlt) {
  var material = new Cesium.PolylineGlowMaterialProperty({
    glowPower: 0.25,
    color: Cesium.Color.fromCssColorString("#00f").withAlpha(0.9),
  });
  var num = positions.length;
  var last = positions[num - 1];
  var tip = "距离：" + rlt.dis3d + "千米";

  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "SpaceDisMeasure",
    position: last,
    label: {
      text: tip,
      font: '16px "微软雅黑", Arial, Helvetica, sans-serif, Helvetica',
      fillColor: Cesium.Color.RED,
      outlineColor: Cesium.Color.SKYBLUE,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polyline: {
      positions: positions,
      clampToGround: true,
      width: 8,
      material: material,
    },
  };
  var entity = viewer.entities.add(bData);
}

function showPosMeasure(objId, position, lonLat) {
  var tip =
    "经度：" +
    lonLat.lon +
    "，纬度：" +
    lonLat.lat +
    "\n 海拔=" +
    lonLat.alt +
    "米";

  var entity = viewer.entities.add({
    layerId: layerId,
    objId: objId,
    shapeType: "PosMeasure",
    position: position,
    label: {
      text: tip,
      font: '18px "微软雅黑", Arial, Helvetica, sans-serif, Helvetica',
      fillColor: Cesium.Color.RED,
      outlineColor: Cesium.Color.SKYBLUE,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    billboard: {
      image: circle_red_img,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
}

function showAreaMeasure(objId, positions, rlt) {
  var material = Cesium.Color.fromCssColorString("#ff0").withAlpha(0.5);
  var outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#00f").withAlpha(0.7),
  });
  var outlinePositions = [].concat(positions);
  outlinePositions.push(positions[0]);

  var tip = "周长：" + rlt.dis3d + "千米";
  tip += "\n 面积：" + rlt.area + "平方千米";

  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "AreaMeasure",
    position: positions[positions.length - 1],
    label: {
      text: tip,
      font: '16px "微软雅黑", Arial, Helvetica, sans-serif, Helvetica',
      fillColor: Cesium.Color.RED,
      outlineColor: Cesium.Color.SKYBLUE,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polygon: new Cesium.PolygonGraphics({
      hierarchy: positions,
      material: material,
      show: true,
    }),
    polyline: {
      positions: outlinePositions,
      clampToGround: true,
      width: 2,
      material: outlineMaterial,
      show: true,
    },
  };
  var entity = viewer.entities.add(bData);
}

function showCircleMeasure(objId, positions) {
  var material = Cesium.Color.fromCssColorString("#ff0").withAlpha(0.5);
  var outlineMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#f00").withAlpha(0.7),
  });
  var radiusMaterial = new Cesium.PolylineDashMaterialProperty({
    dashLength: 16,
    color: Cesium.Color.fromCssColorString("#00f").withAlpha(0.7),
  });
  var pnts = tracker.circleDrawer._computeCirclePolygon(positions);
  var dis = tracker.circleDrawer._computeCircleRadius3D(positions);
  var distan = (dis / 1000).toFixed(3);
  var area = ((dis * dis * Math.PI) / (1000 * 1000)).toFixed(3);

  var text = "半径：" + distan + " 千米";
  text += "\n 面积：" + area + "平方千米";

  var bData = {
    layerId: layerId,
    objId: objId,
    shapeType: "CircleMeasure",
    position: positions[0],
    label: {
      text: text,
      font: "16px Helvetica",
      fillColor: Cesium.Color.SKYBLUE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      eyeOffset: new Cesium.ConstantProperty(
        new Cesium.Cartesian3(0, 0, -9000)
      ),
      pixelOffset: new Cesium.Cartesian2(16, 16),
    },
    billboard: {
      image: circle_center_img,
      eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
    polyline: {
      positions: positions,
      clampToGround: true,
      width: 2,
      material: radiusMaterial,
    },
    polygon: new Cesium.PolygonGraphics({
      hierarchy: pnts,
      asynchronous: false,
      material: material,
    }),
  };
  var entity = viewer.entities.add(bData);

  var outlineBdata = {
    layerId: layerId,
    objId: objId,
    shapeType: "Circle",
    polyline: {
      positions: pnts,
      clampToGround: true,
      width: 2,
      material: outlineMaterial,
    },
  };
  var outlineEntity = viewer.entities.add(outlineBdata);
}

function editPolygon(objId) {
  var {
    positions: oldPositions
  } = shapeDic[objId];

  //先移除entity
  clearEntityById(objId);

  //进入编辑状态
  tracker.polygonDrawer.showModifyPolygon(
    oldPositions,
    function (positions) {
      shapeDic[objId] = {
        positions,
        shapeType: "Polygon",
      };
      showPolygon(objId, positions);
      cbBackDo();
      clearEvent();
    },
    function () {
      showPolygon(objId, oldPositions);
      cbBackDo();
      clearEvent();
    }
  );
}

function editPolyline(objId) {
  var {
    positions: oldPositions
  } = shapeDic[objId];

  //先移除entity
  clearEntityById(objId);

  //进入编辑状态
  tracker.polylineDrawer.showModifyPolyline(
    oldPositions,
    function (positions) {
      shapeDic[objId] = {
        positions,
        shapeType: "Polyline",
      };
      showPolyline(objId, positions);
      cbBackDo();
      clearEvent();
    },
    function () {
      showPolyline(objId, oldPositions);
      cbBackDo();
      clearEvent();
    }
  );
}

function editRectangle(objId) {
  var {
    positions: oldPositions
  } = shapeDic[objId];

  //先移除entity
  clearEntityById(objId);

  //进入编辑状态
  tracker.rectDrawer.showModifyRectangle(
    [...oldPositions],
    function (positions) {
      shapeDic[objId] = {
        positions,
        shapeType: "Rectangle",
      };
      showRectangle(objId, positions);
      cbBackDo();
      clearEvent();
    },
    function () {
      showRectangle(objId, oldPositions);
      cbBackDo();
      clearEvent();
    }
  );
}

function editCircle(objId) {
  var {
    positions: oldPositions
  } = shapeDic[objId];

  console.log(oldPositions);

  //先移除entity
  clearEntityById(objId);

  //进入编辑状态
  tracker.circleDrawer.showModifyCircle(
    [...oldPositions],
    function (positions) {
      shapeDic[objId] = {
        positions,
        shapeType: "Circle",
      };
      showCircle(objId, positions);
      cbBackDo();
      clearEvent();
    },
    function () {
      showCircle(objId, oldPositions);
      cbBackDo();
      clearEvent();
    }
  );
}

function editPoint(objId) {
  var oldPosition = shapeDic[objId];

  //先移除entity
  clearEntityById(objId);

  //进入编辑状态
  tracker.pointDrawer.showModifyPoint(
    oldPosition,
    function (position) {
      shapeDic[objId] = position;
      showPoint(objId, position);
      cbBackDo();
      clearEvent();
    },
    function () {
      showPoint(objId, oldPosition);
      cbBackDo();
      clearEvent();
    }
  );
}

function editLabel(objId) {
  var {
    position: oldPosition,
    label: oldLabel
  } = shapeDic[objId];

  //先移除entity
  clearEntityById(objId);

  //进入编辑状态
  tracker.labelDrawer.showModifyPoint(
    oldPosition,
    oldLabel,
    function (position, label) {
      shapeDic[objId] = {
        position,
        shapeType: "Label",
        label,
      };
      showLabel(objId, position, label);
      cbBackDo();
      clearEvent();
    },
    function () {
      showLabel(objId, oldPosition, oldLabel);
      cbBackDo();
      clearEvent();
    }
  );
}

function editBufferLine(objId) {
  var old = shapeDic[objId];

  //先移除entity
  clearEntityById(objId);

  //进入编辑状态
  tracker.bufferLineDrawer.showModifyBufferLine(
    old.positions,
    old.radius,
    function (positions, radius) {
      shapeDic[objId] = {
        positions: positions,
        radius: radius,
        shapeType: "BufferLine",
      };
      showBufferLine(objId, positions, radius);
      cbBackDo();
      clearEvent();
    },
    function () {
      showBufferLine(old.positions, old.radius, oldPositions);
      cbBackDo();
      clearEvent();
    }
  );
}

function editStraightArrow(objId) {
  var {
    positions: oldPositions
  } = shapeDic[objId];

  //先移除entity
  clearEntityById(objId);

  //进入编辑状态
  tracker.straightArrowDrawer.showModifyStraightArrow(
    oldPositions,
    function (positions) {
      shapeDic[objId] = {
        positions,
        shapeType: "StraightArrow",
      };
      showStraightArrow(objId, positions);
      cbBackDo();
      clearEvent();
    },
    function () {
      showStraightArrow(objId, oldPositions);
      cbBackDo();
      clearEvent();
    }
  );
}

function editAttackArrow(objId) {
  var old = shapeDic[objId];

  //先移除entity
  clearEntityById(objId);

  tracker.attackArrowDrawer.showModifyAttackArrow(
    old.custom,
    function (positions, custom) {
      //保存编辑结果
      shapeDic[objId] = {
        custom: custom,
        positions: positions,
        shapeType: "AttackArrow",
      };
      showAttackArrow(objId, positions);
      cbBackDo();
      clearEvent();
    },
    function () {
      showAttackArrow(objId, old.positions);
      cbBackDo();
      clearEvent();
    }
  );
}

function editPincerArrow(objId) {
  var old = shapeDic[objId];

  //先移除entity
  clearEntityById(objId);

  tracker.pincerArrowDrawer.showModifyPincerArrow(
    old.custom,
    function (positions, custom) {
      //保存编辑结果
      shapeDic[objId] = {
        custom: custom,
        positions: positions,
        shapeType: "PincerArrow",
      };
      showPincerArrow(objId, positions);
      cbBackDo();
      clearEvent();
    },
    function () {
      showPincerArrow(objId, old.positions);
      cbBackDo();
      clearEvent();
    }
  );
}

function editPosMeasure(objId) {
  var {
    position: oldPosition,
    lonLat: oldLonLat
  } = shapeDic[objId];

  //先移除entity
  clearEntityById(objId);

  tracker.posMeasure.showModifyPoint(
    oldPosition,
    function (position, lonLat) {
      shapeDic[objId] = {
        position,
        lonLat,
      };
      showPosMeasure(objId, position, lonLat);
      cbBackDo();
      clearEvent();
    },
    function () {
      showPosMeasure(objId, oldPosition, oldLonLat);
      cbBackDo();
      clearEvent();
    }
  );
}

function editCircleMeasure(objId) {
  var {
    positions: oldPositions
  } = shapeDic[objId];
  //先移除entity
  clearEntityById(objId);

  tracker.circleMeasure.showModifyCircle(
    [...oldPositions],
    function (positions) {
      shapeDic[objId] = {
        positions,
        shapeType: "CircleMeasure",
      };
      showCircleMeasure(objId, positions);
      cbBackDo();
      clearEvent();
    },
    function () {
      showCircleMeasure(objId, oldPositions);
      cbBackDo();
      clearEvent();
    }
  );
}

function editAreaMeasure(objId) {
  var {
    positions: oldPositions,
    rlt: oldRlt
  } = shapeDic[objId];
  //先移除entity
  clearEntityById(objId);

  tracker.areaMeasure.showModifyPolygon(
    oldPositions,
    function (positions, rlt) {
      shapeDic[objId] = {
        positions,
        rlt,
        shapeType: "AreaMeasure",
      };
      showAreaMeasure(objId, positions, rlt);
      cbBackDo();
      clearEvent();
    },
    function () {
      showAreaMeasure(objId, oldPositions, oldRlt);
      cbBackDo();
      clearEvent();
    }
  );
}

function editSpaceDisMeasure(objId) {
  var {
    positions: oldPositions,
    rlt: oldRlt
  } = shapeDic[objId];
  //先移除entity
  clearEntityById(objId);

  tracker.spaceDisMeasure.showModifyPolyline(
    oldPositions,
    function (positions, rlt) {
      shapeDic[objId] = {
        positions,
        rlt,
        shapeType: "SpaceDisMeasure",
      };
      showSpaceDisMeasure(objId, positions, rlt);
      cbBackDo();
      clearEvent();
    },
    function () {
      showSpaceDisMeasure(objId, oldPositions, oldRlt);
      cbBackDo();
      clearEvent();
    }
  );
}

function clearEntityById(objId) {
  var entityList = viewer.entities.values;
  if (entityList == null || entityList.length < 1) {
    return;
  }
  for (var i = 0; i < entityList.length; i++) {
    var entity = entityList[i];
    if (entity.layerId == layerId && entity.objId == objId) {
      viewer.entities.remove(entity);
      i--;
    }
  }
}

function deleteEntityById(objId) {
  clearEntityById(objId);
  delete shapeDic[objId];
}

function doClear() {
  for (let objId in shapeDic) {
    deleteEntityById(objId);
  }
}

function doParse(objId, shape) {
  shape.positions.forEach(val => {
    var {
      x,
      y,
      z
    } = val;
    val = new Cesium.Cartesian3(x, y, z);
  });
  switch (shape.shapeType) {
    case "Polygon":
      shapeDic[objId] = shape;
      showPolygon(objId, shape.positions);
      break;
    case "Polyline":
      shapeDic[objId] = shape;
      showPolyline(objId, shape.positions);
      break;
    case "Rectangle":
      shapeDic[objId] = shape;
      showRectangle(objId, shape.positions);
      break;
    case "Circle":
      shapeDic[objId] = shape;
      showCircle(objId, shape.positions);
      break;
    case "BufferLine":
      shapeDic[objId] = shape;
      showBufferLine(objId, shape.positions, shape.radius);
      break;
    case "StraightArrow":
      shapeDic[objId] = shape;
      showStraightArrow(objId, shape.positions);
      break;
    case "AttackArrow":
      shapeDic[objId] = shape;
      showAttackArrow(objId, shape.positions);
      break;
    case "PincerArrow":
      shapeDic[objId] = shape;
      showPincerArrow(objId, shape.positions);
      break;
    case "CircleMeasure":
      shapeDic[objId] = shape;
      showCircleMeasure(objId, shape.positions);
      break;
    case "AreaMeasure":
      shapeDic[objId] = shape;
      showAreaMeasure(objId, shape.positions, shape.rlt);
      break;
    case "SpaceDisMeasure":
      shapeDic[objId] = shape;
      showSpaceDisMeasure(objId, shape.positions, shape.rlt);
      break;
    default:
      break;
  }
}
