<template>
  <div class="tool-tag">
    <div class="body">
      <div class="main-box">
        <div class="tab-content">
          <el-form ref="form" label-width="120px" style="max-height: 218px;overflow-y: scroll;">
            <!-- <el-form-item label="融合显示范围">
              <el-switch class="switch" v-model="form.changeRange"></el-switch>
            </el-form-item>-->
            <el-form-item
              v-for="(item, index) in form.verticeFilter"
              :key="index"
              :label="index === 0 ? '显示范围' : ''"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.key"
                placement="top"
                :disabled="item.key.length<=5"
              >
                <el-select
                  v-model="item.key"
                  :popper-append-to-body="false"
                  allow-create
                  filterable
                  placeholder="请选择属性"
                  class="select-input"
                >
                  <el-option
                    v-for="(ele,i) in allProperties"
                    :key="i"
                    :label="ele.name"
                    :value="ele.name"
                  ></el-option>
                </el-select>
              </el-tooltip>
              <el-color-picker v-model="item.color" show-alpha :predefine="predefineColors"></el-color-picker>
              <el-button
                type="text"
                icon="el-icon-close"
                class="danger"
                v-show="form.verticeFilter.length > 1"
                @click="deletItem(index)"
              ></el-button>
              <el-button
                type="text"
                icon="el-icon-plus"
                v-show="index + 1 === form.verticeFilter.length"
                @click="addItem()"
              ></el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer" slot="footer">
        <el-button type="primary" @click="saveInfo()" size="small">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import * as propManagement from '@/services/props-management'
import { emitter, EventType } from '../../../src/EventEmitter'
export default {
  name: 'Setting',
  data() {
    return {
      form: {
        changeRange: false,
        verticeFilter: [
          {
            key: '', // 属性名
            color: '#ffcc33',
          },
        ],
      },
      reset: false,
      allProperties: [],
      predefineColors: [
        '#FFFFFF',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
      ],
    }
  },
  components: {},
  computed: {
    ...mapState('map', ['allEntityBackEnd']),
    ...mapGetters('map', ['allLabels']),
    ...mapState('graphInfo', ['id', 'graphType']),
  },
  watch: {
    id(val) {
      this.getCategory(this.id)
    },
  },
  methods: {
    ...mapMutations('canvasInfo', ['setClearTag']),
    ...mapActions('canvasInfo', ['revertCanvas']),
    ...mapMutations('map', ['updateInitTack']),
    async getCategory(graphId) {
      // this.treeData = [];
      const res = await propManagement.attributePageQuery(graphId, 1, 200, '')
      this.allProperties = res.data.content
    },
    // 实体搜索添加属性
    addItem(natureIndex, index) {
      this.form.verticeFilter.push({
        key: '', // 属性名
        color: '#ffcc33',
      })
    },
    deletItem(index) {
      this.form.verticeFilter.splice(index, 1)
    },
    saveInfo() {
      //过滤出来所有实体数据中满足条件的值并设置他的颜色(有可能是同一个对象更改同时更改了并且不能用浅拷贝)
      let arr = []
      gisvis.viewer.entities.values.forEach((item) => {
        this.form.verticeFilter.forEach((element) => {
          if (
            item.properties &&
            item.properties.properties.getValue()[element.key]
          ) {
            arr.push({
              info: item,
              color: element.color,
              showProperty: element.key,
              sortOrder: Number(
                item.properties.properties.getValue()[element.key]
              ),
            })
          }
        })
      })
      console.log('显示范围选中的数据', arr)
      //每次删除之前的设置范围
      let deleteArr = []
      gisvis.viewer.entities.values.forEach((ele) => {
        let id = ele.id.toString()
        if (
          id.split(',').length > 1 &&
          ele.id.split(',').includes('显示范围')
        ) {
          deleteArr.push(ele)
        }
      })
      deleteArr.forEach((item) => {
        gisvis.viewer.entities.removeById(item.id)
      })
      //按照半径从大到小排序展示出来
      arr.sort((a, b) => {
        return b.sortOrder - a.sortOrder
      })
      //更新左侧面板的样式状态 (找到对应的并且有该属性并且值是数字的并且按钮是显示的状态)
      arr.forEach(({ info: item, color, showProperty }, index) => {
        this.allEntityBackEnd.forEach((ele) => {
          if (
            ele.id == item.id &&
            item.properties.properties.getValue()[showProperty] &&
            !isNaN(
              parseInt(item.properties.properties.getValue()[showProperty])
            ) &&
            ele.visible
          ) {
            ele.attackRange = true
            gisvis.viewer.entities.getById(ele.id).show = true
            //伪造ID显示范围圈
            gisvis.viewer.entities.add({
              id: '显示范围' + ',' + item.id + ',' + index,
              position: Cesium.Cartesian3.fromDegrees(
                Number(item.properties.properties.getValue().longitude),
                Number(item.properties.properties.getValue().latitude),
                10
              ),
              ellipse: {
                show: true,
                semiMajorAxis: Number(
                  item.properties.properties.getValue()[showProperty]
                ),
                semiMinorAxis: Number(
                  item.properties.properties.getValue()[showProperty]
                ),
                material: Cesium.Color.fromCssColorString(color),
                outline: true,
                outlineColor: Cesium.Color.fromCssColorString(color),
                height: index,
                outlineWidth: 15,
              },
            })
          }
        })
      })
      gisvis.emitter.emit(EventType.LEGEND_DATA_CHANGE, [])
      emitter.emit(EventType.deleteAllLabelPopper) //删除所有的标签
      //创建标签显示半径字段
      arr.forEach(({ info: item, showProperty }, index, Arr) => {
        let targetArr = Arr.filter(({ info: ele }) => ele.id == item.id)
        if (targetArr.length > 1) {
          let nameString = targetArr
            .map(
              ({ info: ele, showProperty: eachProperty }) =>
                eachProperty +
                ':' +
                ele.properties.properties.getValue()[eachProperty]
            )
            .join()
          emitter.emit(EventType.LABEL_CREATE, {
            position: item.position.getValue(),
            name: nameString,
            id: targetArr[0].info.id,
          })
        } else {
          emitter.emit(EventType.LABEL_CREATE, {
            position: item.position.getValue(),
            name:
              showProperty +
              ':' +
              item.properties.properties.getValue()[showProperty],
            id: item.id,
          })
        }
      })
      document.getElementById('mapMap').click()
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item {
  margin-bottom: 12px;
}
/deep/ .el-form-item__content {
  display: flex;
  align-items: center;
}
/deep/ .el-switch {
  height: 34px;
}
/deep/ .el-color-picker {
  height: 30px;
  margin-left: 10px;
}
/deep/ .el-color-picker__trigger {
  height: 30px;
  width: 30px;
}
.tool-tag {
  max-height: 426px;
  margin: -12px 0;
  padding: 12px 0;

  .body {
    width: 345px;
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
.dialog-footer {
  float: right;
  margin: 20px;
  bottom: 0;
}
.footer {
  text-align: right;
}
</style>
