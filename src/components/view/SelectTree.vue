<template>
  <Select
    ref="select"
    v-model="names"
    filterable
    allow-create
    :multiple="multiple"
    save-when-blur
    default-first-option
    clearable
    :filter-method="treeFilterNode"
    :placeholder="placeholder"
    popper-class="my-select-tree"
    @visible-change="treeBlur"
    @clear="clear"
  >
    <el-option :value="0" class="hidden" />
    <template>
      <el-tree
        ref="tree"
        :filter-node-method="filterNode"
        accordion
        highlight-current
        :data="data"
        :props="propSet"
        :node-key="nodeKey"
        :lazy="lazy"
        :load="load"
        @node-click="nodeClick"
      />
    </template>
    <template slot="empty">
      暂时没有数据
    </template>
  </Select>
</template>

<script>
import { Select } from "element-ui";

export default {
  name: "SelectTree",
  components: {
    Select
  },
  props: {
    // 虽然v-model默认绑定的是value值，但props如果没显性声明value的话，即使绑定v-model，但this.value还会是undefined
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    propSet: {
      type: Object,
      default() {
        return {
          children: "children",
          label: "name"
        };
      }
    },
    placeholder: {
      type: String,
      default() {
        return "";
      }
    },
    nodeKey: {
      type: String,
      default() {
        return "id";
      }
    },
    // 只对单选下拉树起作用
    automaticShrink: {
      type: Boolean,
      default() {
        return true;
      }
    },
    load: Function,
    lazy: Boolean,
    multiple: Boolean
  },
  data() {
    return {
      ids: null,
      names: null
    };
  },
  watch: {
    async value() {
      // OPTIMIZE 第一次使用，tree组件还没来得及render，这样update()方法里tree.getNode()会拿不到数据，先这样，没必要每次都nextTick，优化点：判断树是否渲染
      await this.$nextTick();
      this.update();
    },
    names(nv, ov) {
      // 处理多选时，删除选项
      if (!ov) return;
      if (this.multiple && nv.length < ov.length) {
        const index = ov.findIndex(i => !nv.includes(i));
        if (index !== -1) {
          this.ids.splice(index, 1);
        }
      }
    },
    ids(val) {
      this.$emit("input", val);
      this.$emit("change", this.selectedItems);
    }
  },
  created() {
    this.reset();
  },
  mounted() {
    (typeof this.value === "number" || this.value) && this.update();
  },
  methods: {
    update() {
      if (typeof this.value === "number" || this.value) {
        this.ids = this.value;
        let ids = this.multiple ? [].concat(this.ids) : [this.ids];
        const nodeLabel = this.getPropByKey("label");
        let names = [],
          selectedItems = [];
        ids.forEach(id => {
          let node = this.$refs.tree.getNode({ [this.nodeKey]: id });
          if (!node) return;
          names.push(node.data[nodeLabel]);
          selectedItems.push(node.data);
        });
        this.names = this.multiple ? names : names[0];
        this.selectedItems = this.multiple ? selectedItems : selectedItems[0];
      } else {
        this.reset();
      }
    },
    reset() {
      if (this.multiple) {
        this.ids = [];
        this.names = [];
        this.selectedItems = [];
      } else {
        this.ids = "";
        this.names = "";
        this.selectedItems = {};
      }
    },
    nodeClick(data) {
      const nodeKey = this.nodeKey;
      const nodeLabel = this.getPropByKey("label");
      if (this.multiple) {
        const names = this.names;
        const ids = this.ids;
        const selectedItems = this.selectedItems;
        const index = ids.findIndex(i => String(i) === String(data[nodeKey])); // 忽略数字和字符串吧
        if (index === -1) {
          ids.push(data[nodeKey]);
          names.push(data[nodeLabel]);
          selectedItems.push(data);
        } else {
          ids.splice(index, 1);
          names.splice(index, 1);
          selectedItems.splice(index, 1);
        }
      } else {
        this.ids = data[nodeKey];
        this.names = data[nodeLabel];
        this.selectedItems = data;
        if (this.automaticShrink) {
          this.$refs.select.blur();
        }
      }
    },
    treeFilterNode(value) {
      this.$refs.tree && this.$refs.tree.filter(value);
    },
    treeBlur(show) {
      // 下拉框隐藏时，取消过滤
      show || (this.$refs.tree && this.$refs.tree.filter());
    },
    clear() {
      if (this.multiple) {
        this.ids = [];
        this.names = [];
        this.selectedItems = [];
      } else {
        this.ids = "";
        this.names = "";
        this.selectedItems = {};
      }
    },
    filterNode(value, data) {
      const nodeLabel = this.getPropByKey("label");
      if (!value) return true;
      return data[nodeLabel].indexOf(value) !== -1;
    },
    getPropByKey(key) {
      if (this.propSet) {
        return this.propSet[key];
      }
      return null;
    }
  }
};
</script>

<style lang="scss" scoped>
.hidden {
  display: none;
}
</style>
<style>
.my-select-tree .el-select-dropdown__item {
  display: none;
}
.my-select-tree .el-select-dropdown__list {
  padding: 5px 0;
}
</style>
