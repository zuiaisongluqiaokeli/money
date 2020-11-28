export function planFlying(viewer) {
  var data = [];
  data = [{
    longitude: 116.405419,
    dimension: 39.918034,
    height: 700000,
    time: 0
  }, {
    longitude: 115.2821,
    dimension: 39.918145,
    height: 700000,
    time: 40
  }, {
    longitude: 114.497402,
    dimension: 39.344641,
    height: 700000,
    time: 100
  }, {
    longitude: 107.942392,
    dimension: 35.559967,
    height: 700000,
    time: 280
  }, {
    longitude: 106.549265,
    dimension: 34.559967,
    height: 700000,
    time: 360
  }, {
    longitude: 95.2821,
    dimension: 32.918145,
    height: 700000,
    time: 400
  }, {
    longitude: 94.497402,
    dimension: 30.344641,
    height: 700000,
    time: 450
  }, {
    longitude: 87.942392,
    dimension: 25.559967,
    height: 700000,
    time: 550
  }, {
    longitude: 66.549265,
    dimension: 24.559967,
    height: 700000,
    time: 600
  }];

  // 起始时间
  var start = Cesium.JulianDate.fromDate(new Date(2017, 7, 11));
  // 结束时间
  var stop = Cesium.JulianDate.addSeconds(start, 600, new Cesium.JulianDate());

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
  // 循环执行
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;


  var property = computeFlight(data);
  // 添加模型
  var planeModel = viewer.entities.add({
    // 和时间轴关联
    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
      start: start,
      stop: stop
    })]),
    position: property,
    // 根据所提供的速度计算点
    orientation: new Cesium.VelocityOrientationProperty(property),
    // 模型数据
    model: {
      uri: 'Cesium/CesiumAir/Cesium_Air.glb',
      minimumPixelSize: 128
    },
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: .1,
        color: Cesium.Color.YELLOW
      }),
      width: 10
    }
  });
  planeModel.position.setInterpolationOptions({ //设定位置的插值算法
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  });

  var property2 = computeFlight2(data);
  var entity_ty = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
      start: start,
      stop: stop
    })]),
    position: property2,
    orientation: new Cesium.VelocityOrientationProperty(property2),
    cylinder: {
      HeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      length: 700000,
      topRadius: 0,
      bottomRadius: 700000 / 2,
      material: Cesium.Color.RED.withAlpha(.4),
      outline: !0,
      numberOfVerticalLines: 0,
      outlineColor: Cesium.Color.RED.withAlpha(.8)
    },
  });
  entity_ty.position.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  });



  function computeFlight(source) {
    var property = new Cesium.SampledPositionProperty();
    for (var i = 0; i < source.length; i++) {
      var time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
      var position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height);
      // 添加位置，和时间对应
      property.addSample(time, position);
    }
    return property;
  }

  function computeFlight2(source) {
    var property = new Cesium.SampledPositionProperty();
    for (var i = 0; i < source.length; i++) {
      var time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
      var position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height / 2);
      // 添加位置，和时间对应
      property.addSample(time, position);
    }
    return property;
  }
}
