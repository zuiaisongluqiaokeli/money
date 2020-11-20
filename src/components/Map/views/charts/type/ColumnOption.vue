<template>
    <div class="ColumnOption">
      <common-chart-option :option-form="optionForm">
        <template slot="shape">
          <column-style-option :option-form="optionForm"></column-style-option>
        </template>
      </common-chart-option>
    </div>
</template>

<script>
  import CommonChartOption from './CommonChartOption'
  import { updateMixin } from '../js/mixin'
  import ColumnStyleOption from '../options/shape/ColumnStyleOption'
  export default {
    name: 'ColumnOption',
    mixins    : [updateMixin],
    components: { ColumnStyleOption, CommonChartOption },
  }
</script>

<style scoped lang="scss">
    .ColumnOption {
    }
</style>
