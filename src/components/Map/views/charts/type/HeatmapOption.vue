<template>
  <div class="HeatmapOption">
    <common-chart-option :option-form="optionForm">
      <template slot="shape">
        <heatmap-shape-option :option-form="optionForm"></heatmap-shape-option>
      </template>
    </common-chart-option>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CommonChartOption from './CommonChartOption'
  import HeatmapShapeOption from '../options/shape/HeatmapShapeOption'

  export default {
    name      : 'HeatmapOption',
    components: { HeatmapShapeOption, CommonChartOption },
    mixins    : [updateMixin]
  }
</script>

<style scoped lang="scss">
  .HeatmapOption {
  }
</style>
