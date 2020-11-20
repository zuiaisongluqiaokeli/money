<template>
  <div class="FunnelShapeOption">
    <shape-option :option-form="optionForm" :show-label="false">
      <!--      <el-form-item label="布局">-->
      <!--        <el-radio-group v-model="optionForm.transport" @change="updateConfig" size="small">-->
      <!--          <el-radio-button :label="false">垂直</el-radio-button>-->
      <!--          <el-radio-button :label="true">水平</el-radio-button>-->
      <!--        </el-radio-group>-->
      <!--      </el-form-item>-->
      <el-form-item label="动态高度">
        <el-switch v-model="optionForm.dynamicHeight" @change="updateConfig"
                   :disabled="optionForm.compareField.length>0"></el-switch>
      </el-form-item>
      <!--      <el-form-item label="对比文本">-->
      <!--        <el-switch v-model="optionForm.compareText.visible" @change="updateConfig"-->
      <!--                   :disabled="optionForm.compareField.length===0"></el-switch>-->
      <!--      </el-form-item>-->
      <offset-option v-if="optionForm.compareText.visible" :option-form="optionForm"
                     :object="optionForm.compareText"></offset-option>
      <style-option v-if="detail&&optionForm.compareText.visible" :option-form="optionForm" :styles="optionForm.compareText.style"
                    collapse-title="对比文本样式"></style-option>
    </shape-option>
  </div>
</template>

<script>
  import ShapeOption from './ShapeOption'
  import { updateMixin } from '../../js/mixin'
  import OffsetOption from '../OffsetOption'
  import StyleOption from '../StyleOption'
  import { EVENT_UPDATE_THEME, eventBus } from '../../js/event'

  export default {
    name      : 'FunnelShapeOption',
    components: { StyleOption, OffsetOption, ShapeOption },
    mixins    : [updateMixin],
    props     : {
      detail: {
        type   : Boolean,
        default: false
      }
    },
    watch     : {
      'optionForm.compareField' () {
        if (this.optionForm.compareText.visible === false) {
          this.optionForm.compareText.visible = true
          this.updateConfig()
        }
      }
    },
    methods   : {
      updateCompareText () {
        const isDark = this.optionForm.theme === 'dark'
        if (isDark) {
          if (this.optionForm.compareText.style.fill === '#000000') {
            this.optionForm.compareText.style.fill = '#ffffff'
          }
        } else {
          if (this.optionForm.compareText.style.fill === '#ffffff') {
            this.optionForm.text.style.fill = '#000000'
          }
        }
      }
    },
    created () {
      eventBus.$on(EVENT_UPDATE_THEME, this.updateCompareText)
    },
    beforeDestroy () {
      eventBus.$off(EVENT_UPDATE_THEME, this.updateCompareText)
    }
  }
</script>

<style scoped lang="scss">
  .FunnelShapeOption {
  }
</style>
