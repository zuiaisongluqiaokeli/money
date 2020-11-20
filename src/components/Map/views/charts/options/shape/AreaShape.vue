<template>
  <div class="AreaShape">
    <shape-option :option-form="optionForm" show-label>
      <el-form-item v-if="isNotNullOrUndefined(optionForm.areaStyle)" label="区域透明度" label-width="100px">
        <el-input-number v-model="optionForm.areaStyle.opacity" @change="updateConfig" :max="1"></el-input-number>
      </el-form-item>
      <point-and-smooth-option :option-form="optionForm" :detail="detail"></point-and-smooth-option>
    </shape-option>
  </div>
</template>

<script>
  import { updateMixin } from '../../js/mixin'
  import ShapeOption from './ShapeOption'
  import PointAndSmoothOption from './PointAndSmoothOption'

  export default {
    name      : 'AreaShape',
    components: { PointAndSmoothOption, ShapeOption },
    mixins    : [updateMixin],
    props     : {
      detail: {
        type   : Boolean,
        default: false
      }
    }
  }
</script>
