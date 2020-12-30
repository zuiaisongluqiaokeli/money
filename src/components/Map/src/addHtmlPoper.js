/**
 * 添加css3 html元素
 */
const elements = []
const scratch = new Cesium.Cartesian2()
const container = document.createElement('div')
export function addHtmlPoper(viewer, isBackHide) {
  const scene = viewer.scene
  const camera = viewer.scene.camera
  container.className = `ys-css3-container`
  document.body.appendChild(container)
  elements.forEach(e => {
    container.insertAdjacentHTML('beforeend', e.element);
  })
  scene.preRender.addEventListener(function () {
    for (let i = 0; i < container.children.length; i++) {
      const p = Cesium.Cartesian3.fromDegrees(elements[i].position[0], elements[i].position[1], elements[i].position[2] || 0)
      const canvasPosition = scene.cartesianToCanvasCoordinates(p, scratch)
      if (Cesium.defined(canvasPosition)) {
        container.children[i].style.left = parseFloat(canvasPosition.x) + parseFloat(elements[i].offset[0]) + 'px'
        container.children[i].style.top = parseFloat(canvasPosition.y) + parseFloat(elements[i].offset[1]) + 'px'
        if (isBackHide) {
          let j = camera.position, n = scene.globe.ellipsoid.cartesianToCartographic(j).height;
          if (!(n += 1 * scene.globe.ellipsoid.maximumRadius, Cesium.Cartesian3.distance(j, p) > n)) {
            container.children[i].style.display = 'block'
          } else {
            container.children[i].style.display = 'none'
          }
        }
      }
    }
  })
}

export function addEntityLayer(object) {
  let lon = object.position[0],
    lat = object.position[1],
    sStartFlog = false,
    s1 = 0.001,
    s2 = s1,
    s3 = s1,
    s4 = s1
  setTimeout(() => sStartFlog = true, 300)
  let rotation = Cesium.Math.toRadians(30);
  let rotation2 = Cesium.Math.toRadians(30);

  //构建entity
  let height = object.boxHeight, heightMax = object.boxHeightMax, heightDif = object.boxHeightDif;
  let goflog = true
  //添加正方体
  viewer.entities.add({
    id: object.id + "_1",
    name: "立方体盒子",
    position: new Cesium.CallbackProperty(function () {
      height = height + heightDif;
      if (height >= heightMax) {
        height = heightMax
      }
      return Cesium.Cartesian3.fromDegrees(lon, lat, height / 2)
    }, false),
    box: {
      dimensions: new Cesium.CallbackProperty(function () {
        height = height + heightDif
        if (height >= heightMax) {
          height = heightMax
          if (goflog) { //需要增加判断 不然它会一直执行; 导致对div的dom操作 会一直重复
            goflog = false
            append(object, true)
          }
        }
        return new Cesium.Cartesian3(object.boxSide, object.boxSide, height)
      }, false),
      material: object.boxMaterial
    }
  });
  //添加底座一 外环
  viewer.entities.add({
    id: object.id + "_2",
    name: "椭圆",
    position: Cesium.Cartesian3.fromDegrees(lon, lat),
    ellipse: {
      // semiMinorAxis : object.circleSize, //直接这个大小 会有一个闪白的材质 因为cesium材质默认是白色 所以我们先将大小设置为0
      // semiMajorAxis : object.circleSize,
      semiMinorAxis: new Cesium.CallbackProperty(function () {
        if (sStartFlog) {
          s1 = s1 + object.circleSize / 20;
          if (s1 >= object.circleSize) {
            s1 = object.circleSize;
          }
        }
        return s1;
      }, false),
      semiMajorAxis: new Cesium.CallbackProperty(function () {
        if (sStartFlog) {
          s2 = s2 + object.circleSize / 20;
          if (s2 >= object.circleSize) {
            s2 = object.circleSize
          }
        }
        return s2;
      }, false),
      material: "images/circle2.png",
      rotation: new Cesium.CallbackProperty(function () {
        rotation += 0.05;
        return rotation;
      }, false),
      stRotation: new Cesium.CallbackProperty(function () {
        rotation += 0.05;
        return rotation;
      }, false),
      zIndex: 2,
    }
  });
  //添加底座二 内环
  viewer.entities.add({
    id: object.id + "_3",
    name: "椭圆",
    position: Cesium.Cartesian3.fromDegrees(lon, lat),
    ellipse: {
      semiMinorAxis: new Cesium.CallbackProperty(function () {
        if (sStartFlog) {
          s3 = s3 + object.circleSize / 20;
          if (s3 >= object.circleSize / 2) {
            s3 = object.circleSize / 2;
          }
        }
        return s3;
      }, false),
      semiMajorAxis: new Cesium.CallbackProperty(function () {
        if (sStartFlog) {
          s4 = s4 + object.circleSize / 20;
          if (s4 >= object.circleSize / 2) {
            s4 = object.circleSize / 2;
          }
        }
        return s4;
      }, false),
      material: "images/circle1.png",
      rotation: new Cesium.CallbackProperty(function () {
        rotation2 -= 0.03
        return rotation2
      }, false),
      stRotation: new Cesium.CallbackProperty(function () {
        rotation2 -= 0.03
        return rotation2
      }, false),
      zIndex: 3
    }
  })
}
function append(object) {
  elements.push(object)
  container.insertAdjacentHTML('beforeend', object.element)
}
function remove(id) {
  elements = elements.filter(e => e.id !== id)
  container.removeChild(D.getElementById(id))
}
function removeEntityLayer(id) {
  viewer.entities.removeById(id + "_1")
  viewer.entities.removeById(id + "_2")
  viewer.entities.removeById(id + "_3")
  remove(id)
}
