<template>
  <div class="typeExpand">
    <el-dialog
      title="按类型拓展"
      :close-on-click-modal="false"
      :visible="typeExpandShow"
      @close="closeModal"
      :modal-append-to-body="false"
      class="small-dialog"
    >
      <div class="content">
        <p>关系名称</p>
        <div class="checkBox">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <el-checkbox-group v-model="checkedTypes" @change="handleCheckedTypesChange">
            <el-checkbox
              v-for="type in menuTypes"
              :label="type.name"
              :title="type.title"
              @mouseenter.native="handleMouseEnter($event, type)"
              :key="type.name"
            >{{type.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button type="primary" @click="expand">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { emitter, EventType } from '../src/EventEmitter'
import { newExtendVertice, verticalLayer } from '@/assets/api/expand'
export default {
  data() {
    return {
      checkAll: false,
      checkedTypes: [],
      isIndeterminate: false,
      radioList: [
        '左上',
        '向上',
        '右上',
        '向右',
        '右下',
        '向下',
        '左下',
        '向左',
        '自由',
      ],
      radio: '自由',
    }
  },
  computed: {
    ...mapState('map', [
      'typeExpandShow',
      'gisRightSelectedEntity',
      'allEntityBackEnd',
    ]),
    ...mapState('canvasInfo', [
      'canvasType',
      'clusterCacheKey',
      'extendRecord',
    ]),
    ...mapState('map', {
      menuTypes: function (state) {
        return state.menuTypes.map((i) => {
          this.$set(i, 'title', '')
          return i
        })
      },
    }),
    ...mapState('userInfo', ['frontendConfig', 'expandFilter']),
  },
  watch: {
    typeExpandShow(n) {
      this.checkedTypes = []
      this.isIndeterminate = false
      this.menuTypes.forEach((v) =>
        this.expandFilter.relationType.includes(v.name)
          ? this.checkedTypes.push(v.name)
          : ''
      )
      if (this.checkedTypes.length) this.isIndeterminate = true
    },
  },
  methods: {
    handleMouseEnter(e, type) {
      let labelEle = e.target.lastChild
      if (labelEle.clientWidth < labelEle.scrollWidth) {
        type.title = type.name
      }
    },
    handleCheckAllChange(val) {
      this.checkedTypes = val ? this.menuTypes.map((v) => v.name) : []
      this.isIndeterminate = false
    },
    handleCheckedTypesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.menuTypes.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.menuTypes.length
    },
    // 拓展
    expand() {
      if (!this.checkedTypes.length)
        return this.$message.error({
          message: '至少选择一个关系进行拓展',
          duration: 1500,
        })
      //掉分析端的接口
      // sativis.vertice(this.vertice.id).root = true
      // sativis.getVertices().forEach((v) => (v.fixed = true))
      this.changeLoading(true)
      //掉分析端的接口
      // this.extendVertice({
      //   vertice: this.gisRightSelectedEntity,
      //   types: this.checkedTypes.join(','),
      //   type: 'type',
      //   subIds: this.allEntityBackEnd.map((v) => v.id).join(''),
      // })
      const vertice = this.gisRightSelectedEntity
      const types = this.checkedTypes.join(',')
      const subIds = this.allEntityBackEnd.map((v) => v.id).join(',')
      const rootState = this.$store.state
      let extendOpen = rootState.userInfo.frontendConfig.EXTEND_OPEN,
        extendSize = rootState.userInfo.frontendConfig.EXTEND_SIZE,
        time = {
          startTime: rootState.home.startTime,
          endTime: rootState.home.endTime,
        },
        extendRecord = this.extendRecord[vertice.id], //扩展记录
        count = (extendRecord && extendRecord.count) || 1,
        virtualFlag = false,
        virtualNum = rootState.userInfo.frontendConfig.VIRTUAL_NODE_NUMBER,
        graphName = rootState.graphInfo.name,
        expandFilter = {
          relationType: null,
          relationWeight: null,
          dimension: null,
          timeFilter: null,
          all: types,
        }
      let id = vertice.id,
        level = vertice.level || 0
      let virtualCount = 1
      const clusterCacheKey = new Date().getTime()
      newExtendVertice(
        extendSize,
        extendOpen,
        count,
        id,
        time.startTime,
        time.endTime,
        virtualFlag,
        virtualNum,
        clusterCacheKey,
        level,
        subIds,
        types,
        virtualCount,
        graphName,
        JSON.stringify(expandFilter)
      ).then((res) => {
        // this.$store.commit("home/changeLoading", false);
        this.changeLoading(false)
        if (res.data.success) {
          if (res.data.object) {
            let result = res.data.object
            // let entities = result.vertices.filter((v) => {
            //   return !this.gisEntityIds.includes(v.id);
            // });
            // this.updateGisEntities(
            //   [].concat(entities, this.gisEntities)
            // );
            // let lines = result.edges.filter((e) => {
            //   return !this.gisLinesIds.includes(e.id);
            // });
            // console.log(lines);
            // this.updateGisLines([].concat(lines, this.gisLines));
            result.vertices.forEach((item) => {
              item.id = Number(item.id) //有的是字符串的达不到去重的效果
              if (
                item.properties.hasOwnProperty('经度') &&
                item.properties.经度
              ) {
                item.properties.longitude = item.properties.经度 //绘图用
                item.properties.latitude = item.properties.纬度
              } else if (
                item.properties.hasOwnProperty('longitude') &&
                item.properties.longitude
              ) {
                item.properties.longitude = item.properties.longitude //绘图用
                item.properties.latitude = item.properties.latitude
              } else {
                item.properties.longitude = undefined
                item.properties.latitude = undefined
              }
              if (
                (item.properties.hasOwnProperty('分类名称') &&
                  item.properties.分类名称) ||
                (item.properties.hasOwnProperty('实体分类') &&
                  item.properties.实体分类)
              ) {
                item.properties.实体分类 =
                  (item.properties.hasOwnProperty('实体分类') &&
                    item.properties.实体分类) ||
                  (item.properties.hasOwnProperty('分类名称') &&
                    item.properties.分类名称)
              } else {
                item.properties.实体分类 = '暂未分类'
              }
            })
            //去处当前被扩展点
            result.vertices = result.vertices.filter(
              (item) => item.id != vertice.id
            )
            let gisData = {
              entities: result.vertices,
              labelShow: this.gisLabelShow,
            }
            gisvis.emitter.emit('gis-render-data', gisData)
            this.$message.success({ message: '扩展成功' })
            gisvis.emitter.emit(EventType.LEGEND_DATA_CHANGE, [])
            this.changeGisRightSelectedEntity(null)
            //对数据划分哪个是起点哪个是终点,如果有关系就不再二次加关系
            let arrIds = []
            arrIds = gisvis.viewer.entities.values
              .filter((ele) => {
                let id = ele.id.toString()
                return id.split(',').length > 1
              })
              .map((item) => item.id)
            arrIds.push('001,0002') //给个初始值为了循环
            let center = {}
            let points = []
            //对扩展的数据过滤出来有经纬度的才画线
            result.vertices = result.vertices.filter(
              (item) => item.properties.latitude
            )
            result.vertices.forEach((element) => {
              if (
                arrIds.every(
                  (item) =>
                    item
                      .split(',')
                      .filter((ele) =>
                        [vertice.id, element.id].some(
                          (valueId) => ele == valueId
                        )
                      ).length != 2
                )
              ) {
                center = {
                  id: vertice.id,
                  lon: Number(vertice.properties.lng.getValue()),
                  lat: Number(vertice.properties.lat.getValue()),
                  size: 5,
                  color: Cesium.Color.YELLOW,
                }
                points.push({
                  id: element.id,
                  lon: Number(element.properties.longitude),
                  lat: Number(element.properties.latitude),
                  size: 5,
                  color: Cesium.Color.YELLOW,
                })
              }
            })
            gisvis.emitter.emit(EventType.CREATE_Fly_LINES_MANY, {
              center,
              points,
            })
          } else {
            this.$message.success({ message: '无拓展结果' })
          }
        } else {
          this.$message.error({
            message: res.data.msg || res.data.errorMsg || '拓展失败',
            duration: 1500,
          })
        }
      })
      this.closeModal()
      gisvis.emitter.emit(EventType.POPPER_SHOW)
    },
    // 关闭
    closeModal() {
      this.radio = '自由'
      this.checkAll = false
      this.isIndeterminate = true
      this.changeTypeExpandShow(false)
    },
    ...mapMutations('map', [
      'changeTypeExpandShow',
      'changeGisRightSelectedEntity',
    ]),
    ...mapMutations('home', ['changeLoading']),
    ...mapActions('canvasInfo', ['extendVertice']),
  },
}
</script>
<style lang="sass" scope>
.typeExpand
  .content
    p
      font-size: var(--smallFontSize)
    p:first-child
      margin-top: 0
    .checkBox
      margin-left: 1rem
</style>
<style>
.typeExpand .el-checkbox,
.typeExpand .el-radio {
  margin-right: 0;
  margin-bottom: 0.5rem;
  width: 33.33333%;
}
</style>
<style lang="scss" scope>
.typeExpand {
  /deep/ .el-dialog {
    .el-dialog__body {
      display: block !important;
    }
  }

  /deep/ .el-checkbox__input {
    line-height: 1.4;
  }

  /deep/ .el-checkbox__label {
    overflow: hidden;
    white-space: nowrap;
    width: calc(100% - 10px);
    text-overflow: ellipsis;
    line-height: 1;
  }
}
</style>
