<template>
  <div class="PercentageOption">
    <collapse-item title="转化率" show-switch v-model="optionForm.percentage.visible" @update="updateConfig">
      <el-form label-width="80px">
        <el-form-item label="显示线">
          <el-switch v-model="optionForm.percentage.line.visible" @change="updateConfig"></el-switch>
        </el-form-item>
        <el-form-item label="固定文本">
          <el-input v-model="optionForm.percentage.text.content" @change="updateConfig"></el-input>
        </el-form-item>
        <el-form-item label="间隔">
          <el-input-number v-model="optionForm.percentage.spacing" @change="updateConfig"></el-input-number>
        </el-form-item>
        <offset-option :option-form="optionForm" :object="optionForm.percentage"></offset-option>
        <style-option :option-form="optionForm" :styles="optionForm.percentage.line.style" :down-divider="false"
                      collapse-title="线样式"></style-option>
        <style-option :option-form="optionForm" :styles="optionForm.percentage.text.style" :down-divider="false"
                      collapse-title="固定文本样式"></style-option>
        <style-option :option-form="optionForm" :styles="optionForm.percentage.value.style"
                      collapse-title="转化值样式"></style-option>
      </el-form>
    </collapse-item>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CollapseItem from '../CollapseItem'
  import OffsetOption from './OffsetOption'
  import { EVENT_UPDATE_THEME, eventBus } from '../js/event'
  import StyleOption from './StyleOption'

  export default {
    name      : 'PercentageOption',
    components: { StyleOption, OffsetOption, CollapseItem },
    mixins    : [updateMixin],
    methods   : {
      updateColor () {
        const isDark = this.optionForm.theme === 'dark'
        if (isDark) {
          if (this.optionForm.percentage.text.style.fill === '#000000') {
            this.optionForm.percentage.text.style.fill = '#ffffff'
          }
          if (this.optionForm.percentage.value.style.fill === '#000000') {
            this.optionForm.percentage.value.style.fill = '#ffffff'
          }
        } else {
          if (this.optionForm.percentage.text.style.fill === '#ffffff') {
            this.optionForm.percentage.text.style.fill = '#000000'
          }
          if (this.optionForm.percentage.value.style.fill === '#ffffff') {
            this.optionForm.percentage.value.style.fill = '#000000'
          }
        }
      }
    },
    created () {
      eventBus.$on(EVENT_UPDATE_THEME, this.updateColor)
    },
    beforeDestroy () {
      eventBus.$off(EVENT_UPDATE_THEME, this.updateColor)
    }
  }
</script>
