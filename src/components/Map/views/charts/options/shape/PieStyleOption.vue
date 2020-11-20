<template>
  <div class="PieStyleOption">
    <shape-option :option-form="optionForm" :show-label="!detail" :show-label-style="showLabelStyle&&!detail" :show-divider="!detail">
      <el-form-item v-if="optionForm.label.visible&&!detail" label="标签位置">
        <el-radio-group v-model="optionForm.label.type" @change="updateConfig" size="small">
          <el-radio-button v-for="val in labelTypeList" :label="val.label" :key="val.label">{{val.text}}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="radiusLabel">
        <el-slider v-model="optionForm.radius" :max="1" :step="0.01" :format-tooltip="formatTooltip"
                   @change="updateConfig"></el-slider>
      </el-form-item>
      <el-form-item v-if="isNotNullOrUndefined(optionForm.innerRadius)" label="内半径">
        <el-slider v-model="optionForm.innerRadius" :max="1" :step="0.01" :format-tooltip="formatTooltip"
                   @change="updateConfig"></el-slider>
      </el-form-item>
      <div v-if="isNotNullOrUndefined(optionForm.statistic)">
        <el-form-item label="显示指标卡" label-width="100px">
          <el-switch v-model="optionForm.statistic.visible" @change="updateConfig"></el-switch>
        </el-form-item>
        <el-form-item label="总计值标签" label-width="100px">
          <el-input v-model="optionForm.statistic.totalLabel" @change="updateConfig"></el-input>
        </el-form-item>
        <el-form-item label="默认指标卡" label-width="100px">
          <el-input v-model="optionForm.statistic.content" @change="updateConfig"></el-input>
        </el-form-item>
      </div>
    </shape-option>
  </div>
</template>

<script>
  import { updateMixin } from '../../js/mixin'
  import ShapeOption from './ShapeOption'

  export default {
    name      : 'PieStyleOption',
    components: { ShapeOption },
    mixins    : [updateMixin],
    props     : {
      detail: {
        type   : Boolean,
        default: false
      }
    },
    computed  : {
      radiusLabel () {
        return this.isDonut ? '外半径' : '半径'
      },
      showLabelStyle () {
        return this.optionForm.label.type !== 'spider'
      }
    },
    watch     : {
      'optionForm.statistic.visible' (val) {
        if (val) {
          this.optionForm.tooltip.visible = false
        }
      }
    },
    methods   : {
      formatTooltip (val) {
        return (val * 100).toFixed(0) + '%'
      }
    }
  }
</script>

<style scoped lang="scss">
  .PieStyleOption {
  }
</style>
