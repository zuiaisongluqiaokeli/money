<template>
  <div class="LineDetailOption">
    <common-chart-detail-option :option-form="optionForm">
      <template slot="shape">
        <shape-option :show-divider="false" :option-form="optionForm"></shape-option>
      </template>
      <collapse-item title="线条" default-expand>
        <line-style-options :option-form="optionForm" :smooth="isLine" detail></line-style-options>
      </collapse-item>
      <line-label-option :option-form="optionForm"></line-label-option>
      <point-label-option :option-form="optionForm"></point-label-option>
    </common-chart-detail-option>
  </div>
</template>

<script>
  import CommonChartDetailOption from './CommonChartDetailOption'
  import { updateMixin } from '../js/mixin'
  import CollapseItem from '../CollapseItem'
  import ShapeOption from '../options/shape/ShapeOption'
  import LineStyleOptions from '../options/LineStyleOptions'
  import LineLabelOption from '../options/LabelOption'
  import PointLabelOption from '../options/PointLabelOption'

  export default {
    name      : 'LineDetailOption',
    mixins    : [updateMixin],
    components: {
      PointLabelOption,
      LineLabelOption,
      LineStyleOptions,
      ShapeOption,
      CollapseItem,
      CommonChartDetailOption
    }
  }
</script>

<style scoped lang="scss">
  .LineDetailOption {
  }
</style>
