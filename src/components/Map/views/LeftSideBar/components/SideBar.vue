<template>
  <div class="side-bar" :class="placement">
    <ul class="list">
      <li
        class="item"
        v-for="(item, index) in data"
        :key="index"
        :title="item.label"
        @click="handleClick(item)"
      >
        <i class="tip iconfont icon-triangle" v-show="item.tip"></i>
        <div v-if="item.name === 'category' || item.name === 'mark'">
          <i :class="item.icon" class="icon" @click="open(item.name)"></i>
        </div>
        <el-popover
          v-else
          :placement="item.placement"
          trigger="click"
          :disabled="!item.component"
        >
          <component :is="item.component"></component>
          <i :class="item.icon" class="icon" slot="reference"></i>
        </el-popover>
      </li>
    </ul>
    <!-- 分类 -->
    <MapSearchAdd
      v-if="showMapSearchAdd"
      @before-close="closeDialog"
    ></MapSearchAdd>
    <!-- 标记 -->
      <el-dialog
        title="标记"
        class="dialog"
        :visible.sync="showMapMark"
        append-to-body
      >
        <div class="dialog-body">
          <MapMark @before-close="closeDialog"></MapMark>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import MapSearchAdd from "./MapSearchAdd";
import MapMark from "./MapMark";
import { mapMutations } from "vuex";

export default {
  components: {MapSearchAdd, MapMark },
  props: {
    placement: {
      type: String,
      default: "left"
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      showMapSearchAdd: false,
      showMapMark: false
    };
  },

  methods: {
    /**
     * 点击某一项
     */
    handleClick(item) {
      // this.$emit("click", item);
      if (item.label === "主页") {
        console.log("重置视角为初始态");
        window.viewer.camera.flyHome();
      } else if (item.label === "清空") {
        this.updateGisEntities([]);
        this.updateGisLines([]);
        gisvis.viewer.entities.removeAll();
      }
    },
    open(val) {
      val == "category"
        ? (this.showMapSearchAdd = true)
        : (this.showMapMark = true);
    },
    closeDialog() {
      this.showMapSearchAdd = false;
      this.showMapMark = false;
    },
    ...mapMutations("map", ["updateGisEntities", "updateGisLines"])
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  .dialog-body {
    height: 60vh;
    position: relative;
  }
}
.side-bar {
  width: 3.58rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-top: 2px #383838 solid;
  box-shadow: var(--box-shadow);
  background-color: var(--background-color-panel);

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }
  .list {
    margin: 0;
    padding: 0;
    .item {
      position: relative;
      text-align: center;
      color: var(--color-text-regular);

      .icon {
        display: inline-block;
        font-size: 1.29rem;
        width: 100%;
        margin: 16px 0;
      }

      .tip {
        position: absolute;
        color: var(--color-text-regular);
        margin-top: 60%;
        display: inline-block;
        font-size: 10px;
        left: 60%;
      }
      &:hover {
        color: var(--color-text-primary);
      }
    }
  }
}
</style>
