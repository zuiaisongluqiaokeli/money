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
            <el-select v-model="item.country" placeholder="">
              <el-option
                :value="country"
                v-for="country in countries"
                :key="country"
              >
              </el-option>
            </el-select>
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
        <el-button type="primary" class="submit" @click="submit"
          >确 定</el-button
        >
        <el-button type="plain" class="cancel" @click="cancel">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import colorControl from "../../../src/ColorControl";

let main = null;

export default {
  name: "LegendShader",

  inject: ["provide"],

  components: {},

  data() {
    return {
      shaderList: [], //循环列表
      countries: [],
      shaderTemplate: {
        //暂存数据
        country: "",
        color: "",
      },
      predefineColors: [], //预定义颜色
    };
  },

  computed: {},

  watch: {},

  created() {
    ({ main } = this.provide());
    // this.predefineColors = this.getPredefineColors();
    // this.shaderList = this.getShaderList();
    // this.countries = this.getCountries();
  },

  mounted() {},

  methods: {
    /**
     * 获取已有的着色列表（结果就是数组对象包含国家和颜色）
     */
    getShaderList() {
      const shaderMap = colorControl.getShaderMap();

      return Object.entries(shaderMap).map(([country, color]) => {
        return {
          country,
          color,
        };
      });
    },
    /**
     * 获取已有的国家列表
     */
    getCountries() {
      const legendData = main.getLegendData();

      if (legendData) {
        const { entitiesCountryCollection } = legendData;

        return Object.keys(entitiesCountryCollection).map((key) => key);
      }

      return [];
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
    /**
     * 确定
     */
    submit() {
      const color = this.shaderList.reduce((previous, current) => {
        const { country, color } = current;

        if (country && color) {
          previous[country] = color;
        }

        return previous;
      }, {});

      this.$emit("before-close");
      colorControl.addShader(color);
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
