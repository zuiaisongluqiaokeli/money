<template>
  <div class="line-option">
    <common-chart-option :option-form="optionForm">
      <template slot="shape">
        <line-shape-option :option-form="optionForm"></line-shape-option>
      </template>
    </common-chart-option>
  </div>
</template>

<script>
  import CommonChartOption from './CommonChartOption'
  import { updateMixin } from '../js/mixin'
  import LineShapeOption from '../options/shape/LineShapeOption'

  export default {
    name      : 'LineOption',
    mixins    : [updateMixin],
    components: { LineShapeOption, CommonChartOption },
  }
</script>
