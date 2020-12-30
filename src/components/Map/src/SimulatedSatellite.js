import Store from "./Store";
class SimulatedSatellite {
  constructor(options) {
    this.store = options.store;
  }
  planFlying(viewer, data) {
    // var data = [];
    // data = [{
    //   longitude: 115.2821,
    //   latitude: 39.918145,
    //   height: 700000,
    //   time: 40
    // }, {
    //   longitude: 114.497402,
    //   latitude: 39.344641,
    //   height: 700000,
    //   time: 100
    // }, {
    //   longitude: 107.942392,
    //   latitude: 35.559967,
    //   height: 700000,
    //   time: 280
    // }, {
    //   longitude: 106.549265,
    //   latitude: 34.559967,
    //   height: 700000,
    //   time: 360
    // }, {
    //   longitude: 95.2821,
    //   latitude: 32.918145,
    //   height: 700000,
    //   time: 400
    // }, {
    //   longitude: 94.497402,
    //   latitude: 30.344641,
    //   height: 700000,
    //   time: 450
    // }, {
    //   longitude: 87.942392,
    //   latitude: 25.559967,
    //   height: 700000,
    //   time: 550
    // }, {
    //   longitude: 66.549265,
    //   latitude: 24.559967,
    //   height: 700000,
    //   time: 600
    // }];

    // 起始时间
    var start = Cesium.JulianDate.fromDate(new Date(2017, 7, 11));
    // 结束时间(600秒)
    var stop = Cesium.JulianDate.addSeconds(start, data[data.length - 1].time, new Cesium.JulianDate());

    // 设置始时钟始时间
    viewer.clock.startTime = start.clone();
    // 设置时钟当前时间
    viewer.clock.currentTime = start.clone();
    // 设置始终停止时间
    viewer.clock.stopTime = stop.clone();
    // 时间速率，数字越大时间过的越快
    viewer.clock.multiplier = 10;
    // 时间轴
    viewer.timeline.zoomTo(start, stop);
    // 执行完结束
    viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;


    var property = computeFlight(data);
    // 添加模型
    var planeModel = viewer.entities.add({
      // 和时间轴关联
      availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
        start: start,
        stop: stop
      })]),
      id: "airplain",
      position: property,
      // 根据所提供的速度计算点
      orientation: new Cesium.VelocityOrientationProperty(property),
      // 模型数据
      model: {
        uri: 'Cesium/Cesium3D/airplane.glb',
        minimumPixelSize: 60
      },
      path: {
        resolution: 1, //1秒内就要画出
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: .1,
          color: Cesium.Color.YELLOW
        }),
        width: 4
      }
    });
    this.store.airplaneEntity = planeModel //用于观察飞机模型
    planeModel.position.setInterpolationOptions({ //设定位置的插值算法
      interpolationDegree: 1,
      interpolationAlgorithm: Cesium.LinearApproximation,
      //画园轨迹
      // interpolationDegree: 5,
      // interpolationAlgorithm:Cesium.LagrangePolynomialApproximation,
    });

    // var property2 = computeFlight2(data);
    // var entity_ty = viewer.entities.add({
    //   availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
    //     start: start,
    //     stop: stop
    //   })]),
    //   id:"airplain-radar",
    //   position: property2,
    //   orientation: new Cesium.VelocityOrientationProperty(property2),
    //   cylinder: {
    //     HeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    //     length: data[0].height,
    //     topRadius: 0,
    //     bottomRadius: data[0].height / 2,
    //     material: Cesium.Color.RED.withAlpha(.4),
    //     outline: !0,
    //     numberOfVerticalLines: 0,
    //     outlineColor: Cesium.Color.RED.withAlpha(.8)
    //   },
    // });
    // entity_ty.position.setInterpolationOptions({
    //   interpolationDegree: 1,
    //   interpolationAlgorithm: Cesium.LinearApproximation,
    //   //画园轨迹
    //   // interpolationDegree: 5,
    //   // interpolationAlgorithm:Cesium.LagrangePolynomialApproximation,
    // });



    function computeFlight(source) {
      var property = new Cesium.SampledPositionProperty();
      for (var i = 0; i < source.length; i++) {
        var time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
        var position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].latitude, source[i].height);
        // 添加位置，和时间对应
        property.addSample(time, position);
      }
      return property;
    }

    // function computeFlight2(source) {
    //   var property = new Cesium.SampledPositionProperty();
    //   for (var i = 0; i < source.length; i++) {
    //     var time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
    //     var position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].latitude, source[i].height / 2);
    //     // 添加位置，和时间对应
    //     property.addSample(time, position);
    //   }
    //   return property;
    // }
  }
}
export default SimulatedSatellite