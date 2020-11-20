<template>
  <div class="map-mark">
    <el-tabs class="tabs" v-model="activeTabName">
      <el-tab-pane label="力量编制" name="group"></el-tab-pane>
      <el-tab-pane label="部署设施" name="deployment"></el-tab-pane>
    </el-tabs>
    <div class="content">
      <!-- 力量编制 -->
      <div class="group" v-if="activeTabName === 'group'">
        <div
          v-for="(child, index) in groupData"
          :key="index"
          class="child"
          :title="child.groupType"
          @click="handleMarkClick(child)"
        >
          <img class="img" :src="child.image" :alt="child.groupType" />
          <div class="description">
            {{ child.groupType }}
          </div>
        </div>
      </div>
      <!-- 部署设施 -->
      <div class="deployment" v-if="activeTabName === 'deployment'">
        <!-- 搜索框 -->
        <div class="search">
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            clearable
            v-model="markSearchString"
          >
          </el-input>
        </div>
        <!-- 分类过滤 -->
        <div class="filter">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="checkboxGroup"
            @change="handleCheckboxChange"
          >
            <el-checkbox
              v-for="(item, index) in markData"
              :label="item.type"
              :key="index"
              class="button"
            >
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <!--索引 -->
        <div class="index">
          <PinyinIndex
            :data="filterMarkData"
            :default-props="defaultProps"
            class="pinyin-index"
          >
            <template slot-scope="{ children }">
              <template v-if="children.length">
                <div
                  v-for="(child, index) in children"
                  :key="index"
                  class="child"
                  :title="child.type"
                  @click="handleMarkClick(child)"
                >
                  <img class="img" :src="child.image" :alt="child.type" />
                  <div class="description">
                    {{ child.type }}
                  </div>
                </div>
              </template>
            </template>
          </PinyinIndex>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import legendJson from "../../../mock/legend.json";
import PinyinIndex from "../../PinyinIndex";
import { enumCategoryQuery, geoNodeFindGroup } from "@/assets/api/map";
import { findTargetLegend } from "../../../src/Methods";
import { emitter, EventType } from "../../../src/EventEmitter";
import mapMarkCategoryJson from "../../../mock/map-mark-category.json";

