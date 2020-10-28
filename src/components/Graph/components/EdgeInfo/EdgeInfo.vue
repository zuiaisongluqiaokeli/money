<template>
  <div class="node-info">
    <div class="header">
      <h3>关系信息</h3>
      <i
        title="关闭"
        aria-label="close"
        class="close el-icon-close"
        @click="close"
      ></i>
    </div>
    <el-collapse v-model="activeNames" class="collapse">
      <!-- 基本信息 -->
      <el-collapse-item name="basic">
        <template slot="title">
          <h4 class="title">基本信息</h4>
        </template>
        <Basic :data="edgeInfo" />
      </el-collapse-item>
      <!-- 属性 -->
      <el-collapse-item name="properties">
        <template slot="title">
          <h4 class="title">属性</h4>
        </template>
        <Properties :data="edgeInfo" />
      </el-collapse-item>
      <!-- 关系类型 -->
      <el-collapse-item name="tags">
        <template slot="title">
          <h4 class="title">关系类型</h4>
        </template>
        <Type :data="edgeInfo" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Basic from "./Basic";
import Properties from "./Properties";
import Type from "./Type";

export default {
  components: {
    Basic,
    Properties,
    Type
  },

  props: {
    edgeInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      activeNames: ["basic"]
    };
  },

  created() {},

  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>

.node-info {
  width: 17vw;
  height: 70vh;
  position: absolute;
  top: 3.58rem;
  right: 0;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;

  .header {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 16px;
    padding-right: 16px;

    .close {
      font-size: 16px;
      cursor: pointer;
    }
  }

  .collapse {
    flex: 1;
    padding: 0 16px 16px;
    overflow-y: overlay;

    .title {
      font-size: 14px;
    }
    /deep/ .el-collapse-item__header,
    /deep/ .el-collapse-item__wrap {
      background-color: #fafafa;
    }
  }
}
</style>
