<template>
  <div class="ScatterOption">
    <common-chart-option :option-form="optionForm">
      <template slot="shape">
        <scatter-shape-option :option-form="optionForm"></scatter-shape-option>
      </template>
    </common-chart-option>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CommonChartOption from './CommonChartOption'
  import ScatterShapeOption from '../options/shape/ScatterShapeOption'

  export default {
    name      : 'ScatterOption',
    components: { ScatterShapeOption, CommonChartOption },
    mixins    : [updateMixin]
  }
</script>

<style scoped lang="scss">
  .ScatterOption {
  }
</style>
