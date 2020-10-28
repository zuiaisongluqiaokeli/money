<template>
  <div class="properties">
    <!-- 筛选 -->
    <div class="filter">
      <el-popover
        v-model="popoverVisible"
        placement="bottom"
        popper-class="property-panel-popover"
        @after-leave="handlerAfterLeave"
      >
        <el-input
          v-model="filterSearch"
          placeholder="输入属性搜索"
          class="filter-input"
          @keydown.native.enter="handlerSearch"
          @input="handlerSearch"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search search-icon"
            @click="handlerSearch"
          ></i>
        </el-input>
        <ul class="list">
          <li
            v-for="(item, index) in filteredProperties"
            v-show="item.show && item.value"
            :key="index"
            class="item"
            @click="handlerSearchListClick(item)"
          >
            <div class="title" :title="item.key">
              {{ item.key }}
            </div>
          </li>
        </ul>
        <p v-if="!properties.length" class="no-message">
          当前无属性信息
        </p>
        <!-- <span slot="reference" class="btn">筛选</span> -->
      </el-popover>
    </div>

    <ul class="list">
      <li
        v-for="(item, index) in properties"
        :key="index"
        :data-title="item.key"
        class="item"
      >
        <div class="title" :title="item.key">
          {{ item.key }}
        </div>
        <div class="detail" :title="item.value">
          {{ item.value }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      errorImg: `this.src='./img/default.png'`,
      defaultImgSrc: require("@/assets/img/empty.svg"),
      properties: [],
      filterSearch: "", // 筛选的绑定值
      filteredProperties: [], // 筛选的属性数组
      popoverVisible: false // popover 可见性
    };
  },

  computed: {},

  watch: {
    data: {
      handler(value) {
        if (value) {
          this.properties = this.generateProperties();
        } else {
          this.properties = [];
        }
      },
      immediate: true,
      deep: true
    },

    properties(newValue) {
      this.filteredProperties = this.properties.map(({ key, value }) => {
        return {
          key,
          value,
          show: true
        };
      });
    }
  },

  created() {
    this.properties = this.generateProperties();
  },

  methods: {
    /**
     * 过滤一下不用显示的属性
     */
    getProperties() {
      const notNeed = [
        "avatar",
        "url",
        "keyType",
        "tag",
        "uuid",
        "tempbool",
        "temptool",
        "position",
        "summary",
        "sections",
        "name",
        "radius",
        "color",
        "params",
        "weight",
        "keyVertexId",
        "fixedId",
        "category"
      ];
      const { properties } = this.data;

      return Object.entries(properties).reduce((previous, current) => {
        const [key, value] = current;

        if (key === "mark") {
          previous["备注"] = value;
        } else if (!notNeed.includes(key)) {
          previous[key] = value;
        }

        return previous;
      }, {});
    },
    /**
     * 构建数据
     */
    generateProperties() {
      const properties = this.getProperties();

      return Object.entries(properties).map(([key, value]) => {
        return {
          key,
          value
        };
      });
    },
    /**
     * 筛选搜索
     */
    handlerSearch() {
      this.filteredProperties.forEach(prop => {
        if (prop.key.includes(this.filterSearch)) {
          prop.show = true;
        } else {
          prop.show = false;
        }
      });
    },
    /**
     * 点击某项后跳转到视图内
     */
    handlerSearchListClick(item) {
      const target = document.querySelector(`li[data-title="${item.key}"]`);

      target.scrollIntoView();
      this.popoverVisible = false;
    },
    /**
     * popover 消失后
     */
    handlerAfterLeave() {
      this.filterSearch = "";
      this.filteredProperties.forEach(prop => {
        prop.show = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.properties {
  position: relative;

  .filter {
    position: sticky;
    top: 0;
    text-align: right;
  }

  .no-message {
    text-align: center;
    margin: 0;
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;

    .item {
      display: flex;
      // color: #bfbfbf;
      margin: 4px 0;

      .title {
        width: 130px;
        // color: #fafafa;
        font-weight: 600;
        font-size: 14px;
      }

      .detail {
        flex: 1;
        word-break: break-word;
      }
    }
  }

  .btn {
    color: #02b3fc;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.properties.el-popover {
  .no-message {
    text-align: center;
  }

  .search-icon {
    cursor: pointer;
  }

  .filter-input {
    margin-bottom: 8px;
  }

  .list {
    display: flex;
    width: 300px;
    max-height: 250px;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    list-style: none;

    .item {
      width: 50%;
      color: #bfbfbf;
      padding: 4px;
      margin: 4px 0;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #4b4b4b;
      }

      .title {
        color: #fafafa;
        font-weight: 500;
        font-size: 14px;
      }
    }
  }
}
</style>