export default {
  components: { PinyinIndex },

  directives: {},

  props: {
    clickMethod: {
      type: Function,
      default: null
    }
  },

  data() {
    return {
      defaultProps: {
        label: "type"
      },
      tabsMap: ["group", "deployment"],
      activeTabName: "",
      markSearchString: "",
      groupData: [],
      markData: [], //所有勾选框
      filterMarkData: [], //已勾选的
      checkAll: false,
      checkboxGroup: []
    };
  },

  computed: {
    ...mapState("graphInfo", ["name"]),
    isIndeterminate() {
      const { length } = this.checkboxGroup;

      return length > 0 && length < this.markData.length;
    }
  },

  watch: {
    markSearchString(newValue) {
      this.filterMarkNode(newValue);
    },
    checkboxGroup() {
      this.checkAll = this.checkboxGroup.length === this.markData.length;
      this.handleCheckboxChange();
    }
  },

  async created() {
    this.activeTabName = this.tabsMap[0];
    await this.getAllData();
  },

  methods: {
    ...mapActions("3dMap", ["setMeasureType", "setInfoPanelEditStatus"]),
    /**
     * 得到所有数据
     */
    async getAllData() {
      this.groupData = await this.getGroup(); //依据分组名称查找分组对象
      this.markData = await this.getCategory();
      this.filterMarkData = this.generateLegendData(this.markData); //字母查找的
      this.checkboxGroup = this.markData.map(item => item.type);
    },
    async getGroup() {
      const res = await geoNodeFindGroup(this.name);
      const { data } = res;
      const { object, success, msg } = data;
      if (!success) {
        this.$message.error(msg);
      }
      if (object) {
        //依据分组名称查找分组对象
        return object.map(name => {
          const targetLegend = findTargetLegend(name);
          const { image } = targetLegend;
          return {
            image: image,
            groupCategory: name,
            groupType: name,
            group: name
          };
        });
      }
      return [];
    },
    /**
     * 获取类别数据
     */
    async getCategory() {
      const res = await enumCategoryQuery();
      const { data } = res;
      const { object, success, msg } = data;
      // const { object, success, msg } = mapMarkCategoryJson;

      if (!success) {
        this.$message.error(msg);
      }

      if (object) {
        return object;
      }

      return [];
    },
    /**
     * 生成标记图例能用的数据
     */
    generateLegendData(arr) {
      const cloneArray = JSON.parse(JSON.stringify(arr));
      const array = [];

      cloneArray.forEach(parent => {
        const { children, type } = parent;
        const targetLegend = findTargetLegend(type);
        const { image, markType } = targetLegend;

        if (children) {
          children.forEach(child => {
            const { name } = child;

            child = {
              image: image,
              category: markType,
              type: name
            };

            array.push(child);
          });
        }
      });

      return array;
    },
    /**
     * 过滤标记图例节点
     */
    filterMarkNode(value) {
      const target = this.getCurrentAvailableMarkData(); //拿到勾选了的数据
      const cloneArray = this.generateLegendData(target);

      if (!value) {
        this.filterMarkData = cloneArray;
      } else {
        this.filterMarkData = cloneArray.filter(item =>
          item.type.toLowerCase().includes(value.toLowerCase())
        );
      }
    },
    /**
     * 选择测量类型
     */
    handleMarkClick(item) {
      const { group } = item; //左/右
      group
        ? console.log("选择测量类型", item.groupCategory, item.groupType, item)
        : console.log("选择测量类型", item.category, item.type, item);

      if (typeof this.clickMethod === "function") {
        this.clickMethod({ ...item });
      } else {
        console.log("标记的点的值", item);
        emitter.emit(EventType.SET_MEASURE_TYPE, { ...item });
        // this.setMeasureType(type);
        // this.setInfoPanelEditStatus(true);
      }

      this.$emit("before-close");
    },
    /**
     * 多选框更新事件
     */
    handleCheckboxChange() {
      const target = this.getCurrentAvailableMarkData();

      this.filterMarkData = this.generateLegendData(target);
      this.filterMarkNode(this.markSearchString);
    },
    /**
     * 得到当前有效数据
     */
    getCurrentAvailableMarkData() {
      return this.markData.filter(item =>
        this.checkboxGroup.includes(item.type)
      );
    },
    /**
     * 全选框事件
     */
    handleCheckAllChange(checkAll) {
      if (checkAll) {
        this.checkboxGroup = this.markData.map(({ type }) => type);
      } else {
        this.checkboxGroup = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.map-mark {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;

  .tabs {
    padding-left: 8px;
  }

  .content {
    height: 100%;
  }

  .group {
  }

  .deployment {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .search {
    padding: 8px;
  }

  .filter {
    padding: 8px;
    margin-bottom: 8px;

    .button {
      margin-top: 4px;

      /deep/ .el-checkbox-button__inner {
        border: 1px solid var(--border-color-base);
        margin-left: -1px;
      }
    }
  }

  .index {
    position: relative;
    flex: 1;

    .pinyin-index {
      position: absolute;
      width: 100%;
      height: 100%;
      padding-bottom: 8px;
    }
  }

  .child {
    display: flex;
    align-items: center;
    margin: 4px 8px;
    background-color: var(--background-color-item);
    border-radius: 4px;
    color: var(--color-text-regular);
    cursor: pointer;

    &:hover {
      color: var(--color-text-primary);
      background-color: var(--background-color-item-light);
    }

    .img {
      width: 24px;
      margin: 0 4px;
    }

    .description {
    }
  }
}
</style>
