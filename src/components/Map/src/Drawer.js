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
        e.properties.latitude !== undefined && !this.viewer.entities.getById(Number(e.id)) //去重添加
      ) {
        if (entityIndex === -1) {
          entityIndex = index;
        }
        this.viewer.entities.add({
          id: Number(e.id),
          entityId: Number(e.id),
          position: Cesium.Cartesian3.fromDegrees(
            e.properties.longitude,
            e.properties.latitude,
            0
          ),
          billboard: {
            image: "img/location.png",
            width: 25,
            height: 25,
            color: Cesium.Color.fromCssColorString("#ffcc33"),
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2)
          },
          label: {
            show: labelShow,
            text: e.properties.name || e.name,
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
          properties: {
            lat: e.properties.latitude,
            lng: e.properties.longitude,
            properties: {
              ...e.properties
            },
            name: e.properties.name,
            id: Number(e.id),
            entityId: Number(e.id),
            labels: e.labels,
            avatar: './img/gis/location.png'
          }
        });
      }
    });
    if (entityIndex > -1) {
      let center = Cesium.Cartesian3.fromDegrees(
        data[entityIndex].properties.longitude,
        data[entityIndex].properties.latitude,
        1500
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
}
export default Drawer;
