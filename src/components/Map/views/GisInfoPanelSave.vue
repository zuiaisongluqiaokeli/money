<template>
  <div class="GisInfoPanel" :class="[show ? 'show-panel' : 'hide-panel']">
    <transition name="el-fade-in-linear">
      <div class="tab-button" @click="clickTabButton" v-show="!show">
        <div class="text">
          <i class="iconfont icon-left3"></i>
          信息面板
        </div>
      </div>
    </transition>
    <div class="panel-content" v-if="show">
      <div class="top"></div>
      <div class="body">
        <div class="content">
          <div class="close-banner">
            <i class="text iconfont icon-right3" @click="show = false"></i>
            <i
              class="text iconfont"
              :class="[fixed ? 'icon-ding' : 'icon-ding-normal']"
              @click="fixedPanel"
            ></i>
          </div>
          <el-collapse :value="['1', '2', '3']">
            <el-collapse-item name="1" title="实体信息">
              <div class="collapse-body avatar-name">
                <div class="avatar">
                  <img
                    :src="selectedEntity.properties.avatar"
                    v-if="selectedEntity.properties.avatar"
                    :onerror="errorImg"
                  />
                  <img v-else :src="defaultImgSrc" />
                </div>
                <div class="properties">
                  <span class="label">实体名称：</span>
                  <span class="value"
                    ><el-input v-model="selectedEntity.name"></el-input
                  ></span>
                </div>
                <div class="properties">
                  <span class="label">实体分类：</span>
                  <span class="value">
                    <el-select
                      v-model="selectedEntity.name"
                      filterable
                      clearable
                      :filter-method="selectTreeFilterNode"
                      placeholder="请选择实体分类"
                      @visible-change="selectTreeBlur"
                      @clear="clearSortParent"
                    >
                      <el-option :value="0" class="hidden" />
                      <template>
                        <el-tree
                          ref="selectTree"
                          :filter-node-method="filterNode"
                          accordion
                          highlight-current
                          :data="treeData"
                          :props="propSet"
                          node-key="id"
                          @node-click="nodeClick"
                        />
                      </template>
                      <template slot="empty"> 暂时没有数据 </template>
                    </el-select>
                  </span>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="2" title="部署信息">
              <div class="collapse-body">
                <div
                  v-for="(item, index) in selectedEntity.deployInfo"
                  :key="index"
                  class="properties"
                >
                  <span class="label">{{ `${item.label}:` }}</span>
                  <span class="value"
                    ><el-input v-model="item.value"></el-input
                  ></span>
                </div>
                <div class="properties">
                  <span class="label">部署装备：</span>
                  <el-button type="text" @click="dialogOpen('部署装备')">
                    选择
                  </el-button>
                </div>
                <div class="properties">
                  <span class="label">隶属：{{ checkedRadio }}</span>
                  <el-button type="text" @click="dialogOpen('隶属')">
                    选择
                  </el-button>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="3" title="标签">
              <div class="labels collapse-body">
                <el-select
                  v-model="selectedEntity.labelsList"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择标签"
                >
                  <el-option
                    v-for="item in selectedEntity.labelsList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div class="footer" style="text-align: center;margin: 10px;">
            <el-button type="primary" @click="dialogSave" size="small"
              >确定</el-button
            >
            <el-button type="default" @click="cancelEdit" size="small"
              >取消</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 查看详细弹窗 -->
    <el-dialog
      append-to-body
      class="map-info-panel-dialog detail-dialog"
      :title="detailDialogTitle"
      :visible.sync="detailDialogVisible"
    >
      <el-radio-group v-model="checkedRadio">
        <el-radio
          v-for="(item, index) in radioData"
          :label="item.id"
          :key="index"
          class="radio"
        >
          {{ item.name }}
        </el-radio>
      </el-radio-group>
      <div class="footer" slot="footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button type="default" @click="detailDialogVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { emitter, EventType } from "../src/EventEmitter";
