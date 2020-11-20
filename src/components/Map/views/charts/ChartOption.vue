<template>
  <div class="chart-option" :class="{black:isBlack}">
    <div class="chart-panel">
      <div id="chart-container" class="chart-container">
        <div id="resize-card" class="resize-card" @mouseenter="onmouseenterResizeCard"
             @mouseleave="onmouseleaveResizeCard">
          <chart ref="chart" :option="optionForm" :type="chartType" @updateSize="updateSize" @click.stop=""></chart>
          <div class="resize-two-direction-right-top"
               :class="{'resize-icon-active':mousePoint,'default-cursor':mousePoint}"
               @mouseup="onmouseupResize"
               @mousedown="onmousedownResize($event,-1,1)" @mousemove="onmouseMoveTwoDirectionResize"></div>
          <div class="resize-two-direction-left-top"
               :class="{'resize-icon-active':mousePoint,'default-cursor':mousePoint}"
               @mouseup="onmouseupResize"
               @mousedown="onmousedownResize($event,-1,-1)" @mousemove="onmouseMoveTwoDirectionResize"></div>
          <div class="resize-two-direction-right-bottom"
               :class="{'resize-icon-active':mousePoint,'default-cursor':mousePoint}"
               @mouseup="onmouseupResize"
               @mousedown="onmousedownResize" @mousemove="onmouseMoveTwoDirectionResize"></div>
          <div class="resize-two-direction-left-bottom"
               :class="{'resize-icon-active':mousePoint,'default-cursor':mousePoint}"
               @mouseup="onmouseupResize"
               @mousedown="onmousedownResize($event,1,-1)" @mousemove="onmouseMoveTwoDirectionResize"></div>
        </div>
      </div>
      <float-util ref="floatUtilRef" :history="optionHistory" :history-index="historyIndex"></float-util>
    </div>
    <div class="option-forms">
      <el-tabs class="tabs" v-model="activeTab" stretch type="border-card">
        <el-tab-pane label="常用配置" name="0">
          <component :is="optionComponent" :option-form="optionForm"></component>
        </el-tab-pane>
        <el-tab-pane label="全部配置" name="1">
          <component :is="detailOptionComponent" :option-form="optionForm"></component>
        </el-tab-pane>
      </el-tabs>
      <div class="form-bottom-button">
        <el-button class="button" type="success" @click="goBack">返回</el-button>
        <el-button class="button" type="primary" @click="next">导出图表</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Chart from './Chart'
  import LineOption from './type/LineOption'
  import LineDetailOption from './type-detail/LineDetailOption'
  import ColumnOption from './type/ColumnOption'
  import ColumnDetailOption from './type-detail/ColumnDetailOption'
  import PieOption from './type/PieOption'
  import PieDetailOption from './type-detail/PieDetailOption'
  import ScatterOption from './type/ScatterOption'
  import ScatterDetailOption from './type-detail/ScatterDetailOption'
  import RadarOption from './type/RadarOption'
  import RadarDetailOption from './type-detail/RadarDetailOption'
  import AreaOption from './type/AreaOption'
  import AreaDetailOption from './type-detail/AreaDetailOption'
  import HeatmapOption from './type/HeatmapOption'
  import HeatmapDetailOption from './type-detail/HeatmapDetailOption'
  import FunnelDetailOption from './type-detail/FunnelDetailOption'
  import FunnelOption from './type/FunnelOption'
  import {
    EVENT_UPDATE_CONFIG,
    EVENT_UPDATE_SIZE,
    EVENT_UPDATE_THEME,
    eventBus
  } from './js/event'
  import FloatUtil from './FloatUtil'
  import { getDefaultCommonOption } from './js/util'
  import { mapState } from 'vuex'

  const minWidth = 500, minHeight = 200
  export default {
    name      : 'ChartOption',
    components: {
      FloatUtil,
      LineOption,
      Chart,
      LineDetailOption,
      ColumnOption,
      ColumnDetailOption,
      PieOption,
      PieDetailOption,
      ScatterOption,
      ScatterDetailOption,
      RadarOption,
      RadarDetailOption,
      AreaOption,
      AreaDetailOption,
      HeatmapOption,
      HeatmapDetailOption,
      FunnelDetailOption,
      FunnelOption
    },
    props     : {
      tableData    : {
        type    : Array,
        required: true
      },
      type         : {
        type    : String,
        required: true
      },
      fields       : {
        type    : Array,
        required: true
      },
      defaultOption: {
        type    : Object,
        required: false
      },
      optionHistory: {
        type    : Array,
        required: false
      },
      historyIndex : {
        type   : Number,
        default: 0
      }
    },
    computed  : {
      chartType () {
        return this.type.replace('-multi', '')
      },
      optionComponent () {
        return this.optionComponents[this.chartType]
      },
      detailOptionComponent () {
        return this.detailOptionComponents[this.chartType]
      },
      ...mapState('home', ['themeType']),
      isBlack(){
        return this.themeType==='black'
      },
    },
    data () {
      return {
        activeTab             : '0',
        optionForm            : {},
        optionComponents      : {
          Line                : 'LineOption',
          StepLine            : 'LineOption',
          Column              : 'ColumnOption',
          GroupedColumn       : 'ColumnOption',
          StackedColumn       : 'ColumnOption',
          PercentStackedColumn: 'ColumnOption',
          Waterfall           : 'ColumnOption',
          Histogram           : 'ColumnOption',
          Bar                 : 'ColumnOption',
          GroupedBar          : 'ColumnOption',
          PercentStackedBar   : 'ColumnOption',
          StackedBar          : 'ColumnOption',
          Pie                 : 'PieOption',
          Donut               : 'PieOption',
          Rose                : 'PieOption',
          StackedRose         : 'PieOption',
          GroupedRose         : 'PieOption',
          Scatter             : 'ScatterOption',
          Bubble              : 'ScatterOption',
          Radar               : 'RadarOption',
          Area                : 'AreaOption',
          PercentStackedArea  : 'AreaOption',
          StackedArea         : 'AreaOption',
          Heatmap             : 'HeatmapOption',
          DensityHeatmap      : 'HeatmapOption',
          Funnel              : 'FunnelOption'
        },
        detailOptionComponents: {
          Line                : 'LineDetailOption',
          StepLine            : 'LineDetailOption',
          Column              : 'ColumnDetailOption',
          GroupedColumn       : 'ColumnDetailOption',
          StackedColumn       : 'ColumnDetailOption',
          PercentStackedColumn: 'ColumnDetailOption',
          Waterfall           : 'ColumnDetailOption',
          Histogram           : 'ColumnDetailOption',
          Bar                 : 'ColumnDetailOption',
          GroupedBar          : 'ColumnDetailOption',
          PercentStackedBar   : 'ColumnDetailOption',
          StackedBar          : 'ColumnDetailOption',
          Pie                 : 'PieDetailOption',
          Donut               : 'PieDetailOption',
          Rose                : 'PieDetailOption',
          StackedRose         : 'PieDetailOption',
          GroupedRose         : 'PieDetailOption',
          Scatter             : 'ScatterDetailOption',
          Bubble              : 'ScatterDetailOption',
          Radar               : 'RadarDetailOption',
          Area                : 'AreaDetailOption',
          PercentStackedArea  : 'AreaDetailOption',
          StackedArea         : 'AreaDetailOption',
          Heatmap             : 'HeatmapDetailOption',
          DensityHeatmap      : 'HeatmapDetailOption',
          Funnel              : 'FunnelDetailOption'
        },
        resizeCard            : null,
        mousePoint            : false,
      }
    },
    methods   : {
      goBack(){
        this.$emit('return')
      },
      next () {
        const optionHistoryAndPointer = this.$refs.floatUtilRef.getOptionHistory()
        this.$emit('next', [this.optionForm, ...this.optionForm.chart.getCanvasAndData(), ...optionHistoryAndPointer])
      },
      onmousedownResize (e, row = 1, col = 1) {
        const el = this.resizeCard
        e = e || window.event
        this.mousePoint = {
          x     : e.clientX,
          y     : e.clientY,
          width : el.offsetWidth,
          height: el.offsetHeight,
          row, col
        }
        console.log(this.mousePoint)
      },
      onmouseupResize (e) {
        e = e || window.event
        this.mousePoint = false
        this.onmouseleaveResizeCard()
        const el = document.getElementById('resize-card')
        const width = Math.round(el.offsetWidth)
        const height = Math.round(el.offsetHeight)
        eventBus.$emit(EVENT_UPDATE_SIZE, width, height, true)
      },
      onmouseMoveTwoDirectionResize (e) {
        e = e || window.event
        if (this.mousePoint) {
          const el = this.resizeCard
          const xBias = (e.clientX - this.mousePoint.x) * this.mousePoint.col
          const yBias = (e.clientY - this.mousePoint.y) * this.mousePoint.row
          let width = this.mousePoint.width + xBias
          let height = this.mousePoint.height + yBias
          width = width <= minWidth ? minWidth : width
          height = height <= minHeight ? minHeight : height
          el.style.width = width + 'px'
          el.style.height = height + 'px'
          eventBus.$emit(EVENT_UPDATE_SIZE, width, height, true)
        }
      },
      onmouseenterResizeCard () {
        this.resizeCard = document.getElementById('resize-card')
      },
      onmouseleaveResizeCard () {
        // if (!this.resizeCard) return
        // const width = Math.round(this.resizeCard.offsetWidth)
        // const height = Math.round(this.resizeCard.offsetHeight)
        // if (width !== this.preWidth || height !== this.preHeight || width !== this.optionForm.width || height !== this.optionForm.height) {
        //   this.setSize(width, height, true)
        // }
        !this.mousePoint && (this.resizeCard = null)
      },
      onMouseScroll (e) {
        if (!this.resizeCard) return
        let width = Math.round(this.resizeCard.offsetWidth)
        let height = Math.round(this.resizeCard.offsetHeight)
        const chartContainerEl = document.getElementById('chart-container')
        const maxWidth = Math.round(chartContainerEl.offsetWidth)
        const maxHeight = Math.round(chartContainerEl.offsetHeight)
        e = e || window.event
        if (e.wheelDelta > 0) {
          const minHeight = 200, minWidth = 500
          if (width === minWidth && height === minHeight) return
          width -= 50
          height -= 50
          width = width < minWidth ? minWidth : width
          height = height < minHeight ? minHeight : height
        } else {
          if (width >= maxWidth && height >= maxHeight) return
          width += 50
          height += 50
          width = width > maxWidth ? maxWidth : width
          height = height > maxHeight ? maxHeight : height
        }
        e.preventDefault()
        this.setSize(width, height)
      },
      setSize (width, height, update) {
        if (this.resizeCard) {
          this.resizeCard.style.width = width + 'px'
          this.resizeCard.style.height = height + 'px'
        }
        eventBus.$emit(EVENT_UPDATE_SIZE, width, height, update)
      },
      updateSize (width, height, update) {
        const clear = !this.resizeCard
        if (!this.resizeCard) {
          this.resizeCard = document.getElementById('resize-card')
        }
        this.setSize(width, height, update)
        if (clear) this.resizeCard = null
      },
      onThemeChange () {
        const isDark = this.optionForm.theme === 'dark'
        if (isDark) {
          if (this.optionForm.title.style.fill === '#000000') {
            this.optionForm.title.style.fill = '#ffffff'
          }
          if (this.optionForm.description.style.fill === '#585b62') {
            this.optionForm.description.style.fill = '#aaaaaa'
          }
          if (this.optionForm.label && this.optionForm.label.style) {
            if (this.optionForm.label.style.fill === '#000000') {
              this.optionForm.label.style.fill = '#ffffff'
            }
          }
          this.updateConfig()
        } else {
          if (this.optionForm.title.style.fill === '#ffffff') {
            this.optionForm.title.style.fill = '#000000'
          }
          if (this.optionForm.description.style.fill === '#aaaaaa') {
            this.optionForm.description.style.fill = '#585b62'
          }
          if (this.optionForm.label && this.optionForm.label.style && this.optionForm.label.style.fill === '#ffffff') {
            this.optionForm.label.style.fill = '#000000'
          }
          this.updateConfig()
        }
      },
      updateConfig () {
        eventBus.$emit(EVENT_UPDATE_CONFIG)
      },
      // setYAxisMinAndMax () {
      //   if (this.optionForm.yAxis) {
      //     let min = 0, max = Number.MIN_SAFE_INTEGER
      //     const getYValue = (item) => {
      //       return item[this.optionForm.yField]
      //     }
      //     this.tableData.forEach(val => {
      //       const y = getYValue(val)
      //       min = Math.min(min, y)
      //       max = Math.max(max, y)
      //     })
      //     this.optionForm.yAxis.min = min
      //     this.optionForm.yAxis.max = max
      //     this.updateConfig()
      //   }
      // }
    },
    mounted () {
      this.optionForm.chart = this.$refs.chart
      window.addEventListener('mousewheel', this.onMouseScroll, { passive: false })
    },
    beforeDestroy () {
      window.removeEventListener('mousewheel', this.onMouseScroll)
      eventBus.$off(EVENT_UPDATE_THEME, this.onThemeChange)
      // eventBus.$off(EVENT_UPDATE_SERIES_LIST, this.setYAxisMinAndMax)
    },
    created () {
      const optionForm = getDefaultCommonOption()
      const assign = function (option) {
        Object.assign(optionForm, option)
        return appendOption
      }
      const fieldList = Object.assign([], this.fields)
      const getValidField = (type) => {
        if (type) {
          const firstData = this.tableData[0]
          for (let i = 0; i < fieldList.length; i++) {
            const field = fieldList[i]
            if (typeof firstData[field] === type) {
              fieldList.splice(i, 1)
              return field
            }
          }
          this.$message.warning('当前数据不适合此种图表')
          this.goBack()
        } else {
          const field = fieldList[0]
          fieldList.splice(0, 1)
          return field
        }
      }
      const setField = (fields = ['xField', 'yField'], types = []) => {
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i]
          optionForm[field] = getValidField(types[i])
        }
      }
      const appendOption = {
        title (title, subTitle) {
          optionForm.title.text = title
          optionForm.description.text = subTitle
          return this
        },
        tooltip () {
          return assign({
            tooltip: {
              visible       : true,
              shared        : true,
              showCrosshairs: false,
              offset        : 20,
            },
          })
        },
        xyField () {
          assign({
            xField: '',
            yField: '',
          })
          setField()
          return this
        },
        lineField () {
          assign({
            xField     : '',
            yField     : '',
            seriesField: '',
          })
          setField(['xField', 'yField', 'seriesField'])
          optionForm.fieldKey = 'seriesField'
          return this
        },
        columnField () {
          assign({
            xField    : '',
            yField    : '',
            colorField: '',
          })
          setField()
          optionForm.fieldKey = 'colorField'
          return this
        },
        groupColumnField (setGroupField) {
          assign({
            xField    : '',
            yField    : '',
            groupField: '',
          })
          if (setGroupField) {
            setField(['xField', 'yField', 'groupField'])
          } else {
            setField()
          }
          optionForm.fieldKey = 'groupField'
          return this
        },
        barColorField () {
          assign({
            colorField: ''
          })
          optionForm.colorField = optionForm.groupField
          return this
        },
        stackColumnField (setStackField) {
          assign({
            xField    : '',
            yField    : '',
            stackField: '',
          })
          if (setStackField) {
            setField(['xField', 'yField', 'stackField'])
          } else {
            setField()
          }
          optionForm.fieldKey = 'stackField'
          return this
        },
        histogramField () {
          assign({
            binField : '',
            binNumber: 0,
          })
          setField(['binField'],['number'])
          return this
        },
        pieField () {
          assign({
            angleField: '',
            colorField: ''
          })
          setField(['angleField', 'colorField'], ['number'])
          optionForm.fieldKey = 'colorField'
          return this
        },
        roseField () {
          assign({
            radiusField  : '',
            categoryField: '',
            colorField   : ''
          })
          setField(['radiusField', 'categoryField'])
          optionForm.fieldKey = 'categoryField'
          optionForm.colorField = optionForm.categoryField
          return this
        },
        groupRoseField () {
          assign({
            radiusField  : '',
            categoryField: '',
            colorField   : '',
            groupField   : ''
          })
          setField(['radiusField', 'categoryField', 'groupField'])
          optionForm.fieldKey = 'groupField'
          optionForm.colorField = optionForm.groupField
          return this
        },
        stackRoseField () {
          assign({
            radiusField  : '',
            categoryField: '',
            colorField   : '',
            stackField   : ''
          })
          setField(['radiusField', 'categoryField', 'stackField'])
          optionForm.fieldKey = 'stackField'
          optionForm.colorField = optionForm.stackField
          return this
        },
        bubbleField () {
          assign({
            xField    : '',
            yField    : '',
            colorField: '',
            sizeField : ''
          })
          setField(['xField', 'yField', 'colorField'])
          optionForm.fieldKey = 'colorField'
          optionForm.sizeField = optionForm.xField
          return this
        },
        scatterField () {
          assign({
            xField    : '',
            yField    : '',
            colorField: '',
          })
          setField(['xField', 'yField', 'colorField'])
          optionForm.fieldKey = 'colorField'
          return this
        },
        radarField () {
          assign({
            angleField : '',
            radiusField: '',
            seriesField: ''
          })
          setField(['angleField', 'radiusField', 'seriesField'])
          optionForm.fieldKey = 'seriesField'
          return this
        },
        heatMapField (sizeField) {
          assign({
            xField    : '',
            yField    : '',
            colorField: ''
          })
          if (sizeField) {
            assign({
              sizeField: ''
            })
          }
          setField(['xField', 'yField', 'colorField'])
          optionForm.fieldKey = 'colorField'
          return this
        },
        funnelField () {
          assign({
            compareField: '',
            xField      : '',
            yField      : '',
          })
          setField(['xField', 'yField'])
          optionForm.fieldKey = 'xField'
          return this
        },
        guideLine () {
          return assign({
            guideLine: []
          })
        },
        lineStyle () {
          return assign({
            lineStyle: {
              lineWidth: 2,
              lineDash : [0, 0],
              opacity  : 1
            }
          })
        },
        smooth () {
          return assign({
            smooth: false
          })
        },
        point () {
          return assign({
            point: {
              visible: false,
              shape  : 'circle',
              size   : 4,
              style  : {
                stroke: '#fff'
              },
            },
          })
        },
        axis () {
          return assign({
            xAxis: {
              visible : true,
              grid    : {
                visible: false
              },
              line    : {
                visible: true,
                style  : createLineStyle(1)
              },
              tickLine: {
                visible: false,
              },
              label   : {
                visible   : true,
                autoRotate: true,
                autoHide  : true,
                suffix    : ''
              },
              title   : {
                visible: true,
                offset : 30,
                text   : ''
              },
            },
            yAxis: {
              visible : true,
              grid    : {
                visible: false
              },
              line    : {
                visible: true,
                style  : createLineStyle(1)
              },
              tickLine: {
                visible: false,
              },
              label   : {
                visible   : true,
                autoRotate: true,
                autoHide  : true,
                suffix    : ''
              },
              title   : {
                visible: false,
                offset : 30,
                text   : ''
              },
            }
          })
        },
        xAxis () {
          return assign({
            xAxis: {
              visible : true,
              grid    : {
                visible: false
              },
              line    : {
                visible: true,
                style  : createLineStyle(1)
              },
              tickLine: {
                visible: false,
              },
              label   : {
                visible   : true,
                autoRotate: true,
                autoHide  : true,
                suffix    : ''
              },
              title   : {
                visible: true,
                offset : 30,
                text   : ''
              },
            }
          })
        },
        column (columnSize = 0) {
          return assign({
            columnSize,
            columnStyle: {
              stroke       : 'white',//描边
              lineWidth    : 0,
              lineDash     : [0, 0],
              opacity      : 1,
              fillOpacity  : 1,
              strokeOpacity: 1
            }
          })
        },
        waterfall () {
          return assign({
            waterfallStyle: {
              stroke       : 'white',//描边
              lineWidth    : 0,
              lineDash     : [0, 0],
              opacity      : 1,
              fillOpacity  : 1,
              strokeOpacity: 1
            },
            color         : {
              rising : '#ff0000',
              falling: '#00ff00',
              total  : '#aaaaaa'
            },
            leaderLine    : {
              visible: true,
              style  : {
                stroke   : '#d3d3d3',
                lineDash : [4, 2],
                lineWidth: 1
              }
            },
            showTotal     : {
              visible: true,
              label  : '总计值'
            },
            diffLabel     : {
              visible: true,
              style  : {
                fill     : '#ffffff',
                fontSize : 16,
                stroke   : '#000000',
                lineWidth: 1
              }
            }
          })
        },
        step () {
          return assign({
            step: 'hv'
          })
        },
        lineLabel () {
          return assign({
            label: {
              visible: false,
              type   : 'point',
              offsetX: 6,
              offsetY: 6,
              style  : {
                fill    : '#000000',
                fontSize: 14
              }
            }
          })
        },
        scatterLabel () {
          return assign({
            label: {
              visible: false,
              offsetX: 6,
              offsetY: 6,
              style  : {
                fill    : '#000000',
                fontSize: 14
              }
            }
          })
        },
        columnLabel (position = 'top') {
          return assign({
            label: {
              visible       : false,
              position,
              offsetX       : 0,
              offsetY       : 0,
              style         : {
                fontSize: 14
              },
              adjustColor   : true,
              adjustPosition: false
            }
          })
        },
        conversionTag () {
          return assign({
            conversionTag: {
              visible: false,
              size   : 32,
              spacing: 8,
              offset : 32,
              arrow  : {
                headSize: 12
              }
            }
          })
        },
        connectedArea () {
          return assign({
            connectedArea: {
              visible  : false,
              triggerOn: false
            }
          })
        },
        pie () {
          return assign({
            radius: 0.8
          })
        },
        donut () {
          return assign({
            innerRadius: 0.8
          })
        },
        pieTooltip (visible = true) {
          return assign({
            tooltip: {
              visible,
              offset: 20,
            },
          })
        },
        pieLabel (type) {
          return assign({
            label: {
              visible   : true,
              type,
              offsetX   : 6,
              offsetY   : 6,
              autoRotate: false,
              style     : {
                fill    : '#000000',
                fontSize: 12,
              }
            }
          })
        },
        statistic () {
          return assign({
            statistic: {
              visible   : true,
              totalLabel: '总计',
              content   : ''
            }
          })
        },
        scatter () {
          return assign({
            pointSize: 2,
            quadrant : {
              visible    : false,
              xBaseline  : 0,
              yBaseline  : 0,
              label      : {
                text : ['第2象限', '第3象限', '第1象限', '第4象限'],//顺序：2,3,1,4象限
                style: {
                  fill    : '#ccc',
                  fontSize: 16,
                  opacity : 1
                }
              },
              lineStyle  : {
                stroke   : '#000000',
                lineWidth: 1,
                opacity  : 1
              },
              regionStyle: [
                { fill: '#ffffff', opacity: 0 },//第2象限
                { fill: '#ffffff', opacity: 0 },//第3象限
                { fill: '#ffffff', opacity: 0 },//第1象限
                { fill: '#ffffff', opacity: 0 },//第4象限
              ]
            },
            trendline: {
              visible        : false,
              type           : 'poly',
              style          : {
                stroke   : '#000000',
                lineWidth: 1,
              },
              showConfidence : true,
              confidenceStyle: {
                fill   : '#ff0000',
                opacity: 0.1,
              },
            }
          })
        },
        bubble () {
          return assign({
            pointSize: [2, 30]
          })
        },
        line () {
          return assign({
            line: {
              visible: true,
              size   : 2,
              style  : {
                opacity : 1,
                stroke  : '#dddddd',
                lineDash: [0, 0]
              }
            },
          })
        },
        radar () {
          return assign({
            area      : {
              visible: true,
              style  : {
                opacity: 1
              }
            },
            angleAxis : {
              visible : true,
              line    : {
                visible: false,
              },
              tickLine: {
                visible: false,
              },
              grid    : {
                visible: true,
              },
              label   : {
                visible   : true,
                offset    : 8,
                autoRotate: true,
                autoHide  : true
              },
              title   : {
                visible: false,
              }
            },
            radiusAxis: {
              visible : true,
              line    : {
                visible: false,
              },
              tickLine: {
                visible: false,
              },
              grid    : {
                visible: true,
              },
              label   : {
                visible   : true,
                offset    : 8,
                autoRotate: true,
                autoHide  : true
              },
              title   : {
                visible: false,
              }
            },
          })
        },
        radarLabel () {
          return assign({
            label: {
              visible: false,
              offsetX: 6,
              offsetY: 6,
              style  : {
                fill    : '#000000',
                fontSize: 14,
              }
            }
          })
        },
        area () {
          return assign({
            areaStyle: {
              opacity: 1
            }
          })
        },
        heatMap () {
          return assign({
            color      : ['#295599', '#3e94c0', '#78c6d0', '#b4d9e4', '#fffef0', '#f9cdac', '#ec7d92', '#bc448c'],
            shapeSize  : [5, 50],
            shapeType  : 'rect',//circle
            forceSquare: false,
            label      : {
              visible       : false,
              offsetX       : 6,
              offsetY       : 6,
              adjustColor   : true,
              adjustPosition: true
            }
          })
        },
        densityHeatmap () {
          return assign({
            color    : ['#295599', '#3e94c0', '#78c6d0', '#b4d9e4', '#fffef0', '#f9cdac', '#ec7d92', '#bc448c'],
            intensity: 2,
            // label    : {
            //   visible       : false,
            //   offsetX       : 6,
            //   offsetY       : 6,
            //   adjustColor   : true,
            //   adjustPosition: true
            // }
          })
        },
        heatmapLegend () {
          return assign({
            legend: {
              position: '',
              visible : true,
            },
          })
        },
        funnel () {
          return assign({
            dynamicHeight: false,
            compareText  : {
              visible: false,
              offsetY: 0,
              style  : {
                fill    : '#000000',
                fontSize: 12
              }
            },
            percentage   : {
              visible: true,
              line   : {
                visible: true,
                style  : {
                  stroke   : '#dddddd',
                  lineWidth: 2
                }
              },
              text   : {
                content: '转化率',
                style  : {
                  fill    : '#000000',
                  fontSize: 14
                }
              },
              value  : {
                style: {
                  fill    : '#000000',
                  fontSize: 14
                }
              },
              offsetX: 6,
              offsetY: 6,
              spacing: 2
            }
          })
        },
      }
      optionForm.data = this.tableData
      optionForm.fields = this.fields
      optionForm.type = this.type.replace('-multi','')
      optionForm.originType=this.type
      optionForm.multi = this.type.indexOf('-multi') >= 0
      switch (this.chartType) {
        case 'Funnel':
          appendOption.title('漏斗图', '一个漏斗图').funnelField().funnel()
          break
        case 'DensityHeatmap':
          appendOption.title('密度热力图', '一个密度热力图').densityHeatmap().heatMapField().heatmapLegend()
          break
        case 'Heatmap':
          appendOption.title('热力图', '一个热力图').heatMap().heatMapField(true).heatmapLegend()
          break
        case 'StackedArea':
          appendOption.title('堆叠面积图', '一个堆叠面积图').stackColumnField(true).smooth().point().line().lineLabel().guideLine()
          break
        case 'PercentStackedArea':
          appendOption.title('百分比堆叠面积图', '一个百分比堆叠面积图').stackColumnField(true).smooth().point().line().lineLabel().guideLine()
          break
        case 'Area':
          appendOption.title('面积图', '一个面积图').lineField().smooth().point().line().lineLabel().guideLine()
          break
        case 'Radar':
          appendOption.title('雷达图', '一个雷达图').radarField().smooth().point().radarLabel().radar().line()
          break
        case 'Bubble':
          appendOption.title('气泡图', '一个气泡图').bubbleField().scatter().bubble().axis().scatterLabel()
          break
        case 'Scatter':
          appendOption.title('散点图', '一个散点图').scatterField().scatter().axis().scatterLabel()
          break
        case 'StackedRose':
          appendOption.title('堆叠玫瑰图', '一个堆叠玫瑰图').stackRoseField().pie().pieLabel('outer').pieTooltip()
          break
        case 'GroupedRose':
          appendOption.title('分组玫瑰图', '一个分组玫瑰图').groupRoseField().pie().pieLabel('outer').pieTooltip()
          break
        case 'Rose':
          appendOption.title('玫瑰图', '一个玫瑰图').roseField().pie().pieLabel('outer').pieTooltip()
          break
        case 'Pie':
          appendOption.title('饼图', '一个饼图').pieField().pie().pieLabel('spider').pieTooltip()
          break
        case 'Donut':
          appendOption.title('环形图', '一个环形图').pieField().pie().donut().pieLabel().pieTooltip(false).statistic()
          break
        case 'Bar':
          appendOption.title('条形图', '一个条形图').column().columnField().columnLabel().conversionTag().xAxis()
          break
        case 'Column':
          appendOption.title('柱状图', '一个柱状图').column().axis().guideLine().columnField().columnLabel().conversionTag()
          break
        case 'Histogram':
          appendOption.title('直方图', '一个直方图').column(null).axis().guideLine().histogramField().columnLabel()
          break
        case 'Waterfall':
          appendOption.title('瀑布图', '瀑布图').waterfall().axis().guideLine().xyField().columnLabel().conversionTag()
          break
        case 'GroupedBar':
          appendOption.title('分组条形图', '一个分组条形图').column().groupColumnField(true).columnLabel().barColorField().xAxis()
          break
        case 'GroupedColumn':
          appendOption.title('分组柱状图', '一个分组柱状图').column().axis().guideLine().groupColumnField().columnLabel().conversionTag()
          break
        case 'PercentStackedBar':
          appendOption.title('百分比堆叠条形图', '一个百分比堆叠条形图').column().barColorField()
            .stackColumnField(true).columnLabel('bottom').xAxis()
          break
        case 'PercentStackedColumn':
          appendOption.title('百分比堆叠柱状图', '一个百分比堆叠柱状图').column().axis().guideLine()
            .stackColumnField().columnLabel('bottom').connectedArea()
          break
        case 'StackedBar':
          appendOption.title('堆叠条形图', '一个堆叠条形图').column().guideLine()
            .stackColumnField(true).columnLabel('bottom').barColorField().xAxis()
          break
        case 'StackedColumn':
          appendOption.title('堆叠柱状图', '一个堆叠柱状图').column().axis().guideLine()
            .stackColumnField().columnLabel('bottom').connectedArea()
          break
        case 'StepLine':
          appendOption.title('阶梯图', '一个阶梯图').step().axis().lineField().lineStyle().point().lineLabel().guideLine()
          break
        case 'Line':
          appendOption.title('折线图', '一个折线图').lineField().lineStyle().smooth().point().axis().lineLabel().guideLine()
          break
        default:
          alert('未定义的类型：' + this.chartType)
          throw new Error('unknown type:' + this.chartType)
      }
      this.defaultOption && Object.assign(optionForm, this.defaultOption)
      this.optionForm = optionForm
      eventBus.$on(EVENT_UPDATE_THEME, this.onThemeChange)
      // eventBus.$on(EVENT_UPDATE_SERIES_LIST, this.setYAxisMinAndMax)
      // this.setYAxisMinAndMax()
    },
  }

  function createLineStyle (lineWidth) {
    return {
      stroke  : '#585b62',
      lineWidth,
      lineDash: [0, 0],
      opacity : 1,
    }
  }
