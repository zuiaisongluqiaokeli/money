class Drawer {
  constructor(options) {
    this.store = options.store;
    this.viewer = options.viewer;
  }
  /**
   * 渲染实体数据
   * @param {array} entitiesData 实体数据数组
   * @param {number} [layerId] 图层id
   */
  drawEntities(entitiesData, labelShow, layerId = 0) {
    const data = entitiesData || [];
    if (!data.length) {
      return;
    }
    let entityIndex = -1;
    data.forEach((e, index) => {
      if (
        e.properties.longitude !== undefined &&
        e.properties.latitude !== undefined && !this.viewer.entities.getById(e.id) //去重添加
      ) {
        if (entityIndex === -1) {
          entityIndex = index;
        }
        this.viewer.entities.add({
          id: Number(e.id),
          entityId:Number(e.id),
          position: Cesium.Cartesian3.fromDegrees(
            e.properties.longitude,
            e.properties.latitude,
            0
          ),
          billboard: {
            image: "img/location.png",
            width: 40,
            height: 40,
            color: Cesium.Color.fromCssColorString("#ffcc33"),
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2)
          },
          label: {
            show: labelShow,
            text: e.properties.name || e.name || e.id,
            pixelOffset: new Cesium.Cartesian2(0, 24),
            font: "25px sans-serif",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.fromCssColorString(window.mapType === 'satellite' ? "#000000" : "#ffffff"),
            // outlineColor:Cesium.Color.fromCssColorString(window.mapType==='satellite'?"#000000":"#ffffff"),
            // outlineWidth:2,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
            pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
              1e2,
              3,
              9.0e6,
              0.0
            )
          },
          properties: { properties: { ...e.properties }, name: e.properties.name || e.name || e.id, id: Number(e.id), entityId: Number(e.id), labels: e.labels, avatar: './img/gis/location.png' }
        });
      }
    });
    if (entityIndex > -1) {
      let center = Cesium.Cartesian3.fromDegrees(
        data[entityIndex].properties.longitude,
        data[entityIndex].properties.latitude,
        1000000
      );
      this.viewer.camera.flyTo({
        // 相机飞往该点
        destination: center, // 摄像机的最终位置
        duration: 2
      });
    }
    this.viewer.entities.removeById('marsRadarScan')
    // this.viewer.scene.postProcessStages._stages.forEach(i => {
    //   i.enabled = false;
    // });

    // setTimeout(()=>{
    //   this.viewer.camera.flyTo({
    //     // 相机飞往该点
    //     destination: Cesium.Cartesian3.fromDegrees(
    //       data[0].properties.longitude,
    //       data[0].properties.latitude,
    //       5000000
    //     ), // 摄像机的最终位置
    //     duration: 2
    //   });
    // },2000)
    // if (this.viewer.scene.mode === 3) {
    //   setTimeout(() => {
    //     this.viewer.scene.morphTo2D(0);
    //     this.viewer.camera.flyTo({
    //       destination: Cesium.Cartesian3.fromDegrees(
    //         data[0].properties.longitude,
    //         data[0].properties.latitude,
    //         5000000
    //       ),
    //       duration: 2
    //     });
    //   }, 2000);
    // }
  }
  /**
   * 绘制圆形区域
   * @param {array} entitiesData 实体数据数组
   * @param {number} [layerId] 图层id
   * @param {number} [radius] 区域半径
   * @param {string} [color] 区域颜色
   * areaProperty 属性
   */
  drawScope(entitiesData, areaProperty, radius, color) {
    const data = entitiesData || [];
    if (!data.length) {
      return;
    }
    data.forEach(e => {
      // let propertyValue = e.properties[areaProperty]
      // if (typeof propertyValue === 'string') {
      //   const result = propertyValue.match(/\d+(\.\d*)?/)
      //   propertyValue = result ? Number(result[0]) : 0
      // }
      if (radius) {
        this.viewer.entities.getById(e.id).ellipse = {
          show: true,
          semiMajorAxis: (radius) * 1000,
          semiMinorAxis: (radius) * 1000,
          material: Cesium.Color.fromCssColorString(
            color || "#00ff00"
          ).withAlpha(0.08),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString(
            color || "#00ff00"
          ).withAlpha(1),
          height: 0,
          outlineWidth: 15
        };
      }
      // if (!this.viewer.entities.getById(e.id).ellipse) {
      //   console.log(e.properties[areaProperty])
      //   if (e.properties[areaProperty] || radius) {
      //     this.viewer.entities.getById(e.id).ellipse = {
      //       show: true,
      //       semiMajorAxis: e.properties[areaProperty] || radius,
      //       semiMinorAxis: e.properties[areaProperty] || radius,
      //       material: Cesium.Color.fromCssColorString(
      //         color || "#00ff00"
      //       ).withAlpha(0.6)
      //     };
      //   }
      // }
      // else if (this.viewer.entities.getById(e.id).ellipse && !show) {
      //   this.viewer.entities.getById(e.id).ellipse.show = false;
      // }
      // if(e.properties.areaRadius || radius){
      //   this.viewer.entities.getById(e.id).ellipse = {
      //     semiMajorAxis: e.properties.areaRadius || radius,
      //     semiMinorAxis: e.properties.areaRadius || radius,
      //     material:Cesium.Color.fromCssColorString(e.properties.areaColor || color || '#00ff00').withAlpha(0.6)
      //   }
      // }
    });
  }
  /**
   * 雷达扫描
   */
  AddRadarScanPostStage(
    viewer,
    cartographicCenter,
    radius,
    scanColor,
    duration
  ) {
    console.log(cartographicCenter);
    console.log(scanColor);
    var ScanSegmentShader =
      "uniform sampler2D colorTexture;\n" +
      "uniform sampler2D depthTexture;\n" +
      "varying vec2 v_textureCoordinates;\n" +
      "uniform vec4 u_scanCenterEC;\n" +
      "uniform vec3 u_scanPlaneNormalEC;\n" +
      "uniform vec3 u_scanLineNormalEC;\n" +
      "uniform float u_radius;\n" +
      "uniform vec4 u_scanColor;\n" +
      "vec4 toEye(in vec2 uv, in float depth)\n" +
      " {\n" +
      " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
      " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
      " posInCamera =posInCamera / posInCamera.w;\n" +
      " return posInCamera;\n" +
      " }\n" +
      "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
      "{\n" +
      "vec3 v01 = testPt - ptOnLine;\n" +
      "normalize(v01);\n" +
      "vec3 temp = cross(v01, lineNormal);\n" +
      "float d = dot(temp, u_scanPlaneNormalEC);\n" +
      "return d > 0.5;\n" +
      "}\n" +
      "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
      "{\n" +
      "vec3 v01 = point -planeOrigin;\n" +
      "float d = dot(planeNormal, v01) ;\n" +
      "return (point - planeNormal * d);\n" +
      "}\n" +
      "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
      "{\n" +
      "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n" +
      "return length(tempPt - ptOnLine);\n" +
      "}\n" +
      "float getDepth(in vec4 depth)\n" +
      "{\n" +
      "float z_window = czm_unpackDepth(depth);\n" +
      "z_window = czm_reverseLogDepth(z_window);\n" +
      "float n_range = czm_depthRange.near;\n" +
      "float f_range = czm_depthRange.far;\n" +
      "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
      "}\n" +
      "void main()\n" +
      "{\n" +
      "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
      "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
      "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
      "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
      "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
      "float twou_radius = u_radius * 2.0;\n" +
      "if(dis < u_radius)\n" +
      "{\n" +
      "float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n" +
      "f0 = pow(f0, 64.0);\n" +
      "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n" +
      "float f = 0.0;\n" +
      "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n" +
      "{\n" +
      "float dis1= length(prjOnPlane.xyz - lineEndPt);\n" +
      "f = abs(twou_radius -dis1) / twou_radius;\n" +
      "f = pow(f, 3.0);\n" +
      "}\n" +
      "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n" +
      "}\n" +
      "}\n";

    var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);

    var _Cartesian4Center = new Cesium.Cartesian4(
      _Cartesian3Center.x,
      _Cartesian3Center.y,
      _Cartesian3Center.z,
      1
    );

    var _CartographicCenter1 = new Cesium.Cartographic(
      cartographicCenter.longitude,
      cartographicCenter.latitude,
      cartographicCenter.height + 500
    );

    var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(
      _CartographicCenter1
    );

    var _Cartesian4Center1 = new Cesium.Cartesian4(
      _Cartesian3Center1.x,
      _Cartesian3Center1.y,
      _Cartesian3Center1.z,
      1
    );

    var _CartographicCenter2 = new Cesium.Cartographic(
      cartographicCenter.longitude + Cesium.Math.toRadians(0.001),
      cartographicCenter.latitude,
      cartographicCenter.height
    );

    var _Cartesian3Center2 = Cesium.Cartographic.toCartesian(
      _CartographicCenter2
    );

    var _Cartesian4Center2 = new Cesium.Cartesian4(
      _Cartesian3Center2.x,
      _Cartesian3Center2.y,
      _Cartesian3Center2.z,
      1
    );

    var _RotateQ = new Cesium.Quaternion();

    var _RotateM = new Cesium.Matrix3();

    var _time = new Date().getTime();

    var _scratchCartesian4Center = new Cesium.Cartesian4();

    var _scratchCartesian4Center1 = new Cesium.Cartesian4();

    var _scratchCartesian4Center2 = new Cesium.Cartesian4();

    var _scratchCartesian3Normal = new Cesium.Cartesian3();

    var _scratchCartesian3Normal1 = new Cesium.Cartesian3();

    var ScanPostStage = new Cesium.PostProcessStage({
      name: "test",
      fragmentShader: ScanSegmentShader,

      uniforms: {
        u_scanCenterEC: function () {
          return Cesium.Matrix4.multiplyByVector(
            viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          );
        },

        u_scanPlaneNormalEC: function () {
          var temp = Cesium.Matrix4.multiplyByVector(
            viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          );

          var temp1 = Cesium.Matrix4.multiplyByVector(
            viewer.camera._viewMatrix,
            _Cartesian4Center1,
            _scratchCartesian4Center1
          );

          _scratchCartesian3Normal.x = temp1.x - temp.x;

          _scratchCartesian3Normal.y = temp1.y - temp.y;

          _scratchCartesian3Normal.z = temp1.z - temp.z;

          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          );

          return _scratchCartesian3Normal;
        },

        u_radius: radius * 2,

        u_scanLineNormalEC: function () {
          var temp = Cesium.Matrix4.multiplyByVector(
            viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          );

          var temp1 = Cesium.Matrix4.multiplyByVector(
            viewer.camera._viewMatrix,
            _Cartesian4Center1,
            _scratchCartesian4Center1
          );

          var temp2 = Cesium.Matrix4.multiplyByVector(
            viewer.camera._viewMatrix,
            _Cartesian4Center2,
            _scratchCartesian4Center2
          );

          _scratchCartesian3Normal.x = temp1.x - temp.x;

          _scratchCartesian3Normal.y = temp1.y - temp.y;

          _scratchCartesian3Normal.z = temp1.z - temp.z;

          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          );

          _scratchCartesian3Normal1.x = temp2.x - temp.x;

          _scratchCartesian3Normal1.y = temp2.y - temp.y;

          _scratchCartesian3Normal1.z = temp2.z - temp.z;

          var tempTime = ((new Date().getTime() - _time) % duration) / duration;

          Cesium.Quaternion.fromAxisAngle(
            _scratchCartesian3Normal,
            tempTime * Cesium.Math.PI * 2,
            _RotateQ
          );

          Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);

          Cesium.Matrix3.multiplyByVector(
            _RotateM,
            _scratchCartesian3Normal1,
            _scratchCartesian3Normal1
          );

          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal1,
            _scratchCartesian3Normal1
          );

          return _scratchCartesian3Normal1;
        },

        u_scanColor: scanColor
      }
    });

    viewer.scene.postProcessStages.add(ScanPostStage);
  }

  /**
   * mars3D雷达
   */
  marsRadarScan(lat, lng, scanColor, radius) {
    console.log(scanColor)
    let r = 2
    this.viewer.entities.add({
      id: 'marsRadarScan',
      position: Cesium.Cartesian3.fromDegrees(
        lng,
        lat,
        0
      ),
      ellipse: {
        semiMinorAxis: radius || 500,
        semiMajorAxis: radius || 500,
        height: 0,
        outline: true,
        outlineWidth: 10.0,
        outlineColor: scanColor,
        material: new mars3d.CircleScanMaterial({
          url: 'img/gis/scan.png',
          color: scanColor.withAlpha(0.6)
        }),
        stRotation: new (Cesium.CallbackProperty)(function (n) {
          return r -= .15
        }, !1),
        classificationType: Cesium.ClassificationType.BOTH
      }
    })
  }
}
export { Drawer };
export default Drawer;
