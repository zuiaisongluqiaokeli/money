<template>
  <div class="map-membership">
    <el-dialog
      title="隶属"
      append-to-body
      class="map-membership dialog"
      :visible.sync="dialogVisible"
      @closed="emitClosedEvent"
    >
      <el-radio-group v-model="checked">
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
        <el-button type="default" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import {
  geoNodeFindGroupData
} from "@/assets/api/map";
import MapCategory from "../LeftSideBar/components/MapCategory";

export default {
  components: { MapCategory },

  directives: {},

  props: {},

  data() {
    return {
      dialogVisible: true,
      checked: "",
      radioData: []
    };
  },

  computed: {
    ...mapState("graphInfo", ["graphName"])
  },

  watch: {},

  async created() {
    this.radioData = await this.getGroupData();
  },

  methods: {
    /**
     * 获取group分组列表
     */
    async getGroupData() {
      const res = await geoNodeFindGroupData(this.graphName);
      const { success, object, msg } = res.data;

      if (!success) {
        this.$message.error(msg);
      }

      return object || [];
    },
    /**
     * 节点点击
     */
    clickMethod(data) {
      this.currentCategory = data;
    },
    submit() {
      const target = this.radioData.find(({ id }) => id === this.checked);

      this.$emit("submit", target);
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
  .radio {
    display: block;
  }
}
</style>
