<template>
  <div v-drag class="left-side">
    <div class="cover" v-show="$store.state.map.isCover"></div>
    <div class="map-legend" v-if="allEntityBackEnd.length > 0">
      <div class="remove-all">
        <el-button type="text" class="button">所有实体({{ allEntityBackEnd.length }})</el-button>
        <i
          :class="collapse ? 'qbxx2-icon-unfold2' : 'qbxx2-icon-fold2'"
          @click="collapse = !collapse"
        ></i>
      </div>
      <div v-show="!collapse">
        <div class="title">
          <el-button :type="active == 1 ? 'primary' : ''" @click="buttonChoice(1)">已知位置</el-button>
          <el-button :type="active == 2 ? 'primary' : ''" @click="buttonChoice(2)">未知位置</el-button>
        </div>
        <div class="legend">
          <el-collapse v-for="(item, index) in tableData" :key="index">
            <el-collapse-item v-if="item.number > 0">
              <template slot="title">
                <div class="titleItem" style="padding-left: 31px; font-size: 15px">
                  <!-- <img :src="item.image" class="img" /> -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="`${item.category}(${item.number})`"
                    placement="top-start"
                  >
                    <div class="description" :style="{'width':(active == 1?'110px':'157px')}">
                      <span>{{ `${item.category}(${item.number})` }}</span>
                    </div>
                  </el-tooltip>
                  <div class="count"></div>
                </div>
                <div class="switch" style="padding-right: 8px">
                  <i
                    class="el-icon-view"
                    title="切换显示"
                    :class="{
                      'is-active': item.visible,
                    }"
                    v-if="active == 1"
                    @click="changeVisibleEntities($event, index, item)"
                  ></i>
                  <i class="el-icon-delete" title="移除" @click="removeEntities($event, item, index)"></i>
                  <i
                    class="el-icon-aim"
                    title="切换攻击范围"
                    :class="{
                      'is-active': item.attackRange,
                    }"
                    v-if="active == 1"
                    @click="changeEntitiesAttackRange($event, index, item)"
                  ></i>
                </div>
              </template>
              <div v-for="(ele, key) in item.listInfo" :key="key">
                <div
                  class="titleItem"
                  @click="
                    ele.properties.latitude ? flyEntity(ele) : mapMark(ele)
                  "
                  :title="ele.properties.latitude ? '飞向该点' : '暂无坐标'"
                >
                  <!-- <img :src="ele.image" class="img" /> -->

                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="ele.properties.name || ele.properties.名称"
                    placement="top-start"
                  >
                    <div class="description" :style="{'width':(active == 1?'110px':'157px')}">
                      <span>
                        {{
                        ele.properties.name || ele.properties.名称
                        }}
                      </span>
                    </div>
                  </el-tooltip>
                </div>
                <div class="switch">
                  <i
                    class="el-icon-view"
                    title="切换显示"
                    v-if="active == 1"
                    :class="{
                      'is-active': ele.visible,
                    }"
                    @click="changeVisibleEntity($event, index, ele, key)"
                  ></i>
                  <i
                    class="el-icon-delete"
                    title="移除"
                    @click="removeEntity($event, index, ele, key)"
                  ></i>
                  <i
                    class="el-icon-aim"
                    title="切换攻击范围"
                    v-if="active == 1"
                    :class="{
                      'is-active': ele.attackRange,
                    }"
                    @click="changeAttackRange($event, index, ele, key)"
                  ></i>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { emitter, EventType } from '../src/EventEmitter'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  directives: {
    drag(el) {
      el.onmousedown = function (e) {
        var disx = e.pageX - el.offsetLeft
        var disy = e.pageY - el.offsetTop
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
        }
        document.onmouseup = function (e) {
          document.onmouseup = document.onmousemove = null
        }
        e.preventDefault()
      }
    },
  },

  computed: {
    ...mapState('map', ['allEntityBackEnd']),
    ...mapState('map', ['gisLabelShow']),
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
      collapse: false, //默认展开
      legendData: [
        {
          name: '机场',
          category: '机场',
          image: require('@/assets/img/facility.png'),
          number: 5,
          visible: true,
          listInfo: [
            {
              name: '福建机场',
              category: '福建机场',
              image: require('@/assets/img/facility.png'),
              visible: true,
              lat: 12,
              log: 12,
            },
            {
              name: '厦门机场',
              category: '厦门机场',
              image: require('@/assets/img/facility.png'),
              visible: true,
            },
          ],
        },
        {
          name: '基地',
          category: '基地',
          image: require('@/assets/img/facility.png'),
          number: 5,
          visible: true,
          listInfo: [
            {
              name: '福建基地',
              category: '福建基地',
              image: require('@/assets/img/facility.png'),
              visible: true,
              lat: 12,
              log: 12,
            },
            {
              name: '厦门基地',
              category: '厦门基地',
              image: require('@/assets/img/facility.png'),
              visible: true,
            },
          ],
        },
      ],
      resultArr: [], //所有的数据
      allEntityTotal: 12,
      active: 1,
      tableData: [],
      arr1: [],
      arr2: [],
      countArr: [], //用来累计便于关系线的显示
    }
  },
  created() {
    emitter.on(EventType.LEGEND_DATA_CHANGE, this.handleLegendDataChange, this)
    emitter.on(
      EventType.MapLegend_Collapse,
      () => {
        this.collapse = false
      },
      this
    )
  },

  mounted() {},
  //样式的更新/实体的更新/全局的更新
  methods: {
    ...mapMutations('map', [
      'setallEntityBackEnd',
      'removeEntityBackEnd',
      'removeallEntityBackEnd',
    ]),

    buttonChoice(val) {
      this.active = val
      this.$forceUpdate()
      val == 1 ? (this.tableData = this.arr1) : (this.tableData = this.arr2)
      this.$set(this.tableData, 0, this.tableData[0])
    },
    /**
     * 图例数据更新
     */
    handleLegendDataChange(data) {
      this.setallEntityBackEnd(data)
      this.resultArr = [...this.allEntityBackEnd]
      this.arr1 = this.allEntityBackEnd
        .map((item, index, arr) => {
          return {
            image:
              (item.properties.hasOwnProperty('avatar') &&
                item.properties.avatar) ||
              require('@/assets/img/facility.png'),
            name: item.properties.name || item.properties.名称,
            category: item.properties.实体分类,
            number: this.resultArr.filter(
              (ele) =>
                ele.properties.实体分类 == item.properties.实体分类 &&
                ele.properties.latitude
            ).length,
            visible: true, //切换显示
            attackRange: false, //切换攻击范围
            listInfo: this.resultArr.filter(
              (ele) =>
                ele.properties.实体分类 == item.properties.实体分类 &&
                ele.properties.latitude
            ), //分组对应的信息
          }
        })
        .filter((item, index, arr) => {
          let arrCategory = arr.map((ele) => ele.category)
          return arrCategory.indexOf(item.category) == index
        })
      this.arr1.forEach((item) => {
        item.listInfo.forEach((ele) => {
          this.countArr.push(ele.id)
        })
      })
      this.arr2 = this.allEntityBackEnd
        .map((item, index, arr) => {
          return {
            image:
              (item.properties.hasOwnProperty('avatar') &&
                item.properties.avatar) ||
              require('@/assets/img/facility.png'),
            name: item.properties.name || item.properties.名称,
            category: item.properties.实体分类,
            number: this.resultArr.filter(
              (ele) =>
                ele.properties.实体分类 == item.properties.实体分类 &&
                !ele.properties.latitude
            ).length,
            visible: false, //切换显示
            attackRange: false, //切换攻击范围
            listInfo: this.resultArr.filter(
              (ele) =>
                ele.properties.实体分类 == item.properties.实体分类 &&
                !ele.properties.latitude
            ), //分组对应的信息
          }
        })
        .filter((item, index, arr) => {
          let arrCategory = arr.map((ele) => ele.category)
          return arrCategory.indexOf(item.category) == index
        })
      this.active == 1
        ? (this.tableData = this.arr1)
        : (this.tableData = this.arr2)
      this.$set(this.tableData, 0, this.tableData[0])
      // console.log("左下侧分组数据信息", this.legendData);
      // console.log("已知位置的数据信息", this.arr1);
      // console.log("未知位置的数据信息", this.arr2);
    },
    /**
     * 清空地图上的所有实体
     */
    removeAllEntities() {
      emitter.emit(EventType.REMOVE_ALL_ENTITIES)
      emitter.emit(EventType.POPPER_REMOVE)
      emitter.emit(EventType.CONTEXT_MENU_REMOVE)
      emitter.emit(EventType.CLICK_ENTITY, null)
    },
    removeAll() {
      this.removeallEntityBackEnd()
      gisvis.viewer.entities.removeAll()
      this.handleLegendDataChange([])
      emitter.emit(EventType.POPPER_REMOVE)
      emitter.emit(EventType.CONTEXT_MENU_REMOVE)
      emitter.emit(EventType.CLICK_BLANK)
      gisvis.viewer.scene.postProcessStages.removeAll()
    },
    removeEntities(event, val, index) {
      event.stopPropagation()
      gisvis.emitter.emit(EventType.CLICK_BLANK)
      //批量删除
      let arrLine = []
      let deleteLabelArr = []
      this.tableData.forEach((item) => {
        if (item.category == val.category) {
          //对这个种类下每一项删除
          item.listInfo.forEach((element) => {
            gisvis.viewer.entities.removeById(element.id)
            this.removeEntityBackEnd(element.id)
            //批量删除存在的关系线
            gisvis.viewer.entities.values.forEach((ele) => {
              let id = ele.id.toString()
              if (
                id.split(',').length == 2 &&
                ele.id.split(',').includes(element.id.toString())
              ) {
                arrLine.push(ele)
              }
            })
            //每次删除之前的范围设置的圆圈
            gisvis.viewer.entities.values.forEach((ele) => {
              let id = ele.id.toString()
              if (
                id.split(',').length == 3 &&
                ele.id.split(',').includes('显示范围') &&
                ele.id.split(',').includes(val.id.toString())
              ) {
                deleteLabelArr.push(ele)
              }
            })
          })
        }
      })
      arrLine.forEach((item) => {
        gisvis.viewer.entities.removeById(item.id)
      })

      deleteLabelArr.forEach((item) => {
        gisvis.viewer.entities.removeById(item.id)
      })
      if (gisvis.contextMenu) {
        gisvis.contextMenu.destroy()
        gisvis.contextMenu = null
      }
      if (gisvis.popper) {
        gisvis.popper.destroy()
        gisvis.popper = null
      }
      if (gisvis.addHtmlPopper) {
        gisvis.addHtmlPopper.destroy()
        gisvis.addHtmlPopper = null
      }
      this.tableData.splice(index, 1)
      this.handleLegendDataChange([])
    },
    removeEntity(event, index, val, key) {
      event.stopPropagation()
      this.tableData[index].listInfo.splice(key, 1)
      gisvis.emitter.emit(EventType.CLICK_BLANK)
      this.removeEntityBackEnd(val.id)
      gisvis.viewer.entities.removeById(val.id)
      //批量删除存在的关系线
      let arrLine = []
      gisvis.viewer.entities.values.forEach((ele) => {
        let id = ele.id.toString()
        if (
          id.split(',').length == 2 &&
          ele.id.split(',').includes(val.id.toString())
        ) {
          arrLine.push(ele)
        }
      })
      arrLine.forEach((item) => {
        gisvis.viewer.entities.removeById(item.id)
      })
      //每次删除之前的范围设置的圆圈

      let deleteLabelArr = []
      gisvis.viewer.entities.values.forEach((ele) => {
        let id = ele.id.toString()
        if (
          id.split(',').length == 3 &&
          ele.id.split(',').includes('显示范围') &&
          ele.id.split(',').includes(val.id.toString())
        ) {
          deleteLabelArr.push(ele)
        }
      })
      deleteLabelArr.forEach((item) => {
        gisvis.viewer.entities.removeById(item.id)
      })
      this.handleLegendDataChange([])
      if (gisvis.contextMenu) {
        gisvis.contextMenu.destroy()
        gisvis.contextMenu = null
      }
      if (gisvis.popper) {
        gisvis.popper.destroy()
        gisvis.popper = null
      }
    },
    /**
     * 点击图例项，飞到项里的最后一个
     */
    handleLegendItemClick(item) {
      let arr = this.resultArr.filter(
        (ele) => ele.properties.实体分类 == item.category
      )
      let lng = arr[arr.length - 1].properties.经度
      let lat = arr[arr.length - 1].properties.纬度
      gisvis.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, h),
      })
    },
    flyEntity(val) {
      if (val) {
        emitter.emit(EventType.CLICK_BLANK)
        let { 经度: lng, 纬度: lat } = val.properties
        gisvis.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lng, lat, 30000),
        })
      }
    },
    mapMark(val) {
      this.collapse = true
      emitter.emit(EventType.CLICK_BLANK) //避免右键取消转到之前仍被选中的状态
      emitter.emit(EventType.SET_MEASURE_TYPE, {
        group: '基地',
        groupCategory: '基地',
        groupType: '基地',
        image: 'images/facility.png',
        id: val.id,
        name:
          (val.properties.name || val.properties.名称 || '').substring(0, 10) +
          '...',
        labelShow: this.gisLabelShow,
      })
      this.$message.warning('开始编辑位置,鼠标右键取消')
      this.$store.state.map.isCover = true
    },
    /**
     * 点击图例显示图标
     */
    handleLegendVisibleClick(item) {
      item.visible = !item.visible
      this.resultArr
        .filter((ele) => ele.properties.实体分类 == item.category)
        .forEach((element) => {
          console.log(gisvis.viewer.entities.getById(element.id))
          gisvis.viewer.entities.getById(element.id).show = item.visible
        })
    },
    changeVisibleEntities(event, index, val) {
      event.stopPropagation()
      gisvis.emitter.emit(EventType.CLICK_BLANK)
      val.visible = !val.visible
      this.tableData[index].listInfo.forEach((item) => {
        item.visible = val.visible
        gisvis.viewer.entities.getById(item.id).show = val.visible
        //批量隐藏存在的关系线
        if (!val.visible) {
          this.countArr = this.countArr.filter((vv) => vv != item.id)
          gisvis.viewer.entities.values.forEach((ele) => {
            let id = ele.id.toString()
            if (
              id.split(',').length == 2 &&
              ele.id.split(',').includes(item.id.toString())
            ) {
              ele.show = false
            }
          })
          let scopeChangeArr = []
          gisvis.viewer.entities.values.forEach((ele) => {
            let id = ele.id.toString()
            if (
              id.split(',').length == 3 &&
              ele.id.split(',').includes('显示范围')
            ) {
              scopeChangeArr.push(ele)
            }
          })
          scopeChangeArr.forEach((ele) => {
            if (ele.id.includes(item.id)) {
              ele.ellipse.show.setValue(false)
            }
          })
        } else {
          if (val.attackRange) {
            let scopeChangeArr = []
            gisvis.viewer.entities.values.forEach((ele) => {
              let id = ele.id.toString()
              if (
                id.split(',').length == 3 &&
                ele.id.split(',').includes('显示范围')
              ) {
                scopeChangeArr.push(ele)
              }
            })
            scopeChangeArr.forEach((ele) => {
              if (ele.id.includes(item.id)) {
                ele.ellipse.show.setValue(true)
              }
            })
          }
        }
      })
      //只有当两个点都是被选中的点是和边对应的ID吻合时候才显示边
      if (val.visible) {
        this.tableData[index].listInfo.forEach((item) => {
          this.countArr.push(item.id)
        })
        let arrIds = gisvis.viewer.entities.values
          .filter((ele) => {
            let id = ele.id.toString()
            return id.split(',').length == 2
          })
          .map((item) => item.id)
        arrIds.forEach((item) => {
          if (
            item
              .split(',')
              .filter((ele) => this.countArr.some((element) => ele == element))
              .length == 2
          ) {
            gisvis.viewer.entities.getById(item).show = true
          }
        })
      }
    },
    changeVisibleEntity(event, index, val, key) {
      event.stopPropagation()
      gisvis.emitter.emit(EventType.CLICK_BLANK)
      this.tableData[index].listInfo[key].visible = !val.visible
      gisvis.viewer.entities.getById(val.id).show = val.visible
      //批量隐藏存在的关系线
      if (!val.visible) {
        this.countArr = this.countArr.filter((vv) => vv != val.id)
        gisvis.viewer.entities.values.forEach((ele) => {
          let id = ele.id.toString()
          if (
            id.split(',').length == 2 &&
            ele.id.split(',').includes(val.id.toString())
          ) {
            ele.show = false
          }
        })
        //批量切换范围圆圈
        let scopeChangeArr = []
        gisvis.viewer.entities.values.forEach((ele) => {
          let id = ele.id.toString()
          if (
            id.split(',').length == 3 &&
            ele.id.split(',').includes('显示范围')
          ) {
            scopeChangeArr.push(ele)
          }
        })
        scopeChangeArr.forEach((ele) => {
          if (ele.id.includes(val.id)) {
            ele.ellipse.show.setValue(false)
          }
        })
      }
      if (val.visible) {
        this.countArr.push(val.id)
        console.log(this.countArr)
        let arrIds = gisvis.viewer.entities.values
          .filter((ele) => {
            let id = ele.id.toString()
            return id.split(',').length == 2
          })
          .map((item) => item.id)
        console.log(arrIds)
        arrIds.forEach((item) => {
          if (
            item
              .split(',')
              .filter((ele) => this.countArr.some((element) => ele == element))
              .length == 2
          ) {
            gisvis.viewer.entities.getById(item).show = true
          }
        })
        if (val.attackRange) {
          //批量切换范围圆圈
          let scopeChangeArr = []
          gisvis.viewer.entities.values.forEach((ele) => {
            let id = ele.id.toString()
            if (
              id.split(',').length == 3 &&
              ele.id.split(',').includes('显示范围')
            ) {
              scopeChangeArr.push(ele)
            }
          })
          scopeChangeArr.forEach((ele) => {
            if (ele.id.includes(val.id)) {
              ele.ellipse.show.setValue(true)
            }
          })
        }
      }
      if (
        this.tableData[index].listInfo.every((item) => item.visible == false) ||
        this.tableData[index].listInfo.every((item) => item.visible == true)
      ) {
        this.tableData[index].visible = this.tableData[
          index
        ].listInfo[0].visible
      }
      this.$set(this.tableData, 0, this.tableData[0])
    },
    /**
     * 点击图例删除图标
     */
    handleLegendDeleteClick(item) {
      this.legendData = this.legendData.filter(
        (ele) => ele.category != item.category
      )
      this.resultArr
        .filter((ele) => ele.properties.实体分类 == item.category)
        .forEach((element) => {
          gisvis.viewer.entities.removeById(element.id)
        })
    },
    /**
     * 点击攻击范围图标
     */
    handleAttackClick(item) {
      const { type } = item
      const entityShow = this.entitiesVisibleCollection[type]
      const attackShow = this.entitiesAttackAvailableCollection[type]

      if (!entityShow) {
        return
      }

      emitter.emit(EventType.SET_ATTACK_VISIBLE_BY_TYPE, {
        type,
        value: !attackShow,
      })
    },
    changeEntitiesAttackRange(event, index, val) {
      event.stopPropagation()
      val.attackRange = !val.attackRange
      this.tableData[index].listInfo.forEach((item) => {
        item.attackRange = val.attackRange
        // if (gisvis.viewer.entities.getById(item.id).ellipse) {
        //   gisvis.viewer.entities.getById(item.id).ellipse.show = val.attackRange
        // } else {
        //   let params = {
        //     entities: [{ id: item.id }],
        //     radius: 250,
        //     areaProperty: null,
        //     color: '#ffcc33',
        //   }
        //   gisvis.emitter.emit('gis-scope-render', params)
        // }
        if (val.attackRange) {
          //批量切换范围圆圈
          let scopeChangeArr = []
          gisvis.viewer.entities.values.forEach((ele) => {
            let id = ele.id.toString()
            if (
              id.split(',').length == 3 &&
              ele.id.split(',').includes('显示范围')
            ) {
              scopeChangeArr.push(ele)
            }
          })
          scopeChangeArr.forEach((ele) => {
            if (ele.id.includes(item.id)) {
              ele.ellipse.show.setValue(true)
            }
          })
        } else {
          //批量切换范围圆圈
          let scopeChangeArr = []
          gisvis.viewer.entities.values.forEach((ele) => {
            let id = ele.id.toString()
            if (
              id.split(',').length == 3 &&
              ele.id.split(',').includes('显示范围')
            ) {
              scopeChangeArr.push(ele)
            }
          })
          scopeChangeArr.forEach((ele) => {
            if (ele.id.includes(item.id)) {
              ele.ellipse.show.setValue(false)
            }
          })
        }
      })
      this.$set(this.tableData, 0, this.tableData[0])
    },
    changeAttackRange(event, index, val, key) {
      event.stopPropagation()
      this.tableData[index].listInfo[key].attackRange = !val.attackRange
      if (
        this.tableData[index].listInfo.every(
          (item) => item.attackRange == false
        ) ||
        this.tableData[index].listInfo.every((item) => item.attackRange == true)
      ) {
        this.tableData[index].attackRange = this.tableData[
          index
        ].listInfo[0].attackRange
      }
      if (val.attackRange) {
        //批量切换范围圆圈
        let scopeChangeArr = []
        gisvis.viewer.entities.values.forEach((ele) => {
          let id = ele.id.toString()
          if (
            id.split(',').length == 3 &&
            ele.id.split(',').includes('显示范围')
          ) {
            scopeChangeArr.push(ele)
          }
        })
        scopeChangeArr.forEach((ele) => {
          if (ele.id.includes(val.id)) {
            ele.ellipse.show.setValue(true)
          }
        })
      } else {
        //批量切换范围圆圈
        let scopeChangeArr = []
        gisvis.viewer.entities.values.forEach((ele) => {
          let id = ele.id.toString()
          if (
            id.split(',').length == 3 &&
            ele.id.split(',').includes('显示范围')
          ) {
            scopeChangeArr.push(ele)
          }
        })
        scopeChangeArr.forEach((ele) => {
          if (ele.id.includes(val.id)) {
            ele.ellipse.show.setValue(false)
          }
        })
      }

      this.$set(this.tableData, 0, this.tableData[0])
    },
  },
}
</script>

