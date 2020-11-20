<template>
  <collapse-item title="提示框" show-switch v-model="optionForm.tooltip.visible" @update="updateConfig"
                 :disabled="optionForm.statistic&&optionForm.statistic.visible"
                 :default-expand="false">
    <el-form label-width="120px">
      <el-form-item v-if="isNotNullOrUndefined(optionForm.tooltip.shared)" label="显示多条数据">
        <el-switch v-model="optionForm.tooltip.shared" @change="updateConfig"></el-switch>
      </el-form-item>
      <el-form-item v-if="isNotNullOrUndefined(optionForm.tooltip.showCrosshairs)" label="显示辅助线">
        <el-switch v-model="optionForm.tooltip.showCrosshairs" @change="updateConfig"></el-switch>
      </el-form-item>
      <el-form-item v-if="isNotNullOrUndefined(optionForm.tooltip.crosshairs)" label="辅助线位置">
        <el-select v-model="optionForm.tooltip.crosshairs.type" @change="updateConfig">
          <el-option label="X轴" value="x"></el-option>
          <el-option label="Y轴" value="y"></el-option>
          <el-option label="XY轴" value="xy"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="偏移量">
        <el-input-number v-model="optionForm.tooltip.offset" @change="updateConfig"></el-input-number>
      </el-form-item>
    </el-form>
  </collapse-item>
</template>

<script>
  import CollapseItem from '../CollapseItem'
  import { updateMixin } from '../js/mixin'

  export default {
    name      : 'TooltipOption',
    components: { CollapseItem },
    mixins    : [updateMixin],
  }
</script>

