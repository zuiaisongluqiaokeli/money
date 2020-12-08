<template>
  <div class="time-line">
    <div class="container">
      <i
        class="iconfont icon-Play"
        title="播放"
        v-if="isPlay"
        @click="handlePlay"
      ></i>
      <i
        class="iconfont icon-suspend"
        title="暂停"
        v-if="!isPlay"
        @click="handlePause"
      ></i>
      <i class="iconfont icon-stop-b" title="停止" @click="handleStop"></i>
      <i class="iconfont icon-speed" title="加速" @click="handleSpeed"></i>
      <span class="speed">x{{ speedUp }}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { emitter, EventType } from "../src/EventEmitter";
export default {
  props: {
    placement: {
      type: String,
      default: "left",
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      speedUp: 1, //速率
      isPlay: true, //是否播放   创建单例模式
      animationViewModel: null, //动画对象
      clockViewModel: null, //时钟对象
      multiplier: 1, //速率
      create: false,
    };
  },
  created() {
    emitter.on(EventType.StartTimeLine, this.changePlay, this);
  },
  computed: {
    ...mapState("map", [
      "allEntityBackEnd",
      "initTack",
      "gisTrackShow",
      "gisRightSelectedEntity",
    ]),
  },

  watch: {
    initTack(val) {
      this.handleStop(); //改变轨迹状态就相当于重启过程
    },
  },

  methods: {
    ...mapMutations("map", ["updateInitTack"]),
    //创建单例模式
    handlePlay() {
      if (!this.create) {
        this.create = true;
        this.initTimeline();
      }
      this.isPlay = false;
      this.animationViewModel.playForwardViewModel.command(); //播放
    },
    handlePause() {
      this.isPlay = true;
      this.animationViewModel.pauseViewModel.command(); //暂停
    },
    //飞行时候自动执行时间轴
    changePlay() {
      this.isPlay = false;
      this.initTimeline();
      this.animationViewModel.playForwardViewModel.command(); //播放
    },
    handleStop() {
      if (this.create) {
        if (!this.isPlay) {  //如果运行就暂停
          this.animationViewModel.pauseViewModel.command();
        }
        this.clockViewModel.currentTime = this.clockViewModel.startTime;
        this.isPlay = true;
        this.speedUp = 1;
        this.multiplier = 1;
        this.create = false;
        gisvis.viewer.dataSources.removeAll(); //删除移动点
        let trackEntities = this.allEntityBackEnd.filter(
          (e) => e.properties.locus
        );
        trackEntities.forEach((item) => {
          let locus = JSON.parse(item.properties.locus);
          let cartographicDegrees = locus.position.cartographicDegrees.map(
            (i) => Number(i)
          );
          gisvis.viewer.entities.getById(
            item.id
          ).position = Cesium.Cartesian3.fromDegrees(
            this.initTack
              ? cartographicDegrees[1]
              : cartographicDegrees[cartographicDegrees.length - 3],
            this.initTack
              ? cartographicDegrees[2]
              : cartographicDegrees[cartographicDegrees.length - 2],
            0
          );
          gisvis.viewer.entities.getById(item.id).show = true; //显示真实的点
          if (this.gisTrackShow) {
            gisvis.viewer.entities.removeById("track-line-" + item.id); //删除轨迹线
          }
        });
        //右键飞行轨迹实体显示出来，显示的坐标是最后画线的经纬度
        let initTackData = JSON.parse(sessionStorage.getItem("initTackData"));
        gisvis.viewer.entities.getById(
          this.gisRightSelectedEntity.id
        ).position = Cesium.Cartesian3.fromDegrees(
          initTackData[initTackData.length - 1].longitude,
          initTackData[initTackData.length - 1].latitude
        );
        gisvis.viewer.entities.getById(
          this.gisRightSelectedEntity.id
        ).show = true;
        //销毁轨迹线和飞机实体
        gisvis.viewer.entities.removeById("airplain");
        gisvis.viewer.entities.removeById("airplain-radar");
        gisvis.viewer.entities.values.forEach(element => {
          if(element.name=='空间直线距离'||element.name=='直线')
          gisvis.viewer.entities.remove(element)
        });
        gisvis.viewer.trackedEntity = null
      }
      this.updateInitTack(false);
    },
    handleSpeed() {
      if (++this.speedUp > 3) {
        this.speedUp = 1;
      }
      this.clockViewModel.multiplier =
        this.multiplier * (this.speedUp === 1 ? 1 : this.speedUp * 3);
    },
    //生成CZML格式
    initTimeline() {
      let trackEntities = this.allEntityBackEnd.filter(
        (item) =>
          item.properties.hasOwnProperty("locus") && item.properties.locus
      );
      let trackCZML = [
        { id: "document", name: "CZML billboard", version: "1.0" },
      ];
      //找到有轨迹线的数据(4个值为一组，分别是时间，经度，纬度，高度)
      trackEntities.forEach((item) => {
        gisvis.viewer.entities.getById(item.id).show = false;
        let locus = JSON.parse(item.properties.locus);
        let position = {
          epoch: locus.position.epoch,
          cartographicDegrees: locus.position.cartographicDegrees.map((i) =>
            Number(i)
          ),
        };
        //是否显示轨迹
        if (this.gisTrackShow) {
          let trackLinePositions = position.cartographicDegrees.filter(
            (i, index) => index % 4 === 1 || index % 4 === 2
          );
          //绘制线条
          gisvis.viewer.entities.add({
            id: "track-line-" + item.id,
            polyline: {
              loop: false,
              material: new Cesium.PolylineDashMaterialProperty({
                color: gisvis.viewer.entities
                  .getById(item.id)
                  .billboard.color.getValue(),
                gapColor: Cesium.Color.TRANSPARENT, //裂口颜色
                dashLength: 40,
                // dashPattern: 220
              }),
              positions: Cesium.Cartesian3.fromDegreesArray(trackLinePositions),
              width: 2,
            },
          });
        }
        //批量封装数据
        let data = {
          id: "track-" + item.id,
          availability: locus.availability, //起始时间
          orientation: { velocityReference: "#position" }, //czml中的属性  设置镜头跟随路径经纬度
          position: position,
          billboard: {
            image: gisvis.viewer.entities
              .getById(item.id)
              .billboard.image.getValue(),
            width: gisvis.viewer.entities
              .getById(item.id)
              .billboard.width.getValue(),
            height: gisvis.viewer.entities
              .getById(item.id)
              .billboard.height.getValue(),
            color: Cesium.Color.fromCssColorString("#ffcc33"),
          },
          label: {
            show: gisvis.viewer.entities.getById(item.id).label.show.valueOf(),
            text: gisvis.viewer.entities.getById(item.id).label.text.valueOf(),
            pixelOffset: { cartesian2: [0, 24] },
            font: "12px sans-serif",
            fillColor: Cesium.Color.fromCssColorString(
              window.mapType === "satellite" ? "#000000" : "#ffffff"
            ),
            // outlineColor:Cesium.Color.fromCssColorString(window.mapType==='satellite'?"#000000":"#ffffff"),
            outlineWidth: 2,
            horizontalOrigin: "CENTER",
            // scaleByDistance: new Cesium.NearFarScalar(1e2, 3, 9.0e6, 0.0),
            // pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
            //   1e2,
            //   3,
            //   9.0e6,
            //   0.0
            // )
          },
          ellipse: gisvis.viewer.entities.getById(item.id).ellipse
            ? {
                show: gisvis.viewer.entities
                  .getById(item.id)
                  .ellipse.show.valueOf(),
                semiMinorAxis: gisvis.viewer.entities
                  .getById(item.id)
                  .ellipse.semiMinorAxis.valueOf(),
                semiMajorAxis: gisvis.viewer.entities
                  .getById(item.id)
                  .ellipse.semiMajorAxis.valueOf(),
                height: 0,
                material: {
                  solidColor: {
                    color: {
                      rgba: [
                        gisvis.viewer.entities
                          .getById(item.id)
                          .ellipse.material.getValue().color.red * 255,
                        gisvis.viewer.entities
                          .getById(item.id)
                          .ellipse.material.getValue().color.green * 255,
                        gisvis.viewer.entities
                          .getById(item.id)
                          .ellipse.material.getValue().color.blue * 255,
                        gisvis.viewer.entities
                          .getById(item.id)
                          .ellipse.material.getValue().color.alpha * 255,
                      ],
                    },
                  },
                },
                outline: true,
                outlineColor: {
                  rgba: [
                    gisvis.viewer.entities
                      .getById(item.id)
                      .ellipse.outlineColor.getValue().red * 255,
                    gisvis.viewer.entities
                      .getById(item.id)
                      .ellipse.outlineColor.getValue().green * 255,
                    gisvis.viewer.entities
                      .getById(item.id)
                      .ellipse.outlineColor.getValue().blue * 255,
                    gisvis.viewer.entities
                      .getById(item.id)
                      .ellipse.outlineColor.getValue().alpha * 255,
                  ],
                },
              }
            : undefined,
        };
        trackCZML.push(data); //每个数组都绘制一个实体
      });

      let czmlDataSource = new Cesium.CzmlDataSource();
      let dataSourcePromise = gisvis.viewer.dataSources.add(czmlDataSource);
      //载入数据
      czmlDataSource.load(trackCZML).then((instance) => {
        trackEntities.forEach((item) => {
          let entity = instance.entities.getById("track-" + item.id);
          (entity.billboard.scaleByDistance = new Cesium.NearFarScalar(
            1.5e2,
            1.0,
            8.0e6,
            0.2
          )),
            (entity.label.scaleByDistance = new Cesium.NearFarScalar(
              1.5e2,
              1.0,
              8.0e6,
              0.2
            ));
          entity.label.pixelOffsetScaleByDistance = new Cesium.NearFarScalar(
            1e2,
            3,
            9.0e6,
            0.0
          );
        });
      });
      // CLAMPED
      // 达到终止时间后停止
      // LOOP_STOP
      // 达到终止时间后重新循环
      // UNBOUNDED
      // 达到终止时间后继续读秒
      //当前时间超过结束时间掉暂停
      gisvis.viewer.clock.clockRange = "CLAMPED";
      this.clockViewModel = null;
      this.clockViewModel = new Cesium.ClockViewModel(gisvis.viewer.clock);
      console.log("轨迹时间", this.clockViewModel);
      this.animationViewModel = null;
      this.animationViewModel = new Cesium.AnimationViewModel(
        this.clockViewModel
      );
      this.multiplier = this.clockViewModel.multiplier;
      gisvis.viewer.clock.onTick.addEventListener((event) => {
        let currentTime = Cesium.JulianDate.toDate(
          this.clockViewModel.currentTime
        ).getTime();
        //获取截至时间
        let stopTime = Cesium.JulianDate.toDate(
          this.clockViewModel.stopTime
        ).getTime();
        if (currentTime >= stopTime) {
          this.handleStop();
        }
      });
    },
    //测试数据
    initLine() {
      gisvis.viewer.entities.add({
        id: "line1",
        polyline: {
          loop: false,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.RED,
            gapColor: Cesium.Color.TRANSPARENT,
            dashLength: 20,
            dashPattern: 255,
          }),
          positions: Cesium.Cartesian3.fromDegreesArray([
            149.5458984375,
            11.480024648555816,
            150.4248046875,
            10.876464994816295,
            // 150.75439453125,
            // 10.962764256386821,
            152.149658203125,
            10.390571576337726,
            152.061767578125,
            10.433793243184432,
            152.95166015625,
            10.844096320683942,
            152.75390625,
            10.773952188496649,
            153.72070312499997,
            10.466205555063882,
            154.00634765625003,
            9.579084335882534,
            // 153.36914062500003,
            // 9.123792057073985,
            151.622314453125,
            10.1905939626797,
            152.7264404296875,
            10.768555807732437,
          ]),
          width: 2,
        },
      });
      gisvis.viewer.entities.add({
        id: "1000411",
        polyline: {
          loop: false,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.BLUE,
            gapColor: Cesium.Color.TRANSPARENT,
            dashLength: 20,
            dashPattern: 255,
          }),
          positions: Cesium.Cartesian3.fromDegreesArray([
            149.8095703125,
            12.382928338487396,
            152.666015625,
            11.523087506868514,
            155.9619140625,
            11.6522364041154,
            159.43359375,
            11.221510260010541,
            159.2578125,
            11.26461221250444,
            159.98291015625,
            11.135287077054238,
            159.92523193359372,
            11.12181239218314,
            160.433349609375,
            11.251143544897465,
            160.39764404296875,
            11.24036815726794,
            161.65283203125,
            9.752370139173285,
            163.5205078125,
            8.733077421211563,
            165.10253906249997,
            7.863381805309173,
            166.97021484375,
            7.231698708367139,
            166.9921875,
            7.035475652433024,
            168.75,
            6.599130675207247,
          ]),
          width: 2,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.time-line {
  position: relative;
  left: 3.58rem;
  bottom: 2rem;
  width: 118px;
  // height: 1.7em;
  color: white;
  margin: 0 6px;
  // display: flex;
  // flex-direction: column;
  // border-top: 2px #383838 solid;
  // box-shadow: var(--box-shadow);
  // background-color: var(--background-color-panel);

  ul,
  li {
    margin: 0;
    padding: 0;
  }

  .container {
    line-height: 23px;

    i {
      padding: 4px;
      font-size: 22px;
      cursor: pointer;
    }
    span {
      font-size: 16px;
      position: absolute;
      user-select: none;
    }
  }
}
</style>
