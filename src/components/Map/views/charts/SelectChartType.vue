<template>
  <div class="select-chart-type">
    <div class="title-search">
      <!--      <div class="search-button">-->
      <!--        <el-input v-model="searchTxt" style="width: 300px" placeholder="搜索图表"></el-input>-->
      <!--      </div>-->
      <div class="index">
        <a :class="{active:index===activeIndex}" @click="activeIndex=index" v-for="(val,index) in typesList"
           :key="val.label" :href="'#'+val.label">{{val.label}}</a>
      </div>
    </div>
    <div class="chart-types-container">
      <div class="chart-container">
        <div class="chart-types" v-for="types in typesList" v-if="types.types.length>0">
          <div class="big-type" :id="types.label">{{types.label}}</div>
          <el-row>
            <el-col :span="8" v-for="val in types.types" :key="val.type">
              <div class="chart-type" :class="{active:val===chartTypeObject}" @click="selectType(val)">
                <div class="label">{{val.label}}</div>
                <img :src="val.img">
                <div class="check" v-show="chartTypeObject===val">
                  <img src="@/assets/img/chart/check-a.svg">
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="chart-info-container">
        <div class="chart-info">
          <el-card v-show="chartInfo">
            <div class="name">{{chartInfo.name}}</div>
            <div class="field">定义</div>
            <div class="field-content">{{chartInfo.define}}</div>
            <div class="field">图表血缘</div>
            <div class="field-content">{{chartInfo.relate}}</div>
            <div class="field">视觉通道</div>
            <div class="field-content">{{chartInfo.visual}}</div>
            <div class="field">分析目的</div>
            <div class="field-content">{{chartInfo.purpose}}</div>
            <div class="field">数据准备</div>
            <div class="field-content">{{chartInfo.data}}</div>
          </el-card>
        </div>
        <div class="buttons">
          <el-button @click="goBack" type="info">返回</el-button>
          <el-button @click="next" type="primary">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name    : 'SelectChartType',
    data () {
      return {
        activeIndex    : 0,
        typeList       : [
          {
            label: '柱状图类',
            types: [
              {
                label: '柱状图', img: require('@/assets/img/chart/column-multi.png'), type: 'Column-multi',
                info : {
                  name   : '柱状图',
                  define : '使用柱形显示维度的数值。横轴显示分类维度，纵轴显示相应的值。',
                  relate : '统计图表 - 柱状图类',
                  visual : '位置、颜色',
                  purpose: '比较、趋势',
                  data   : '1 ~ 2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '分组柱状图', img: require('@/assets/img/chart/group-column.png'), type: 'GroupedColumn-multi',
                info : {
                  name   : '分组柱状图',
                  define : '使用颜色不同的柱形并排组成小组来显示各维度的数值。横轴标示出分组，颜色标示出分类，纵轴显示相应的值。',
                  relate : '统计图表 - 柱状图类',
                  visual : '颜色、位置',
                  purpose: '比较、分布、排名',
                  data   : '2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '堆叠柱状图', img: require('@/assets/img/chart/stack-column.png'), type: 'StackedColumn-multi',
                info : {
                  name   : '堆叠柱状图',
                  define : '使用颜色不同的堆叠的柱形来显示各维度的数值。横轴标示出第一个分类维度，颜色标示出第二个分类维度，纵轴显示相应的值。',
                  relate : '统计图表 - 柱状图类',
                  visual : '颜色、长度、位置',
                  purpose: '比较、组成、分布、排名',
                  data   : '2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '百分比堆叠柱状图',
                img  : require('@/assets/img/chart/percentage-stack-column.png'),
                type : 'PercentStackedColumn-multi',
                info : {
                  name   : '百分比堆叠柱状图',
                  define : '使用颜色不同的堆叠的柱形来显示各维度的数值。横轴标示出第一个分类维度，颜色标示出第二个分类维度，纵轴显示相应分类所占的百分比。',
                  relate : '统计图表 - 柱状图类',
                  visual : '颜色、长度',
                  purpose: '比较、组成、分布、占比',
                  data   : '2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '瀑布图', img: require('@/assets/img/chart/waterfall.png'), type: 'Waterfall',
                info : {
                  name   : '瀑布图',
                  define : '瀑布图形似瀑布流水，采用绝对值与相对值结合的方式，适用于表达数个特定数值之间的数量变化关系。',
                  relate : '统计图表 - 柱状图类',
                  visual : '颜色、长度、位置',
                  purpose: '比较、趋势',
                  data   : '1 个「有序名词」或「时间」或「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '直方图', img: require('@/assets/img/chart/histogram.png'), type: 'Histogram',
                info : {
                  name   : '直方图',
                  define : '直方图是一种统计报告图，由一系列高度不等的纵向条纹或线段表示数据分布的情况。',
                  relate : '统计图表 - 柱状图类',
                  visual : '位置',
                  purpose: '分布',
                  data   : '1 个「数值」字段'
                }
              },
            ]
          },
          {
            label: '条形图类',
            types: [
              {
                label: '条形图', img: require('@/assets/img/chart/bar.png'), type: 'Bar-multi',
                info : {
                  name   : '条形图',
                  define : '使用条形显示维度的数值。纵轴显示分类维度，横轴显示相应的值。',
                  relate : '统计图表 - 条形图类',
                  visual : '位置、颜色',
                  purpose: '比较、分布、排名',
                  data   : '1 ~ 2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '分组条形图', img: require('@/assets/img/chart/group-bar.png'), type: 'GroupedBar-multi',
                info : {
                  name   : '分组条形图',
                  define : '使用颜色不同的条形并排组成小组来显示维度的数值。纵轴标示出分组，颜色标示出分类，横轴显示相应的值。',
                  relate : '统计图表 - 条形图类',
                  visual : '颜色、位置',
                  purpose: '比较、分布、排名',
                  data   : '2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '堆叠条形图', img: require('@/assets/img/chart/stack-bar.png'), type: 'StackedBar-multi',
                info : {
                  name   : '堆叠条形图',
                  define : '使用颜色不同的堆叠的条形来显示各维度的数值。纵轴标示出第一个分类维度，颜色标示出第二个分类维度，横轴显示相应的值。',
                  relate : '统计图表 - 条形图类',
                  visual : '颜色、长度、位置',
                  purpose: '比较、组成、分布、排名',
                  data   : '2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '百分比堆叠条形图',
                img  : require('@/assets/img/chart/percent-stack-bar.png'),
                type : 'PercentStackedBar-multi',
                info : {
                  name   : '百分比堆叠条形图',
                  define : '使用颜色不同的堆叠的条形来显示各维度的数值。纵轴标示出第一个分类维度，颜色标示出第二个分类维度，横轴显示相应分类所占的百分比。',
                  relate : '统计图表 - 条形图类',
                  visual : '颜色、长度',
                  purpose: '比较、组成、分布、占比',
                  data   : '2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
            ]
          },
          {
            label: '折线图类',
            types: [
              {
                label: '折线图', img: require('@/assets/img/chart/line-two.png'), type: 'Line-multi',
                info : {
                  name   : '折线图',
                  define : '使用折线的线段显示数据在一个具有顺序性的维度上的变化。',
                  relate : '统计图表 - 折线图类',
                  visual : '位置、方向',
                  purpose: '比较、趋势',
                  data   : '1 个「时间」或「有序名词」字段\n' +
                    '0 ~ 1 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '阶梯图', img: require('@/assets/img/chart/lader-two.png'), type: 'StepLine-multi',
                info : {
                  name   : '阶梯图',
                  alias  : '阶梯线',
                  define : '折线根据分类字段分为多根在 x 方向（时间）的信息是完全一致、颜色及 y 方向（变量）信息不一致的折线，通常用作同一时间区间内多个变量发展趋势的对比。',
                  relate : '统计图表 - 折线图类',
                  visual : '位置、方向',
                  purpose: '比较、趋势',
                  data   : '1 个「时间」或「有序名词」字段\n' +
                    '0 ~ 1 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
            ]
          },
          {
            label: '面积图类',
            types: [
              {
                label: '面积图', img: require('@/assets/img/chart/area.png'), type: 'Area-multi',
                info : {
                  name   : '面积图',
                  define : '使用带填充区域的线段显示数据在一个具有顺序性的维度上的变化。',
                  relate : '统计图表 - 面积图类',
                  visual : '颜色、位置',
                  purpose: '比较、趋势',
                  data   : '1 个「时间」或「有序名词」字段\n' +
                    '0 ~ 1 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '堆叠面积图', img: require('@/assets/img/chart/stack-area.png'), type: 'StackedArea-multi',
                info : {
                  name   : '堆叠面积图',
                  define : '使用带不同样式的填充区域的层叠线段来显示多组数据在同一个具有顺序性的维度上的变化，线段在同一维度值上的端点高度按照数值累加。',
                  relate : '统计图表 - 面积图类',
                  visual : '颜色、长度',
                  purpose: '比较、组成、趋势',
                  data   : '1 个「时间」或「有序名词」字段\n' +
                    '1 个「数值」字段\n' +
                    '1 个「无序名词」字段'
                }
              },
              {
                label: '百分比堆叠图',
                img  : require('@/assets/img/chart/percent-stack-area.png'),
                type : 'PercentStackedArea-multi',
                info : {
                  name   : '百分比堆叠图',
                  define : '一种特殊的堆叠面积图，线段在同一维度值上的端点高度代表值在其中的占比，占比总和为百分之百。',
                  relate : '统计图表 - 面积图类',
                  visual : '颜色、长度',
                  purpose: '比较、组成、占比、趋势',
                  data   : '1 个「时间」或「有序名词」字段\n' +
                    '1 个「数值」字段\n' +
                    '1 个「无序名词」字段'
                }
              },
            ]
          },
          {
            label: '饼图类',
            types: [
              {
                label: '饼图', img: require('@/assets/img/chart/pie.png'), type: 'Pie-multi',
                info : {
                  name   : '饼图',
                  define : '通过扇形区块的颜色和弧长（角度、面积）来展现数据的分类和占比情况。',
                  relate : '统计图表 - 饼图类',
                  visual : '角度、面积、颜色',
                  purpose: '比较、组成、占比',
                  data   : '1 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '环形图', img: require('@/assets/img/chart/donut.png'), type: 'Donut-multi',
                info : {
                  name   : '环形图',
                  define : '通过弧形区块的颜色和弧长来展现数据的分类和占比情况。',
                  relate : '统计图表 - 饼图类',
                  visual : '弧长',
                  purpose: '比较、组成、占比',
                  data   : '1 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '玫瑰图', img: require('@/assets/img/chart/rose.png'), type: 'Rose',
                info : {
                  name   : '玫瑰图',
                  define : '通过扇形区块的颜色、弧长（角度、面积）和大小来展现数据的分类和占比情况。',
                  relate : '统计图表 - 饼图类',
                  visual : '角度、面积、颜色',
                  purpose: '比较、组成、占比',
                  data   : '1 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '堆叠玫瑰图', img: require('@/assets/img/chart/stacked-rose.png'), type: 'StackedRose-multi',
                info : {
                  name   : '堆叠玫瑰图',
                  define : '使用带不同样式的填充区域的层叠扇形来显示多组数据在同一个维度上的变化。',
                  relate : '统计图表 - 饼图类',
                  visual : '角度、面积、颜色',
                  purpose: '比较、组成、占比',
                  data   : '2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
              {
                label: '分组玫瑰图', img: require('@/assets/img/chart/group-rose.png'), type: 'GroupedRose-multi',
                info : {
                  name   : '分组玫瑰图',
                  define : '使用颜色不同的扇形来显示各维度的数值。',
                  relate : '统计图表 - 饼图类',
                  visual : '角度、面积、颜色',
                  purpose: '比较、组成、占比',
                  data   : '2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
            ]
          },
          {
            label: '散点图类',
            types: [
              {
                label: '散点图', img: require('@/assets/img/chart/scatter.png'), type: 'Scatter-multi',
                info : {
                  name   : '散点图',
                  define : '散点图是将所有的数据以不同颜色的点的形式展现在平面直角坐标系上的统计图表。',
                  relate : '统计图表 - 散点图类',
                  visual : '颜色、位置',
                  purpose: '比较、分布',
                  data   : '2 个「数值」字段\n' +
                    '0 ~ 1 个「无序名词」字段'
                }
              },
              {
                label: '气泡图', img: require('@/assets/img/chart/bubble.png'), type: 'Bubble-multi',
                info : {
                  name   : '气泡图',
                  define : '气泡图是一种多变量的统计图表，由笛卡尔坐标系（直角坐标系）和大小不一、颜色不同的圆组成，可以看作是散点图的变形。',
                  relate : '统计图表 - 散点图类',
                  visual : '颜色、位置、大小',
                  purpose: '比较、分布',
                  data   : '3 个「数值」字段\n' +
                    '0 ~ 1 个「无序名词」字段'
                }
              },
            ]
          },
          {
            label: '雷达图类',
            types: [
              {
                label: '雷达图', img: require('@/assets/img/chart/radar.png'), type: 'Radar-multi',
                info : {
                  name   : '雷达图',
                  define : '将不同系列的多个维度的数据量映射到坐标轴上，这些坐标轴起始于同一个圆心点，通常结束于圆周边缘，将同一组的点使用线连接起来，用颜色区分系列。',
                  relate : '统计图表 - 雷达图类',
                  visual : '颜色、位置',
                  purpose: '比较',
                  data   : '1 ~ 2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              }
            ]
          },
          {
            label: '热力图类',
            types: [
              {
                label: '热力图', img: require('@/assets/img/chart/heatmap.png'), type: 'Heatmap-multi',
                info : {
                  name   : '热力图',
                  define : '热力图，是一种通过对色块着色来显示数据的统计图表。',
                  relate : '统计图表 - 热力图类',
                  visual : '位置、颜色',
                  purpose: '分布',
                  data   : '3 个「数值」字段'
                }
              },
              {
                label: '密度热力图', img: require('@/assets/img/chart/density-heatmap.png'), type: 'DensityHeatmap-multi',
                info : {
                  name   : '密度热力图',
                  define : '密度热力图是一种绘制在地图之上散点区域型热力图。',
                  relate : '统计图表 - 热力图类',
                  visual : '位置、颜色',
                  purpose: '分布',
                  data   : '1 个「无序名词」或「有序名词」字段\n' +
                    '2 个「数值」字段'
                }
              },
            ]
          },
          {
            label: '漏斗图类',
            types: [
              {
                label: '漏斗图', img: require('@/assets/img/chart/funnel.png'), type: 'Funnel-multi',
                info : {
                  name   : '柱状图',
                  define : '用于表达数据从一个阶段到另一阶段逐步减少的过程。其中每个阶段的数据都表示为整体中的不同部分。',
                  relate : '统计图表 - 漏斗图类',
                  visual : '颜色、位置',
                  purpose: '比较、分布',
                  data   : '1 ~ 2 个「无序名词」字段\n' +
                    '1 个「数值」字段'
                }
              },
            ]
          },
        ],
        searchTxt      : '',
        chartInfo      : '',
        chartTypeObject: {}
      }
    },
    computed: {
      typesList () {
        const res = []
        this.typeList.forEach(val => {
          res.push({ label: val.label, types: val.types.filter(value => value.label.indexOf(this.searchTxt) >= 0) })
        })
        return res
      }
    },
    methods : {
      selectType (val) {
        this.chartTypeObject = val
        this.chartInfo = val.info
      },
      next () {
        this.$emit('next', this.chartTypeObject.type)
      },
      goBack () {
        this.$emit('return')
      }
    },
    created () {
      this.selectType(this.typeList[0].types[0])
    }
  }
</script>

<style scoped lang="scss">
  .select-chart-type {
    color: white;
    height: calc(100% - 20px);

    .title-search {
      padding-left: 20px;
      padding-right: 20px;

      .index {
        a {
          display: inline-block;
          padding-top: 18px;
          padding-bottom:  18px;
          text-decoration: none;
          margin-right: 24px;
          font-size: 14px;
        }

        a:active, a {
          color: var(--color-text-regular);
        }

        .active {
          color: #00b2ff
        }
      }
    }

    .chart-types-container {
      display: flex;
      position: relative;
      padding-top: 2px;
      padding-left: 20px;
      padding-right: 20px;
      overflow: auto;
      height: calc(100% - 40px);

      .big-type {
        margin-top: -20px;
        padding-top: 20px;
        padding-bottom: 10px;
        font-size: 20px;
        color: var(--color-text-regular);
      }

      .chart-type {
        position: relative;
        border: 2px solid transparent;
        border-radius: 3px;
        cursor: pointer;
        background-color: white;
        color: black;
        margin-right: 24px;
        margin-bottom: 24px;

        .label {
          font-size: 14px;
          padding-left: 20px;
          padding-top: 10px;
        }

        img {
          display: block;
          width: 100%;
        }

        .check{
          position: absolute;
          bottom: 0;
          right: 0;
          transform: translateY(4px) translateX(2px);
          img{
            width: 32px;
            height: 32px;
            display: block;
          }
        }
      }

      .active {
        border-color: var(--color-primary);
      }

      .chart-types-container {
        flex-grow: 1;
        margin-right: 30px;
      }

      .chart-info-container {
        width: 400px;
        flex-shrink: 0;
      }

      .chart-info {
        position: fixed;
        top: 190px;
        right: 20px;
        width: 400px;
        box-sizing: border-box;
        border-radius: 3px;

        .name {
          font-size: 16px;
        }
      }

      .buttons {
        position: fixed;
        right: 20px;
        bottom: 20px;
      }
    }

    .search-button {
      padding-bottom: 10px;
    }

    .name {
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 10px;
    }

    .field {
      font-weight: bold;
      padding-bottom: 5px;
    }

    .field-content {
      white-space: pre-wrap;
      padding-bottom: 15px;
    }
  }
</style>
