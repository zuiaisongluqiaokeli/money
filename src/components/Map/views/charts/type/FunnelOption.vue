<template>
  <div class="FunnelShapeOption">
    <common-chart-option :option-form="optionForm">
      <template slot="shape">
        <funnel-shape-option :option-form="optionForm"></funnel-shape-option>
      </template>
    </common-chart-option>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CommonChartOption from './CommonChartOption'
  import FunnelShapeOption from '../options/shape/FunnelShapeOption'

  export default {
    name      : 'FunnelOption',
    components: { FunnelShapeOption, CommonChartOption },
    mixins    : [updateMixin]
  }
</script>

<style scoped lang="scss">
  .FunnelShapeOption {
  }
</style>
