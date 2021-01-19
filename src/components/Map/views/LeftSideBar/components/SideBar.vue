<template>
  <div class="side-bar" :class="placement">
    <ul class="list">
      <li
        class="item"
        v-for="(item, index) in data"
        :key="index"
        :title="item.label"
        @click="handleClick(item)"
      >
        <i class="tip iconfont icon-triangle" v-show="item.tip"></i>
        <div v-if="item.name === 'relationship' || item.name === 'mark'" @click="open(item.name)">
          <i :class="item.icon" class="icon"></i>
        </div>
        <el-popover v-else :placement="item.placement" trigger="click" :disabled="!item.component">
          <component :is="item.component"></component>
          <i :class="item.icon" class="icon" slot="reference"></i>
        </el-popover>
      </li>
    </ul>
    <!-- 图表 -->
    <chart-view v-if="showChartView" :return-callback="onCloseChartView"></chart-view>
    <!-- 旧的分类 -->
    <!-- <MapSearchAdd
      v-if="setRelationship"
      @before-close="closeDialog"
    ></MapSearchAdd>-->
    <!-- 旧的标记 -->
    <!-- <el-dialog
      title="标记"
      class="dialog"
      :visible.sync="showMapMark"
      append-to-body
    >
      <div class="dialog-body">
        <MapMark @before-close="closeDialog"></MapMark>
      </div>
    </el-dialog>-->
    <!-- 新的标记 -->
    <GisInfoPanelAdd
      v-if="addEntityDialog"
      @before-close="closeDialog()"
      @cancel="closeDialog();deleteNewPoint()"
      :dialogTattle="dialogTitle"
      :entityInfo="entityInfo"
      ref="entityDialog"
      @changeEntity="saveEntityDialog"
    ></GisInfoPanelAdd>
    <!-- 关联关系 -->
    <Relationship
      v-if="setRelationship"
      @before-close="closeDialog"
      :dialogTattle="dialogTitle"
      :edge-info="edgeInfo"
      ref="relationship"
    ></Relationship>
  </div>
</template>

