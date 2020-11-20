<template>
  <div class="PointAndSmoothOption">
    <el-form-item label="平滑">
      <el-switch v-model="optionForm.smooth" @change="updateConfig"></el-switch>
    </el-form-item>
    <div v-if="!detail">
      <el-form-item label="显示点">
        <el-switch v-model="optionForm.point.visible" @change="updateConfig"></el-switch>
      </el-form-item>
      <div v-if="optionForm.point.visible">
        <el-form-item label="大小">
          <el-input-number v-model="optionForm.point.size" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="形状">
          <el-select v-model="optionForm.point.shape" @change="updateConfig">
            <el-option v-for="val in shapeList" :label="val.label" :key="val.label" :value="val.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
  import { updateMixin } from '../../js/mixin'

  export default {
    name  : 'PointAndSmoothOption',
    mixins: [updateMixin],
    props     : {
      detail: {
        type   : Boolean,
        default: false
      }
    }
  }
</script>
