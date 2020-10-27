<template>
  <div class="map-category">
    <el-input
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
      clearable
      v-model="treeSearchString"
    >
    </el-input>
    <PinyinIndex
      class="pinyin-index"
      ref="pinyinIndex"
      :data="treeData"
      :filter-method="filterMethod"
    >
      <template slot-scope="{ children, label }">
        <el-tree
          :ref="'tree' + label"
          :data="children"
          :filter-node-method="filterTreeNode"
          @node-click="handleTreeNodeClick"
        >
        </el-tree>
      </template>
    </PinyinIndex>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import PinyinIndex from "../../PinyinIndex";
// import { dictionaryQuery, categoryQuery } from "@/assets/api/map";

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
      treeData: [],
      filterMarkData: [],
      markData: [],
      treeSearchString: "",
      treeSelectedString: "",
      allCountries: [],
      allSubCategory: []
    };
  },

  computed: {
    ...mapState("graphInfo", ["name"])
  },

  watch: {
    treeSearchString(newValue) {
      this.$refs.pinyinIndex.filter(newValue);
    }
  },

  async created() {
    this.allCountries = await this.getAllCountries();
    this.allSubCategory = await this.getAllSubCategory();

    const tree = this.arrayToTree(this.allSubCategory);

    this.treeData = this.countryCategoryTree(this.allCountries, tree);
  },

  methods: {
    /**
     * 得到所有国家
     */
    async getAllCountries() {
      const type = "Country";
      const res = await dictionaryQuery(type);
      const { data } = res;
      const { success, msg, object } = data;

      if (!success) {
        this.$message({
          message: msg,
          type: "error"
        });
      }

      return object || [];
    },
    /**
     * 得到所有子分类
     */
    async getAllSubCategory() {
      const graphName = this.name;
      const res = await categoryQuery(graphName);
      const { data } = res;
      const { success, msg, object } = data;

      if (!success) {
        this.$message({
          message: msg,
          type: "error"
        });
      }

      return object || [];
    },
    /**
     * 数组转树型
     */
    arrayToTree(vertices) {
      function process(node) {
        const properties = node.properties;

        node.name = properties.name;
        node.pid = properties.ParentId;
      }

      function getNodeByPropId(id) {
        if (cache[id]) {
          return cache[id];
        }

        const node = vertices.find(vertice => vertice.properties.ID === id);

        if (node) {
          cache[id] = node;

          return node;
        }

        return null;
      }

      const cache = {};
      const root = [];

      vertices.forEach(vertice => {
        const childNode = vertice;

        process(childNode);

        const pId = vertice.properties.ParentId;

        if (!pId) {
          return root.push(vertice);
        }

        const parentNode = getNodeByPropId(pId);

        if (!parentNode) {
          return root.push(vertice);
        }

        // 定制加工
        process(parentNode);

        const children = (parentNode.children = parentNode.children || []);

        if (!children.includes(childNode)) {
          children.push(childNode);
        }
      });

      return root;
    },
    /**
     * 构建国家树节点
     */
    countryCategoryTree(countries, vertices) {
      countries.forEach(i => {
        i.children = [];
      });
      vertices.forEach(vertice => {
        const target = countries.find(
          country => country.label === vertice.properties["国家"]
        );

        if (target) {
          target.children.push(vertice);
        }
      });

      return countries;
    },
    /**
     * 过滤树节点
     */
    filterTreeNode(value, data) {
      if (!value) {
        return true;
      }

      return data.label.includes(value);
    },
    /**
     * 树节点点击
     */
    handleTreeNodeClick(data) {
      const { label } = data;

      this.treeSelectedString = label;

      if (typeof this.clickMethod === "function") {
        this.clickMethod(data);
      }
    },

    /**
     * 过滤树
     */
    filterMethod(val, { label }) {
      const tree = this.$refs[`tree${label}`];

      tree.filter(val);

      return !tree.isEmpty;
    }
  }
};
</script>

<style lang="scss" scoped>
.map-category {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .pinyin-index {
    margin-top: 8px;
    overflow: auto;
  }
}
</style>
