<template>
  <div class="ScatterDetailOption">
    <common-chart-detail-option :option-form="optionForm">
      <template slot="shape">
        <scatter-shape-option detail :option-form="optionForm"></scatter-shape-option>
      </template>
      <line-label-option :option-form="optionForm" detail></line-label-option>
      <template slot="append">
        <quadrant-option :option-form="optionForm"></quadrant-option>
        <trend-option :option-form="optionForm"></trend-option>
        <time-line-option v-if="isNotNullOrUndefined(optionForm.interactions)"
                          :option-form="optionForm"></time-line-option>
      </template>
    </common-chart-detail-option>
  </div>
</template>

<script>
  import CommonChartDetailOption from './CommonChartDetailOption'
  import ScatterShapeOption from '../options/shape/ScatterShapeOption'
  import { updateMixin } from '../js/mixin'
  import LineLabelOption from '../options/LabelOption'
  import QuadrantOption from '../options/QuadrantOption'
  import TrendOption from '../options/TrendOption'
  import TimeLineOption from '../options/TimeLineOption'

  export default {
    name      : 'ScatterDetailOption',
    components: {
      TimeLineOption,
      TrendOption,
      QuadrantOption,
      LineLabelOption,
      ScatterShapeOption,
      CommonChartDetailOption
    },
    mixins    : [updateMixin]
  }
</script>

<style scoped lang="scss">
  .ScatterDetailOption {
  }
</style>
