<template>
  <div class="ScatterShapeOption">
    <shape-option :option-form="optionForm" :show-divider="!detail" :show-label="!detail">
      <el-form-item v-if="!detail" label="区分象限">
        <el-switch v-model="optionForm.quadrant.visible" @change="updateConfig"></el-switch>
      </el-form-item>
      <el-form-item v-if="!sizeIsArray" label="点的尺寸">
        <el-input-number v-model="optionForm.pointSize" @change="updateConfig"></el-input-number>
      </el-form-item>
      <div v-else>
        <el-form-item label="气泡最小尺寸" label-width="120px">
          <el-input-number v-model="optionForm.pointSize[0]" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="气泡最大尺寸" label-width="120px">
          <el-input-number v-model="optionForm.pointSize[1]" @change="updateConfig"></el-input-number>
        </el-form-item>
      </div>
    </shape-option>
  </div>
</template>

<script>
  import { updateMixin } from '../../js/mixin'
  import ShapeOption from './ShapeOption'

  export default {
    name      : 'ScatterShapeOption',
    components: { ShapeOption },
    mixins    : [updateMixin],
    props     : {
      detail: {
        type   : Boolean,
        default: false
      }
    },
    computed  : {
      sizeIsArray () {
        return this.optionForm.pointSize instanceof Array
      }
    }
  }
</script>

<style scoped lang="scss">
  .ScatterShapeOption {
  }
</style>
