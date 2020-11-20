<template>
  <div class="map-weapon">
    <el-dialog
      title="部署装备"
      class="dialog"
      append-to-body
      :visible.sync="dialogVisible"
      @closed="emitClosedEvent"
    >
      <div class="dialog-body">
        <el-radio-group v-model="checked">
          <el-radio
            v-for="(item, index) in checkboxData"
            :label="item.id"
            :key="index"
            class="radio"
          >
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </div>
      <div class="footer" slot="footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button type="default" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { knowledgeEquipmentQueryByType } from "@/assets/api/map";

let main = null;

export default {

  props: {
    infoData: {
      type: Object,
      default() {
        return {};
      }
    },
    currentChecked: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      treeData: [],
      checkboxData: [],
      checked: [],
      checkedData: [],
      defaultProps: {
        label: "name",
      },
      defaultExpandedKeys: [],
      dialogVisible: true,
      selectedEntity: null,
    };
  },

  computed: {
    ...mapState("graphInfo", ["name"]),
  },

  created() {
    this.checkboxData = this.getDeployment();
  },

  methods: {
    ...mapActions("3dMap", ["setMapData", "setMarkType"]),
    /**
     * 根据类型查找装备
     */
    async getDeployment() {
      const { category, type, country } = this.infoData;
      const res = await knowledgeEquipmentQueryByType(
        category,
        type,
        this.name,
        country
      );
      const { object, success, msg,message } = res.data;
      // const { object, success, msg } = mapWeaponTreeJson;

      if (!success) {
        this.$message.error(message);
      }

      if (object) {
        return object;
      }

      return [];
    },
    /**
     * 触发关闭事件
     */
    emitClosedEvent() {
      this.$emit("before-close");
    },
    /**
     * 提交修改
     */
    submit() {
      const target = this.checkboxData.find(({ id }) => id === this.checked);

      this.$emit("submit", [target]);
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
     * 构造能用的数据
     */
    generateCheckboxData(category) {
      const cloneCategory = JSON.parse(JSON.stringify(category));
      const result = [];

      if (!Array.isArray(cloneCategory)) {
        return result;
      }

      return cloneCategory.map((item) => {
        const { id, properties } = item;
        const { name } = properties;

        return {
          id,
          name,
        };
      });
    },
    /**
     * 多选框选择事件
     */
    handleCheckboxChange(data) {
      this.checkedData = this.checkboxData.filter(({ id }) =>
        data.includes(id)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.map-weapon {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.dialog {
  .dialog-body {
    height: 450px;
    position: relative;
    display: flex;
    flex-direction: column;

    .radio {
      display: block;
    }

    .row {
      height: 100%;

      &::before {
        content: "";
        width: 2px;
        height: 100%;
        position: absolute;
        top: 0;
        left: calc(50% - 1px);
        background-color: var(--border-color-base);
      }

      .col {
        height: 100%;
      }
    }

    .wrap {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .title {
      margin-bottom: 8px;
    }

    .content {
      height: 100%;
      position: relative;
      overflow-y: auto;
    }
  }

  .footer {
  }
}
</style>
