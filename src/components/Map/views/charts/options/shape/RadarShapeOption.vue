<template>
  <div class="RadarShapeOption">
    <shape-option :option-form="optionForm" :show-label="!detail" :show-divider="!detail">
      <point-and-smooth-option :option-form="optionForm" :detail="detail"></point-and-smooth-option>
    </shape-option>
  </div>
</template>

<script>
  import { updateMixin } from '../../js/mixin'
  import ShapeOption from './ShapeOption'
  import PointLabelOption from '../PointLabelOption'
  import PointAndSmoothOption from './PointAndSmoothOption'

  export default {
    name      : 'RadarShapeOption',
    components: { PointAndSmoothOption, PointLabelOption, ShapeOption },
    mixins    : [updateMixin],
    props     : {
      detail: {
        type   : Boolean,
        default: false
      }
    }
  }
</script>
