<template>
  <div class="ColumnStyleOption">
    <shape-option :option-form="optionForm" :show-divider="!detail" :show-label="!detail">
      <div v-if="isNotNullOrUndefined(optionForm.binNumber)">
        <el-form-item label="分箱数量">
          <el-input-number v-model="optionForm.binNumber" @change="updateConfig"></el-input-number>
        </el-form-item>
      </div>
      <div v-if="isNotNullOrUndefined(optionForm.showTotal)">
        <el-form-item label="总计值">
          <div class="canvas-form-item">
            <el-switch v-model="optionForm.showTotal.visible" @change="updateConfig"></el-switch>
            <el-input class="input" v-model="optionForm.showTotal.label" @change="updateConfig"
                      placeholder="总计值标签"></el-input>
          </div>
        </el-form-item>
      </div>
      <div v-if="isNotNullOrUndefined(optionForm.diffLabel)">
        <el-form-item label="差值">
          <el-switch v-model="optionForm.diffLabel.visible" @change="updateConfig"></el-switch>
        </el-form-item>
        <style-option :option-form="optionForm" :styles="optionForm.diffLabel.style" collapse-title="差值样式"
                      line-width-label="描边粗细" stroke-label="描边颜色"></style-option>
      </div>
      <el-form-item v-if="isNotNullOrUndefined(optionForm.connectedArea)&&assignedStackField" label="联通区域">
        <el-switch v-model="optionForm.connectedArea.visible" @change="updateConfig"></el-switch>
      </el-form-item>
      <div v-if="isNotNullOrUndefined(optionForm.columnSize)">
        <el-form-item label="柱条宽度">
          <el-radio-group v-model="sizeType">
            <el-radio-button label="0">默认</el-radio-button>
            <el-radio-button label="1">自定义</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数值" v-if="sizeType==='1'">
          <el-input-number v-model="optionForm.columnSize" @change="updateConfig"></el-input-number>
        </el-form-item>
      </div>
      <style-option v-if="detail&&optionForm.columnStyle" :option-form="optionForm" :styles="optionForm.columnStyle"
                    collapse-title="柱条样式" stroke-label="描边颜色" line-width-label="描边宽度" line-dash-label="虚线描边"
                    :line-width-min="0"></style-option>
    </shape-option>
  </div>
</template>

<script>
  import { updateMixin } from '../../js/mixin'
  import ShapeOption from './ShapeOption'
  import StyleOption from '../StyleOption'

  export default {
    name      : 'ColumnStyleOption',
    components: { StyleOption, ShapeOption },
    mixins    : [updateMixin],
    props     : {
      detail: {
        type   : Boolean,
        default: false
      }
    },
    data () {
      return {
        sizeType: '0',
        lastSize: 0
      }
    },
    watch     : {
      sizeType (val) {
        if (val === '0') {
          this.lastSize = this.optionForm.columnSize
          this.optionForm.columnSize = 0
          this.updateConfig()
        } else {
          this.optionForm.columnSize = this.lastSize
          this.optionForm.columnSize && this.updateConfig()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .ColumnStyleOption {
  }
</style>
