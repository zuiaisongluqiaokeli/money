<template>
  <div class="properties">
    <ul class="list">
      <li
        v-for="(item, index) in properties"
        :key="index"
        class="item"
        :data-title="item.key"
      >
        <div class="title">
          {{ item.key }}
        </div>
        <div class="detail">
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
      const notNeed = ["color", "summary", "type", "name"];
      const { properties } = this.data;

      return Object.entries(properties).reduce((previous, current) => {
        const [key, value] = current;

        if (!notNeed.includes(key)) {
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
        width: 100px;
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
      // color: #bfbfbf;
      padding: 4px;
      margin: 4px 0;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #4b4b4b;
      }

      .title {
        // color: #fafafa;
        font-weight: 500;
        font-size: 14px;
      }
    }
  }
}
</style>
