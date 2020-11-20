<template>
  <collapse-item title="字段映射" class="FieldOption">
    <el-form label-width="80px">
      <el-form-item :label="field1Label.label" required>
        <el-select v-model="field1" @change="onFieldChange('field1',field1Label)" filterable>
          <el-option v-for="val in fieldList1" :key="val" :label="val" :value="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="field2Label.label" :label="field2Label.label" required>
        <el-select v-model="field2" @change="onFieldChange('field2',field2Label)" filterable>
          <el-option v-for="val in optionForm.fields" :key="val" :label="val" :value="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="field3Label.label" :label="field3Label.label" :required="field3Label.required">
        <el-select v-model="field3" @change="onFieldChange('field3',field3Label)" :clearable="!field3Label.required" filterable>
          <el-option v-for="val in optionForm.fields" :key="val" :label="val" :value="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="field4Label.label" :label="field4Label.label">
        <el-select v-model="field4" @change="onFieldChange('field4',field4Label)" clearable filterable>
          <el-option v-for="val in optionForm.fields" :key="val" :label="val" :value="val"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </collapse-item>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CollapseItem from '../CollapseItem'
  import { getFieldListByType } from '../js/util'

  export default {
    name      : 'FieldOption',
    components: { CollapseItem },
    mixins    : [updateMixin],
    data () {
      return {
        field1: '',
        field2: '',
        field3: '',
        field4: '',
      }
    },
    computed  : {
      type () {
        return this.optionForm.type
      },
      field1Label () {
        switch (this.type) {
          case 'Funnel':
            this.field1 = this.optionForm.xField
            return { label: '类别', value: 'xField' }
          case 'Rose':
          case 'StackedRose':
          case 'GroupedRose':
          case 'Radar':
            this.field1 = this.optionForm.radiusField
            return { label: '值', value: 'radiusField' }
          case 'Pie':
          case 'Donut':
            this.field1 = this.optionForm.angleField
            return { label: '值', value: 'angleField', type: 'number' }
          case 'Histogram':
            this.field1 = this.optionForm.binField
            return { label: '值', value: 'binField', type: 'number' }
          case 'Line':
          default:
            this.field1 = this.optionForm.xField
            return { label: 'X轴', value: 'xField' }
        }
      },
      field2Label () {
        switch (this.type) {
          case 'Funnel':
            this.field2 = this.optionForm.yField
            return { label: '值', value: 'yField' }
          case 'Radar':
            this.field2 = this.optionForm.angleField
            return { label: '类别', value: 'angleField' }
          case 'Rose':
          case 'StackedRose':
          case 'GroupedRose':
            this.field2 = this.optionForm.categoryField
            return { label: '类别', value: ['categoryField', 'colorField'] }
          case 'Pie':
          case 'Donut':
            this.field2 = this.optionForm.colorField
            return { label: '类别', value: 'colorField' }
          case 'Histogram':
            return {}
          case 'Line':
          default:
            this.field2 = this.optionForm.yField
            return { label: 'Y轴', value: 'yField' }
        }
      },
      field3Label () {
        switch (this.type) {
          case 'Funnel':
            this.field3 = this.optionForm.compareField
            return this.optionForm.multi ? { label: '值', value: 'compareField' } : {}
          case 'Heatmap':
          case 'DensityHeatmap':
            this.field3 = this.optionForm.colorField
            return this.optionForm.multi ? { label: '值', value: 'colorField', required: true } : {}
          case 'StackedRose':
            this.field3 = this.optionForm.stackField
            this.optionForm.colorField = this.optionForm.stackField
            return this.optionForm.multi ? { label: '类型', value: ['colorField', 'stackField'] } : {}
          case 'GroupedRose':
            this.field3 = this.optionForm.groupField
            this.optionForm.colorField = this.optionForm.groupField
            return this.optionForm.multi ? { label: '类型', value: ['groupField', 'colorField'] } : {}
          case 'Pie':
          case 'Donut':
          case 'Rose':
            return {}
          case 'GroupedColumn':
          case 'GroupedBar':
            this.field3 = this.optionForm.groupField
            this.optionForm.colorField = this.optionForm.groupField
            return this.optionForm.multi ? { label: '类型', value: ['groupField', 'colorField'] } : {}
          case 'Column':
          case 'Bar':
          case 'Waterfall':
          case 'Scatter':
          case 'Bubble':
            this.field3 = this.optionForm.colorField
            return this.optionForm.multi ? { label: '类型', value: 'colorField' } : {}
          case 'PercentStackedColumn':
          case 'StackedColumn':
            this.field3 = this.optionForm.stackField
            return this.optionForm.multi ? { label: '类型', value: 'stackField' } : {}
          case 'PercentStackedBar':
          case 'PercentStackedArea':
          case 'StackedBar':
          case 'StackedArea':
            this.field3 = this.optionForm.stackField
            this.optionForm.colorField = this.optionForm.stackField
            return this.optionForm.multi ? { label: '类型', value: ['stackField', 'colorField'] } : {}
          case 'Line':
          default:
            this.field3 = this.optionForm.seriesField
            return this.optionForm.multi ? { label: '类型', value: 'seriesField' } : {}
        }
      },
      field4Label () {
        switch (this.type) {
          case 'Bubble':
            this.field4 = this.optionForm.sizeField
            return this.optionForm.multi ? { label: '点大小', value: 'sizeField' } : {}
          case 'Heatmap':
            this.field4 = this.optionForm.sizeField
            return this.optionForm.multi ? { label: '大小', value: 'sizeField' } : {}
          default:
            return {}
        }
      },
      fieldList1 () {
        if (this.field1Label.type) {
          return getFieldListByType(this.optionForm.fields, this.optionForm.data[0], this.field1Label.type)
        }
        return this.optionForm.fields
      },
      fieldList2 () {
        return this.optionForm.fields.filter(val => val !== this.field1)
      },
      fieldList3 () {
        return this.optionForm.fields.filter(val => val !== this.field1 && val !== this.field2)
      },
      fieldList4 () {
        return this.optionForm.fields
      },
    },
    methods   : {
      setField (fieldProp, fieldLabel) {
        if (fieldLabel.value instanceof Array) {
          fieldLabel.value.forEach(val => this.optionForm[val] = this[fieldProp])
        } else {
          this.optionForm[fieldLabel.value] = this[fieldProp]
        }
      },
      onFieldChange (fieldProp, fieldLabel) {
        this.setField(fieldProp, fieldLabel)
        // this.checkField()
        // this.isBar ? this.repaint() : this.updateConfig()
        this.updateConfig()
      },
      // checkField (f1=0,f2=1,f3=3) {
      // if (this.field1 === this.field2) {
      //   this.field2 = this.fieldList2[0]
      //   this.setField('field2',this.field2Label)
      // }
      // if(this.field3Label.required){
      //   if (this.field1 === this.field3) {
      //     this.field3 = this.fieldList3[0]
      //     this.setField('field3',this.field3Label)
      //   }
      //   if (this.field2 === this.field3) {
      //     this.field3 = this.fieldList3[0]
      //     this.setField('field3',this.field3Label)
      //   }
      // }
      // }
    }
  }
</script>

<style scoped lang="scss"></style>
