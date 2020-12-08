<template>
  <div id="map-switch" class="map-switch">
    <div>
      <span>名称：</span><el-switch class="switch" v-model="label"></el-switch>
    </div>
    <div>
      <span>经纬度网格：</span>
      <el-switch class="switch" v-model="gridLatitudeLongitude"></el-switch>
    </div>
    <div>
      <span>轨迹：</span
      ><el-switch class="switch" v-model="track">轨迹</el-switch>
    </div>
    <div>
      <span>切换飞机视角：</span>
      <el-switch class="switch" v-model="changePlaneView"></el-switch>
    </div>
    <div>
      <span>测量：</span>
      <el-tooltip
        class="item"
        effect="dark"
        content="左键绘制右键完成"
        placement="top-start"
      >
        <el-button type="primary" icon="el-icon-add" @click="measureLineSpace"
          >距离</el-button
        >
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="左键绘制右键完成"
        placement="top-start"
      >
        <el-button type="primary" icon="el-icon-add" @click="measureAreaSpace"
          >面积</el-button
        >
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { emitter, EventType } from "../../../src/EventEmitter";
export default {
  name: "MapSwitch",
  props: {},
  data() {
    return {
      label: true,
      track: true,
      changePlaneView: false,
      gridLatitudeLongitude: false,
      trackedEntity: {}, //切换飞机视角对象
    };
  },
  components: {},
  computed: {
    ...mapState("map", ["gisLabelShow", "gisTrackShow", "airplaneEntity"]),
  },
  watch: {
    label(n) {
      this.changeGisLabelShow(n);
      console.log("页面上的实体", gisvis.viewer.entities.values);
      if (n) {
        gisvis.viewer.entities.values.forEach((n) => (n.label.show = true));
      } else {
        gisvis.viewer.entities.values.forEach((n) => (n.label.show = false));
      }
    },
    track(n) {
      this.changeGisTrackShow(n);
    },
    changePlaneView(val) {
      if (val) this.changeAirPlaneView();
    },
    gridLatitudeLongitude(val) {
      if (val) this.ChangeGridLatitudeLongitude();
      else {
        for (let lang = -180; lang <= 180; lang += 20) {
          gisvis.viewer.entities.removeById("drawGridLongitude" + lang);
        }
        for (let lat = -80; lat <= 80; lat += 10) {
          gisvis.viewer.entities.removeById("drawGridLatitude" + lat);
        }
      }
    },
  },
  methods: {
    ...mapMutations("map", ["changeGisLabelShow", "changeGisTrackShow"]),
    measureLineSpace() {
      gisvis.emitter.emit(EventType.MeasureLineSpace, { state: "measure" });
    },
    measureAreaSpace() {
      gisvis.emitter.emit(EventType.MeasureAreaSpace, { state: "measure" });
    },
    changeAirPlaneView() {
      gisvis.viewer.trackedEntity = this.airplaneEntity;
    },
    ChangeGridLatitudeLongitude() {
      const entities = gisvis.viewer.entities;
      //每隔20读绘制一条经度线和经度标注,自己控制间隔
      for (let lang = -180; lang <= 180; lang += 20) {
        let text = "";
        if (lang === 0) {
          text = "0";
        }
        text += lang === 0 ? "" : "" + lang + "°";
        if (lang === -180) {
          text = "";
        }
        entities.add({
          id: "drawGridLongitude" + lang,
          position: Cesium.Cartesian3.fromDegrees(lang, 0),
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
              lang,
              -90,
              lang,
              0,
              lang,
              90,
            ]),
            width: 1.0,
            material: Cesium.Color.WHITE,
          },
          label: {
            text: text,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            font: "12px sans-serif",
            fillColor: Cesium.Color.WHITE,
          },
        });
      }
      //纬度
      let langS = [];
      for (let lang = -180; lang <= 180; lang += 5) {
        langS.push(lang);
      }
      //每隔10读绘制一条纬度线和纬度标注,自己控制间隔
      for (let lat = -80; lat <= 80; lat += 10) {
        let text = "";
        text += "" + lat + "°";
        if (lat === 0) {
          text = "";
        }
        entities.add({
          id: "drawGridLatitude" + lat,
          position: Cesium.Cartesian3.fromDegrees(0, lat),
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(
              langS
                .map((long) => {
                  return [long, lat].join(",");
                })
                .join(",")
                .split(",")
                .map((item) => Number(item))
            ),
            width: 1.0,
            material: Cesium.Color.WHITE,
          },
          label: {
            text: text,
            font: "12px sans-serif",
            fillColor: Cesium.Color.WHITE,
          },
        });
      }
      //开启抗锯齿
      gisvis.viewer.scene.fxaa = true;
      gisvis.viewer.scene.postProcessStages.fxaa.enabled = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.map-switch {
  max-height: 385px;
  // 外层容器有padding，滚动调滚不到最顶或最底部，做些处理
  margin: -12px 0;
  padding: 8px 0;
  overflow: auto;
  div {
    margin: 5px 0;
  }
}
span {
  display: inline-block;
  text-align: right;
  width: 100px;
}
</style>
