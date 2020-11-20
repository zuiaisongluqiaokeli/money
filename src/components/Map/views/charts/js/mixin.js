import { EVENT_RE_RENDER, EVENT_UPDATE_CONFIG, eventBus } from './event'
import { pop } from 'echarts/src/component/dataZoom/history'

export const updateMixin = {
  props   : {
    optionForm: {
      type    : Object,
      required: true
    }
  },
  computed: {
    isLine () {
      return this.optionForm.type === 'Line'
    },
    isStepLine () {
      return this.optionForm.type === 'StepLine'
    },
    isHistogram () {
      return this.optionForm.type === 'Histogram'
    },
    isWaterfall () {
      return this.optionForm.type === 'Waterfall'
    },
    isStackColumn () {
      return this.optionForm.type === 'StackedColumn' || this.optionForm.type === 'PercentStackedColumn'
    },
    assignedStackField () {
      return this.isNotNullOrUndefined(this.optionForm.stackField) && this.optionForm.stackField.length > 0
    },
    isBar () {
      return this.optionForm.type.indexOf('Bar') >= 0
    },
    isStackBar () {
      return this.optionForm.type === 'StackedBar' || this.optionForm.type === 'PercentStackedBar'
    },
    isPie () {
      return this.optionForm.type === 'Pie' || this.optionForm.type === 'Donut'
    },
    isDonut () {
      return this.optionForm.type === 'Donut'
    },
    isRose () {
      return this.optionForm.type.indexOf('Rose') >= 0
    },
    isArea () {
      return this.optionForm.type.indexOf('Area') >= 0
    },
    labelTypeList () {
      if (this.isPie) {
        return [{ label: 'inner', text: '内部' }, { label: 'outer-center', text: '外部' }, {
          label: 'spider',
          text : '蜘蛛'
        }]
      } else if (this.isRose) {
        return [{ label: 'inner', text: '内部' }, { label: 'outer', text: '外部' }]
      } else if (this.isArea) {
        return [{ label: 'line', text: '线' }, { label: 'point', text: '点' }, { label: 'area', text: '区域' }]
      } else {
        return [{ label: 'line', text: '线' }, { label: 'point', text: '点' }]
      }
    },
    shapeList () {
      return [
        { label: '圆', value: 'circle' },
        { label: '直线', value: 'line' },
        { label: '方形', value: 'square' },
        { label: '菱形', value: 'diamond' },
        { label: '三角形', value: 'triangle' },
      ]
    }
  },
  methods : {
    forceUpdate(){
      this.$forceUpdate()
    },
    updateConfig () {
      eventBus.$emit(EVENT_UPDATE_CONFIG)
    },
    repaint () {
      eventBus.$emit(EVENT_RE_RENDER)
    },
    isNotNullOrUndefined (...val) {
      for (let valElement of val) {
        if (valElement === null || valElement === undefined) return false
      }
      return true
    }
  }
}
