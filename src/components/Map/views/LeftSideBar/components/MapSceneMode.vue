<template>
  <div id="map-scene-mode"
       class="map-scene-mode">
    <div class="scene-mode-item"
      :class="{'active': command === item.command}"
      v-for="item in modeOptions"
      :key="item.text"
      @click="handlerMode(item.command)">
      <img :src="item.img" alt="">
      <span>{{item.text}}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name : 'MapImagery',
  props: {

  },
  data () {
    return {
      command    : "3d",
      modeOptions: [{
        img    : 'img/3d.png',
        command: '3d',
        text   : '3维地图'
      }, {
        img    : 'img/2d.png',
        command: '2d',
        text   : '2维地图'
      },{
        img    : 'img/columbus.png',
        command: '2.5d',
        text   : '哥伦布视图'
      }]
      
    }
  },
  components: {

  },
  computed: {
    ...mapState('map',['sceneMode'])
  },
  watch: {
    sceneMode(n) {
      if (n !== this.command) {
        this.handlerMode(n)
      }
    }
  },
  methods: {
    handlerMode (command) {
      this.changeSceneMode(command)
      this.command = command
      switch (command){
        case '3d':
          viewer.scene.morphTo3D(1)
          break
        case '2d':
          viewer.scene.morphTo2D(1)
          break
        case '2.5d':
          viewer.scene.morphToColumbusView(1)
          break
      }
    },
    ...mapMutations("map",["changeSceneMode"])
  },
  mounted () {
    this.command = this.sceneMode
  }
}
</script>

<style lang="scss" scoped>
.map-scene-mode {
  max-height: 385px;
  // 外层容器有padding，滚动调滚不到最顶或最底部，做些处理
  margin: -12px 0;
  padding: 8px 0;
  overflow: auto;

  .scene-mode-item {
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
