<template>
  <div class="TrendOption">
    <collapse-item title="趋势线" show-switch v-model="trendLine.visible" @change="updateConfig">
      <el-form label-width="80px">
        <el-form-item label="类型">
          <el-select v-model="trendLine.type" @change="updateConfig">
            <el-option v-for="val in typeList" :key="val" :value="val" :label="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示置信区间" label-width="120px">
          <el-switch v-model="trendLine.showConfidence" @change="updateConfig"></el-switch>
        </el-form-item>
        <style-option :option-form="optionForm" :styles="trendLine.style" collapse-title="趋势线样式"
                      :down-divider="false"></style-option>
        <style-option :option-form="optionForm" :styles="trendLine.confidenceStyle"
                      collapse-title="置信区间样式"></style-option>
      </el-form>
    </collapse-item>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CollapseItem from '../CollapseItem'
  import StyleOption from './StyleOption'

  export default {
    name      : 'TrendOption',
    components: { StyleOption, CollapseItem },
    mixins    : [updateMixin],
    computed  : {
      trendLine () {
        return this.optionForm.trendline
      },
      typeList () {
        return ['poly', 'linear', 'exp', 'loess', 'pow', 'quad', 'log']
      }
    }
  }
</script>

<style scoped lang="scss">
  .TrendOption {
  }
</style>