<script>
import { emitter, EventType } from '../../../src/EventEmitter'
import GisInfoPanelAdd from './GisInfoPanelAdd'
import Relationship from './Relationship'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import * as graphVerticesDetail from '@/services/graph-vertices-detail'
export default {
  computed: {
    ...mapState('graphInfo', ['id', 'graphType', 'name']),
    ...mapState('map', ['selectedVertices', 'gisLabelShow']),
  },
  components: {
    GisInfoPanelAdd,
    Relationship,
  },
  props: {
    placement: {
      type: String,
      default: 'left',
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
      showChartView: false,
      setRelationship: false,
      showMapMark: false,
      addEntityDialog: false,
      dialogTitle: '',
      entityInfo: {},
      edgeInfo: {},
    }
  },
  created() {
    emitter.on(EventType.CLICK_ENTITY, this.setSelectedEntity, this)
    emitter.on(EventType.EDIT_CLICK_ENTITY, this.editEntityDialog, this)
  },
  beforeDestroy() {
    emitter.off(EventType.CLICK_ENTITY, this.setSelectedEntity)
  },
  methods: {
    ...mapMutations('map', [
      'setallEntityBackEnd',
      'removeEntityBackEnd',
      'removeallEntityBackEnd',
    ]),
    setSelectedEntity(val) {
      console.log('左键实体', val)
      this.temEntity = val
      if (val.id.hasOwnProperty('entityId') && val.id.entityId === '') {
        this.entityInfo.longitude = val.id.properties.getValue().lng
        this.entityInfo.latitude = val.id.properties.getValue().lat
        setTimeout(() => {
          this.addEntityDialog = true
          this.dialogTitle = '新增实体'
        }, 2000)
      }
    },
    editEntityDialog(id) {
      this.addEntityDialog = true
      this.dialogTitle = '编辑实体'
      this.$nextTick(() => {
        this.$refs.entityDialog.editEntity(id)
      })
    },
    /**
     * 点击某一项
     */
    handleClick(item) {
      // this.$emit("click", item);
      if (item.label === '主页') {
        window.viewer.camera.flyHome()
      } else if (item.label === '清空所有') {
        this.removeallEntityBackEnd()
        gisvis.emitter.emit(EventType.CLICK_BLANK) //删除popper/contentmenu
        gisvis.emitter.emit(EventType.deleteAllBubbles) //删除拖拽气泡
        gisvis.emitter.emit(EventType.removeSelectEntityBox) //删除绿色选框
        gisvis.viewer.entities.removeAll()
        sessionStorage.setItem('bubbleBox', JSON.stringify(false))
        sessionStorage.setItem('checkSelectEntityBox', JSON.stringify(false))
      }
    },
    //打开标记或者关系
    async open(val) {
      if (val == 'relationship') {
        console.log('连续选择两项的数据', this.selectedVertices)
        if (this.selectedVertices.length == 2) {
          this.dialogTitle = '设置关系'
          this.setRelationship = true
        } else {
          this.$message.error('请连续选择两项')
        }
      } else {
        emitter.emit(EventType.CLICK_BLANK)
        emitter.emit(EventType.SET_MEASURE_TYPE, {
          group: '基地',
          groupCategory: '基地',
          groupType: '基地',
          image: 'images/facility.png',
          labelShow: this.gisLabelShow,
        })
        this.$message.success('已成功创建标记点')
        this.$store.state.map.isCover = true
      }
    },
    //val 代表ID ，entity代表返回的结果,新增需要重绘/修改不用
    saveEntityDialog({ val, state, entity }) {
      entity.properties.latitude = entity.properties.纬度
      entity.properties.longitude = entity.properties.经度
      if (state === -1) {
        gisvis.emitter.emit(EventType.CLICK_BLANK)
        gisvis.viewer.entities.removeById(this.temEntity.id.id)
        emitter.emit(EventType.POPPER_REMOVE)
        emitter.emit(EventType.RENDER_DATA, {
          entities: [entity],
          labelShow: this.gisLabelShow,
        })
      } else {
        //修改的时候重新生成分组数据,更改经纬度，名称等
        emitter.emit(EventType.CLICK_ENTITY, this.temEntity) //重新掉接口显示更改后的数据
        gisvis.viewer.entities.getById(this.temEntity.id.id).label.text =
          entity.name

        if (gisvis.popper) gisvis.popper.destroy() //先删除之前的，替换成新的名称
        //更改地图上显示的经纬度
        gisvis.viewer.entities.getById(
          this.temEntity.id.id
        ).position = Cesium.Cartesian3.fromDegrees(
          entity.properties.经度,
          entity.properties.纬度
        )
        //更改传给后端的经纬度
        ;(gisvis.viewer.entities.getById(this.temEntity.id.id).properties.lat =
          entity.properties.纬度),
          (gisvis.viewer.entities.getById(this.temEntity.id.id).properties.lng =
            entity.properties.经度),
          emitter.emit(EventType.POPPER_CREATE, {
            //更新poper
            position: this.temEntity.id.position.getValue(),
            name:
              (entity.properties.hasOwnProperty('name') &&
                entity.properties.name) ||
              entity.name,
            canMove: true,
            create: true,
          })
        emitter.emit(EventType.LEGEND_DATA_CHANGE, [entity])
      }
    },
    onCloseChartView() {
      this.showChartView = false
    },
    closeDialog() {
      this.setRelationship = false
      this.showMapMark = false
      this.addEntityDialog = false
    },
    //新增或者未知位置的取消才删除节点
    deleteNewPoint() {
      if (this.temEntity.id.newAdd) {
        gisvis.emitter.emit(EventType.CLICK_BLANK)
        gisvis.viewer.entities.removeById(this.temEntity.id.id)
      }
    },
    ...mapMutations('map', ['updateGisEntities', 'updateGisLines']),
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  .dialog-body {
    height: 60vh;
    position: relative;
  }
}
.side-bar {
  width: 3.58rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-top: 2px #383838 solid;
  box-shadow: var(--box-shadow);
  background-color: var(--background-color-panel);

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }
  .list {
    margin: 0;
    padding: 0;
    cursor: pointer;
    .item {
      position: relative;
      text-align: center;
      color: var(--color-text-regular);

      .icon {
        display: inline-block;
        font-size: 1.29rem;
        width: 100%;
        margin: 16px 0;
      }

      .tip {
        position: absolute;
        color: var(--color-text-regular);
        margin-top: 60%;
        display: inline-block;
        font-size: 10px;
        left: 60%;
      }
      &:hover {
        color: var(--color-text-primary);
      }
    }
  }
}
</style>