<style lang="scss" scoped>
.left-side {
  position: absolute;
  left: 70px;
  top: 26px;
  color: #4c4c4c;
  border-radius: 4px;
  user-select: none;
  overflow: hidden;
}
/deep/ button {
  color: #fafafa;
}
/deep/ .el-button:hover,
.el-button:focus {
  color: #fafafa;
  background-color: none;
}
/deep/ .el-collapse-item__header {
  background: none;
  color: #fafafa;
  line-height: 30px;
  height: 30px;
  position: relative;
}
/deep/ .el-collapse {
  border: none;
}
/deep/ .el-collapse-item__content {
  color: #fafafa;
  padding: 0 0 0 23px;
}
/deep/ .el-collapse-item__wrap {
  background: none;
}
/deep/ .el-collapse-item__content > div {
  display: flex;
  padding: 0 8px;
  justify-content: space-between;
  margin: 5px 0;
}
/deep/ i.el-collapse-item__arrow.el-icon-arrow-right.is-active {
  position: absolute;
  left: 8px;
}
/deep/ i.el-collapse-item__arrow.el-icon-arrow-right {
  position: absolute;
  left: 8px;
}
.map-legend {
  width: 224px;
  cursor: move;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0px 4px 0px 0px;

  .remove-all {
    padding: 0 8px;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      font-size: 20px;
      color: white;
    }
  }

  .legend {
    max-height: 300px;
    border-top: 1px solid rgba(255, 255, 255, 1);
    overflow: auto;
    .titleItem {
      display: flex;
      color: #fafafa;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      cursor: pointer;
    }
    .switch {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex: 1;
      margin-left: 4px;
      color: #fafafa;
      i {
        font-size: 16px;
        cursor: pointer;
      }

      i + i {
        margin-left: 8px;
      }

      .is-active {
        color: orange;
      }
    }
    .legend-item {
      display: flex;
      align-items: center;
      padding: 8px;
      color: #fafafa;

      & + .legend-item {
        margin-top: 4px;
      }

      .item {
        display: flex;
        align-items: center;
        cursor: pointer;

        .img {
          width: 20px;
          height: 24px;
        }

        .description {
          margin-left: 8px;
          font-size: 14px;
        }

        .count {
          font-size: 12px;
          margin-left: 4px;
        }
      }

      .switch {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 1;
        margin-left: 4px;
        color: red;
        i {
          font-size: 16px;
          cursor: pointer;
        }

        i + i {
          margin-left: 8px;
        }

        .is-active {
          color: orange;
        }
      }
    }
  }
}
.title {
  max-height: 500px;
  border-top: 1px solid white;
  overflow: auto;
  display: flex;
  justify-content: space-around;
  padding: 5px;
}
.description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cover {
  position: absolute;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
  height: 100%;
  filter: alpha(opacity=60);
  /*设置透明度为60%*/
  opacity: 0.6;
  /*非IE浏览器下设置透明度为60%*/
  display: block;
  z-index: 999;
}
</style>

