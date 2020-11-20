<template>
  <div class="RadarOption">
    <common-chart-option :option-form="optionForm">
      <template slot="shape">
        <radar-shape-option :option-form="optionForm"></radar-shape-option>
      </template>
    </common-chart-option>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CommonChartOption from './CommonChartOption'
  import RadarShapeOption from '../options/shape/RadarShapeOption'

  export default {
    name      : 'RadarOption',
    components: { RadarShapeOption, CommonChartOption },
    mixins    : [updateMixin]
  }
</script>

<style scoped lang="scss">
  .RadarOption {
  }
</style>
