<template>
  <div class="CommonChartDetailOption">
    <el-form label-width="80px">
      <size-option :option-form="optionForm"></size-option>
      <theme-option :option-form="optionForm"></theme-option>
      <field-option :option-form="optionForm"></field-option>
      <collapse-item v-if="isNotNullOrUndefined(optionForm.title)" title="标题" show-switch
                     v-model="optionForm.title.visible" @update="updateConfig"
                     :default-expand="false">
        <el-form-item label="文本">
          <el-input v-model="optionForm.title.text" @change="updateConfig"></el-input>
        </el-form-item>
        <el-form-item label="位置">
          <el-radio-group v-model="optionForm.title.alignTo" @change="updateConfig">
            <el-radio-button label="left">左</el-radio-button>
            <el-radio-button label="middle">中</el-radio-button>
            <el-radio-button label="right">右</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <style-option :option-form="optionForm" :styles="optionForm.title.style" line-dash-label="虚线描边"
                      line-width-label="描边粗细" stroke-label="描边颜色"></style-option>
      </collapse-item>
      <collapse-item v-if="isNotNullOrUndefined(optionForm.description)" title="副标题" show-switch
                     v-model="optionForm.description.visible" @update="updateConfig"
                     :default-expand="false">
        <el-form-item label="文本">
          <el-input v-model="optionForm.description.text" @change="updateConfig"></el-input>
        </el-form-item>
        <el-form-item label="位置">
          <el-radio-group v-model="optionForm.description.alignTo" @change="updateConfig">
            <el-radio-button label="left">左</el-radio-button>
            <el-radio-button label="middle">中</el-radio-button>
            <el-radio-button label="right">右</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <style-option :option-form="optionForm" :styles="optionForm.description.style" line-dash-label="虚线描边"
                      line-width-label="描边粗细" stroke-label="描边颜色"></style-option>
      </collapse-item>
      <padding-option :option-form="optionForm"></padding-option>
      <legend-option v-if="isNotNullOrUndefined(optionForm.legend)" :option-form="optionForm" detail></legend-option>
      <collapse-item title="图形属性">
        <slot name="shape"></slot>
      </collapse-item>
      <slot></slot>
      <axis-option v-if="optionForm.yAxis" title="Y轴" :option-form="optionForm"
                   :axis="optionForm.yAxis"></axis-option>
      <axis-option v-if="optionForm.radiusAxis" title="径向轴" :option-form="optionForm"
                   :axis="optionForm.radiusAxis"></axis-option>
      <axis-option v-if="optionForm.xAxis" title="X轴" :option-form="optionForm"
                   :axis="optionForm.xAxis"></axis-option>
      <axis-option v-if="optionForm.angleAxis" title="角度轴" :option-form="optionForm"
                   :axis="optionForm.angleAxis"></axis-option>
      <tooltip-option v-if="optionForm.tooltip" :option-form="optionForm"></tooltip-option>
      <slider-option v-if="showSlider&&optionForm.interactions" :option-form="optionForm"></slider-option>
      <slot name="append"></slot>
      <guide-line-option v-if="isNotNullOrUndefined(optionForm.guideLine)"
                         :option-form="optionForm"></guide-line-option>
    </el-form>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import SizeOption from '../options/SizeOption'
  import CollapseItem from '../CollapseItem'
  import ThemeOption from '../options/ThemeOption'
  import StyleOption from '../options/StyleOption'
  import FieldOption from '../options/FieldOption'
  import LegendOption from '../options/LegendOption'

  import AxisOption from '../options/AxisOption'
  import TooltipOption from '../options/TooltipOption'
  import SliderOption from '../options/SliderOption'
  import PaddingOption from '../options/PaddingOption'
  import GuideLineOption from '../options/GuideLineOption'

  export default {
    name      : 'CommonChartDetailOption',
    components: {
      GuideLineOption,
      PaddingOption,
      SliderOption,
      LegendOption, FieldOption, StyleOption, ThemeOption, CollapseItem, SizeOption, TooltipOption,
      AxisOption,
    },
    mixins    : [updateMixin],
    props     : {
      showSlider: {
        type   : Boolean,
        default: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .CommonChartDetailOption {
  }
</style>
