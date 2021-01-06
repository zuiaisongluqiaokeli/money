<template>
  <div class="RangeSetting">
    <el-dialog title="设置范围" visible width="400px" :modal="false" :before-close="close">
      <el-form label-width="80px">
        <el-form-item label="范围">
          <el-input-number
            v-model="range"
            :controls="false"
            style="width:200px"
            placeholder="请输入范围"
          ></el-input-number>
          <span style="margin-left: 10px">公里</span>
        </el-form-item>
      </el-form>
      <div class="footer" slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="dialogSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import { emitter, EventType } from '../src/EventEmitter'
import PrimitiveTriangles from '../src/PrimitiveTriangles.js'
export default {
  name: 'RangeSetting',
  props: {
    close: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      range: 1000,
      labels: [],
      keyword: '',
    }
  },
  computed: {
    ...mapState('map', [
      'rangeSetting',
      'gisRightSelectedEntity',
      'gisEntities',
      'allEntityBackEnd',
      'gisLabelShow',
    ]),
    ...mapGetters('graphInfo', ['graphName']),
    ...mapGetters('map', ['allLabels', 'gisEntityIds']),
  },
  methods: {
    ...mapMutations('map', [
      'setRangeSetting',
      'updateGisEntities',
      'setAttackShow',
      'changeGisRightSelectedEntity',
    ]),
    ...mapMutations('home', ['changeLoading']),
    dialogSave() {
      gisvis.emitter.emit(EventType.POPPER_SHOW)
      gisvis.emitter.emit(EventType.SCOPE_SEARCH, {
        lon: this.gisRightSelectedEntity.properties.lng.getValue(),
        lat: this.gisRightSelectedEntity.properties.lat.getValue(), //纬度
        r: Number(this.range),
        scanColor: Cesium.Color.GREEN,
        interval: 4000, //时间
        name: this.gisRightSelectedEntity.id.toString(), //标识名字有问题
      })
      //请求接口搜索后销毁
      setTimeout(() => {
        gisvis.viewer.scene.postProcessStages.removeAll()
      }, 6000)

      //let primitiveTriangles = null
      //画立体扇形
      /*
        @center 中心点
        @radius 半径
        @rotate 旋转角度（正东为0，顺时针为正方向）
        @angle 扇形角度
        */
      // function drawSector(center, radius, rotate, angle) {
      //   let vertex = []
      //   let ellipsoid = viewer.scene.globe.ellipsoid
      //   if (angle > 180) angle = 180
      //   for (let i = 0; i < angle; i++) {
      //     if (i >= 90) {
      //       let bx = (-radius / 111201) * Math.cos((i * Math.PI) / 180)
      //       let bz = radius * Math.sin((i * Math.PI) / 180)
      //       let bxx = bx * Math.cos((rotate * Math.PI) / 180)
      //       let byy = bx * Math.sin((rotate * Math.PI) / 180)
      //       let tx = (-radius / 111201) * Math.cos(((i + 1) * Math.PI) / 180)
      //       let tz = radius * Math.sin(((i + 1) * Math.PI) / 180)
      //       let txx = tx * Math.cos((rotate * Math.PI) / 180)
      //       let tyy = tx * Math.sin((rotate * Math.PI) / 180)
      //       vertex.push(Cesium.Cartesian3.fromDegrees(center.x, center.y, 0))
      //       vertex.push(
      //         Cesium.Cartesian3.fromDegrees(center.x - bxx, center.y - byy, bz)
      //       )
      //       vertex.push(
      //         Cesium.Cartesian3.fromDegrees(center.x - txx, center.y - tyy, tz)
      //       )
      //     } else {
      //       let bx = (radius / 111201) * Math.cos((i * Math.PI) / 180)
      //       let bz = radius * Math.sin((i * Math.PI) / 180)
      //       let bxx = bx * Math.cos((rotate * Math.PI) / 180)
      //       let byy = bx * Math.sin((rotate * Math.PI) / 180)
      //       let tx = (radius / 111201) * Math.cos(((i + 1) * Math.PI) / 180)
      //       let tz = radius * Math.sin(((i + 1) * Math.PI) / 180)
      //       let txx = tx * Math.cos((rotate * Math.PI) / 180)
      //       let tyy = tx * Math.sin((rotate * Math.PI) / 180)
      //       vertex.push(Cesium.Cartesian3.fromDegrees(center.x, center.y, 0))
      //       vertex.push(
      //         Cesium.Cartesian3.fromDegrees(center.x + bxx, center.y + byy, bz)
      //       )
      //       vertex.push(
      //         Cesium.Cartesian3.fromDegrees(center.x + txx, center.y + tyy, tz)
      //       )
      //     }
      //   }
      //   if (!primitiveTriangles) {
      //     primitiveTriangles = new PrimitiveTriangles({
      //       viewer: viewer,
      //       Cartesians: vertex,
      //       Colors: [0, 1, 1, 0.5, 0, 0, 1, 0.5, 0, 1, 1, 0.5],
      //     })
      //   } else {
      //     primitiveTriangles.updateCartesianPositionColor(vertex, [
      //       0,
      //       1,
      //       1,
      //       0.5,
      //       0,
      //       0,
      //       1,
      //       0.5,
      //       0,
      //       1,
      //       1,
      //       0.5,
      //     ])
      //   }
      // }

      // let index = 0
      // var timeId = setInterval(() => {
      //   if (index > 360) {
      //     index = 0
      //   }
      //   drawSector(
      //     {
      //       x: Number(gisvis.popper.instance.position.left.split('px')[0]),
      //       y: Number(gisvis.popper.instance.position.top.split('px')[0]),
      //     },
      //     1000000,
      //     index,
      //     45
      //   )
      //   index += 10
      // }, 50)

      // setTimeout(() => {
      //   this.$api
      //     .getGisExpand(
      //       this.graphName,
      //       this.gisRightSelectedEntity.id,
      //       this.range,
      //       []
      //     )
      //     .then((res) => {
      //       if (res.data.success) {
      //         if (res.data.object) {
      //           let result = res.data.object
      //           //找余下的
      //           let entities = result.vertices.filter((v) => {
      //             return !this.allEntityBackEnd
      //               .map((item) => item.id)
      //               .includes(v.id)
      //           })
      //           if (entities.length) {
      //             result.vertices.forEach((item) => {
      //               item.properties.latitude = item.properties.纬度
      //               item.properties.longitude = item.properties.经度
      //             })
      //             let gisData = {
      //               entities: result.vertices,
      //               labelShow: true,
      //             }
      //             gisvis.emitter.emit('gis-render-data', gisData)
      //           } else {
      //             gisvis.viewer.entities.removeById('marsRadarScan')
      //             this.$message.success({ message: '无搜索结果' })
      //           }
      //         } else {
      //           gisvis.viewer.entities.removeById('marsRadarScan')
      //           this.$message.success({ message: '无搜索结果' })
      //         }
      //       } else {
      //         gisvis.viewer.entities.removeById('marsRadarScan')
      //         this.$message.error({
      //           message: res.data.msg || res.data.errorMsg || '搜索失败',
      //           duration: 1500,
      //         })
      //       }
      //       window.clearInterval(timeId)
      //     })
      //     .catch(() => {
      //       gisvis.viewer.entities.removeById('marsRadarScan')
      //       this.$message.error({
      //         message: '服务端异常，请联系管理员',
      //         duration: 1500,
      //       })
      //       window.clearInterval(timeId)
      //     })
      // }, 1000)
      if (gisvis.contextMenu) {
        gisvis.contextMenu.destroy()
        gisvis.contextMenu = null
      }
      this.close()
    },
  },
}
</script>

<style scoped lang="scss">
.RangeSetting {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;

  .footer {
    text-align: right;
  }

  /deep/ .el-dialog {
    min-height: 150px;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
</style>
