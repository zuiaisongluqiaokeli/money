<template>
  <div class="chart-setting" :class="[resultData?'on-graph':'on-map']">
    <el-dialog v-loading="loading" width="100%" :title="title" visible :before-close="returnCallback" :modal="false">
      <div class="chart-setting-container">
        <div class="steps">
          <chart-header v-model="activeStep"></chart-header>
        </div>
        <div class="chart-view-main">
          <select-data v-if="activeStep===-1" :table-data="tableData" :fields="fields"
                       :default-selection="selectionProps"
                       @return="goBack" @next="finishSelectData"></select-data>
          <select-chart-type v-if="activeStep===0" @next="next" @return="goBack"></select-chart-type>
          <chart-option v-if="activeStep===1" :type="selectChartType" :table-data="tableData" @next="chartOptionNext"
                        @return="goBack"
                        :default-option="optionForm" :history-index="historyIndex"
                        :fields="selectionProps" :option-history="optionHistory"></chart-option>
          <export-option v-if="activeStep===2" :option-form="optionForm" :canvas="canvas" @return="goBack"
                         :table-data="tableData" :save="save"></export-option>
        </div>
      </div>
    </el-dialog>
    <div v-if="readOption" style="position: fixed;left: 0;top: 0;width: 100vw;z-index:2000">
      <Chart ref="chartRef" :type="optionForm.type" :option="optionForm"></Chart>
    </div>
  </div>
</template>

<script>
  import SelectChartType from './charts/SelectChartType'
  import ChartOption from './charts/ChartOption'
  import ExportOption from './charts/ExportOption'
  import ChartHeader from './charts/ChartHeader'
  import SelectData from './charts/SelectData'
  import { mapGetters, mapState } from 'vuex'
  import Chart from './charts/Chart'
  import { saveStatisticsChartImage } from '../../../assets/api/statisticAnalyze'

  export default {
    name      : 'chartView',
    components: { Chart, SelectData, ChartHeader, ExportOption, ChartOption, SelectChartType },
    props     : {
      returnCallback: {
        type    : Function,
        required: true
      },
      resultData    : {
        type   : Object,
        default: null
      },
      param         : {
        type: Object
      },
      title         : {
        type   : String,
        default: '数据统计'
      }
    },
    data () {
      return {
        activeStep     : -1,
        tableData      : [],
        fields         : [],
        selectionProps : [],
        selectChartType: '',
        optionForm     : {},
        canvas         : {},
        optionHistory  : [],
        historyIndex   : 0,
        result         : {},
        readOption     : false,
        loading        : false
      }
    },
    computed  : {
      ...mapGetters('graphInfo', ['graphName']),
      ...mapState('map', ['gisEntities', 'gisLines'])
    },
    methods   : {
      save (option) {
        saveStatisticsChartImage(this.param.id,option.img)
        .then(({data})=>{
          if(!data.success){
            return this.$message.error(data.msg||'保存失败')
          }
          this.$message.success('保存成功')
        })
      },
      goBack () {
        if (this.activeStep === -1) {
          this.returnCallback()
        } else {
          this.activeStep--
        }
      },
      initData () {
        this.optionForm = {}
        this.optionHistory = []
        this.historyIndex = 0
      },
      finishSelectData (val) {
        if (val instanceof Array) {
          this.selectionProps = val
          this.activeStep++
          this.tableData = this.tableData.map(item => {
            const obj = {}
            val.forEach(key => {
              obj[key] = item[key]
            })
            return obj
          })
          this.initData()
        } else if (typeof val === 'object') {
          if (val.data && val.fields && val.seriesList && val.originType.indexOf(val.type) >= 0) {
            val.id = 'chart' + new Date().getTime()
            this.optionForm = val
            this.tableData = val.data
            this.fields = val.fields
            this.selectionProps = val.fields
            this.selectChartType = val.originType
            this.readOption = true
            this.loading = true
            setTimeout(() => {
              this.loading = false
              this.canvas = this.$refs.chartRef.getCanvasAndData()[0]
              this.activeStep = 2
              this.readOption = false
            }, 1000)
          } else {
            this.$message.error('不是配置文件')
          }
        } else {
          this.$message.error('出错了')
        }
      },
      next (val) {
        this.selectChartType = val
        this.activeStep++
        this.initData()
      },
      chartOptionNext (array) {
        this.optionForm = array[0]
        this.canvas = array[1]
        this.tableData = array[2]
        this.optionHistory = Object.assign([], array[3])
        this.historyIndex = array[4]
        this.activeStep++
      },
      async getResult () {
        const edges = JSON.parse(JSON.stringify(this.gisLines))
        edges.forEach(v => {
          v.source = v.start
          v.target = v.end
        })
        const graphData = JSON.stringify({
          clusters: [],
          edges,
          vertices: this.gisEntities
        })
        const res = await Promise.all([
          this.$api.findAllStatisticCache('标签统计', graphData, this.graphName),
          this.$api.findAllStatisticCache('属性统计', graphData, this.graphName),
          this.$api.findAllStatisticCache('中心度统计', graphData, this.graphName),
          this.$api.findAllStatisticCache('三角统计', graphData, this.graphName),
        ])
        const data = [], types = ['标签统计', '属性统计', '中心度统计', '三角统计']
        for (let i = 0; i < res.length; i++) {
          const obj = JSON.parse(res[i].data.object)
          obj.forEach(v => v['type'] = types[i])
          data.push(...obj)
        }
        this.result = {
          data, fields: ['key', 'value', 'type']
        }
        // this.result = require('../views/charts/js/example')
      },
      wrapTableData(){
        this.tableData.forEach(val=>{
          Object.keys(val).forEach(key=>{
            if(!isNaN(val[key])){
              val[key]=Number(val[key])
            }
          })
        })
        console.log(this.tableData)
      }
    },
    created () {
      if (this.resultData) {
        this.result = this.resultData
        console.log(this.result)
        this.tableData = this.result.data
        this.fields = this.result.fields
        this.wrapTableData()
      } else {
        this.getResult().then(() => {
          console.log(this.result)
          this.tableData = this.result.data
          this.fields = this.result.fields
          this.wrapTableData()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .on-map {
    top: 3.58rem;
    /deep/ .el-dialog {
      margin-top: 3.58rem !important;
      max-height: calc(100vh - 3.58rem);
      height: calc(100vh - 3.58rem);
      display: flex;
      flex-direction: column;
    }
  }

  .on-graph {
    top: 0;
    /deep/ .el-dialog {
      margin-top: 0 !important;
      height: 100vh;
      max-height: 100vh !important;
      display: flex;
      flex-direction: column;
    }
  }

  .chart-setting {
    position: fixed;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    overflow: auto;

    .chart-setting-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .steps {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      border-bottom: 1px solid var(--border-color-extra-light);
    }

    .chart-view-main {
      flex-grow: 1;
      overflow: auto;
    }

    /deep/ .el-dialog__body {
      position: relative;
      flex-grow: 1;
      padding: 0;
    }

    /deep/ .el-dialog__header {
      flex-shrink: 0;
    }

    /deep/ .el-dialog__footer {
      display: none;
    }
  }
</style>
