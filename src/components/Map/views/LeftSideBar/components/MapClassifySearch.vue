<template>
  <div id="map-classify-search" class="map-classify-search">
    <div>
      <el-input placeholder="请输入分类名称" v-model="filterValue"></el-input>
      <el-tree
        :data="classifyData"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :filter-node-method="filterNode"
        ref="classifyTree"
      >
      </el-tree>
      <el-button class="search-btn" type="text" @click="classifySearch">搜索</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { flat2nest } from "../../../utils/flat2nest";
export default {
  name: "MapClassifySearch",
  props: {},
  data() {
    return {
      filterValue: null,
      classifyData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      flatClassifyData: [
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 1000,
          isInherit: 0,
          name: "科研档案",
          parentId: 0,
          rootType: 0,
          sortOrder: 1,
          type: 2
        },
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 3000019776,
          isInherit: 0,
          name: "宏观论证宏观论证宏观论证宏观论证宏观论证",
          parentId: 3000019791,
          rootType: 0,
          sortOrder: 20,
          type: 0
        },
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 3000019777,
          isInherit: 0,
          name: "预研",
          parentId: 3000019792,
          rootType: 0,
          sortOrder: 20,
          type: 0
        },
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 3000019778,
          isInherit: 0,
          name: "JN科研",
          parentId: 3000019792,
          rootType: 0,
          sortOrder: 10,
          type: 0
        },
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 3000019779,
          isInherit: 0,
          name: "QB资料",
          parentId: 3000019793,
          rootType: 0,
          sortOrder: 20,
          type: 0
        },
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 3000019780,
          isInherit: 0,
          name: "内参资料",
          parentId: 3000019793,
          rootType: 0,
          sortOrder: 10,
          type: 0
        },
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 3000019781,
          isInherit: 0,
          name: "实验鉴定",
          parentId: 3000019791,
          rootType: 0,
          sortOrder: 10,
          type: 0
        },
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 3000019791,
          isInherit: 0,
          name: "主题分类",
          parentId: 1000,
          rootType: 0,
          sortOrder: 1,
          type: 0
        },
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 3000019792,
          isInherit: 0,
          name: "领域分类",
          parentId: 1000,
          rootType: 0,
          sortOrder: 20,
          type: 0
        },
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 3000019793,
          isInherit: 0,
          name: "资料类型",
          parentId: 1000,
          rootType: 0,
          sortOrder: 30,
          type: 0
        },
        {
          categoryType: "document",
          description: "",
          icon: "",
          id: 3000019804,
          isInherit: 0,
          name: "测试分类",
          parentId: 1000,
          rootType: 0,
          sortOrder: null,
          type: 0
        }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  components: {},
  computed: {},
  watch: {
    filterValue(n){
      this.$refs.classifyTree.filter(n)
    }
  },
  methods: {
    classifySearch(){
      console.log(this.$refs.classifyTree.getCheckedKeys())
    },
    filterNode(value,data){
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  },
  mounted() {
    this.classifyData = [].concat(flat2nest(this.flatClassifyData)[0].children);
    console.log(this.classifyData);
  }
};
</script>

<style lang="scss" scoped>
.map-classify-search {
  max-height: 385px;
  // 外层容器有padding，滚动调滚不到最顶或最底部，做些处理
  margin: -12px 0;
  padding: 8px 0;
  overflow: auto;
  /deep/ .el-tree {
    height: 200px;
    width: 200px;
    overflow-y: scroll;
  }
  .search-btn{
    float: right;
  }
}
</style>
