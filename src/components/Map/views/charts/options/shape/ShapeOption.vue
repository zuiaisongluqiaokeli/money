<template>
  <div class="ShapeOption">
    <el-form label-width="80px">
      <el-form-item label="类型" v-if="optionForm.seriesList.length>1">
        <el-select v-model="seriesIndex">
          <el-option v-for="(val,index) in optionForm.seriesList" :label="val" :value="index" :key="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="optionForm.color" label="颜色">
        <el-color-picker v-model="optionForm.color[colorKey]" @change="updateConfig" size="small"></el-color-picker>
      </el-form-item>
      <el-form-item v-if="isStepLine" label="转折形态">
        <el-select v-model="optionForm.step" @change="updateConfig">
          <el-option v-for="val in stepList" :value="val" :key="val" :label="val"></el-option>
        </el-select>
      </el-form-item>
      <el-divider v-if="showDivider"></el-divider>
      <el-form-item v-if="showLabel&&isNotNullOrUndefined(optionForm.label)" label="显示标签">
        <el-switch v-model="optionForm.label.visible" @change="updateConfig"></el-switch>
      </el-form-item>
      <slot></slot>
      <div v-if="isNotNullOrUndefined(optionForm.label)">
        <style-option v-if="isNotNullOrUndefined(optionForm.label.style)&&showLabelStyle" :option-form="optionForm"
                      :styles="optionForm.label.style" collapse-title="标签样式"></style-option>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { updateMixin } from '../../js/mixin'
  import { EVENT_UPDATE_SERIES_LIST, eventBus } from '../../js/event'
  import StyleOption from '../StyleOption'

  export default {
    name      : 'ShapeOption',
    components: { StyleOption },
    mixins    : [updateMixin],
    props     : {
      showDivider   : {
        type   : Boolean,
        default: true
      },
      showLabel     : {
        type   : Boolean,
        default: false
      },
      showLabelStyle: {
        type   : Boolean,
        default: false
      }
    },
    data () {
      return {
        seriesIndex: 0,
        stepList   : ['vh', 'hv', 'vhv', 'hvh']
      }
    },
    computed  : {
      colorKey () {
        return this.isWaterfall ? ['rising', 'falling', 'total'][this.seriesIndex] : this.seriesIndex
      }
    },
    methods   : {
      updateSeriesIndex () {
        this.seriesIndex = 0
      },
    },
    created () {
      eventBus.$on(EVENT_UPDATE_SERIES_LIST, this.updateSeriesIndex)
    },
    beforeDestroy () {
      eventBus.$off(EVENT_UPDATE_SERIES_LIST, this.updateSeriesIndex)
    }
  }
</script>

<style scoped lang="scss">
  .ShapeOption {
    /deep/ .el-color-picker__trigger {
      border: none;
    }
  }
</style>
