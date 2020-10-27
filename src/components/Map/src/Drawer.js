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
        if (!entitiesData.length) {
            return;
        }
        entitiesData.forEach((e, index) => {
            if (e.properties.longitude !== undefined && e.properties.latitude !== undefined) {
                this.viewer.entities.add({
                    id: e.id || performance.now(),
                    position: Cesium.Cartesian3.fromDegrees(e.properties.longitude, e.properties.latitude, 0),
                    billboard: {
                        image: './img/gis/location.png',
                        width: 40,
                        height: 40,
                        color: Cesium.Color.fromCssColorString('#ffcc33'),
                        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2)
                    },
                    label: {
                        show: labelShow,
                        text: e.properties.name || e.name || e.id,
                        pixelOffset: new Cesium.Cartesian2(0, 24),
                        font: '20px sans-serif',
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.fromCssColorString(window.mapType === 'satellite' ? '#ffffff' : '#000000'),
                        outlineColor: Cesium.Color.fromCssColorString(window.mapType === 'satellite' ? '#000000' : '#ffffff'),
                        outlineWidth: 2,
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
                        pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1e2, 3, 9.0e6, 0.0)
                    }
                });
            }
        });
        let center = Cesium.Cartesian3.fromDegrees(entitiesData[0].properties.longitude, entitiesData[0].properties.latitude, 1000000);
        this.viewer.camera.flyTo({
            // 相机飞往该点
            destination: center, // 摄像机的最终位置
            duration: 2
        });
        this.viewer.entities.removeById('marsRadarScan');
    }
    /**
     * 绘制圆形区域
     * @param {array} entitiesData 实体数据数组
     * @param {number} [layerId] 图层id
     * @param {number} [radius] 区域半径
     * @param {string} [color] 区域颜色
     */
    drawScope(entitiesData, areaProperty, radius, color) {
        if (!entitiesData.length) {
            return;
        }
        entitiesData.forEach(e => {
            let propertyValue = e.properties[areaProperty];
            if (typeof propertyValue === 'string') {
                const result = propertyValue.match(/\d+(\.\d*)?/);
                propertyValue = result ? Number(result[0]) : 0;
            }
            if (propertyValue || radius) {
                this.viewer.entities.getById(e.id).ellipse = {
                    show: true,
                    semiMajorAxis: (propertyValue || radius) * 1000,
                    semiMinorAxis: (propertyValue || radius) * 1000,
                    material: Cesium.Color.fromCssColorString(color || '#00ff00').withAlpha(0.08),
                    outline: true,
                    outlineColor: Cesium.Color.fromCssColorString(color || '#00ff00').withAlpha(1),
                    height: 0,
                    outlineWidth: 15
                };
            }
        });
    }
    /**
     * mars3D雷达,lat经度,lng纬度
     */
    marsRadarScan(lat, lng, scanColor, radius) {
        let r = 2;
        this.viewer.entities.add({
            id: 'marsRadarScan',
            position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
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
                stRotation: new Cesium.CallbackProperty(function(n) {
                    return (r -= 0.15);
                }, !1),
                classificationType: Cesium.ClassificationType.BOTH
            }
        });
    }
}
export { Drawer };
export default Drawer;
