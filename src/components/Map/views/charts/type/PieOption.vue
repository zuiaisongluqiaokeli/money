<template>
  <div class="PieOption">
    <common-chart-option :option-form="optionForm">
      <template slot="shape">
        <pie-style-option :option-form="optionForm"></pie-style-option>
      </template>
    </common-chart-option>
  </div>
</template>

<script>
  import CommonChartOption from './CommonChartOption'
  import { updateMixin } from '../js/mixin'
  import PieStyleOption from '../options/shape/PieStyleOption'

  export default {
    name      : 'PieOption',
    components: { PieStyleOption, CommonChartOption },
    mixins    : [updateMixin]
  }
</script>

<style scoped lang="scss">
  .PieOption {
  }
</style>
