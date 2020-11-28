<template>
  <div class="map-legend" v-if="allEntityBackEnd.length > 0">
    <div class="remove-all">
      <el-button type="text" class="button">
        所有实体({{ allEntityBackEnd.length }})
      </el-button>
      <el-button type="text" class="button" @click="removeAll">
        清空所有
      </el-button>
      <i
        :class="collapse ? 'el-icon-top-right' : 'el-icon-bottom-left'"
        @click="collapse = !collapse"
      ></i>
    </div>
    <div v-show="!collapse">
      <div class="title">
        <el-button :type="active == 1 ? 'primary' : ''" @click="buttonChoice(1)"
          >已知位置</el-button
        >
        <el-button :type="active == 2 ? 'primary' : ''" @click="buttonChoice(2)"
          >未知位置</el-button
        >
      </div>
      <div class="legend">
        <el-collapse v-for="(item, index) in tableData" :key="index">
          <el-collapse-item>
            <template slot="title">
              <div
                class="titleItem"
                style="padding-left: 31px; font-size: 15px"
              >
                <!-- <img :src="item.image" class="img" /> -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="`${item.category}(${item.number})`"
                  placement="top-start"
                  ><div class="description">
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
                  @click="changeVisibleEntities(index, item)"
                ></i>
                <i
                  class="el-icon-delete"
                  title="移除"
                  @click="removeEntities(item, index)"
                ></i>
                <i
                  class="el-icon-aim"
                  title="切换攻击范围"
                  :class="{
                    'is-active': item.attackRange,
                  }"
                  @click="changeEntitiesAttackRange(index, item)"
                ></i>
              </div>
            </template>
            <div v-for="(ele, key) in item.listInfo" :key="key">
              <div
                class="titleItem"
                @click="ele.properties.latitude ? flyEntity(ele) : mapMark(ele)"
                :title="ele.properties.latitude ? '飞向该点' : '暂无坐标'"
              >
                <!-- <img :src="ele.image" class="img" /> -->

                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="ele.properties.name|| ele.properties.名称"
                  placement="top-start"
                  ><div class="description">
                    <span>{{ ele.properties.name || ele.properties.名称}}</span>
                  </div></el-tooltip
                >
              </div>
              <div class="switch">
                <i
                  class="el-icon-view"
                  title="切换显示"
                  :class="{
                    'is-active': ele.visible,
                  }"
                  @click="changeVisibleEntity(index, ele, key)"
                ></i>
                <i
                  class="el-icon-delete"
                  title="移除"
                  @click="removeEntity(index, ele, key)"
                ></i>
                <i
                  class="el-icon-aim"
                  title="切换攻击范围"
                  :class="{
                    'is-active': ele.attackRange,
                  }"
                  @click="changeAttackRange(index, ele, key)"
                ></i>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { emitter, EventType } from "../src/EventEmitter";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  directives: {
    drag: function (el) {
      let dragBox = el; //获取当前元素
      dragBox.onmousedown = (e) => {
        //算出鼠标相对元素的位置
        let disX = e.clientX - dragBox.offsetLeft;
        let disY = e.clientY - dragBox.offsetTop;
        document.onmousemove = (e) => {
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX;
          let top = e.clientY - disY;
          //移动当前元素
          dragBox.style.left = left + "px";
          dragBox.style.top = top + "px";
        };
        document.onmouseup = (e) => {
          //鼠标弹起来的时候不再移动
          document.onmousemove = null;
          //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
          document.onmouseup = null;
        };
      };
    },
  },

  computed: {
    ...mapState("map", ["allEntityBackEnd"]),
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      collapse: false, //默认展开
      legendData: [
        {
          name: "机场",
          category: "机场",
          image: require("@/assets/img/facility.png"),
          number: 5,
          visible: true,
          listInfo: [
            {
              name: "福建机场",
              category: "福建机场",
              image: require("@/assets/img/facility.png"),
              visible: true,
              lat: 12,
              log: 12,
            },
            {
              name: "厦门机场",
              category: "厦门机场",
              image: require("@/assets/img/facility.png"),
              visible: true,
            },
          ],
        },
        {
          name: "基地",
          category: "基地",
          image: require("@/assets/img/facility.png"),
          number: 5,
          visible: true,
          listInfo: [
            {
              name: "福建基地",
              category: "福建基地",
              image: require("@/assets/img/facility.png"),
              visible: true,
              lat: 12,
              log: 12,
            },
            {
              name: "厦门基地",
              category: "厦门基地",
              image: require("@/assets/img/facility.png"),
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
    };
  },
  created() {
    emitter.on(EventType.LEGEND_DATA_CHANGE, this.handleLegendDataChange, this);
  },

  mounted() {},
  methods: {
    ...mapMutations("map", [
      "setallEntityBackEnd",
      "removeEntityBackEnd",
      "removeallEntityBackEnd",
    ]),

    buttonChoice(val) {
      this.active = val;
      this.$forceUpdate();
      val == 1 ? (this.tableData = this.arr1) : (this.tableData = this.arr2);
      this.$set(this.tableData, 0, this.tableData[0]);
    },
    /**
     * 图例数据更新
     */
    handleLegendDataChange(data) {
      this.active = 1;
      this.setallEntityBackEnd(data);
      this.resultArr = [...this.allEntityBackEnd];
      this.arr1 = this.allEntityBackEnd
        .map((item, index, arr) => {
          return {
            image:
              (item.properties.hasOwnProperty("avatar") &&
                item.properties.avatar) ||
              require("@/assets/img/facility.png"),
            name: item.properties.name,
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
          };
        })
        .filter((item, index, arr) => {
          let arrCategory = arr.map((ele) => ele.category);
          return arrCategory.indexOf(item.category) == index;
        });
      this.arr2 = this.allEntityBackEnd
        .map((item, index, arr) => {
          return {
            image:
              (item.properties.hasOwnProperty("avatar") &&
                item.properties.avatar) ||
              require("@/assets/img/facility.png"),
            name: item.properties.name,
            category: item.properties.实体分类,
            number: this.resultArr.filter(
              (ele) =>
                ele.properties.实体分类 == item.properties.实体分类 &&
                !ele.properties.latitude
            ).length,
            visible: false,  //切换显示
            attackRange: false,  //切换攻击范围
            listInfo: this.resultArr.filter(
              (ele) =>
                ele.properties.实体分类 == item.properties.实体分类 &&
                !ele.properties.latitude
            ), //分组对应的信息
          };
        })
        .filter((item, index, arr) => {
          let arrCategory = arr.map((ele) => ele.category);
          return arrCategory.indexOf(item.category) == index;
        });
      this.tableData = this.arr1;
      this.$set(this.tableData, 0, this.tableData[0]);
      // console.log("左下侧分组数据信息", this.legendData);
      console.log("已知位置的数据信息", this.arr1);
      console.log("未知位置的数据信息", this.arr2);
    },
    /**
     * 清空地图上的所有实体
     */
    removeAllEntities() {
      emitter.emit(EventType.REMOVE_ALL_ENTITIES);
      emitter.emit(EventType.POPPER_REMOVE);
      emitter.emit(EventType.CONTEXT_MENU_REMOVE);
      emitter.emit(EventType.CLICK_ENTITY, null);
    },
    removeAll() {
      this.removeallEntityBackEnd();
      gisvis.viewer.entities.removeAll();
      this.handleLegendDataChange([]);
      emitter.emit(EventType.POPPER_REMOVE);
      emitter.emit(EventType.CONTEXT_MENU_REMOVE);
      emitter.emit(EventType.CLICK_BLANK);
      gisvis.viewer.scene.postProcessStages.removeAll();
    },
    removeEntities(val, index) {
      this.tableData.forEach((item) => {
        if (item.category == val.category) {
          item.listInfo.forEach((element) => {
            gisvis.viewer.entities.removeById(element.id);
            this.removeEntityBackEnd(element.id);
          });
        }
      });
      this.tableData.splice(index, 1);
      this.handleLegendDataChange([]);
    },
    removeEntity(index, val, key) {
      this.tableData[index].listInfo.splice(key, 1);
      this.removeEntityBackEnd(val.id);
      gisvis.viewer.entities.removeById(val.id);
      this.handleLegendDataChange([]);
    },
    /**
     * 点击图例项，飞到项里的最后一个
     */
    handleLegendItemClick(item) {
      let arr = this.resultArr.filter(
        (ele) => ele.properties.实体分类 == item.category
      );
      let lng = arr[arr.length - 1].properties.经度;
      let lat = arr[arr.length - 1].properties.纬度;
      gisvis.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, h),
      });
    },
    flyEntity(val) {
      if (val) {
        let { 经度: lng, 纬度: lat } = val.properties;
        gisvis.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lng, lat, 1000),
        });
      }
    },
    mapMark(val) {
      emitter.emit(EventType.SET_MEASURE_TYPE, {
        group: "基地",
        groupCategory: "基地",
        groupType: "基地",
        image: "images/facility.png",
        id: val.id,
        state: "未知位置",
        name: val.properties.name,
      });
      this.$message.success("已成功创建标记点");
    },
    /**
     * 点击图例显示图标
     */
    handleLegendVisibleClick(item) {
      item.visible = !item.visible;
      this.resultArr
        .filter((ele) => ele.properties.实体分类 == item.category)
        .forEach((element) => {
          console.log(gisvis.viewer.entities.getById(element.id));
          gisvis.viewer.entities.getById(element.id).show = item.visible;
        });
    },
    changeVisibleEntities(index, val) {
      val.visible = !val.visible;
      this.tableData[index].listInfo.forEach((item) => {
        item.visible = val.visible;
        gisvis.viewer.entities.getById(item.id).show = val.visible;
      });
    },
    changeVisibleEntity(index, val, key) {
      this.tableData[index].listInfo[key].visible = !val.visible;
      gisvis.viewer.entities.getById(val.id).show = val.visible;
      if (
        this.tableData[index].listInfo.every((item) => item.visible == false) ||
        this.tableData[index].listInfo.every((item) => item.visible == true)
      ) {
        this.tableData[index].visible = this.tableData[
          index
        ].listInfo[0].visible;
      }
      this.$set(this.tableData, 0, this.tableData[0]);
    },
    /**
     * 点击图例删除图标
     */
    handleLegendDeleteClick(item) {
      this.legendData = this.legendData.filter(
        (ele) => ele.category != item.category
      );
      this.resultArr
        .filter((ele) => ele.properties.实体分类 == item.category)
        .forEach((element) => {
          gisvis.viewer.entities.removeById(element.id);
        });
    },
    /**
     * 点击攻击范围图标
     */
    handleAttackClick(item) {
      const { type } = item;
      const entityShow = this.entitiesVisibleCollection[type];
      const attackShow = this.entitiesAttackAvailableCollection[type];

      if (!entityShow) {
        return;
      }

      emitter.emit(EventType.SET_ATTACK_VISIBLE_BY_TYPE, {
        type,
        value: !attackShow,
      });
    },
    changeEntitiesAttackRange(index, val) {
      val.attackRange = !val.attackRange;
      this.tableData[index].listInfo.forEach((item) => {
        item.attackRange = val.attackRange;
        if (gisvis.viewer.entities.getById(item.id).ellipse) {
          gisvis.viewer.entities.getById(item.id).ellipse.show =
            val.attackRange;
        } else {
          let params = {
            entities: [{ id: item.id }],
            radius: 250,
            color: "#ffcc33",
          };
          gisvis.emitter.emit("gis-scope-render", params);
        }
      });
      this.$set(this.tableData, 0, this.tableData[0]);
    },
    changeAttackRange(index, val, key) {
      this.tableData[index].listInfo[key].attackRange = !val.attackRange;
      if (
        this.tableData[index].listInfo.every(
          (item) => item.attackRange == false
        ) ||
        this.tableData[index].listInfo.every((item) => item.attackRange == true)
      ) {
        this.tableData[index].attackRange = this.tableData[
          index
        ].listInfo[0].attackRange;
      }
      if (gisvis.viewer.entities.getById(val.id).ellipse) {
        gisvis.viewer.entities.getById(val.id).ellipse.show = val.attackRange;
      } else {
        // this.$message.info("当前选中的时候没有设置攻击范围");
        //设置一个默认攻击范围
        let params = {
          entities: [{ id: val.id }],
          radius: 250,
          color: "#ffcc33",
        };
        gisvis.emitter.emit("gis-scope-render", params);
      }
      this.$set(this.tableData, 0, this.tableData[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
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
    max-height: 500px;
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
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

