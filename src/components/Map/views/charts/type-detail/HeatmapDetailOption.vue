<template>
  <div class="HeatmapDetailOption">
    <common-chart-detail-option :option-form="optionForm">
      <template slot="shape">
        <heatmap-shape-option :option-form="optionForm" detail></heatmap-shape-option>
      </template>
    </common-chart-detail-option>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CommonChartDetailOption from './CommonChartDetailOption'
  import HeatmapShapeOption from '../options/shape/HeatmapShapeOption'

  export default {
    name      : 'HeatmapDetailOption',
    components: { HeatmapShapeOption, CommonChartDetailOption },
    mixins    : [updateMixin]
  }
</script>

<style scoped lang="scss">
  .HeatmapDetailOption {
  }
</style>
