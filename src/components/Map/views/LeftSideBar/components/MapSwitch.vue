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
      <span>国界线：</span>
      <el-tooltip
        class="item"
        effect="dark"
        content="启用将会干扰标记功能等"
        placement="top-start"
      >
        <el-switch class="switch" v-model="country"></el-switch>
      </el-tooltip>
    </div>
    <div>
      <span>部分全球卫星：</span
      ><el-switch class="switch" v-model="globalSatellites">轨迹</el-switch>
    </div>
    <div>
      <span>鹰眼图：</span>
      <el-switch class="switch" v-model="eyeMap"></el-switch>
    </div>
    <div>
      <span>轨迹：</span
      ><el-switch class="switch" v-model="track">轨迹</el-switch>
    </div>
    <div>
      <span>切换飞机视角：</span>
      <el-tooltip
        class="item"
        effect="dark"
        content="开始轨迹飞行时才可以切换"
        placement="top-start"
      >
        <el-switch class="switch" v-model="changePlaneView"></el-switch>
      </el-tooltip>
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
import globalSatellites from "../../../src/globalSatellites.json";
import countries from "../../../src/countriesGeo.json";
export default {
  name: "MapSwitch",
  props: {},
  data() {
    return {
      label: true,
      track: true,
      country: false,
      changePlaneView: false,
      globalSatellites: false,
      gridLatitudeLongitude: false,
      trackedEntity: {}, //切换飞机视角对象
      eyeMap: this.$store.state.map.eyeMap,
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
    country(val) {
      if (val) {
        //国家线;
        gisvis.viewer.dataSources.add(
          Cesium.GeoJsonDataSource.load(countries, {
            stroke: Cesium.Color.YELLOW,
            strokeWidth: 5,
          })
        );
        //开启抗锯齿;
        gisvis.viewer.scene.fxaa = true;
        gisvis.viewer.scene.postProcessStages.fxaa.enabled = true;
        gisvis.viewer.dataSources.get(0).show = true;
      } else {
        gisvis.viewer.dataSources.get(0).show = false;
      }
    },
    globalSatellites(val) {
      if (val) {
        let czmlDataSource = new Cesium.CzmlDataSource();
        let dataSourcePromise = gisvis.viewer.dataSources.add(czmlDataSource);
        czmlDataSource.load(globalSatellites).then((instance) => {
          emitter.emit(EventType.StartTimeLine);
        });
      } else {
        gisvis.viewer.dataSources.removeAll();
      }
    },
    eyeMap(val) {
      if (val) this.changeEyeMap(true);
      else {
        this.changeEyeMap(false);
      }
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
    ...mapMutations("map", [
      "changeGisLabelShow",
      "changeGisTrackShow",
      "changeEyeMap",
    ]),
    addselection() {
      var els = document.getElementsByClassName("cesium-viewer"); //cesium起用地图选择后cesium创建的一个框
      // var selectionIndicatorContainer = document.createElement('div');
      //selectionIndicatorContainer.className = 'cesium-viewer-selectionIndicatorContainer';
      //els[0].appendChild(selectionIndicatorContainer);
      var selectionIndicatorContainer = document.getElementsByClassName(
        "cesium-viewer-selectionIndicatorContainer"
      ); //cesium起用地图选择后cesium创建的一个框
      var selectionIndicator = new Cesium.SelectionIndicator(
        selectionIndicatorContainer[0],
        gisvis.viewer.scene
      );
      var entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(113.754961, 23.068441, 0.0),
        billboard: {
          width: 25,
          height: 25,
          color: Cesium.Color.YELLOW,
          image: "img/location.png",
        },
      });
      //var viewModel = selectionIndicator.viewModel;
      //viewer._selectedEntityChanged.raiseEvent(entity);
      //viewModel.animateAppear();
      (selectionIndicator.viewModel.position = Cesium.Cartesian3.fromDegrees(
        113.754961,
        23.068441,
        0.0
      )),
        (selectionIndicator.viewModel.showSelection = true);
      //viewModel.update();
    },

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
        gisvis.viewer.entities.add({
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
        gisvis.viewer.entities.add({
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
