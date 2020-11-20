<template>
  <div class="ColumnDetailOption">
    <common-chart-detail-option :option-form="optionForm">
      <template slot="shape">
        <column-style-option :option-form="optionForm" detail></column-style-option>
      </template>
      <label-option :option-form="optionForm"></label-option>
      <template slot="append">
        <leader-line-option v-if="isNotNullOrUndefined(optionForm.leaderLine)"
                            :option-form="optionForm"></leader-line-option>
        <conversion-option v-if="isNotNullOrUndefined(optionForm.conversionTag)"
                           :option-form="optionForm"></conversion-option>
      </template>
    </common-chart-detail-option>
  </div>
</template>

<script>
  import CommonChartDetailOption from './CommonChartDetailOption'
  import { updateMixin } from '../js/mixin'
  import LineStyleOptions from '../options/LineStyleOptions'
  import LabelOption from '../options/LabelOption'
  import ColumnStyleOption from '../options/shape/ColumnStyleOption'
  import ConversionOption from '../options/ConversionOption'
  import LeaderLineOption from '../options/LeaderLineOption'

  export default {
    name      : 'ColumnDetailOption',
    mixins    : [updateMixin],
    components: {
      LeaderLineOption,
      ConversionOption,
      ColumnStyleOption,
      LabelOption,
      LineStyleOptions,
      CommonChartDetailOption
    }
  }
</script>
