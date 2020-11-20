<template>
  <div class="map-mount">
    <el-dialog
      title="挂载方案"
      append-to-body
      class="map-mount dialog"
      :visible.sync="dialogVisible"
      @closed="emitClosedEvent"
    >
      <div class="content">
        <!-- <el-radio-group v-model="radioChecked" class="left-group">
          <el-radio
            v-for="(item, index) in radioData"
            :label="item.label"
            :key="index"
            class="radio"
          >
          </el-radio>
        </el-radio-group> -->
        <el-tree
          ref="tree"
          class="left-group"
          show-checkbox
          node-key="id"
          icon-class="hidden"
          :data="treeData"
          :expand-on-click-node="false"
          :default-checked-keys="defaultCheckedKeys"
          @node-click="handleNodeClick"
          @check="handleCheck"
        ></el-tree>
        <el-checkbox-group
          v-model="checkboxChecked"
          class="right-group"
          @change="handleCheckboxChange"
        >
          <el-checkbox
            v-for="(item, index) in checkboxData"
            :label="item"
            :key="index"
            class="checkbox"
          >
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
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
import { mountSchemaCategory, findAccessoryByCategory } from "@/assets/api/map";

export default {
  components: {},

  directives: {},

  props: {
    currentChecked: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      dialogVisible: true,
      radioChecked: "",
      treeData: [],
      checkboxData: [],
      checkboxChecked: [],
    };
  },

  computed: {
    ...mapState("graphInfo", ["name"]),
    defaultCheckedKeys() {
      return this.currentChecked;
    },
  },

  watch: {},

  async created() {
    await this.generateData();
    //把右侧内容挂载到左侧树
    const [first] = this.treeData;
    const { children } = first;

    this.$refs.tree.setCurrentNode(first); //默认选中第一个
    this.checkboxData = children; //右侧多选框
    this.checkboxChecked = children.filter(({ id }) =>
      this.defaultCheckedKeys.includes(id)
    );
  },

  methods: {
    /**
     * 构造数据
     */

    async generateData() {
      const treeData = await this.getTreeData();
      const allPromise = [];
      //掉接口
      treeData.forEach(({ label: category }) =>
        allPromise.push(this.getCheckboxData(category))
      );

      const allCheckboxData = await Promise.all(allPromise);

      this.treeData = treeData.map(({ label }, index) => {
        const children = allCheckboxData[index];
        let adaptChildren = children.map((item) => {
          return {
            label: item.name,
            id: item.id,
          };
        });

        // adaptChildren = adaptChildren.slice(0, 2);

        return {
          id: `parent_${label}`,
          label,
          children: adaptChildren,
        };
      });
    },
    /**
     * 获取挂载方案类别
     */
    async getTreeData() {
      const res = await mountSchemaCategory();
      const { success, object, msg } = res.data;

      if (!success) {
        this.$message.error(msg);
      }

      if (object) {
        return object.map((data) => {
          return {
            label: data,
          };
        });
      }
      return [];
    },
    /**
     * 根据挂载类别查找配件
     */
    async getCheckboxData(category) {
      // const category = this.radioChecked;
      const graphName = this.name;
      const page = 1;
      const size = 50;
      const res = await findAccessoryByCategory(
        category,
        graphName,
        page,
        size
      );
      const { success, object, msg } = res.data;

      if (!success) {
        this.$message.error(msg);
      }

      return object || [];
    },
    /**
     * 树节点点击
     */
    handleNodeClick(data, node, vm) {
      this.checkboxData = data.children;
    },
    /**
     * 树节点复选框被点击
     */
    handleCheck(data, checked) {
      const { checkedKeys } = checked;
      const childrenIds = checkedKeys.filter(
        (id) => !String(id).includes("parent_")
      );

      this.setCheckboxChecked(childrenIds);
    },
    /**
     * 设置多选框的选中状态
     */
    setCheckboxChecked(checkedArray = []) {
      this.checkboxChecked = checkedArray.map((id) => {
        const node = this.$refs.tree.getNode(id);
        const { data } = node;

        return data;
      });
    },
    /**
     * 多选框的变化事件
     */
    handleCheckboxChange(checked) {
      const ids = checked.map(({ id }) => id);

      this.$refs.tree.setCheckedKeys(ids);
    },
    /**
     * 确定提交
     */
    submit() {
      const checked = this.$refs.tree.getCheckedKeys();
      const data = checked
        .filter((id) => !String(id).includes("parent_"))
        .map((id) => {
          const node = this.$refs.tree.getNode(id);
          const { data } = node;

          return data;
        });
      this.$emit("submit", [...data]);
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
    },
  },
};
</script>

<style lang="scss" scoped>
.map-mount {
  .content {
    width: 100%;
    height: 100%;
    // position: absolute;
    top: 0;
    left: 0;
    display: flex;
    // padding: 20px;

    .left-group {
      width: 220px;
      padding-right: 16px;
      border-right: 1px solid var(--border-color-base);
    }

    .right-group {
      width: 0;
      flex: 1;
      margin-left: 16px;
      overflow: overlay;

      .checkbox {
        display: block;
      }
    }
  }
}
</style>

<style lang="scss">
.map-mount.dialog {
  .el-dialog {
    height: 80vh;

    .el-dialog__body {
      position: relative;

      .hidden {
        pointer-events: none;
      }
    }
  }
}
</style>
