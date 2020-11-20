<template>
  <collapse-item class="LegendOption"
                 v-if="optionForm.multi" title="图例" show-switch v-model="optionForm.legend.visible"
                 @update="updateConfig">
    <el-form label-width="80px">
      <el-form-item label="方位">
        <el-radio-group size="small" v-model="position">
          <el-radio-button v-for="val in positionList" :key="val.label" :label="val.value">{{val.label}}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="directionLabel">
        <el-radio-group size="small" v-model="direction">
          <el-radio-button v-for="val in directionList" :key="val.label" :label="val.value">{{val.label}}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="isNotNullOrUndefined(optionForm.legend.marker)" label="符号">
        <el-select v-model="optionForm.legend.marker.symbol" @change="updateConfig">
          <el-option v-for="val in symbolList" :label="val.label" :key="val.label" :value="val.value"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="detail">
        <el-form-item label="翻页">
          <el-switch v-model="optionForm.legend.flipPage" @change="updateConfig"></el-switch>
        </el-form-item>
        <offset-option :option-form="optionForm" :object="optionForm.legend"></offset-option>
        <el-form-item v-if="isNotNullOrUndefined(optionForm.legend.marker)" label="符号大小">
          <el-input-number v-model="optionForm.legend.marker.style.r" :min="1" @change="updateConfig"></el-input-number>
        </el-form-item>
        <div v-if="isNotNullOrUndefined(optionForm.legend.title)">
          <el-form-item label="标题">
            <el-input v-model="optionForm.legend.title.text" @change="updateConfig"></el-input>
          </el-form-item>
          <el-collapse-transition>
            <style-option v-show="optionForm.legend.title.text.length>0" :option-form="optionForm"
                          :styles="optionForm.legend.title.style"
                          collapse-title="标题样式"></style-option>
          </el-collapse-transition>
        </div>
      </div>
    </el-form>
  </collapse-item>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CollapseItem from '../CollapseItem'
  import StyleOption from './StyleOption'
  import OffsetOption from './OffsetOption'

  export default {
    name      : 'LegendOption',
    components: { OffsetOption, StyleOption, CollapseItem },
    mixins    : [updateMixin],
    props     : {
      detail: {
        type   : Boolean,
        default: false
      }
    },
    data () {
      return {
        position               : 'top',
        direction              : 'left',
        directionLabel         : '水平位置',
        positionList           : [
          { label: '上', value: 'top' },
          { label: '下', value: 'bottom' },
          { label: '左', value: 'left' },
          { label: '右', value: 'right' }],
        horizontalDirectionList: [
          { label: '左', value: 'left' },
          { label: '中', value: 'center' },
          { label: '右', value: 'right' }],
        verticalDirectionList  : [
          { label: '顶', value: 'top' },
          { label: '中', value: 'center' },
          { label: '底', value: 'bottom' }],
        symbolList             : [
          { label: '圆', value: 'circle' },
          { label: '直线', value: 'line' },
          { label: '方形', value: 'square' },
          { label: '菱形', value: 'diamond' },
          { label: '三角形', value: 'triangle' },
        ]
      }
    },
    computed  : {
      directionList () {
        if (this.position === 'top' || this.position === 'bottom') {
          this.directionLabel = '水平位置'
          return this.horizontalDirectionList
        } else {
          this.directionLabel = '垂直位置'
          return this.verticalDirectionList
        }
      }
    },
    watch     : {
      position (val) {
        if (val === 'top' || val === 'bottom') {
          this.direction = 'left'
        } else {
          this.direction = 'top'
        }
        this.setLegendAlign()
      },
      direction () {
        this.setLegendAlign()
      }
    },
    methods   : {
      setLegendAlign (update = true) {
        this.optionForm.legend.position = this.position + '-' + this.direction
        update && this.updateConfig()
      },
    },
    created () {
      switch (this.optionForm.type) {
        case 'Line':
        default:
          this.position = 'top'
          this.direction = 'left'
          break
      }
      this.setLegendAlign(false)
    }
  }
</script>

<style scoped lang="scss">
  .LegendOption {
  }
</style>
