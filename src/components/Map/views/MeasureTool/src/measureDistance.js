
    var AllEnities = []; //储存所有绘制对象

    //测量距离
    var measureDistance = function (viewer) {
        var isDraw = false;
        var polyline = new Cesium.Entity();
        var polylinePath = [];  //点集合
        //var tooltip = document.getElementById("toolTip");
        var LineEntities = [];//所有折现对象
        var disNums = []; //线路长度之和
        var StartPoint;
        var temLine = null;

        var handler = viewer.screenSpaceEventHandler;
        //tooltip = document.getElementById("ToolTip");
        /***************************鼠标移动事件***********************************/
        handler.setInputAction(function (movement) {
            var position1;
            var cartographic;
            var ray = viewer.scene.camera.getPickRay(movement.endPosition);
            if (ray)
                position1 = viewer.scene.globe.pick(ray, viewer.scene);
            if (position1)
                cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
            if (cartographic) {
                //海拔
                var height = viewer.scene.globe.getHeight(cartographic);
                //地理坐标（弧度）转经纬度坐标
                var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
                if (isDraw) {
                    //tooltip.style.left = movement.endPosition.x + 10 + "px";
                    //tooltip.style.top = movement.endPosition.y + 20 + "px";
                    //tooltip.style.display = "block";
                    if (polylinePath.length < 1) {
                        return;
                    }
                    if (temLine != null) //清除临时线
                    {
                        viewer.entities.remove(temLine);
                    }
                    if (polylinePath.length == 1 && point.x != null) {

                        temLine = viewer.entities.add({
                            polyline: {
                                show: true,
                                positions: [polylinePath[0], point],
                                material: new Cesium.PolylineOutlineMaterialProperty({
                                    color: Cesium.Color.RED
                                }),
                                width: 2
                            }
                        });

                        AllEnities.push(temLine);
                        var distance = sum(disNums) + Number(getLineDis(polylinePath[0], point));//自己实现
                        //tooltip.innerHTML = '<p>长度：' + distance.toFixed(2) + '公里</p><p>双击确定终点</p>';

                    }
                }
            }

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        /***************************鼠标移动事件***********************************/


        /***************************鼠标单击事件***********************************/
        //完成画线操作
        handler.setInputAction(function (movement) {
            isDraw = true;
            var position1;
            var cartographic;
            var ray = viewer.scene.camera.getPickRay(movement.position);
            if (ray)
                position1 = viewer.scene.globe.pick(ray, viewer.scene);
            if (position1)
                cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
            //世界坐标转地理坐标（弧度）
            if (cartographic) {
                //海拔
                var height = viewer.scene.globe.getHeight(cartographic);
                //地理坐标（弧度）转经纬度坐标
                var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);

                polylinePath.push(point); //加点
                if (isDraw && polylinePath.length == 1) {
                    StartPoint = point;
                    var strartpoint = viewer.entities.add(
                     {
                         position: point,
                         point: {
                             heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                             show: true,
                             color: Cesium.Color.SKYBLUE,
                             pixelSize: 3,
                             outlineColor: Cesium.Color.YELLOW,
                             outlineWidth: 1
                         },
                         label: {
                             text: "起点",
                             font: '14pt monospace',
                             color: Cesium.Color.RED,
                             backgroundColor: Cesium.Color.CORAL,
                             style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                             outlineWidth: 2,
                             //垂直位置
                             heightReference: Cesium.HeightReference.NONE,
                             verticalOrigin: Cesium.VerticalOrigin.TOP,
                             pixelOffset: new Cesium.Cartesian2(50, 0)
                         }
                     }
                 );

                    AllEnities.push(strartpoint);

                }

                if (isDraw && polylinePath.length > 1) {

                    var text = 0;
                    text = sum(disNums) + Number(getLineDis(polylinePath[0], polylinePath[1]));
                    disNums.push(getLineDis(polylinePath[0], polylinePath[1]));
                    var temppoint = viewer.entities.add(
                          {
                              position: point,
                              point: {
                                  heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                                  show: true,
                                  color: Cesium.Color.SKYBLUE,
                                  pixelSize: 3,
                                  outlineColor: Cesium.Color.YELLOW,
                                  outlineWidth: 1
                              },
                              label: {
                                  text: text.toFixed(2).toString() + '公里',
                                  font: '14pt monospace',
                                  color: Cesium.Color.RED,
                                  backgroundColor: Cesium.Color.CORAL,
                                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                  outlineWidth: 2,
                                  //垂直位置
                                  heightReference: Cesium.HeightReference.NONE,
                                  verticalOrigin: Cesium.VerticalOrigin.TOP,
                                  pixelOffset: new Cesium.Cartesian2(50, 0)
                              }
                          }
                      );

                    AllEnities.push(temppoint);

                    polyline = viewer.entities.add({
                        polyline: {
                            show: true,
                            positions: polylinePath,
                            material: new Cesium.PolylineOutlineMaterialProperty({
                                color: Cesium.Color.RED
                            }),
                            width: 2
                        }
                    });
                    AllEnities.push(polyline);
                    LineEntities.push(polyline); //加直线
                    var lastpoint = polylinePath[polylinePath.length - 1];
                    polylinePath = [lastpoint];
                }
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        /***************************鼠标单击事件***********************************/

        /***************************鼠标双击事件***********************************/
        handler.setInputAction(function () {
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
            AllEnities.push(polyline);
            viewer.trackedEntity = undefined;
            isDraw = false;
            //tooltip.style.display = "none";
            polylinePath = [];
            //LineEntities = [];
            // polyline = null;

        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        /***************************鼠标双击事件***********************************/
    }


    //获取俩点的距离，返回公里单位值
    function getLineDis(startPoint, endPoint) {
        var x2 = (endPoint.x - startPoint.x) * (endPoint.x - startPoint.x)
        var y2 = (endPoint.y - startPoint.y) * (endPoint.y - startPoint.y);
        var dis = Math.sqrt(x2 + y2) / 1000;
        return dis.toFixed(2);
    }

    function sum(arr) {
        var s = 0;
        for (var i = arr.length - 1; i >= 0; i--) {
            s += Number(arr[i]);
        }
        return s;
    }
    export default measureDistance