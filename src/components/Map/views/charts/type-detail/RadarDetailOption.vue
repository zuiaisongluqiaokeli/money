<template>
  <div class="RadarDetailOption">
    <common-chart-detail-option :option-form="optionForm">
      <template slot="shape">
        <radar-shape-option :option-form="optionForm" detail></radar-shape-option>
      </template>
      <point-label-option :option-form="optionForm" detail :disabled-when-not-point="false"></point-label-option>
      <line-label-option :option-form="optionForm" detail></line-label-option>
      <line-option :option-form="optionForm"></line-option>
    </common-chart-detail-option>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CommonChartDetailOption from './CommonChartDetailOption'
  import RadarShapeOption from '../options/shape/RadarShapeOption'
  import PointLabelOption from '../options/PointLabelOption'
  import LineLabelOption from '../options/LabelOption'
  import LineOption from '../options/LineOption'

  export default {
    name: 'RadarDetailOption',
    components: {
      LineOption,
      LineLabelOption,
      PointLabelOption,
      RadarShapeOption,
      CommonChartDetailOption
    },
    mixins: [updateMixin]
  }
</script>

<style scoped lang="scss">
  .RadarDetailOption {
  }
</style>
