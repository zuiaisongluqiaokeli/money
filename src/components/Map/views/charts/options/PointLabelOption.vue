<template>
  <collapse-item title="点" show-switch v-model="optionForm.point.visible" :disabled="disabled">
    <el-form label-width="80px">
      <el-form-item label="大小">
        <el-input-number v-model="optionForm.point.size" @change="updateConfig"></el-input-number>
      </el-form-item>
      <el-form-item label="形状">
        <el-select v-model="optionForm.point.shape" @change="updateConfig">
          <el-option v-for="val in shapeList" :label="val.label" :key="val.label" :value="val.value"></el-option>
        </el-select>
      </el-form-item>
      <style-option v-if="detail&&isNotNullOrUndefined(optionForm.point.style)" :option-form="optionForm" stroke-label="描边颜色"
                    :styles="optionForm.point.style"></style-option>
    </el-form>
  </collapse-item>
</template>

<script>
  import CollapseItem from '../CollapseItem'
  import { updateMixin } from '../js/mixin'
  import StyleOption from './StyleOption'

  export default {
    name      : 'PointLabelOption',
    components: { StyleOption, CollapseItem },
    mixins    : [updateMixin],
    props     : {
      disabledWhenNotPoint: {
        type   : Boolean,
        default: true
      },
      detail              : {
        type   : Boolean,
        default: true
      }
    },
    computed  : {
      disabled () {
        return this.disabledWhenNotPoint && (this.optionForm.label.type !== 'point' || !this.optionForm.label.visible)
      }
    }
  }
</script>
