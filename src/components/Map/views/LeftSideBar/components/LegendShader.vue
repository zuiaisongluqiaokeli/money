<template>
  <div class="tool-tag">
    <div class="body">
      <ul class="list">
        <li class="item" v-for="(item, index) in shaderList" :key="index">
          <el-color-picker
            show-alpha
            v-model="item.color"
            :predefine="predefineColors"
          ></el-color-picker>
          <div class="input">
            <select-tree
              v-model="item.typeName"
              :data="treeData"
              @change="selectedItems($event, item)"
              :propSet="{ children: 'children', label: 'label' }"
              placeholder="请选择分类名称"
            />
          </div>
          <div class="delete" title="清除此项" @click="deleteItem(item)">
            <i class="icon el-icon-close"></i>
          </div>
        </li>
      </ul>
      <div class="add-new">
        <el-button type="text" @click="addNew">+ 新增着色</el-button>
      </div>
      <div class="btn">
        <el-button type="primary" class="submit" @click="dialogSave"
          >确 定</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import colorControl from "../../../src/ColorControl";
import * as sortManage from "@/services/sort-manage";
import { emitter, EventType } from "../../../src/EventEmitter";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import SelectTree from "@/components/SelectTree";
export default {
  name: "LegendShader",
  inject: ["provide"],
  components: {
    SelectTree,
  },
  computed: {
    ...mapState("graphInfo", ["id", "graphType"]),
    ...mapState("map", ["allEntityBackEnd"]),
  },

  data() {
    return {
      shaderList: [], //循环列表
      shaderTemplate: {
        //暂存数据
        typeName: "",
        color: "",
        value: "",
      },
      predefineColors: [], //预定义颜色
      treeData: [],
    };
  },

  created() {
    setTimeout(() => {
      this.getCategory();
      this.addNew();
    }, 4000);
    // ({ gisvis } = this.provide());
    //this.predefineColors = this.getPredefineColors();
    // this.shaderList = this.getShaderList();
  },

  methods: {
    async getCategory() {
      const res = await sortManage.nodeCategoryQuery(this.id);
      let data = res.data;
      let treeData = [];
      for (const item of data) {
        if (item.parentId === 0) {
          treeData.push({
            id: item.id,
            label: item.name,
            children: [],
            ...item,
          });
        }
      }
      this.formatTree(treeData, data);
      this.treeData = [
        {
          id: -1,
          label: "所有",
          children: treeData,
          parentsName: "",
        },
      ];
    },

    // 递归返回的数据，形成树结构
    formatTree(treeData, data) {
      for (const item of treeData) {
        for (const item2 of data) {
          if (item.id === item2.parentId) {
            item.children.push({
              id: item2.id,
              label: item2.name,
              children: [],
              ...item2,
            });
          }
        }
        this.formatTree(item.children, data);
      }
    },
    /**
     * 获取预定义颜色
     */
    getPredefineColors() {
      return colorControl.getColorSet();
    },
    /**
     * 删除一项
     */
    deleteItem(item) {
      const index = this.shaderList.findIndex((shader) => shader === item);

      this.shaderList.splice(index, 1);
    },
    /**
     * 新增颜色着色
     */
    addNew() {
      const color = colorControl.requireColor();
      const temp = { ...this.shaderTemplate };

      temp.color = color;
      this.shaderList.push(temp);
    },
    selectedItems(event, item) {
      item.value = event.label;
    },
    dialogSave() {
      this.shaderList.forEach((item, index) => {
        if (!item.value) {
          this.shaderList.splice(index, 1);
        }
      });
      this.shaderList.filter((item, index, arr) => {
        let arrIds = arr.map((ele) => ele.value);
        return arrIds.indexOf(item.value) == index;
      });
      this.shaderList.forEach((ele) => {
        this.allEntityBackEnd
          .filter((item) => item.properties.实体分类 == ele.value)
          .forEach((item) => {
            if (gisvis.viewer.entities.getById(item.id).ellipse) {
              gisvis.viewer.entities.getById(
                item.id
              ).ellipse.material = Cesium.Color.fromCssColorString(
                ele.color
              ).withAlpha(0.08);
              gisvis.viewer.entities.getById(item.id).ellipse.show = true;
              // gisvis.viewer.entities.getById(item.id).polyline.material.color.setValue(ele.color.withAlpha(1));
            } else {
              let params = {
                entities: [{ id: item.id }],
                radius: 250,
                color: ele.color,
              };
              gisvis.emitter.emit("gis-scope-render", params);
            }
            item.attackRange = true;
          });
      });
      gisvis.emitter.emit(EventType.LEGEND_DATA_CHANGE, []);
    },
    /**
     * 取消
     */
    cancel() {
      this.$emit("before-close");
    },
  },
};
</script>

<style lang="scss" scoped>
.hidden {
  display: none;
}
.tool-tag {
  max-height: 426px;
  margin: -12px 0;
  padding: 12px 0;

  .body {
    width: 300px;
    margin: 0 10px;

    .list {
      margin: 0;
      padding: 0;
      list-style: none;

      .item {
        display: flex;
        align-items: center;

        & + .item {
          margin-top: 8px;
        }

        .input {
          margin-left: 8px;
        }

        .delete {
          margin-left: 8px;
          color: red;
          cursor: pointer;
        }
      }
    }
  }

  .add-new {
    margin-top: 8px;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>
