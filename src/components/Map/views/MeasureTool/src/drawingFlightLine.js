export default {
  //移动的时候如果有2个点以上的坐标就绘线否则一直更新前一次坐标
  //测量空间直线距离 
  /******************************************* */
  measureLineSpace(viewer, callback, firstPoint) {
    // 取消双击事件-追踪该位置
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    var positions = []
    if (firstPoint.length == 1) {
      positions.push(...firstPoint)
      positions.push(...firstPoint)
    }
    var poly = null; //线条
    // var tooltip = document.getElementById("toolTip");
    var distance = 0; //距离
    var alt = 0 //高度
    var cartesian = null; //坐标
    var floatingPoint;
    var arrData = [] //构造航线的数据
    // tooltip.style.display = "block";

    handler.setInputAction(function (movement) {
      // tooltip.style.left = movement.endPosition.x + 3 + "px";
      // tooltip.style.top = movement.endPosition.y - 25 + "px";
      // tooltip.innerHTML = '<p>单击开始，右击结束</p>';
      // cartesian = viewer.scene.pickPosition(movement.endPosition);
      let ray = viewer.scene.camera.getPickRay(movement.endPosition);
      cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
      if (positions.length >= 2) {
        if (!Cesium.defined(poly)) {
          poly = new PolyLinePrimitive(positions);
        } else {
          positions.pop();
          // cartesian.y += (1 + Math.random());
          positions.push(cartesian);
        }
        distance = getSpaceDistance(positions);
        // console.log("distance: " + distance);
        // tooltip.innerHTML='<p>'+distance+'米</p>';
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(function (movement) {
      // tooltip.style.display = "none";
      // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
      // cartesian = viewer.scene.pickPosition(movement.position);
      let ray = viewer.scene.camera.getPickRay(movement.position);
      cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      alt = Math.abs(cartographic.height);
      if (positions.length == 0) {
        positions.push(cartesian.clone());
      }
      positions.push(cartesian);
      //在三维场景中添加Label
      //   var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      var textDisance = distance + "米";
      // console.log(textDisance + ",lng:" + cartographic.longitude/Math.PI*180.0);
      if (positions.length >= 2) {
        floatingPoint = viewer.entities.add({
          name: '空间直线距离',
          id: `空间直线距离-${positions.length}`,
          // position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
          position: positions[positions.length - 1],
          point: {
            pixelSize: 5,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
            pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
              1.5e2, 1.0, 8.0e6, 0.2
            )
          },

          label: {
            text: textDisance,
            font: '18px sans-serif',
            fillColor: Cesium.Color.GOLD,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
            pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
              1.5e2, 1.0, 8.0e6, 0.2
            )
          }
        });
      }
      arrData.push({
        //time:Cesium.JulianDate.fromDate(new Date()).secondsOfDay, //转为秒钟
        longitude,
        latitude,
        height: alt,
      })
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (movement) {
      handler.destroy(); //关闭事件句柄
      positions.pop(); //最后一个点无效
      callback(arrData)
      // viewer.entities.remove(floatingPoint);
      // tooltip.style.display = "none";
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    var PolyLinePrimitive = (function () {
      function _(positions) {
        this.options = {
          name: '直线',
          id: `直线-${positions.length}`,
          polyline: {
            show: true,
            positions: [],
            material: Cesium.Color.CHARTREUSE,
            width: 2,
            clampToGround: true
          }
        };
        this.positions = positions;
        this._init();
      }

      _.prototype._init = function () {
        var _self = this;
        var _update = function () {
          return _self.positions;
        };
        //实时更新polyline.positions
        this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
        viewer.entities.add(this.options);
      };

      return _;
    })();

    //空间两点距离计算函数
    function getSpaceDistance(positions) {
      var distance = 0;
      for (var i = 0; i < positions.length - 1; i++) {

        var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
        var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        distance = distance + s;
      }
      return distance.toFixed(2);
    }
  },
}
