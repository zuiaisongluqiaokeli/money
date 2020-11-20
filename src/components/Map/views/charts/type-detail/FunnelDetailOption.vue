<template>
  <div class="FunnelDetailOption">
    <common-chart-detail-option :option-form="optionForm">
      <template slot="shape">
        <funnel-shape-option :option-form="optionForm" detail></funnel-shape-option>
      </template>
      <percentage-option :option-form="optionForm"></percentage-option>
    </common-chart-detail-option>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CommonChartDetailOption from './CommonChartDetailOption'
  import FunnelShapeOption from '../options/shape/FunnelShapeOption'
  import PercentageOption from '../options/PercentageOption'

  export default {
    name      : 'FunnelDetailOption',
    components: { PercentageOption, FunnelShapeOption, CommonChartDetailOption },
    mixins    : [updateMixin]
  }
</script>

<style scoped lang="scss">
  .FunnelDetailOption {
  }
</style>
