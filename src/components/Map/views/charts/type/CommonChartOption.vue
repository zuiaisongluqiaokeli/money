<template>
  <div class="common-chart-option">
    <field-option :option-form="optionForm"></field-option>
    <collapse-item title="画布">
      <canvas-option :option-form="optionForm"></canvas-option>
    </collapse-item>
    <padding-option :option-form="optionForm"></padding-option>
    <legend-option v-if="isNotNullOrUndefined(optionForm.legend)" :option-form="optionForm"></legend-option>
    <collapse-item title="图形属性">
      <slot name="shape"></slot>
    </collapse-item>
  </div>
</template>

<script>
  import CollapseItem from '../CollapseItem'
  import CanvasOption from '../options/CanvasOption'
  import LegendOption from '../options/LegendOption'
  import FieldOption from '../options/FieldOption'
  import { updateMixin } from '../js/mixin'
  import ShapeOption from '../options/shape/ShapeOption'
  import PaddingOption from '../options/PaddingOption'
  import { EVENT_FORCE_UPDATE, eventBus } from '../js/event'

  export default {
    name      : 'CommonChartOption',
    mixins    : [updateMixin],
    components: { PaddingOption, ShapeOption, FieldOption, LegendOption, CanvasOption, CollapseItem },
    created () {
      eventBus.$on(EVENT_FORCE_UPDATE,this.forceUpdate)
    },
    beforeDestroy () {
      eventBus.$off(EVENT_FORCE_UPDATE,this.forceUpdate)
    }
  }
</script>

<style scoped lang="scss"></style>
