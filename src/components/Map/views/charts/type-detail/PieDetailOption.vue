<template>
  <div class="PieDetailOption">
    <common-chart-detail-option :option-form="optionForm">
      <template slot="shape">
        <pie-style-option :option-form="optionForm" detail></pie-style-option>
      </template>
      <line-label-option :option-form="optionForm" type-label="标签位置" :style-disabled="typeIsSpider"></line-label-option>
    </common-chart-detail-option>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CommonChartDetailOption from './CommonChartDetailOption'
  import PieStyleOption from '../options/shape/PieStyleOption'
  import LineLabelOption from '../options/LabelOption'

  export default {
    name      : 'PieDetailOption',
    components: { LineLabelOption, PieStyleOption, CommonChartDetailOption },
    mixins    : [updateMixin],
    computed  : {
      typeIsSpider () {
        return this.optionForm.label.type === 'spider'
      }
    }
  }
</script>

<style scoped lang="scss">
  .PieDetailOption {
  }
</style>
