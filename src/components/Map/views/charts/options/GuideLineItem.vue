<template>
  <div class="GuideLineItem">
    <el-collapse-item>
      <template slot="title">
        <div class="guide-collapse-title">
          <span class="title">{{guideLine.text.content}}</span>
          <span class="remove" @click="removeGuideLine(index)">删除</span>
        </div>
      </template>
      <el-form label-width="100px">
        <el-form-item label="类型">
          <el-select v-model="type" @change="onTypeChange()">
            <el-option label="原始数据" :value="0"></el-option>
            <el-option label="绘图区域百分比" :value="1"></el-option>
            <el-option label="统计值" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="type!==2">
          <el-form-item label="起始X">
            <el-slider v-if="type===1" v-model="startX" :format-tooltip="formatTooltip" :max="100"
                       @change="onSliderXChange('startX','start')"></el-slider>
            <el-select v-else v-model="startX" @change="onSelectChange(startX,'start',0)">
              <el-option v-for="(d,index) in startXList" :value="d" :key="index" :label="d"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起始Y">
            <el-slider v-if="type===1" v-model="startY" :format-tooltip="formatTooltip" :max="100"
                       @change="onSliderYChange('startY','start')"></el-slider>
            <el-select v-else v-model="startY" @change="onSelectChange(startY,'start',1)">
              <el-option v-for="(d,index) in startYList" :value="d" :key="index" :label="d"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结束X">
            <el-slider v-if="type===1" v-model="endX" :format-tooltip="formatTooltip" :max="100"
                       @change="onSliderXChange('endX','end')"></el-slider>
            <el-select v-else v-model="endX" @change="onSelectChange(endX,'end',0)">
              <el-option v-for="(d,index) in endXList" :value="d" :key="index" :label="d"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结束Y">
            <el-slider v-if="type===1" v-model="endY" :format-tooltip="formatTooltip" :max="100"
                       @change="onSliderYChange('endY','end')"></el-slider>
            <el-select v-else v-model="endY" @change="onSelectChange(endY,'end',1)">
              <el-option v-for="(d,index) in endYList" :value="d" :key="index" :label="d"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="统计类型">
            <el-select v-model="statisticType" @change="onStatisticsChange">
              <el-option label="最大值" value="max"></el-option>
              <el-option label="最小值" value="min"></el-option>
              <el-option label="平均值" value="mean"></el-option>
              <el-option label="中位数" value="median"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="标题">
          <el-input v-model="guideLine.text.content" @change="updateConfig"></el-input>
        </el-form-item>
        <el-form-item label="标题位置">
          <el-radio-group v-model="guideLine.text.position" @change="updateConfig" size="small">
            <el-radio-button v-for="pos in positionList" :key="pos.label" :label="pos.value">{{pos.label}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <offset-option :option-form="optionForm" :object="guideLine.text" x-label="标题X偏移" y-label="标题Y偏移"
                       label-width="100px"></offset-option>
        <style-option :option-form="optionForm" :styles="guideLine.text.style" collapse-title="标题样式"
                      :down-divider="false"></style-option>
        <style-option :option-form="optionForm" :styles="guideLine.lineStyle" collapse-title="线条样式"
                      :down-divider="false"></style-option>
      </el-form>
    </el-collapse-item>
  </div>
</template>

<script>
  import OffsetOption from './OffsetOption'
  import StyleOption from './StyleOption'
  import { updateMixin } from '../js/mixin'

  export default {
    name      : 'GuideLineItem',
    components: { StyleOption, OffsetOption },
    mixins    : [updateMixin],
    props     : {
      guideLine: {
        type    : Object,
        required: true
      }
    },
    data () {
      return {
        positionList : [
          { label: '左', value: 'start' },
          { label: '中', value: 'center' },
          { label: '右', value: 'end' }
        ],
        startX       : '',
        startY       : '',
        endX         : '',
        endY         : '',
        type         : 0,
        statisticType: 'max',
      }
    },
    computed  : {
      dataList () {
        const xField = this.optionForm.xField
        const yField = this.optionForm.yField
        return this.optionForm.data.map(val => ({ x: val[xField], y: val[yField] }))
      },
      startXList () {
        return this.nonRepeat((this.startY ? this.dataList.filter(val => val.y === this.startY) : this.dataList), 'x')
      },
      startYList () {
        return this.nonRepeat(this.startX ? this.dataList.filter(val => val.x === this.startX) : this.dataList, 'y')
      },
      endXList () {
        return this.nonRepeat(this.endY ? this.dataList.filter(val => val.y === this.endY) : this.dataList, 'x')
      },
      endYList () {
        return this.nonRepeat(this.endX ? this.dataList.filter(val => val.x === this.endX) : this.dataList, 'y')
      },
    },
    methods   : {
      onSelectChange (value, field, index) {
        this.guideLine[field][index] = value
        const start = this.guideLine.start, end = this.guideLine.end
        if (start[0] && start[1] && end[0] && end[1]) {
          this.updateConfig()
        }
      },
      nonRepeat (val, key) {
        const res = new Set()
        val.forEach(v => res.add(v[key]))
        return Array.from(res)
      },
      onSliderXChange (key, field) {
        this.guideLine[field][0] = this[key] + '%'
        this.updateConfig()
      },
      onSliderYChange (key, field) {
        this.guideLine[field][1] = (100 - this[key]) + '%'
        this.updateConfig()
      },
      removeGuideLine (index) {
        this.$emit('delete', index)
      },
      onTypeChange () {
        delete this.guideLine.type
        delete this.guideLine.start
        delete this.guideLine.end
        if (this.type === 0) {
          this.guideLine.start = [this.startXList[0], this.startYList[0]]
          this.guideLine.end = [this.endXList[0], this.endYList[0]]
          this.startX = this.guideLine.start[0]
          this.endX = this.guideLine.end[0]
          this.startY = this.guideLine.start[1]
          this.endY = this.guideLine.end[1]
        } else if (this.type === 1) {
          this.guideLine.start = ['0%', '0%']
          this.guideLine.end = ['0%', '0%']
          this.startX = '0%'
          this.startY = '0%'
          this.endX = '0%'
          this.endY = '0%'
        } else {
          this.guideLine.type = this.statisticType
        }
        this.updateConfig()
      },
      onStatisticsChange () {
        this.guideLine.type = this.statisticType
        this.updateConfig()
      },
      formatTooltip (val) {
        return val + '%'
      }
    },
    created () {
      const start = this.guideLine.start, end = this.guideLine.end
      const reg = /^\d+%$/
      if (reg.test(start[0]) && reg.test(start[1]) && reg.test(end[0]) && reg.test(end[1])) {
        this.type = 1
        this.startX = parseInt(start[0].replace('%', ''))
        this.startY = 100 - parseInt(start[1].replace('%', ''))
        this.endX = parseInt(end[0].replace('%', ''))
        this.endY = 100 - parseInt(end[1].replace('%', ''))
      } else {
        this.type = 0
        this.startX = this.guideLine.start[0]
        this.startY = this.guideLine.start[1]
        this.endX = this.guideLine.end[0]
        this.endY = this.guideLine.end[1]
      }
    }
  }
</script>

<style scoped lang="scss">
  .GuideLineItem {
    .guide-collapse-title {
      display: flex;
      align-items: center;
      width: 100%;

      .title {
        display: inline-block;
        font-size: 14px;
        font-weight: bold;
      }

      .remove {
        display: none;
        cursor: pointer;
        font-size: 12px;
        color: red;
        margin-left: 15px;
        opacity: 0.7;
      }

      &:hover {
        .remove {
          display: inline-block;
        }
      }
    }

    /deep/ .el-collapse-item__header {
      border-bottom: none;
    }

    /deep/ .el-collapse, /deep/ .el-collapse-item__wrap {
      border: none;
    }
  }
</style>
