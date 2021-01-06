<template>
  <div class="context-menu" :style="position">
    <div class="menu-container"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { emitter, EventType } from '../../src/EventEmitter'
import { mapState } from 'vuex'

export default {
  name: 'ContextMenu',
  props: {},

  data() {
    return {
      // 第一环
      dataInnerList: [
        { name: '拓展', icon: '\ue70e', angle: 1, action: 'expand' },
        { name: '删除', icon: '\ue683', angle: 1, action: 'delete' },
        // {
        //   name: '轨迹飞行',
        //   icon: '\ue814',
        //   angle: 1,
        //   action: 'SimulatedSatellite',
        // },
        // { name: '一键部署', icon: '\ue813', angle: 1, action: 'oneDeployment' },
        { name: '范围搜索', icon: '\ue8ef', angle: 1, action: 'scopeSearch' },
        { name: '范围切换', icon: '\ue814', angle: 1, action: 'scopeChange' },
        // { name: '雷达切换', icon: '\ue831', angle: 1, action: 'radarShow' },
      ],
      pieInnerData: [],

      // 第二环
      dataOuterList: [
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1, action: 'range' },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1, action: 'toggle-area' },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
      ],
      pieOuterData: [],

      // 第三环
      dataBigOuterList: [
        { name: '', action: '', angle: 1 },
        { name: '', action: '', angle: 1 },
        { name: '', action: '', angle: 1 },
        { name: '', action: '', angle: 1 },
        { name: '', action: 'range-setting', angle: 1 },
        { name: '', action: '', angle: 1 },
        { name: '', action: '', angle: 1 },
        { name: '', action: '', angle: 1 },
        { name: '', action: '', angle: 1 },
        { name: '', action: '', angle: 1 },
        { name: '', action: '', angle: 1 },
        { name: '', action: '', angle: 1 },
      ],
      pieBigOuterData: [],
      position: {
        top: 0,
        left: 0,
      },
      exit: null,
    }
  },
  computed: {
    ...mapState('map', ['rangeSetting']),
  },
  async mounted() {
    await this.$nextTick()
    this.initMenu()
  },

  beforeDestroy() {
    this.$el.parentNode.removeChild(this.$el)
  },

  methods: {
    handleClick(data) {
      // emitter.emit(EventType.CONTEXT_MENU_CLICK, data);
      emitter.emit('gis.context-menu-item-click', data)
    },
    /**
     * 初始化环形菜单，复制自`sectorMenu.vue`
     */
    initMenu() {
      const width = 360
      const height = 360
      const pie = d3.pie().value((d) => d.angle)

      this.pieInnerData = pie(this.dataInnerList)
      this.pieOuterData = pie(this.dataOuterList)
      this.pieBigOuterData = pie(this.dataBigOuterList)
      // console.log(this.pieInnerData)
      // console.log(this.pieOuterData)

      const svg = d3
        .select('.context-menu .menu-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      svg
        .append('circle')
        .attr('cx', 90)
        .attr('cy', 90)
        .attr('r', 88)
        .attr('transform', 'translate(' + 90 + ',' + 90 + ')')
        .attr('class', 'circle')
        .on('mouseenter', (d, i) => {
          clearTimeout(this.exit)
        })
        .on('mouseenter', (d, i) => {
          clearTimeout(this.exit)
          this.exit = setTimeout(() => {
            this.leaveMune()
          }, 500)
        })
      svg
        .append('circle')
        .attr('cx', 90)
        .attr('cy', 90)
        .attr('r', 25)
        .attr('transform', 'translate(' + 90 + ',' + 90 + ')')
        .attr('class', 'circle')
        .on('mouseenter', (d, i) => {
          clearTimeout(this.exit)
        })

      // 环形菜单第一环
      const arc = d3
        .arc() // 弧生成器
        .innerRadius(25) // 设置内半径
        .outerRadius(88) // 设置外半径

      const g = svg
        .selectAll('g')
        .data(this.pieInnerData)
        .enter()
        .append('g')
        .attr('class', 'g-box')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
        .attr('text-anchor', 'middle')
        .on('click', (d, i) => {
          const { data } = d

          this.handleClick(data)
        })
        .on('mouseenter', (d, i) => {
          clearTimeout(this.exit)
          this.menuInnerHover(i)
        })
        .on('mouseleave', (d, i) => {
          this.exit = setTimeout(() => {
            this.leaveMune()
          }, 500)
        })

      g.append('path')
        .attr('class', 'inner-path-box')
        .transition()
        .delay((d, i) => {
          return i * 70
        })
        .duration(70)
        .ease(d3.easeLinear)
        .attrTween('d', (d) => {
          const i = d3.interpolate(d.startAngle, d.endAngle)

          return (t) => {
            d.endAngle = i(t)
            return arc(d)
          }
        })

      g.append('title').text((d, i) => {
        return this.dataInnerList[i].name
      })

      g.append('text')
        .attr('transform', (d) => {
          return (
            'translate(' + arc.centroid(d).map((v, i) => (i ? v + 10 : v)) + ')'
          )
        })
        .attr('text-anchor', 'middle')
        .attr('fill', '#1C2833')
        .attr('style', 'font-size: 11px')
        .text((d, i) => {
          return this.dataInnerList[i].name
        })

      g.append('text')
        .attr('transform', (d) => {
          return (
            'translate(' + arc.centroid(d).map((v, i) => (i ? v - 5 : v)) + ')'
          )
        })
        .attr('text-anchor', 'middle')
        .attr('fill', '#1C2833')
        .attr('style', 'font-size: 16px')
        .attr('class', 'icon iconfont')
        .text((d, i) => {
          return this.dataInnerList[i].icon
        })

      // 环形菜单第二环
      const arcOuter = d3.arc().innerRadius(88).outerRadius(130)

      const gOuter = svg
        .selectAll('outer')
        .data(this.pieOuterData)
        .enter()
        .append('g')
        .attr('class', 'unshow outer')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
        .attr('text-anchor', 'middle')
        .on('click', (data, i) => {
          this.handleClick(data.data)
        })
        .on('mouseenter', (d, i) => {
          clearTimeout(this.exit)
          this.menuOuterHover(i)
        })
        .on('mouseleave', (d, i) => {
          this.exit = setTimeout(() => {
            this.leaveMune()
          }, 500)
        })

      gOuter
        .append('path')
        .attr('class', 'path-box')
        .transition()
        .delay((d, i) => {
          return i * 70
        })
        .duration(70)
        .ease(d3.easeLinear)
        .attrTween('d', (d) => {
          let i = d3.interpolate(d.startAngle, d.endAngle)
          return (t) => {
            d.endAngle = i(t)
            return arcOuter(d)
          }
        })

      gOuter.append('title').text((d, i) => {
        return this.dataOuterList[i].name
      })

      gOuter
        .append('text')
        .attr('transform', (d) => {
          return 'translate(' + arcOuter.centroid(d) + ')'
        })
        .attr('text-anchor', 'middle')
        .attr('fill', '#1C2833')
        .attr('style', 'font-size: 11px')
        // .attr('class', 'icon iconfont')
        .text((d, i) => {
          return this.dataOuterList[i].name
        })

      // 第三环
      let arcBigOuter = d3.arc().innerRadius(130).outerRadius(180)

      let gBigOuter = svg
        .selectAll('big-outer')
        .data(this.pieBigOuterData)
        .enter()
        .append('g')
        .attr('class', 'unshow big-outer')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
        .attr('text-anchor', 'middle')
        .on('click', (d) => {
          const { data } = d
          this.handleClick(data)
        })
        .on('mouseenter', (d, i) => {
          clearTimeout(this.exit)
        })
        .on('mouseleave', (d, i) => {
          this.exit = setTimeout(() => {
            this.leaveMune()
          }, 500)
        })
      gBigOuter
        .append('path')
        .attr('class', 'path-box')
        .transition()
        .delay((d, i) => {
          return i * 70
        })
        .duration(70)
        .ease(d3.easeLinear)
        .attrTween('d', (d) => {
          let i = d3.interpolate(d.startAngle, d.endAngle)
          return (t) => {
            d.endAngle = i(t)
            return arcBigOuter(d)
          }
        })

      gBigOuter
        .append('circle')
        .attr('transform', (d) => {
          return 'translate(' + arcBigOuter.centroid(d) + ')'
        })
        .attr('r', 20)
        .attr('class', 'edit')

      gBigOuter
        .append('text')
        .attr('transform', (d) => {
          return (
            'translate(' +
            arcBigOuter.centroid(d).map((v, i) => (i ? v + 5 : v)) +
            ')'
          )
        })
        .attr('text-anchor', 'middle')
        .attr('fill', '#1C2833')
        .attr('style', 'font-size: 11px')
        .text('开始')
        .on('click', (d) => {
          this.handleClick(d)
        })
    },

    // 鼠标悬浮第一环菜单按钮
    menuInnerHover(index) {
      let array
      document.querySelector('.hover')
        ? document.querySelector('.hover').classList.remove('hover')
        : ''
      document.querySelectorAll('.outer').forEach((v, i) => {
        v.setAttribute('class', 'unshow outer')
      })
      document.querySelectorAll('.big-outer').forEach((v, i) => {
        v.setAttribute('class', 'unshow big-outer')
      })
      switch (
        index
        // case 0:
        //   array = ['实体', '文本']
        //   document.querySelectorAll('.g-box')[index].classList.add('hover')
        //   document.querySelectorAll('.outer').forEach((v, i) => {
        //     if (array.indexOf(this.dataOuterList[i].name) !== -1) {
        //       v.querySelector('title').innerHTML = array[i]
        //       v.querySelector('text').innerHTML = array[i]
        //       v.setAttribute('class', 'g-box outer')
        //     }
        //   })
        //   break
        //第一层0-5，第二层0-11
        // case 2:
        //   array = ['设置航线']
        //   document.querySelectorAll('.g-box')[index].classList.add('hover')
        //   document.querySelectorAll('.outer').forEach((v, i) => {
        //     if (i === 4) {
        //       v.querySelector('title').innerHTML = array[0]
        //       v.querySelector('text').innerHTML = array[0]
        //       v.setAttribute('class', 'g-box outer')
        //     }
        //   })
        //   break
      ) {
      }
    },

    // 鼠标悬浮第二环菜单按钮
    menuOuterHover(index) {
      // let bigArray = ['实体', '文本']
      document.querySelector('.outer.hover')
        ? document.querySelector('.outer.hover').classList.remove('hover')
        : ''
      document.querySelectorAll('.big-outer').forEach((v, i) => {
        v.setAttribute('class', 'unshow big-outer')
      })

      document.querySelectorAll('.outer')[index].classList.add('hover')
      document
        .querySelectorAll('.big-outer')
        [index].setAttribute('class', 'big-outer')
      // switch (index) {
      //   case 0:

      //     break;
      //   case 1:
      //     breah;
      // }
      // bigArray.forEach((v, i) => {
      //   if (v === this.dataBigOuterList[index].name) {
      //     document
      //       .querySelectorAll('.big-outer')
      //       [i].setAttribute('class', 'g-box big-outer')
      //   }
      // })
    },
    leaveMune() {
      if (gisvis.contextMenu) {
        gisvis.contextMenu.destroy()
        gisvis.contextMenu = null
      }
      // emitter.emit(EventType.CONTEXT_MENU_REMOVE)
    },
  },
}
</script>

<style lang="scss" scoped>
.context-menu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .menu-container {
    font-size: 0;
  }

  & /deep/ {
    .circle {
      fill: transparent;
      stroke: #4a91e9;
      stroke-width: 2;
    }

    .g-box {
      fill: #25507d;
      cursor: pointer;

      &:hover {
        fill: #4a91e9;
      }

      .path-box {
        stroke: var(--sectorMenuHoverColor);
        stroke-width: 2;
      }
    }
    .big-outer {
      fill: transparent;
      cursor: default;
      .path-box {
        stroke-width: 0;
      }
      text,
      circle {
        cursor: pointer;
      }
      &:hover {
        fill: transparent;
        circle {
          fill: #4a91e9;
        }
      }
    }
    .hover {
      fill: #4a91e9;
    }
    .unshow {
      display: none;
    }
    .edit {
      stroke: var(--sectorMenuHoverColor);
      stroke-width: 2;
      fill: var(--sectorMenuColor);
    }

    text {
      fill: white;
    }
  }
}
</style>
