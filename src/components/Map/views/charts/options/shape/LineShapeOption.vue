<template>
  <div class="LineShapeOption">
    <shape-option :option-form="optionForm" show-label>
      <line-style-options v-if="isLine" :option-form="optionForm" :smooth="isLine"></line-style-options>
      <el-form-item label="显示点">
        <el-switch v-model="optionForm.point.visible" @change="updateConfig"></el-switch>
      </el-form-item>
    </shape-option>
  </div>
</template>

<script>
  import { updateMixin } from '../../js/mixin'
  import ShapeOption from './ShapeOption'
  import LineStyleOptions from '../LineStyleOptions'

  export default {
    name      : 'LineShapeOption',
    components: { LineStyleOptions, ShapeOption },
    mixins    : [updateMixin],
  }
</script>
