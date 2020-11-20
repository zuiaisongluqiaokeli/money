<template>
  <div class="LineOption">
    <collapse-item title="线条" show-switch v-model="optionForm.line.visible" @update="updateConfig">
      <el-form label-width="80px">
        <el-form-item label="粗细">
          <el-input-number v-model="optionForm.line.size" @change="updateConfig"></el-input-number>
        </el-form-item>
        <style-option collapse-title="线条样式" :option-form="optionForm" :styles="optionForm.line.style"></style-option>
      </el-form>
    </collapse-item>
  </div>
</template>

<script>
  import CollapseItem from '../CollapseItem'
  import { updateMixin } from '../js/mixin'
  import StyleOption from './StyleOption'

  export default {
    name      : 'LineOption',
    components: { StyleOption, CollapseItem },
    mixins    : [updateMixin]
  }
</script>
