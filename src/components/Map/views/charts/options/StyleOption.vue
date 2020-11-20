<template>
  <div class="StyleOption">
    <el-divider content-position="center">{{collapseTitle}}</el-divider>
    <div style="padding: 0 20px">
      <el-form :label-width="labelWidth">
        <el-form-item v-if="isNotNullOrUndefined(styles.fontSize)" label="字体大小">
          <el-input-number v-model="styles.fontSize" :min="1"
                           @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item v-if="isNotNullOrUndefined(styles.lineHeight)" label="文字行高">
          <el-input-number v-model="styles.lineHeight" :min="1"
                           @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item v-if="isNotNullOrUndefined(styles.fontWeight)" label="字体粗细">
          <el-input-number v-model="styles.fontWeight" :min="1"
                           @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item v-if="isNotNullOrUndefined(styles.textAlign)" label="对齐方式">
          <el-radio-group v-model="styles.textAlign" @change="updateConfig" size="small">
            <el-radio-button label="right">左</el-radio-button>
            <el-radio-button label="center">中</el-radio-button>
            <el-radio-button label="left">右</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isNotNullOrUndefined(styles.fill)" :label="fillLabel">
          <el-color-picker v-model="styles.fill"  size="small" @change="updateConfig"></el-color-picker>
        </el-form-item>
        <el-form-item v-if="isNotNullOrUndefined(styles.stroke)" :label="strokeLabel">
          <el-color-picker v-model="styles.stroke" size="small" @change="updateConfig"></el-color-picker>
        </el-form-item>
        <el-form-item v-if="isNotNullOrUndefined(styles.lineWidth)" :label="lineWidthLabel">
          <el-input-number type="number" v-model="styles.lineWidth" :min="lineWidthMin"
                           @change="updateConfig"></el-input-number>
        </el-form-item>
        <div v-if="styles.lineDash">
          <el-divider content-position="center">{{lineDashLabel}}</el-divider>
          <el-form-item label="分段长度">
            <el-input-number type="number" v-model="styles.lineDash[0]"
                             @change="updateConfig"></el-input-number>
          </el-form-item>
          <el-form-item label="分段间隔">
            <el-input-number type="number" v-model="styles.lineDash[1]"
                             @change="updateConfig"></el-input-number>
          </el-form-item>
          <el-divider></el-divider>
        </div>
        <el-form-item v-if="isNotNullOrUndefined(styles.opacity)" label="透明度">
          <el-input-number type="number" v-model="styles.opacity" :min="0" :max="1" :step="0.1"
                           @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item v-if="isNotNullOrUndefined(styles.fillOpacity)" label="填充透明度">
          <el-input-number type="number" v-model="styles.fillOpacity" :min="0" :max="1" :step="0.1"
                           @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item v-if="isNotNullOrUndefined(styles.strokeOpacity)" label="描边透明度">
          <el-input-number type="number" v-model="styles.strokeOpacity" :min="0" :max="1" :step="0.1"
                           @change="updateConfig"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <el-divider v-if="downDivider"></el-divider>
  </div>
</template>

<script>
  import CollapseItem from '../CollapseItem'
  import { updateMixin } from '../js/mixin'

  export default {
    name      : 'StyleOption',
    components: { CollapseItem },
    mixins    : [updateMixin],
    props     : {
      styles        : {
        type    : Object,
        required: true
      },
      downDivider   : {
        type   : Boolean,
        default: true
      },
      collapseTitle : {
        type   : String,
        default: '样式'
      },
      strokeLabel   : {
        type   : String,
        default: '线条颜色'
      },
      lineWidthLabel: {
        type   : String,
        default: '线宽'
      },
      lineWidthMin  : {
        type   : Number,
        default: 0
      },
      lineDashLabel : {
        type   : String,
        default: '虚线'
      },
      fillLabel     : {
        type   : String,
        default: '字体颜色'
      }
    },
    computed  : {
      labelWidth () {
        return this.styles.strokeOpacity || this.styles.fillOpacity ? '100px' : '80px'
      }
    }
  }
</script>
<style scoped lang="scss">
  .StyleOption{
    /deep/ .el-color-picker__trigger {
      border: none;
    }
  }
</style>
