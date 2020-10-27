import PointDrawer from "./PointDrawer";
class MeasureTool {
  constructor(viewer = {}, options = {}) {
    this.viewer = viewer;
    this.options = options;
    this.pointDrawer = null;
  }
  
  measurePoint(options = {}) {
    this.pointDrawer = new PointDrawer(this.viewer, options);
    this.pointDrawer.startDrawPoint();
  }

  init(originViewer) {
    if (!originViewer) {
      throw new Error("viewer is required");
    }
    viewer = originViewer;
    this.tool = new MeasureTool(originViewer);
  }
  bindGloveEvent() {
    const { scene } = viewer;
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    handler.setInputAction(function(movement) {
      const pick = viewer.scene.pick(movement.position);
      console.log(movement, pick, 33);

      if (!pick) {
        return;
      }

      const obj = pick.id;

      if (!obj || !obj.layerId || this.flag == 0) {
        return;
      }

      const objId = obj.objId;

      //flag为编辑或删除标识,1为编辑，2为删除
      if (this.flag == 1) {
        switch (obj.shapeType) {
          case "Point":
            this.flag = 0;
            this.editPoint(objId);

            break;
          default:
            break;
        }
      } else if (this.flag == 2) {
        this.clearEntityById(objId);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  toggleExpandedToolbar() {
    this.expanded = !this.expanded;

    if (!this.tool) {
      this.init();
    }
  }
  handleToolClick(type) {
    const legend = this.legend.find(legend => legend.MemberType === type);
    const { image } = legend || {};

    if (!legend) {
      throw new Error("unknown MemberType");
    }

    this.flag = 0;
    this.tool.measurePoint({ image });
  }
  showPoint(objId, position, options) {
    const { image } = options;
    const entity = viewer.entities.add({
      layerId: this.layerId,
      objId: objId,
      shapeType: "Point",
      position: position,
      billboard: {
        image: image,
        width: 20,
        height: 20,
        eyeOffset: new Cesium.ConstantProperty(
          new Cesium.Cartesian3(0, 0, -500)
        )
        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
  }
  editPoint(objId) {
    const oldPosition = this.shapeDic[objId];

    //先移除entity
    this.clearEntityById(objId);

    //进入编辑状态
    this.tool.pointDrawer.showModifyPoint(
      oldPosition,
      position => {
        this.shapeDic[objId] = position;
        this.showPoint(objId, position);
      },
      () => {
        this.showPoint(objId, oldPosition);
      }
    );
  }
  clearEntityById(objId) {
    const entityList = viewer.entities.values;
    if (entityList == null || entityList.length < 1) {
      return;
    }
    for (let i = 0; i < entityList.length; i++) {
      const entity = entityList[i];

      if (entity.layerId == this.layerId && entity.objId == objId) {
        viewer.entities.remove(entity);
        i--;
      }
    }
  }
}

export default MeasureTool;
