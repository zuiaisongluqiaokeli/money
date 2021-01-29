<template>
  <div class="context-menu sectorMenu" :style="position">
    <div class="menu-container"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { emitter, EventType } from '../../src/EventEmitter'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'ContextMenu',
  props: {},

  data() {
    return {
      // 第一环
      // dataInnerList: [
      //   { name: '拓展', icon: '\ue70e', angle: 1, action: 'expand' },
      //   { name: '删除', icon: '\ue683', angle: 1, action: 'delete' },
      //   // {
      //   //   name: '轨迹飞行',
      //   //   icon: '\ue814',
      //   //   angle: 1,
      //   //   action: 'SimulatedSatellite',
      //   // },
      //   // { name: '一键部署', icon: '\ue813', angle: 1, action: 'oneDeployment' },
      //   { name: '距离搜索', icon: '\ue8ef', angle: 1, action: 'scopeSearch' },
      //   { name: '范围切换', icon: '\ue814', angle: 1, action: 'scopeChange' },
      //   { name: '信息切换', icon: '\ue814', angle: 1, action: 'scopeInfo' },
      //   // { name: '雷达切换', icon: '\ue831', angle: 1, action: 'radarShow' },
      // ],
      dataInnerList: [
        { name: '拓展', icon: '\ue70c', angle: 1, action: '' },
        { name: '范围切换', icon: '\ue70e', angle: 1, action: 'scopeChange' },
        { name: '距离搜索', icon: '\ue765', angle: 1, action: 'scopeSearch' },
        { name: '信息显示', icon: '\ue6ff', angle: 1, action: 'scopeInfo' },
        { name: '删除', icon: '\ue683', angle: 1, action: 'delete' },
      ],
      dataInnerSet: [],
      // d3饼状图数据
      pieInnerData: '',

      // 第二环
      dataOuterList: [
        { name: '所有', icon: '', angle: 1, action: 'expand' },
        { name: '按类型', icon: '', angle: 1, action: 'expandType' },
        { name: '按维度', icon: '', angle: 1, action: 'expandLatitude' },
        { name: '网格', icon: '', angle: 1 },
        { name: '水平', icon: '', angle: 1 },
        { name: '垂直', icon: '', angle: 1 },
        { name: '径向', icon: '', angle: 1 },
        { name: '组件分析', icon: '', angle: 1 },
        { name: '发展演变', icon: '', angle: 1 },
        { name: '组织分析', icon: '', angle: 1 },
        { name: '战技列表', icon: '', angle: 1 },
      ],
      // dataOuterList: [
      //   { name: '', icon: '', angle: 1 },
      //   { name: '', icon: '', angle: 1 },
      //   { name: '', icon: '', angle: 1 },
      //   { name: '', icon: '', angle: 1 },
      //   { name: '', icon: '', angle: 1, action: 'range' },
      //   { name: '', icon: '', angle: 1 },
      //   { name: '', icon: '', angle: 1 },
      //   { name: '', icon: '', angle: 1, action: 'toggle-area' },
      //   { name: '', icon: '', angle: 1 },
      //   { name: '', icon: '', angle: 1 },
      //   { name: '', icon: '', angle: 1 },
      //   { name: '', icon: '', angle: 1 },
      // ],
      dataOuterSet: [],
      // d3饼状图数据
      pieOuterData: '',

      // 第三环
      // dataBigOuterList: [
      //   { name: '', action: '', angle: 1 },
      //   { name: '', action: '', angle: 1 },
      //   { name: '', action: '', angle: 1 },
      //   { name: '', action: '', angle: 1 },
      //   { name: '', action: 'range-setting', angle: 1 },
      //   { name: '', action: '', angle: 1 },
      //   { name: '', action: '', angle: 1 },
      //   { name: '', action: '', angle: 1 },
      //   { name: '', action: '', angle: 1 },
      //   { name: '', action: '', angle: 1 },
      //   { name: '', action: '', angle: 1 },
      //   { name: '', action: '', angle: 1 },
      // ],
      // 菜单最外环
      dataBigOuterList: [
        { name: '按类型', icon: '', angle: 1, action: 'expandType' },
        { name: '按时间', icon: '', angle: 1 },
        { name: '按维度', icon: '', angle: 1, action: 'expandLatitude' },
        { name: '按权重', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
        { name: '', icon: '', angle: 1 },
      ],
      position: {
        top: 0,
        left: 0,
      },
      dataBigOuterSet: [],
      // d3饼状图数据
      pieBigOuterData: '',
      exit: null,
    }
  },
  computed: {
    ...mapState('map', ['rangeSetting']),
    ...mapGetters('menuControl', ['basicInfoPanels', 'rightClickMenu']),
    ...mapGetters('canvasInfo', ['selectedVerticeIds']),
    ...mapState('contextMenu', ['x', 'y', 'vertice']),
    ...mapState('home', ['startTime', 'endTime', 'menuTypes']),
    ...mapState('graphInfo', ['name']),
    ...mapState('userInfo', ['backendConfig', 'expandFilter']),
    ...mapState('canvasInfo', ['graphData', 'clusterCacheKey']),
    ...mapState('caseAnalysis', ['caseType']),
    ...mapState('menuControl', ['menuPermission']),
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
      emitter.emit('gis.context-menu-item-click', data)
    },
    /**
     * 初始化环形菜单，复制自`sectorMenu.vue`
     */
    initMenu() {
      const width = 360
      const height = 360
      const pie = d3.pie().value((d) => d.angle)
      // 环形菜单内环
      // this.dataInnerList.forEach((v) => this.dataInnerSet.push(1))
      // let pie = d3.pie()
      // this.pieInnerData = pie(this.dataInnerSet)

      // // 环形菜单外环
      // this.dataOuterList.forEach((v) => this.dataOuterSet.push(1))
      // this.pieOuterData = pie(this.dataOuterSet)

      // // 环形菜单最外环
      // this.dataBigOuterList.forEach((v) => this.dataBigOuterSet.push(1))
      // this.pieBigOuterData = pie(this.dataBigOuterSet)
      // clearTimeout(this.exit)
      // this.exit = setTimeout(() => {
      //   this.leaveMune()
      // }, 500)

      this.pieInnerData = pie(this.dataInnerList)
      this.pieOuterData = pie(this.dataOuterList)
      this.pieBigOuterData = pie(this.dataBigOuterList)
      // console.log(this.pieInnerData)
      // console.log(this.pieOuterData)

      let svg = d3
        .select('.context-menu .menu-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      // 这里应该注释
      svg
        .append('circle')
        .attr('cx', 90)
        .attr('cy', 90)
        .attr('r', 85)
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
        .attr('r', 30)
        .attr('transform', 'translate(' + 90 + ',' + 90 + ')')
        .attr('class', 'circle')
        .on('mouseenter', (d, i) => {
          clearTimeout(this.exit)
        })
      // 环形菜单内环
      let arc = d3
        .arc() // 弧生成器
        .innerRadius(32) // 设置内半径
        .outerRadius(85) // 设置外半径
      let g = svg
        .selectAll('g')
        .data(this.pieInnerData)
        .enter()
        .append('g')
        .attr('class', 'gBox')
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
        .attr('class', 'innerPathBox')
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

      // 环形菜单外环
      let arcOuter = d3
        .arc() // 弧生成器
        .innerRadius(88) // 设置内半径
        .outerRadius(130) // 设置外半径

      let gOuter = svg
        .selectAll('.outer')
        .data(this.pieOuterData)
        .enter()
        .append('g')
        .attr('class', 'unshow outer')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
        .attr('text-anchor', 'middle')
        .on('click', (d, i) => {
          const { data } = d
          this.handleClick(data)
        })
        // .on('mouseenter', (d, i) => {
        //   clearTimeout(this.exit)
        //   this.menuOuterHover(i)
        // })
        .on('mouseleave', (d, i) => {
          this.exit = setTimeout(() => {
            this.leaveMune()
          }, 500)
        })

      gOuter
        .append('path')
        .attr('class', 'pathBox')
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

      // 环形菜单最外环
      let arcBigOuter = d3
        .arc() // 弧生成器
        .innerRadius(130) // 设置内半径
        .outerRadius(180) // 设置外半径

      let gBigOuter = svg
        .selectAll('.bigOuter')
        .data(this.pieBigOuterData)
        .enter()
        .append('g')
        .attr('class', 'unshow bigOuter')
        .attr('transform', function (d, i) {
          let x = width / 2,
            y = height / 2
          switch (i) {
            // case 1:
            //   x += 25
            //   y += 40
            //   break
            case 2:
              x -= 12
              y -= 60
              break
            case 3:
              x += 30
              y -= 90
              break
            case 4:
              x += 92
              y -= 80
              break
            case 0:
              x += 50
              y += 267
              break
          }
          return 'translate(' + x + ',' + y + ')'
        })
        .attr('text-anchor', 'middle')
        // .on('click', (d, i) => {
        //   this.menuBigOuterClick(i)
        // })
        .on('mouseenter', (d, i) => {
          clearTimeout(this.exit)
          // this.menuOuterHover(i);
        })
        .on('mouseleave', (d, i) => {
          this.exit = setTimeout(() => {
            this.leaveMune()
          }, 500)
        })
      gBigOuter
        .append('circle')
        .attr('transform', (d) => {
          return 'translate(' + arcBigOuter.centroid(d) + ')'
        })
        .attr('r', 20)
        .attr('class', 'edit')
        .on('click', (d, i) => {
          this.menuBigOuterClick(i)
        })

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
        .text('选择')
        .on('click', (d, i) => {
          this.menuBigOuterClick(i)
        })
    },
    // 全拓展
    expand() {
      this.changeLoading(true)
      this.menuList = []

      this.$api
        .getNextMenu(this.vertice.id, '拓展', 0, this.name)
        .then((response) => {
          let res = response.data
          res.object.menu.forEach((v) => {
            this.menuList.push(v.name)
          })
          let types = this.menuList.join(',')
          this.extendVertice({
            vertice: this.vertice,
            types: types,
            extendAll: true,
          })
        })
    },
    // 鼠标进入菜单
    enterMune() {
      // 注释掉这句，快速点击移开可能菜单一直存在
      // clearTimeout(this.timer)
    },
    // 鼠标离开菜单
    leaveMune() {
      this.timer = setTimeout(() => {
        this.closeMenu()
      }, 100)
    },
    // 关闭菜单
    closeMenu() {
      if (this.close) return
      document.querySelector('.menuBox').style.transition = 'all 0.3s'
      document.querySelector('.menuBox').style.transform = 'scale(0)'
      this.close = true
      // 动画结束后退出
      setTimeout(() => {
        this.closeVerticeContextMenu()
      }, 100)
    },
    // 鼠标悬浮内菜单按钮
    menuInnerHover(index) {
      let array, bigArray
      document.querySelector('.hover')
        ? document.querySelector('.hover').classList.remove('hover')
        : ''
      document.querySelectorAll('.outer').forEach((v, i) => {
        v.setAttribute('class', 'unshow outer')
      })
      document.querySelectorAll('.bigOuter').forEach((v, i) => {
        v.setAttribute('class', 'unshow bigOuter')
      })

      switch (index) {
        case 0:
          array = ['所有', '按类型', '按维度']
          // bigArray = ['按类型', '按时间', '按维度', '按权重']
          document.querySelectorAll('.gBox')[index].classList.add('hover')

          document.querySelectorAll('.outer').forEach((v, i) => {
            if (array.indexOf(this.dataOuterList[i].name) !== -1) {
              v.querySelector('title').innerHTML = array[i]
              v.querySelector('text').innerHTML = array[i]
              v.setAttribute('class', 'gBox outer')
            }
          })
          break
      }
    },
    // 鼠标悬浮外菜单按钮
    menuOuterHover(index) {
      let bigArray = ['', '按类型', '按时间', '按维度', '按权重']
      document.querySelector('.outer.hover')
        ? document.querySelector('.outer.hover').classList.remove('hover')
        : ''
      document.querySelectorAll('.bigOuter').forEach((v, i) => {
        v.setAttribute('class', 'unshow bigOuter')
      })

      document.querySelectorAll('.outer')[index].classList.add('hover')
      let text = document.querySelector('.outer.hover').querySelector('text')
        .innerHTML
      let isSpan = bigArray.includes(text)
      bigArray.forEach((v, i) => {
        if (this.dataBigOuterList[index]) {
          if (v === this.dataBigOuterList[index].name && isSpan) {
            document
              .querySelectorAll('.bigOuter')
              [i].setAttribute('class', 'gBox bigOuter')
          }
        }
      })
    },
    // 鼠标点击内部菜单按钮
    menuInnerClick(index) {
      let type = this.dataInnerList[index].name
      switch (type) {
        case '拓展':
          this.changeLoading(true)
          let expandFilter = JSON.parse(JSON.stringify(this.expandFilter))
          if (
            this.backendConfig.timeDimensionConfig &&
            expandFilter.timeFilter
          ) {
            if (
              expandFilter.timeFilter.nodeFilter &&
              Object.keys(expandFilter.timeFilter.nodeFilter).length > 0
            ) {
              let deleteKeys = []
              Object.values(expandFilter.timeFilter.nodeFilter).forEach(
                (v, i) => {
                  let key = Object.keys(expandFilter.timeFilter.nodeFilter)[i]
                  expandFilter.timeFilter.nodeFilter[key].forEach(
                    (val, index) => {
                      if (val) {
                        expandFilter.timeFilter.nodeFilter[key][index] = moment(
                          val
                        ).format('YYYY-MM-DD')
                      } else {
                        deleteKeys.push(key)
                      }
                    }
                  )
                }
              )
              deleteKeys.forEach(
                (k) => delete expandFilter.timeFilter.nodeFilter[k]
              )
              Object.keys(expandFilter.timeFilter.nodeFilter).length === 0 &&
                (expandFilter.timeFilter = null)
            } else if (
              expandFilter.timeFilter.relationFilter &&
              Object.keys(expandFilter.timeFilter.relationFilter).length > 0
            ) {
              let deleteKeys = []
              Object.values(expandFilter.timeFilter.relationFilter).forEach(
                (v, i) => {
                  let key = Object.keys(
                    this.expandFilter.timeFilter.relationFilter
                  )[i]
                  expandFilter.timeFilter.relationFilter[key].forEach(
                    (val, index) => {
                      if (val) {
                        expandFilter.timeFilter.relationFilter[key][
                          index
                        ] = moment(val).format('YYYY-MM-DD')
                      } else {
                        deleteKeys.push(key)
                      }
                    }
                  )
                }
              )
              deleteKeys.forEach(
                (k) => delete expandFilter.timeFilter.relationFilter[k]
              )
              Object.keys(expandFilter.timeFilter.relationFilter).length ===
                0 && (expandFilter.timeFilter = null)
            } else {
              expandFilter.timeFilter = null
            }
          } else {
            expandFilter.timeFilter = null
          }
          if (expandFilter.relationType.length) {
            this.extendVertice({
              vertice: this.vertice,
              types: this.expandFilter.relationType.join(','),
              type: 'all',
              expand: expandFilter,
            })
          } else {
            this.extendVertice({
              vertice: this.vertice,
              types: '',
              type: 'all',
              expand: expandFilter,
            })
          }
          this.closeVerticeContextMenu()
          break

          break
      }
    },
    // 鼠标点击外部菜单按钮
    menuOuterClick(index) {
      // let type = this.dataOuterList[index].name
      // 只能获取dom，数据列表被改了
      let type = document.querySelector('.outer.hover').querySelector('text')
        .innerHTML
      switch (type) {
        case '按类型':
          if (!this.expandFilter.relationType.length) {
            return this.$message.error({
              message: '请先配置拓展类型',
              duration: 1500,
            })
          }
          this.changeLoading(true)
          this.extendVertice({
            vertice: this.vertice,
            types: this.expandFilter.relationType.join(','),
            type: 'type',
          })
          break
        case '按时间':
          if (!this.backendConfig.timeDimensionConfig) {
            return this.$message.error({
              message: '请先配置时间属性',
              duration: 1500,
            })
          }
          let timeConfig = JSON.parse(this.backendConfig.timeDimensionConfig)
          if (
            !timeConfig.nodeTimePoint.length &&
            !timeConfig.nodeTimeRange.length &&
            !timeConfig.edgeTimePoint.length &&
            !timeConfig.edgeTimeRange.length
          ) {
            return this.$message.error({
              message: '请先配置时间属性',
              duration: 1500,
            })
          }

          let expandFilter = JSON.parse(JSON.stringify(this.expandFilter))
          if (this.expandFilter.timeFilter.nodeFilter) {
            let deleteKeys = []
            Object.values(expandFilter.timeFilter.nodeFilter).forEach(
              (v, i) => {
                let key = Object.keys(expandFilter.timeFilter.nodeFilter)[i]
                expandFilter.timeFilter.nodeFilter[key].forEach(
                  (val, index) => {
                    if (val) {
                      expandFilter.timeFilter.nodeFilter[key][index] = moment(
                        val
                      ).format('YYYY-MM-DD')
                    } else {
                      deleteKeys.push(key)
                    }
                  }
                )
              }
            )
            deleteKeys.forEach(
              (k) => delete expandFilter.timeFilter.nodeFilter[k]
            )
            Object.keys(expandFilter.timeFilter.nodeFilter).length === 0 &&
              (expandFilter.timeFilter = null)
          } else {
            let deleteKeys = []
            Object.values(expandFilter.timeFilter.relationFilter).forEach(
              (v, i) => {
                let key = Object.keys(expandFilter.timeFilter.relationFilter)[i]
                expandFilter.timeFilter.relationFilter[key].forEach(
                  (val, index) => {
                    if (val) {
                      expandFilter.timeFilter.relationFilter[key][
                        index
                      ] = moment(val).format('YYYY-MM-DD')
                    } else {
                      deleteKeys.pus(key)
                    }
                  }
                )
              }
            )
            deleteKeys.forEach(
              (k) => delete expandFilter.timeFilter.relationFilter[k]
            )
            Object.keys(expandFilter.timeFilter.relationFilter).length === 0 &&
              (expandFilter.timeFilter = null)
          }
          if (!expandFilter.timeFilter) {
            return this.$message.error({
              message: '请先配置拓展时间',
              duration: 1500,
            })
          }
          this.changeLoading(true)
          this.extendVertice({
            vertice: this.vertice,
            types: '',
            type: 'time',
            expand: expandFilter.timeFilter,
          })
          break
        case '按维度':
          this.changeLoading(true)
          this.extendVertice({
            vertice: this.vertice,
            types: '',
            type: 'dimension',
            expand: this.expandFilter.dimension,
          })
          break
        // case '按权重':
        //   this.changeLoading(true)
        //   // console.log(this.expandFilter.relationWeight)
        //   this.extendVertice({
        //     vertice: this.vertice,
        //     types: '',
        //     type: 'relationWeight',
        //     expand: this.expandFilter.relationWeight,
        //   })
        //   break
      }
      this.closeVerticeContextMenu()
    },
    async organization() {
      this.changeLoading(true)
      this.changeRigntBottominformation('组织架构')
      let result = await this.$api.queryOrgStructure(this.vertice.id, this.name)
      if (!result) {
        this.changeLoading(false)
        this.$message.error('网络错误，请联系管理员')
        return
      }
      result = result.data
      if (result.success) {
        let list = this.filterData(result.object)
        this.SetOrganizationTabs(list)
        if (list.length) {
          this.SetSelectOrganizationTab(list[0])
        }
        this.changeHeader(0)
        // todo 这边先隐藏底部和右侧面板，展开业务面板
        // this.changeRightBottomPanelShow(true);
        window.BottomPanel.isTabShow = true
        window.infoPanel.isTabShow = true
        window.BusinessPanel.isTabShow = true
      } else {
        this.$message.error('组织架构分析失败')
      }
      this.changeLoading(false)
    },
    // 处理成树形数据
    filterData(data) {
      let usedNodeIds = []
      let usedEdgeIds = []

      let list = []
      list = data.vertices
        .filter((item) => item.level === 0)
        .map((item) => ({ tree: item, graph: { vertices: [], edges: [] } }))
      usedNodeIds = list.map((item) => item.tree.id)
      list.forEach((item, index) => {
        item = findChildren(item.tree, item.graph)
      })
      return list
      function findChildren(vertice, graph) {
        vertice.attributes = {
          level: vertice.level,
        }
        graph.vertices.push(vertice)

        vertice.children = vertice.children || []
        data.edges.forEach((edge) => {
          if (usedEdgeIds.includes(edge.id)) return
          let enode
          if (edge.start == vertice.id) {
            enode = findNode(edge.end)
          }
          if (!enode) return
          usedEdgeIds.push(edge.id)
          // if (vertice.children.map(v => v.id).includes(enode.id)) return;
          if (usedNodeIds.includes(enode.id)) return

          graph.edges.push(edge)
          usedNodeIds.push(enode.id)
          vertice.children.push(enode)
        })
        vertice.children.forEach((node) => findChildren(node, graph))
      }
      function findNode(id) {
        return data.vertices.find((item) => item.id == id)
      }
    },
    // 获取当前根节点子图节点
    getSubGraphNodes(rootNode) {
      let existNodes = [rootNode]
      function _subGraphNodes(node) {
        let relNodes = sativis
          .diagram()
          .getSurroundNodes(node)
          .filter((i) => !existNodes.some((e) => e.id === i.id))
        if (relNodes.length > 0) {
          existNodes = existNodes.concat(relNodes)
          relNodes.forEach((n) => _subGraphNodes(n))
        }
      }
      _subGraphNodes(rootNode)
      return existNodes
    },
    // 鼠标点击最外部菜单按钮
    menuBigOuterClick(index) {
      let type = this.dataOuterList[index].name
      switch (type) {
        case '按类型':
          this.changeLoading(true)
          this.$api
            .getNextMenu(this.vertice.id, '拓展', 0, this.name)
            .then((response) => {
              let res = response.data
              if (res.object.menu && !res.object.menu.length) {
                return (
                  !this.changeLoading(false) &&
                  this.$message.error({
                    message: '当前节点无相关关系',
                    duration: 1500,
                  })
                )
              }
              this.changeMenuType(res.object.menu)
              this.changeLoading(false)
              this.changeTypeExpandShow(true)
            })
            .catch(() => {
              // console.log(err)
              this.changeLoading(false)
              // this.$message.error({ message: '网络错误，请稍后再试', duration: 1500 })
            })
          break
        case '按时间':
          if (!this.backendConfig.timeDimensionConfig) {
            return this.$message.error({
              message: '请先配置时间属性',
              duration: 1500,
            })
          }
          let timeConfig = JSON.parse(this.backendConfig.timeDimensionConfig)
          if (
            !timeConfig.nodeTimePoint.length &&
            !timeConfig.nodeTimeRange.length &&
            !timeConfig.edgeTimePoint.length &&
            !timeConfig.edgeTimeRange.length
          ) {
            return this.$message.error({
              message: '请先配置时间属性',
              duration: 1500,
            })
          }
          this.changeTimeExpandShow(true)
          break
        case '按维度':
          this.changeDimensionExpandShow(true)
          break
        case '按权重':
        case '详情':
          this.changeWeightExpandShow(true)
          break
      }
      this.closeVerticeContextMenu()
    },
    changedevelop(v) {
      let graph
      this.$api.evolution(this.name, v.id).then((res) => {
        // res = JSON.parse(res);
        // todo 今天写到发展演变，用假数据
        res = res.data
        if (!res.success) {
          this.$message.warning('当前实体无发展演变数据！')
        }
        this.changeDevelop()
        this.changeRigntBottominformation('发展演变')
        graph = res.object
        if (!graph) return
        this.resetCanvas()
        graph.vertices.forEach((i) => {
          i.attributes = i.attributes || {}
          i.attributes.level = 0
        })
        // this.changeLayoutType('vertical')
        this.renderCanvas({
          res: graph,
        })
      })
    },
    ...mapActions('snapshot', ['addHistory', 'saveSnapshot']),
    ...mapMutations('warfareList', ['setCurrentWarfare', 'setPlaneOption']),
    ...mapActions('canvasInfo', [
      'collapseVertice',
      'extendVertice',
      'splitVertices',
      'removeVertices',
      'resetCanvas',
      'renderCanvas',
    ]),
    ...mapMutations('informationFile', ['setCurNode']),
    ...mapMutations('snapshot', ['changeHeader']),
    ...mapMutations('contextMenu', ['closeVerticeContextMenu']),

    ...mapMutations('home', [
      'changeRightPanelShow',
      'changeDevelop',
      'changeSingleShow',
      'changeLoading',
      'openEditVerticeModal',
      'openRemarkVerticeModal',
      'changeCompanyPanelShow',
      'changeRightBottomPanelShow',
      'changeBSPanelShow',
      'changeTypeExpandShow',
      'changeTimeExpandShow',
      'changeDimensionExpandShow',
      'changeWeightExpandShow',
      'changeMenuType',
      'openStockInfoModal',
    ]),
    ...mapMutations('canvasInfo', [
      'updateData',
      'changeCanvasType',
      'changeRigntBottominformation',
    ]),
    ...mapMutations('organizationStructurePanel', [
      'SetOrganizationTabs',
      'SetSelectOrganizationTab',
    ]),
    ...mapMutations('caseConcertedAction', [
      'setStockUserDetail',
      'openStockTab',
      'showStockAnalysis',
    ]),
    leaveMune() {
      if (gisvis.contextMenu) {
        // gisvis.contextMenu.destroy()
        // gisvis.contextMenu = null
      }
      // emitter.emit(EventType.CONTEXT_MENU_REMOVE)
    },
  },
}
</script>
<style lang="sass" scope>
.sectorMenu
  position: absolute
  transform: translate(-50%, -50%)
  .menuBox
    transform: scale(0)
    svg
      .edit
        stroke: var(--sectorMenuHoverColor)
        stroke-width: 2
        fill: var(--sectorMenuColor)
      .cancel
        fill: transparent
        stroke: var(--sectorMenuHoverColor)
        stroke-width: 2
      .gBox
        fill: #25507d
        cursor: pointer
        .pathBox
          stroke: var(--sectorMenuHoverColor)
          stroke-width: 2
      .bigOuter
        fill: transparent
        cursor: default
        .pathBox
          stroke-width: 0
        text, circle
          cursor: pointer
      .gBox:hover
        fill: #4a91e9
      .bigOuter:hover
        fill: transparent
        circle
        fill: var(--sectorMenuHoverColor)
      .hover
        fill: var(--sectorMenuHoverColor)
      text
        font-size: 11px
        fill: var(--color-text-primary)
        user-select: none
  .text
    font-size: 11px
    fill: var(--color-text-primary)
  .item
    padding: 8px 0
    cursor: pointer
    text-align: center
  .item:hover
    background-color: #848484
    color: #eee
  .clearfix:before,
  .clearfix:after
    display: table
    content: ""
  .clearfix:after
    clear: both
  .box-card
    width: 300px
  .closeBtn
    float: right
    padding: 3px 0
    cursor: pointer
  .closeBtn:hover
    color: #5DADFF
</style>

<style>
.sectorMenu .el-card {
  background-color: var(--dialogBgColor);
  color: var(--dialogColor);
  border: 1px solid var(--dialogBorderColor);
}
.sectorMenu .el-card__header {
  border-bottom: 1px solid var(--dialogBorderColor);
}
.sectorMenu .el-card__body::-webkit-scrollbar {
  width: 5px;
}
.sectorMenu .el-card__body::-webkit-scrollbar-button {
  display: none;
}

.sectorMenu .el-card__body::-webkit-scrollbar-thumb {
  background-color: #bfc0c2;
  border-radius: 5px;
}

.sectorMenu .unshow {
  display: none;
}
</style>

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

    .gBox {
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
