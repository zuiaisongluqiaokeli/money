<template>
  <div id="map-imagery" class="map-imagery">
    <div
      class="imagery-item"
      :class="{ active: command === item.command }"
      v-for="item in imageryOptions"
      :key="item.text"
      @click="handlerImagery(item.command)"
    >
      <img :src="item.img" alt />
      <span>{{ item.text }}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { EventType } from '../../../src/EventEmitter'
var token = '6c70bdd9f7f6968e0426350072bc945a'
// 服务域名
var tdtUrl = 'https://t{s}.tianditu.gov.cn/'
// 服务负载子域
var subdomains = ['1', '2', '3', '4', '5', '6', '7']
export default {
  name: 'MapImagery',
  props: {},
  data() {
    return {
      command: 'satellite',
      imageryOptions: [
        {
          img: 'img/weixing.png',
          command: 'satellite',
          text: '在线地图',
          url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
          // url    : 'map/s/{z}/{y}/{x}.png'
        },
        {
          img: 'img/lixian.png',
          command: 'offlineMap',
          text: '离线地图',
          url:
            location.origin +
            '/map-resource/map-resource/imagery/{z}/{y}/{x}.jpg',
          // url    : 'maps/m/{z}/{y}/{x}.png'
        },
        {
          img: 'img/xingzhengquyu.png',
          command: 'politicalMap',
          text: '行政区域图',
          url: tdtUrl + 'DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + token,
          // url    : 'maps/m/{z}/{y}/{x}.png'
        },
      ],
    }
  },
  components: {},
  computed: {
    ...mapState('map', ['gisEntities']),
  },
  watch: {},
  methods: {
    handlerImagery(command) {
      this.$store.commit('map/setMapType', command)
      window.mapType = command
      // this.gisEntities.forEach(e=>{
      //   const entity=gisvis.viewer.entities.getById(e.id)
      //   if(entity.ellipse){
      //     ellipse[e.id]=entity.ellipse
      //   }
      //   gisvis.viewer.entities.removeById(e.id)
      // })
      this.command = command
      //换地图先删掉之前的
      let index = this.imageryOptions.findIndex((i) => i.command === command)
      var layers = gisvis.viewer.imageryLayers
      var baseLayer = layers.get(0)
      layers.remove(baseLayer)
      layers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: this.imageryOptions[index].url,
          subdomains: subdomains,
          tilingScheme: new Cesium.WebMercatorTilingScheme(),
          maximumLevel: 18,
        })
      )
      //鹰眼图换肤
      // window.viewer1.imageryLayers.remove(gisvis.viewer.imageryLayers.get(0));
      // window.viewer1.imageryLayers.addImageryProvider(
      //   new Cesium.UrlTemplateImageryProvider({
      //     url: this.imageryOptions[index].url,
      //   })
      // );
      // gisvis.emitter.emit(EventType.RENDER_DATA,{entities:this.gisEntities,labelShow:true})
      //   Object.keys(ellipse).forEach(id=>{
      //   const entity= gisvis.viewer.entities.getById(e.id)
      //   if(entity){
      //     entity.ellipse=ellipse[id]
      //   }
      // })
      // gisvis.viewer.entities.values.forEach((e) => {
      //   e.label.fillColor = Cesium.Color.fromCssColorString(
      //     window.mapType === "satellite" ? "#ffffff" : "#000000"
      //   );
      //   e.label.outlineColor = Cesium.Color.fromCssColorString(
      //     window.mapType === "satellite" ? "#000000" : "#ffffff"
      //   );
      // });
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
.map-imagery {
  max-height: 385px;
  // 外层容器有padding，滚动调滚不到最顶或最底部，做些处理
  margin: -12px 0;
  padding: 8px 0;
  overflow: auto;

  .imagery-item {
    display: flex;
    align-items: center;
    padding: 7px 15px;
    cursor: pointer;

    img {
      display: inline-block;
      width: 110px;
      height: 60px;
      box-sizing: border-box;
      border: 1px solid #808080;
    }

    span {
      margin-left: 10px;
      user-select: none;
    }

    &:hover {
      background-color: #ffffff0a;
    }

    &.active {
      color: var(--color-primary);
      img {
        border: 1px solid var(--color-primary);
      }
    }
  }
}
</style>
