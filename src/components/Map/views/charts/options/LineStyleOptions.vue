<template>
  <el-form class="LineStyleOptions" label-width="80px">
    <el-form-item label="平滑" v-if="smooth">
      <el-switch v-model="optionForm.smooth" @change="updateConfig"></el-switch>
    </el-form-item>
    <style-option v-if="detail" :option-form="optionForm" :styles="optionForm.lineStyle"
                  line-width-label="线宽" line-dash-label="虚线" collapse-title="线条样式"
                  :line-width-min="1"></style-option>
  </el-form>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CollapseItem from '../CollapseItem'
  import StyleOption from './StyleOption'

  export default {
    name      : 'LineStyleOptions',
    components: { StyleOption, CollapseItem },
    mixins    : [updateMixin],
    props     : {
      smooth: {
        type    : Boolean,
        required: true
      },
      detail: {
        type   : Boolean,
        default: false
      }
    }
  }
</script>
