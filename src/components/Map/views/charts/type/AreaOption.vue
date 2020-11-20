<template>
  <div class="AreaOption">
    <common-chart-option :option-form="optionForm">
      <template slot="shape">
        <area-shape :option-form="optionForm"></area-shape>
      </template>
    </common-chart-option>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CommonChartOption from './CommonChartOption'
  import AreaShape from '../options/shape/AreaShape'

  export default {
    name      : 'AreaOption',
    components: { AreaShape, CommonChartOption },
    mixins    : [updateMixin]
  }
</script>

<style scoped lang="scss">
  .AreaOption {
  }
</style>
