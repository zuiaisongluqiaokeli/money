<template>
  <div class="left-side-bar">
    <div class="cover" v-show="$store.state.map.isCover"></div>
    <SideBar :data="listMap" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import SideBar from './components/SideBar'
import MapSceneMode from './components/MapSceneMode'
import MapImagery from './components/MapImagery'
import MapDelete from './components/MapDelete'
import MapClassifySearch from './components/MapClassifySearch'
import chartView from '../chartView'
import LegendShader from './components/LegendShader'
import Setting from './components/Setting'
import MapMark from './components/MapMark'
import MapSearchAdd from './components/MapSearchAdd'
import MapSwitch from './components/MapSwitch'
export default {
  name: 'LeftSideBar',
  components: {
    SideBar,
    MapImagery,
    MapSceneMode,
    MapDelete,
    chartView,
    Setting,
    MapSwitch,
    LegendShader,
    MapMark,
    MapSearchAdd,
  },

  data() {
    return {
      listMap: [
        {
          label: '主页',
          type: 'home',
          name: '',
          icon: 'iconfont icon-fanhuishouye',
        },
        {
          label: '地形',
          type: 'imagery',
          name: 'MapImagery',
          icon: 'iconfont icon-map',
          component: MapImagery,
          tip: false,
          placement: 'right-start',
        },
        // {
        //   label: "模式",
        //   type: "mode",
        //   name: "MapSceneMode",
        //   icon: "iconfont icon-information-attribute",
        //   component: MapSceneMode,
        //   tip: true,
        //   placement: "right-start"
        // },
        {
          label: '清空所有',
          type: 'delete',
          name: 'MapDelete',
          icon: 'iconfont icon-tool-delete-circle',
          component: '',
          tip: false,
          placement: 'right',
        },
        // 丐版,不配拥有这个功能
        // {
        //   label: "分类搜索",
        //   type: "classifySearch",
        //   name: "MapClassifySearch",
        //   icon: "iconfont icon-gaojisousuo",
        //   component: MapClassifySearch,
        //   tip: true,
        //   placement: "right"
        // },
        {
          label: '设置',
          type: 'switch',
          name: 'switch',
          icon: 'iconfont icon-home-tool',
          component: MapSwitch,
          tip: false,
          placement: 'right',
        },

        // {
        //   label: "图表配置",
        //   type: "chartOption",
        //   name: "chartView",
        //   icon: "iconfont icon-timeline",
        //   component: chartView,
        //   tip: false,
        //   placement: "right"
        // },
        {
          label: '标记',
          type: 'mark',
          name: 'mark',
          icon: 'el-icon-circle-plus-outline',
          component: MapMark,
          tip: false,
          placement: 'right',
        },
        {
          label: '设置关系',
          type: 'relationship',
          name: 'relationship',
          icon: 'iconfont icon-tool-link',
          component: MapSearchAdd,
          tip: false,
          placement: 'right',
        },
        {
          label: '规则展示',
          type: 'setting',
          name: 'setting',
          icon: 'iconfont icon-tool-setting',
          component: Setting,
          tip: false,
          placement: 'right',
        },
        // {
        //   label: '着色',
        //   type: 'LegendShader',
        //   name: 'LegendShader',
        //   icon: 'el-icon-magic-stick',
        //   component: LegendShader,
        //   tip: false,
        //   placement: 'right',
        // },
      ],
      drawerTitle: '',
      drawerVisible: false,
      componentVisible: false,
      drawerComponent: null,
      // component: null
    }
  },

  computed: {
    // ...mapGetters("3dMap", ["leftSideBarComponent"])
  },

  watch: {
    // leftSideBarComponent(newValue) {
    //   if (newValue) {
    //     const target = this.listMap.find(({ name }) => name === newValue);
    //     this.handleSideBarClick(target);
    //   }
    // }
  },

  methods: {
    /**
     * 点击某一项
     */
    // handleSideBarClick(item) {
    //   const { component, drawerComponent, label } = item;
    //   console.log(item)
    //   if(label === '清空'){
    //     console.log('清空')
    //     return gisvis.viewer.entities.removeAll()
    //   }
    //   if (component) {
    //     this.component = component;
    //     this.componentVisible = true;
    //   } else if (drawerComponent) {
    //     this.drawerTitle = label;
    //     this.drawerComponent = drawerComponent;
    //     this.drawerVisible = true;
    //   }
    // },
    /**
     * 关闭抽屉
     */
    closeDrawer() {
      this.drawerVisible = false
      this.drawerComponent = null
    },
    /**
     * 关闭组件
     */
    closeComponent() {
      this.componentVisible = false
      this.component = null
    },
    /**
     * 处理传来的关闭抽屉事件
     */
    handleDrawerBeforeClose() {
      this.closeDrawer()
    },
    /**
     * 处理组件传来的关闭事件
     */
    handleComponentBeforeClose() {
      this.closeComponent()
    },
  },
}
</script>

<style lang="scss" scoped>
.left-side-bar {
  height: calc(100vh - 3.58rem);
  position: fixed;
  top: 3.58rem;

  .title {
    color: #fafafa;
    font-size: 16px;
  }
  /deep/ .left-side-bar-drawer.drawer {
    top: 3.58rem;
  }
}
</style>

<style lang="scss" scoped>
.left-side-bar-drawer.drawer {
  &,
  *,
  *:focus {
    outline: none;
  }

  .el-drawer__body {
    position: relative;
  }
}
.cover {
  position: absolute;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
  height: 100%;
  filter: alpha(opacity=60);
  /*设置透明度为60%*/
  opacity: 0.6;
  /*非IE浏览器下设置透明度为60%*/
  display: block;
  z-index: 999;
}
</style>
