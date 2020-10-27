<template>
  <div id="map-switch"
       class="map-switch">
    <div>
      名称：<el-switch
        class="switch"
        v-model="label"
      ></el-switch>
    </div>
    <div>
      轨迹：<el-switch
        class="switch"
        v-model="track"
      >轨迹</el-switch>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name : 'MapSwitch',
  props: {

  },
  data () {
    return {
      label: true,
      track:true,
    }
  },
  components: {

  },
  computed: {
    ...mapState('map',['gisLabelShow','gisTrackShow'])
  },
  watch: {
    label(n){
      this.changeGisLabelShow(n)
      console.log("页面上的实体",gisvis.viewer.entities.values)
      if(n){
        gisvis.viewer.entities.values.forEach(n=>n.label.show = true)
      }else{
        gisvis.viewer.entities.values.forEach(n=>n.label.show = false)
      }
    },
    track(n){
      this.changeGisTrackShow(n)
    }
  },
  methods: {
    ...mapMutations('map',['changeGisLabelShow','changeGisTrackShow']),
  },
  mounted () {
    
  }
}
</script>

<style lang="scss" scoped>
.map-switch {
  max-height: 385px;
  // 外层容器有padding，滚动调滚不到最顶或最底部，做些处理
  margin: -12px 0;
  padding: 8px 0;
  overflow: auto;
  div{
    margin: 5px 0;
  }
}
  
</style>
