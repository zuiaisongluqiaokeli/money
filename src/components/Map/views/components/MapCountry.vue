<template>
  <div class="map-membership">
    <el-dialog
      title="国家"
      append-to-body
      class="map-membership dialog"
      :visible.sync="dialogVisible"
      @closed="emitClosedEvent"
    >
      <MapCategory :click-method="clickMethod" />
      <div class="footer" slot="footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button type="default" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import MapCategory from "../LeftSideBar/components/MapCategory";

export default {
  components: { MapCategory },

  directives: {},

  props: {},

  data() {
    return {
      dialogVisible: true
    };
  },

  computed: {},

  watch: {},

  mounted() {},

  methods: {
    /**
     * 节点点击
     */
    clickMethod(data) {
      this.currentCategory = data;
    },
    submit() {
      this.$emit("submit", this.currentCategory);
      this.closeDialog();
    },
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.dialogVisible = false;
      this.emitClosedEvent();
    },
    /**
     * 触发关闭事件
     */
    emitClosedEvent() {
      this.$emit("before-close");
    }
  }
};
</script>

<style lang="scss" scoped>
.map-membership {
  .map-category {
    height: 500px;
  }
}
</style>
