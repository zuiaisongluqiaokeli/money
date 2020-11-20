<template>
  <div class="AreaDetailOption">
    <common-chart-detail-option :option-form="optionForm">
      <template slot="shape">
        <area-shape :option-form="optionForm" detail></area-shape>
      </template>
      <line-option :option-form="optionForm"></line-option>
      <line-label-option :option-form="optionForm"></line-label-option>
      <point-label-option :option-form="optionForm"></point-label-option>
    </common-chart-detail-option>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CommonChartDetailOption from './CommonChartDetailOption'
  import AreaShape from '../options/shape/AreaShape'
  import LineOption from '../options/LineOption'
  import LineLabelOption from '../options/LabelOption'
  import PointLabelOption from '../options/PointLabelOption'
  import SliderOption from '../options/SliderOption'

  export default {
    name: 'AreaDetailOption',
    components: {
      SliderOption,
      PointLabelOption,
      LineLabelOption,
      LineOption,
      AreaShape,
      CommonChartDetailOption
    },
    mixins: [updateMixin]
  }
</script>

<style scoped lang="scss">
  .AreaDetailOption {
  }
</style>
