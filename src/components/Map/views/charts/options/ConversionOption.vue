<template>
  <div class="ConversionOption">
    <collapse-item title="转化率" show-switch :default-expand="false" v-model="conversion.visible" @update="updateConfig">
      <el-form label-width="80px">
        <el-form-item label="尺寸">
          <el-input-number v-model="conversion.size" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="间距">
          <el-input-number v-model="conversion.spacing" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="Y偏移">
          <el-input-number v-model="conversion.offset" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="箭头宽度">
          <el-input-number v-model="conversion.arrow.headSize" @change="updateConfig"></el-input-number>
        </el-form-item>
      </el-form>
    </collapse-item>
  </div>
</template>

<script>
  import CollapseItem from '../CollapseItem'
  import { updateMixin } from '../js/mixin'
  import OffsetOption from './OffsetOption'

  export default {
    name      : 'ConversionOption',
    components: { OffsetOption, CollapseItem },
    mixins    : [updateMixin],
    computed  : {
      conversion () {
        return this.optionForm.conversionTag
      }
    }
  }
</script>

<style scoped lang="scss">
  .ConversionOption {
  }
</style>
