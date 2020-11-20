<template>
  <collapse-item title="图形标签" show-switch v-model="optionForm.label.visible"
                 @update="updateConfig">
    <el-form label-width="80px">
      <el-form-item v-if="isNotNullOrUndefined(optionForm.label.type)" :label="typeLabel">
        <el-radio-group v-model="optionForm.label.type" @change="updateConfig" size="small">
          <el-radio-button v-for="val in labelTypeList" :label="val.label" :key="val.label">{{val.text}}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-if="isNotNullOrUndefined(optionForm.label.position)">
        <el-form-item label="位置">
          <el-radio-group v-model="optionForm.label.position" @change="updateConfig" size="small">
            <el-radio-button v-for="val in positionList" :label="val.label" :key="val.label">{{val.text}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isMiddle&&isNotNullOrUndefined(optionForm.label.adjustColor)" label="文本自动适应颜色"
                      label-width="160px">
          <el-switch v-model="optionForm.label.adjustColor" @change="updateConfig"></el-switch>
        </el-form-item>
        <el-form-item v-if="isMiddle&&isNotNullOrUndefined(optionForm.label.adjustPosition)" label="文本自动适应位置"
                      label-width="160px">
          <el-switch v-model="optionForm.label.adjustPosition" @change="updateConfig"></el-switch>
        </el-form-item>
      </div>
      <el-form-item v-if="isNotNullOrUndefined(optionForm.label.autoRotate)" label="标签自动旋转" label-width="120px">
        <el-switch v-model="optionForm.label.autoRotate" @change="updateConfig"></el-switch>
      </el-form-item>
      <div v-if="detail">
        <offset-option :option-form="optionForm" :object="optionForm.label"></offset-option>
        <style-option v-if="optionForm.label.style&&!styleDisabled" :option-form="optionForm"
                      :styles="optionForm.label.style"></style-option>
      </div>
    </el-form>
  </collapse-item>
</template>

<script>
  import CollapseItem from '../CollapseItem'
  import { updateMixin } from '../js/mixin'
  import OffsetOption from './OffsetOption'
  import StyleOption from './StyleOption'

  export default {
    name      : 'LineLabelOption',
    components: { StyleOption, OffsetOption, CollapseItem },
    mixins    : [updateMixin],
    props     : {
      detail       : {
        type   : Boolean,
        default: true
      },
      typeLabel    : {
        type   : String,
        default: '类型'
      },
      styleDisabled: {
        type   : Boolean,
        default: false
      }
    },
    computed  : {
      isMiddle () {
        return this.optionForm.label.position && this.optionForm.label.position === 'middle'
      },
      positionList () {
        if (this.isStack) {
          return [{ label: 'bottom', text: '底部' }]
        } else if (this.isPie) {
          return [{ label: 'inner', text: '底部' }, { label: 'out', text: '外部' }, { label: 'spider', text: '蜘蛛' }]
        } else {
          return [{ label: 'top', text: '顶部' }, { label: 'middle', text: '中部' }, { label: 'bottom', text: '底部' }]
        }
      },
    }
  }
</script>
