
const defined = Cesium.defined;
const DeveloperError = Cesium.DeveloperError;

function toDegreesFromScreenCoordinate (viewer, x, y) {
  if (!viewer) return null;
  try {
    let scene = viewer.scene;
    const ray = viewer.camera.getPickRay(new Cesium.Cartesian2(x, y));
    const cartesian = scene.globe.pick(ray, scene);
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    // 弧度转度数 toDegrees，度数转弧度 Cesium.Math.toRadians(degrees)
    let longitude = Cesium.Math.toDegrees(cartographic.longitude)
    let latitude = Cesium.Math.toDegrees(cartographic.latitude)

    return {
      longitude,
      latitude,
      height: cartographic.height
    }
  } catch (e) {
    console.log('toDegreesFromScreenCoordinate transform error!', e)
    return null
  }
  
}

function distanceFromDegrees(longitude1, latitude1, longitude2, latitude2) {
  let p1 = Cesium.Cartesian3.fromDegrees(longitude1, latitude1, 0);
  let p2 = Cesium.Cartesian3.fromDegrees(longitude2, latitude2, 0);
  let res = Cesium.Cartesian3.distance(p1, p2);
  return res;
}

export default class MergeCircles {

  constructor ({viewer, id = Date.now(), color = '#f00', lineWidth = 1}) {
    if (!defined(viewer)) {
      throw new DeveloperError('viewer is required.');
    }
    this.viewer = viewer;
    this.id = id;
    this.color = color;
    this.lineWidth = lineWidth;
    this.entities = new Map()
    this.properties = new Map()
    this.curRedCanvas = '1'
    this.countRed = 0
    this.width = viewer.scene.canvas.clientWidth
    this.height = viewer.scene.canvas.clientHeight

    this.createElement()
    this.createEntities()
  }

  createElement () {
    let parent = document.querySelector('#' + this.viewer.container.id).parentElement

    for (let i = 1; i < 3; i++) {
      let canvas = document.createElement('canvas')
      canvas.setAttribute('id', this.id + i)
      parent.appendChild(canvas)
    }
  }

  createEntities () {
    const coordinates = this.updateEntityPosition()
    this.entityRed = this.viewer.entities.add({
      id: this.id,
      custom: 'red',
      rectangle: {
        coordinates,
        material: new Cesium.ImageMaterialProperty({
          image: new Cesium.CallbackProperty(this.drawCanvasRed.bind(this), false),
          transparent: true
        })
      }
    })
  }

  updatePosition (canvas) {
    let properties = []
    this.entities.forEach((entity, id) => {
      const cartesian = entity.position.getValue({})
      const position = this.viewer.scene.cartesianToCanvasCoordinates(cartesian)
      const {radius} = this.properties.get(id)
      
      properties.push({
        radius: radius * this.distanceRatio,
        color: this.color,
        width: this.lineWidth,
        position
      })
    })
    this.updateCanvas({properties, canvas})
  }

  updateEntityPosition () {
    let wn = toDegreesFromScreenCoordinate(this.viewer, 20, -20);
      let es = toDegreesFromScreenCoordinate(
        this.viewer,
        this.width + 20,
        this.height - 21
      );
      if (wn && es) {
        let vp = {}
        vp.WEST = Cesium.Math.toRadians(wn.longitude);
        vp.NORTH = Cesium.Math.toRadians(wn.latitude);
        vp.EAST = Cesium.Math.toRadians(es.longitude);
        vp.SOUTH = Cesium.Math.toRadians(es.latitude);
        const coordinates = Cesium.Rectangle.fromDegrees(
          Cesium.Math.toDegrees(vp.WEST),
          Cesium.Math.toDegrees(vp.SOUTH),
          Cesium.Math.toDegrees(vp.EAST),
          Cesium.Math.toDegrees(vp.NORTH)
        )
        
        this.distanceRatio = this.width / distanceFromDegrees(wn.longitude, (wn.latitude + es.latitude) / 2, es.longitude, (wn.latitude + es.latitude) / 2)
        
        return coordinates
      }

      return null
  }

  drawCanvasRed () {
    const canvas = document.querySelector('#' + this.id + this.curRedCanvas)
    // const canvas = document.createElement('canvas')
    canvas.width = this.width;
    canvas.height = this.height;
    
    this.updatePosition(canvas)

    if (++this.countRed > 5) {
      // console.log('y')
      this.countRed = 0
      this.curRedCanvas = this.curRedCanvas === '1' ? '2' : '1'

      const coordinates = this.updateEntityPosition()
      if (coordinates) {
        this.entityRed.rectangle.coordinates = coordinates
      }
    }
    return canvas
  }

  add ({entity, radius}) {
    this.entities.set(entity.id, entity)
    this.properties.set(entity.id, {radius})
  }

  removeById (id) {
    if (this.entities.has(id)) {
      this.entities.delete(id)
    }
    if (this.properties.has(id)) {
      this.properties.delete(id)
    }
  }

  createPath(array) {
    const result = []
    array.forEach(a => {
      let p = new Path2D()
      const {position, radius} = a
      p.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
      result.push(p)
    })
    const [head, ...others] = result
    others.forEach(a => {
      head.addPath(a)
    })

    return head;
  }

  updateCanvas ({properties, canvas}) {
    if (!properties.length) return canvas;

    const ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, canvas.width, canvas.height); 

    ctx.beginPath();
    let color = properties[0].color, width = properties[0].width || 1
    let strokePath = this.createPath(properties)
    ctx.lineWidth = width + 1;
    ctx.strokeStyle = color;
    ctx.stroke(strokePath)

    ctx.beginPath();
    let fillPath = this.createPath(properties)
    ctx.globalCompositeOperation = "destination-out";
    ctx.fill(fillPath)
    
    return canvas
  }

}