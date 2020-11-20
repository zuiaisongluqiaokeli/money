<template>
  <div class="HeatmapShapeOption">
    <el-form label-width="80px">
      <div v-if="!isDensity">
        <el-form-item label="图像类型">
          <el-radio-group v-model="optionForm.shapeType" @change="updateConfig" size="small">
            <el-radio-button label="rect">矩形</el-radio-button>
            <el-radio-button label="circle">圆形</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最小尺寸">
          <el-input-number v-model="optionForm.shapeSize[0]" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="最大尺寸">
          <el-input-number v-model="optionForm.shapeSize[1]" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="等宽等高">
          <el-switch v-model="optionForm.forceSquare" @change="updateConfig"></el-switch>
        </el-form-item>
      </div>
      <el-form-item v-else label="热力权重">
        <el-input-number v-model="optionForm.intensity" @change="update"></el-input-number>
      </el-form-item>
<!--      <el-form-item v-if="!detail" label="显示标签">-->
<!--        <el-switch v-model="optionForm.label.visible" @change="updateConfig"></el-switch>-->
<!--      </el-form-item>-->
    </el-form>
  </div>
</template>

<script>
  import { updateMixin } from '../../js/mixin'

  export default {
    name    : 'HeatmapShapeOption',
    mixins  : [updateMixin],
    props   : {
      detail: {
        type   : Boolean,
        default: false
      }
    },
    computed: {
      isDensity () {
        return this.optionForm.type === 'DensityHeatmap'
      }
    },
    methods : {
      update () {
        this.updateConfig()
      }
    }
  }
</script>

<style scoped lang="scss">
  .HeatmapShapeOption {
  }
</style>