</script>

<style scoped lang="scss">
  .chart-option {
    position: relative;
    display: flex;
    height: 100%;

    .chart-panel {
      position: relative;
      height: 100%;
      flex-grow: 1;

      .chart-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;

        .resize-card {
          position: relative;
          overflow: auto;
          background-color: white;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
          box-sizing: content-box;
        }

        .resize-icon {
          position: absolute;
          width: 20px;
          height: 20px;
        }

        .resize-two-direction-right-top {
          @extend .resize-icon;
          right: 0;
          top: 0;
          cursor: ne-resize;
        }

        .resize-two-direction-left-top {
          @extend .resize-icon;
          left: 0;
          top: 0;
          cursor: nw-resize;
        }

        .resize-two-direction-right-bottom {
          @extend .resize-icon;
          right: 0;
          bottom: 0;
          cursor: se-resize;
        }

        .resize-two-direction-left-bottom {
          @extend .resize-icon;
          left: 0;
          bottom: 0;
          cursor: sw-resize;
        }

        .resize-icon-active {
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: transparent;
          z-index: 10000;
        }

        .default-cursor {
          cursor: default;
        }
      }
    }

    .option-forms {
      flex-shrink: 0;
      width: 300px;
      height: 100%;
      overflow: auto;
      padding-bottom: 50px;
      box-sizing: border-box;

      .tabs {
        min-height: 100%;
        flex-grow: 1;
      }

      .form-bottom-button {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 300px;
        height: 50px;
        z-index: 100;

        .button {
          width: 50%;
          height: 100%;
          text-align: center;
          color: white;
          font-size: 16px;
          border-radius: 0;
          margin: 0;
        }
      }
    }
    /deep/ .el-tabs__item{
      border-bottom: 1px solid var(--border-color-base);
      border-left: 1px solid var(--border-color-base);
      transition: none;
    }
    /deep/ .is-active{
      border-bottom: none !important;
    }
  }
  .black{
    /deep/ .el-tabs__item{
      background-color: #414141;
    }
  }
</style>
