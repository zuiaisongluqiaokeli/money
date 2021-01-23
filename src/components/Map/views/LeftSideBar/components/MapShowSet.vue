<template>
  <div class="tool-tag">
    <div class="body">
      <div class="main-box">
        <div class="tab-content">
          <el-form ref="form" label-width="120px">
            <el-form-item label="融合显示范围">
              <el-switch class="switch" v-model="form.changeRange"></el-switch>
            </el-form-item>
            <el-form-item
              v-for="(item, index) in form.verticeFilter"
              :key="index"
              :label="index === 0 ? '显示范围' : ''"
            >
              <el-select
                v-model="item.key"
                :popper-append-to-body="false"
                allow-create
                filterable
                placeholder="请选择属性"
                class="select-input"
              >
                <el-option v-for="(ele,i) in allProperties" :key="i" :label="ele" :value="ele"></el-option>
              </el-select>
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
    ...mapGetters('map', ['allLabels', 'allProperties']),
  },

  methods: {
    ...mapMutations('canvasInfo', ['setClearTag']),
    ...mapActions('canvasInfo', ['revertCanvas']),
    ...mapMutations('map', ['updateInitTack']),
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
      //过滤出来所有实体数据中满足条件的值并设置他的颜色
      let arr = []
      this.allEntityBackEnd.forEach((item) => {
        this.form.verticeFilter.forEach((element) => {
          if (Object.keys(item.properties).includes(element.key)) {
            item.color = element.color
            arr.push(item)
          }
        })
      })
      if (this.form.changeRange) {
        arr.forEach((item) => {
          if (gisvis.viewer.entities.getById(item.id).ellipse) {
            gisvis.viewer.entities.getById(
              item.id
            ).ellipse.material = Cesium.Color.fromCssColorString(
              item.color
            ).withAlpha(1)
            gisvis.viewer.entities.getById(item.id).ellipse.outline = false
          } else {
            gisvis.viewer.entities.getById(item.id).ellipse = {
              show: true,
              semiMajorAxis: 250 * 1000,
              semiMinorAxis: 250 * 1000,
              material: Cesium.Color.fromCssColorString(item.color).withAlpha(
                1
              ),
              outline: false,
            }
          }
        })
      } else {
        arr.forEach((item) => {
          if (gisvis.viewer.entities.getById(item.id).ellipse) {
            gisvis.viewer.entities.getById(
              item.id
            ).ellipse.material = Cesium.Color.fromCssColorString(
              item.color
            ).withAlpha(0.08)
            gisvis.viewer.entities.getById(
              item.id
            ).ellipse.outlineColor = Cesium.Color.fromCssColorString(
              item.color
            ).withAlpha(1)
          } else {
            let params = {
              entities: [{ id: item.id }],
              radius: 250,
              areaProperty: null,
              color: item.color,
            }
            gisvis.emitter.emit('gis-scope-render', params)
          }
        })
      }
      //是否范围融合
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