import { geoNodeFindGroupData } from "@/assets/api/map";
export default {
  name: "GisInfoPanel",
  data() {
    return {
      show: false,
      fixed: false,
      selectedEntity: {},
      treeData: [],
      checkedRadio: null,
      propSet: {
        label: "name",
        children: "children",
      },
      errorImg: 'this.src="' + './img/gis/location.png"',
      defaultImgSrc: "./img/gis/location.png",
      radioData: [{ id: "1", name: "3" }],
      detailDialogTitle: "",
      detailDialogVisible: false,
      resultData: {
        success: true,
        code: null,
        msg: "操作成功!",
        errorMsg: "",
        object: {
          id: 293741,
          idStr: "293741",
          name: "麦坎贝尔号驱逐舰",
          desc: null,
          type: null,
          props: null,
          labels: "[DATAEXA_OBJECT, 军用舰船, 驱逐舰]",
          atlasId: null,
          uuid: null,
          labelsList: ["DATAEXA_OBJECT", "军用舰船", "驱逐舰"],

          deployInfo: [
            { label: "经度", value: "1233" },
            { label: "纬度", value: "1233" },
            { label: "部署数量", value: "1233" },
          ],
          properties: {
            _time: "2019-06-04<br />11:40:14",
            _uuid: "1991bfcf81e9438fa7cdb81dcb2f397b",
            avatar: "http://192.168.1.51:9050/jky/img/no-image.jpg",
            id: "58",
            pk_id: "jky_58",
            下定日期: "1996年12月13日",
            下水日期: "2000-07-02",
            下订日期: "1996-12-13",
            动工日期: "1999-07-15",
            国家: "美国",
            实体分类: "",
            建造者: "巴斯钢铁厂",
            服役日期: "2002-08-17",
            来源:
              "https://zh.wikipedia.org/wiki/%E9%BA%A6%E5%9D%8E%E8%B4%9D%E5%B0%94%E5%8F%B7%E9%A9%B1%E9%80%90%E8%88%B0",
            概要:
              "麦坎贝尔号驱逐舰（英语：USS<br />McCampbell<br />(DDG-85)）是美国海军阿利伯克级驱逐舰的第三十五艘，以海军上校戴维麦坎贝尔命名。麦坎贝尔号驱逐舰于1999年7月15日在缅因州巴斯的巴斯钢铁厂安放龙骨，2000年7月2日下水，2002年8月17日服役。",
            状态: "现役",
            目前状态: "截至2019年为止仍现役中",
            舰名: "麦坎贝尔号",
            舰名出处: "戴维·麦坎贝尔",
            舰队: "第五驱逐舰中队",
          },
          propertiesJsonArr: null,
          propsList: [
            { id: null, key: "下订日期", value: "1996-12-13" },
            { id: null, key: "pk_id", value: "jky_58" },
            { id: null, key: "状态", value: "现役" },
            {
              id: null,
              key: "来源",
              value:
                "https://zh.wikipedia.org/wiki/%E9%BA%A6%E5%9D%8E%E8%B4%9D%E5%B0%94%E5%8F%B7%E9%A9%B1%E9%80%90%E8%88%B0",
            },
            { id: null, key: "建造者", value: "巴斯钢铁厂" },
            { id: null, key: "名称", value: "麦坎贝尔号驱逐舰" },
            {
              id: null,
              key: "avatar",
              value: "http://192.168.1.51:9050/jky/img/no-image.jpg",
            },
            {
              id: null,
              key: "_uuid",
              value: "1991bfcf81e9438fa7cdb81dcb2f397b",
            },
            { id: null, key: "舰名", value: "麦坎贝尔号" },
            { id: null, key: "服役日期", value: "2002-08-17" },
            {
              id: null,
              key: "概要",
              value:
                "麦坎贝尔号驱逐舰（英语：USS<br />McCampbell<br />(DDG-85)）是美国海军阿利伯克级驱逐舰的第三十五艘，以海军上校戴维麦坎贝尔命名。麦坎贝尔号驱逐舰于1999年7月15日在缅因州巴斯的巴斯钢铁厂安放龙骨，2000年7月2日下水，2002年8月17日服役。",
            },
            { id: null, key: "实体分类", value: "" },
            { id: null, key: "国家", value: "美国" },
            { id: null, key: "舰名出处", value: "戴维·麦坎贝尔" },
            { id: null, key: "动工日期", value: "1999-07-15" },
            { id: null, key: "下定日期", value: "1996年12月13日" },
            { id: null, key: "name", value: "麦坎贝尔号驱逐舰" },
            { id: null, key: "目前状态", value: "截至2019年为止仍现役中" },
            { id: null, key: "id", value: "58" },
            { id: null, key: "_time", value: "2019-06-04<br />11:40:14" },
            { id: null, key: "舰队", value: "第五驱逐舰中队" },
            { id: null, key: "下水日期", value: "2000-07-02" },
          ],
          examineState: null,
        },
        columnsHeader: {},
      },
    };
  },
  computed: {
    ...mapState("graphInfo", ["name"]),
    ...mapGetters("graphInfo", ["id"]),
    ...mapGetters("map", ["gisEntityIds", "gisLinesIds"]),
    ...mapState("map", ["gisEntities"]),
    // entity() {
    //   if (this.selectedEntity) {
    //     console.log(
    //       "选中实体属性",
    //       this.selectedEntity.id.properties.getValue()
    //     );
    //     // return this.gisEntities.filter(
    //     //   (item) => item.id === this.selectedEntity.id.id
    //     // )[0]; //所有的实体列表
    //     let form = this.selectedEntity.id.properties.getValue();
    //     form.id = this.selectedEntity.id.id;
    //     return form;
    //   } else {
    //     return undefined;
    //   }
    // },
    // labels() {
    //   if (this.entity.hasOwnProperty("labels")) {
    //     return this.entity.labels.filter((item) => item != "DATAEXA_OBJECT");
    //   } else {
    //     return [];
    //   }
    // },
    // properties() {
    //   const nameMap = {
    //     latitude: "纬度",
    //     longitude: "经度",
    //   };
    //   return this.entity
    //     ? Object.keys(this.entity)
    //         .filter(
    //           (v) =>
    //             [
    //               "avatar",
    //               "name",
    //               "keyVertexId",
    //               "weight",
    //               "color",
    //               "r_doc",
    //               "locus",
    //               "id",
    //             ].indexOf(v) < 0
    //         )
    //         .map((k) => [nameMap[k] ? nameMap[k] : k, this.entity[k]])
    //     : [];
    // },
    // nameAndAvatar() {
    //   return this.entity ? [this.entity.name, this.entity.avatar] : [];
    // },
  },
  async created() {
    emitter.on(EventType.CLICK_BLANK, this.close, this);
    emitter.on(EventType.CLICK_ENTITY, this.setSelectedEntity, this);
    //this.radioData = await this.getGroupData();
  },
  beforeDestroy() {
    emitter.off(EventType.CLICK_BLANK, this.close);
    emitter.off(EventType.CLICK_ENTITY, this.setSelectedEntity);
  },
  methods: {
    //记得改标记实体的ID
    setSelectedEntity(val) {
      // let res = await vertexDetailView(val.id.id , this.id)
      // let result = res.data.object
      this.selectedEntity = this.resultData.object;
      this.selectedEntity.deployInfo[0].value = val.id.properties.getValue().lng
      this.selectedEntity.deployInfo[1].value = val.id.properties.getValue().lat
      console.log("左键实体", this.selectedEntity);
      this.show = true;
    },
    async dialogOpen(item) {
      this.detailDialogTitle = item;
      this.detailDialogVisible = true;
    },
    //显示树
    async getCategory() {
      const res = await nodeCategoryQuery(this.id);
      let data = res.data;
      let treeData = [];
      for (const item of data) {
        if (item.parentId === 0) {
          treeData.push({
            id: item.id,
            label: item.name,
            children: [],
            ...item,
          });
        }
      }
      this.formatTree(treeData, data);
      this.treeData = [
        {
          id: -1,
          label: "所有",
          children: treeData,
          parentsName: "",
        },
      ];
    },
    // 递归返回的数据，形成树结构
    formatTree(treeData, data) {
      for (const item of treeData) {
        for (const item2 of data) {
          if (item.id === item2.parentId) {
            item.children.push({
              id: item2.id,
              label: item2.name,
              children: [],
              ...item2,
            });
          }
        }
        this.formatTree(item.children, data);
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    selectTreeFilterNode(value) {
      this.$refs.selectTree && this.$refs.selectTree.filter(value);
    },
    nodeClick(data) {
      this.selectedEntity.parentId = data.id;
      this.selectedEntity.parentsName = data.name;
    },
    selectTreeBlur(show) {
      // 下拉框隐藏时，取消过滤
      show || (this.$refs.selectTree && this.$refs.selectTree.filter());
    },
    clearSortParent() {
      this.selectedEntity.parentId = "";
      this.selectedEntity.parentsName = "";
    },
    /**
     * 获取group分组列表
     */
    async getGroupData() {
      const res = await geoNodeFindGroupData(this.name);
      const { success, object, msg } = res.data;
      if (!success) {
        this.$message.error(msg);
      }
      return object || [];
    },
    submit() {
      this.detailDialogVisible = false;
    },
    fixedPanel() {
      this.fixed = !this.fixed;
      let message = "面板已锁住";
      if (!this.fixed) {
        message = "面板已解锁";
      }
      this.$message.warning({
        message,
        duration: 1500,
      });
    },
    clickTabButton() {
      this.show = !this.show;
    },
    dialogSave() {},
    cancelEdit() {},
    close() {
      this.selectedEntity = null;
      !this.fixed && (this.show = false);
    },
  },
};
</script>

<style scoped lang="scss">
.GisInfoPanel {
  position: fixed;
  top: 3.58rem;
  right: 0;
  width: 23rem;
  height: calc(100vh - 3.58rem);
  background-color: var(--background-color-panel);
  border-top: 2px var(--color-dark) solid;
  transition: all 0.5s;

  .text {
    color: var(--color-text-regular);
    cursor: pointer;

    &:hover {
      color: var(--color-text-primary);
    }
  }

  .tab-button {
    position: absolute;
    top: calc(50vh - 8.43rem);
    left: -31px;
    width: 31px;
    box-sizing: border-box;
    cursor: pointer;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    background-color: var(--background-color-panel);
    padding: 12px 8px;
  }

  .panel-content {
    display: flex;
    flex-direction: column;
    height: 100%;

    .top {
      flex-shrink: 0;
    }

    .body {
      flex-grow: 1;
      overflow: auto;

      .content {
        .close-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
        }

        /deep/ .el-collapse-item__header {
          padding-left: 16px;
          padding-right: 16px;
          color: var(--color-text-regular);
          font-size: 15px;
          font-weight: 600;
        }

        .collapse-body {
          padding-right: 16px;
          padding-left: 16px;
        }

        .properties {
          display: flex;
          color: var(--color-text-regular);
          margin: 4px 0;
          flex-wrap: wrap;
          align-items: center;
          // div {
          //   padding-bottom: 10px;
          // }

          .label {
            display: block;
            text-align: left;
            width: 80px;
            color: var(--color-text-primary);
            font-weight: var(--font-weight-primary-bold);
            font-size: var(--font-size-base);
          }
          .value {
            display: block;
            flex: 1;
            word-break: break-word;
          }
        }

        .labels {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .avatar-name {
          .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 8.3rem;
            background-color: var(--background-color-item);
            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
          .name {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}

.show-panel {
  right: 0;
}
/deep/ .el-radio-group {
  display: flex;
  flex-direction: column;
}
.hide-panel {
  right: -23rem;
}
</style>
