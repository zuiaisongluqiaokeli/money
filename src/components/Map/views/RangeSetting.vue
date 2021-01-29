<template>
  <div class="RangeSetting">
    <el-dialog
      title="距离搜索"
      visible
      width="660px"
      :modal="false"
      :before-close="close"
      :close-on-click-modal="false"
    >
      <el-form label-width="80px" :model="verticeFilter" :rules="rules" ref="dialogForm">
        <el-form-item label="距离" prop="range">
          <el-input v-model="verticeFilter.range" placeholder="请输入距离" style="width:160px"></el-input>
          <span style="margin-left: 10px">公里</span>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="verticeFilter.labels"
            style="width:160px"
            clearable
            multiple
            filterable
            allow-create
            placeholder="请选择标签"
          >
            <el-option v-for="model in allLabels" :key="model" :label="model" :value="model"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in verticeFilter.props"
          :key="index"
          :label="index === 0 ? '属性' : ''"
        >
          <el-select
            v-model="item.key"
            allow-create
            filterable
            style="width:160px;margin-right:10px;"
            placeholder="请选择属性"
            class="select-input"
          >
            <el-option v-for="item in allProperties" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select
            v-model="item.operation"
            :popper-append-to-body="false"
            style="width:160px;margin-right:10px;"
            placeholder="请选择操作符"
            class="select-input"
          >
            <el-option
              v-for="item in relPropList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.value"
            placement="top"
            :disabled="item.value.length<10"
          >
            <el-input
              v-model="item.value"
              v-show="item.operation!=null"
              class="select-input"
              placeholder="请输入内容"
              style="width:160px"
            ></el-input>
          </el-tooltip>
          <el-button
            type="text"
            icon="el-icon-close"
            class="danger"
            v-show="verticeFilter.props.length > 1"
            @click="deletItem(index)"
          ></el-button>
          <el-button
            type="text"
            icon="el-icon-plus"
            v-show="index + 1 === verticeFilter.props.length"
            @click="addItem()"
          ></el-button>
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
      rules: {
        range: [
          { required: true, message: '请输入距离', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
      relPropList: [
        { label: '等于', value: '=' },
        { label: '大于', value: '>' },
        { label: '小于', value: '<' },
        { label: '不等于', value: '<>' },
        { label: '大于等于', value: '>=' },
        { label: '小于等于', value: '<=' },
        { label: '模糊等于', value: null },
        { label: '空值', value: null },
        { label: '存在', value: null },
        { label: '不存在', value: null },
      ], // 筛选关系

      verticeFilter: {
        range: '100',
        labels: [], // 标签
        props: [
          // 属性
          {
            key: '', // 属性名
            operation: '', // 关系
            value: '', // 结果名
          },
        ],
      },
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
    ...mapGetters('map', ['allLabels', 'gisEntityIds', 'allProperties']),
  },
  methods: {
    ...mapMutations('map', [
      'setRangeSetting',
      'updateGisEntities',
      'setAttackShow',
      'changeGisRightSelectedEntity',
    ]),
    ...mapMutations('home', ['changeLoading']),
    // 实体搜索添加属性
    addItem() {
      this.verticeFilter.props.push({
        key: '', // 属性名
        operation: '', // 关系
        value: '', // 结果名
      })
    },
    deletItem(index) {
      this.verticeFilter.props.splice(index, 1)
    },
    //过滤条件
    getFilters(vertices, filters) {
      let verticeByLabel = []
      if (filters.labels.length) {
        verticeByLabel = vertices.filter((v) =>
          filters.labels.some((l) => v.labels.includes(l))
        )
      }
      let length = filters.props.length
      if (filters.props[0].key == '') return vertices
      let verticeByProp = vertices.filter((vertice) => {
        let flag = false

        for (let i = 0; i < length; i++) {
          let p = filters.props[i]

          if (vertice.properties[p.key] === undefined) continue

          switch (p.operation) {
            case '=':
              flag = vertice.properties[p.key] + '' === p.value
              break
            case '<':
              flag = vertice.properties[p.key] < +p.value
              break
            case '>':
              flag = vertice.properties[p.key] > +p.value
              break
            case '<>':
              flag = vertice.properties[p.key] + '' !== p.value
              break
          }
          if (flag) break
        }
        return flag
      })
      return Array.from(new Set(verticeByLabel.concat(verticeByProp)))
    },
    async dialogSave() {
      let flag = await new Promise((resolve) =>
        this.$refs.dialogForm.validate(resolve)
      )
      if (!flag) return
      //这种会漂移
      // gisvis.emitter.emit(EventType.SCOPE_SEARCH, {
      //   lon: this.gisRightSelectedEntity.properties.lng.getValue(),
      //   lat: this.gisRightSelectedEntity.properties.lat.getValue(), //纬度
      //   r: Number(this.range),
      //   scanColor: Cesium.Color.GREEN,
      //   interval: 4000, //时间
      //   name: this.gisRightSelectedEntity.id.toString(), //标识名字有问题
      // })
      // console.log(viewer.scene.postProcessStages)
      gisvis.emitter.emit(EventType.RADAR_RENDER, {
        id: this.gisRightSelectedEntity.id,
        range: this.verticeFilter.range,
      })
      let vertices = this.allEntityBackEnd.filter(
        (e) => e.id.toString() === this.gisRightSelectedEntity.id.toString()
      )
      let vertex = vertices[0]
      setTimeout(() => {
        this.$api
          .getGisExpand(
            this.graphName,
            vertex,
            this.verticeFilter.range,
            this.verticeFilter.labels
          )
          .then((res) => {
            if (res.data.success) {
              let result = res.data.object
              if (result && result.vertices.length) {
                //找到的实体要满足这个条件的
                let entities = this.getFilters(
                  result.vertices,
                  this.verticeFilter
                )
                entities.forEach((item) => {
                  item.id = Number(item.id)
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
                //放入VUEX重新分组+批量去重绘制
                let gisData = {
                  entities: entities,
                  labelShow: this.gisLabelShow,
                }
                gisvis.emitter.emit('gis-render-data', gisData)
              } else {
                this.$message.success({ message: '无搜索结果' })
              }
            } else {
              this.$message.error({
                message: res.data.msg || res.data.errorMsg || '搜索失败',
                duration: 1500,
              })
            }
            gisvis.viewer.entities.getById(
              this.gisRightSelectedEntity.id
            ).ellipse = null
          })
      }, 3000)

      this.close()
      //弹窗消失才打开气泡，不然会导致弹窗和气泡一起出现的情况
      gisvis.emitter.emit(EventType.POPPER_SHOW)
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
}
</style>

<style lang="scss" scoped>
.tool-tag {
  max-height: 426px;
  margin: -12px 0;
  padding: 12px 0;

  .body {
    width: 500px;
    margin: 0 10px;

    .main-box {
      .tab-content {
        .select-input + .select-input {
          margin-left: 16px;
        }

        .select-input ~ button {
          margin-left: 16px;
        }

        .select-input {
          width: 114px;

          &.el-checkbox {
            width: initial;
          }
        }

        .danger {
          color: var(--color-danger);
        }

        .set {
          padding-top: 10px;
          border-top: 1px solid var(--border-color-base);
        }

        .el-select {
          &.name {
            width: 100%;
          }
        }
        .icon-select,
        .color-select {
          display: flex;
          align-items: center;
          img,
          .color {
            width: 30px;
            height: 30px;
            margin-left: 10px;
          }
        }
        .range-setting {
          .range-item {
            margin-top: 10px;
            display: flex;
          }
          .range-input {
            width: 200px;
            margin-right: 20px;
          }
          .color {
            width: 30px;
            height: 30px;
            margin-left: 10px;
          }
        }
      }
    }

    /deep/ .popper__arrow {
      display: none;
    }

    /deep/ .show-btn {
      margin-right: 10px;
      text-align: right;
      .reset {
        float: left;
      }
    }

    .active {
      color: var(--color-text-primary) !important;
    }
  }

  /deep/ .el-select .el-tag.el-tag--info {
    color: #fafafa;
  }
  /deep/ .RangeSetting .el-form-item {
    margin-bottom: 18px;
  }
  /deep/ input::-webkit-input-placeholder {
    color: var(--color-text-placeholder);
    font-size: var(--font-size-extra-small);
  }

  /deep/ input:-moz-placeholder {
    color: var(--color-text-placeholder);
    font-size: var(--font-size-extra-small);
  }

  /deep/ input::placeholder {
    color: var(--color-text-placeholder);
    font-size: var(--font-size-extra-small);
    // padding: 4px;
    // background-color: #2b2b2b5e;
  }

  /deep/ input:-ms-input-placeholder {
    color: var(--color-text-placeholder);
    font-size: var(--font-size-extra-small);
  }
}
</style>
