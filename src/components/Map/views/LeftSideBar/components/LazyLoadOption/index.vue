<template>
  <div ref="option-box" class="option-box">
    <!-- 对象数组 -->
    <template v-if="isObjAry">
      <el-option
        v-for="(item, index) in filterOptions"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </template>
    <!-- 基础类型数组 -->
    <template v-else>
      <el-option
        v-for="(item, index) in filterOptions"
        :key="index"
        :label="item"
        :value="item"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: "LazyLoadOption",
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否可以搜索
    search: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // // 用来辨别现在是否是改动的状态
    modelValue: {
      type: [String, Array, Number],
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      andTop: true, // 最顶部
      andBootm: false, // 最底部
      isObjAry: true, // 是对象数组
      filterOptions: [], // 过滤的渲染数组
      baseLocation: 0, // 基础累加的位置
      baseNum: 40, // 累加的基数  也可以做成属性让开发者自己调整，不过下面的滚动高度的值就得计算了
      list: [], // 保存着原数组
      searchText: "", // 过滤搜索的字段
      inputDom: "", // 搜索的Dom元素
      showTip: true, // 展示提示
      scrollDom: null // 滚动条的Dom元素
    };
  },
  watch: {
    // 搜索初始化一些依赖的值
    searchText() {
      this.andTop = true;
      this.baseLocation = 0;
    },
    // 清空或者删除时 重新过滤为初始的数据
    modelValue(someValue) {
      if (Array.isArray(someValue) || someValue === "") {
        this.searchText = "";
        this.list = this.options;
        this.filterOptions = this.initList(this.options);
        this.initData();
      }
    }
  },
  mounted() {
    // 搜索是否开启
    this.inputDom = this.$parent.$parent.$parent.$children[0].$el.nextElementSibling;
    if (this.search) {
      this.inputDom.addEventListener("input", this.onInput);
    }

    this.scrollDom = this.$refs["option-box"].parentElement.parentElement;

    this.scrollDom.addEventListener("scroll", this.onScroll);

    // 数据列表是基本类型数组还是对象数组
    this.isObjAry = typeof this.options[0] === "object";

    this.list = this.options;
    this.filterOptions = this.initList(this.options);
  },
  updated() {
    // 每次过滤数据，导致重新渲染，input的值被置空，在重新赋值回来
    this.inputDom.value = this.searchText;
  },
  destroyed() {
    this.inputDom.removeEventListener("input", this.onInput);
    this.scrollDom.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    // 初始化列表
    initList(options) {
      if (options.length < 40) {
        this.andBootm = true;
        return options;
      } else {
        this.andBootm = false;
        return options.filter((e, i) => i < this.baseNum);
      }
    },
    // 初始化依赖的值
    initData() {
      this.andTop = true;
      this.andBootm = false;
      this.baseLocation = 0;
    },
    // 搜索的筛选数据
    onInput() {
      this.searchText = event.target.value;
      this.filterOptions = this.options.filter(item => {
        return typeof item === "object"
          ? item.label.toString().includes(event.target.value)
          : item.toString().includes(event.target.value);
      });
      this.list = this.filterOptions;
      this.filterOptions = this.initList(this.filterOptions);
    },
    // 滚动事件
    onScroll() {
      let Dom = event.srcElement;
      let scrollTop = Dom.scrollTop,
        clientHeight = Dom.clientHeight,
        scrollHeight = Dom.scrollHeight;
      scrollTop === 0 && !this.andTop && this.topLoad();

      scrollTop + clientHeight >= scrollHeight - 5 &&
        !this.andBootm &&
        this.bootomLoad();
    },
    // 加载新数据
    bootomLoad() {
      if (this.baseLocation * 20 + 40 >= this.list.length) {
        this.andBootm = true;
        return;
      }
      this.baseLocation++;
      if (this.baseLocation === 1) this.andTop = false;
      this.filterOptions = this.list.filter((e, i) => {
        return i >= this.baseLocation * 20 && i < this.baseLocation * 20 + 40;
      });
      this.scrollDom.scrollTo(0, 636);
    },
    // 加载旧数据
    topLoad() {
      this.baseLocation--;
      this.andBootm = false;
      if (this.baseLocation === 0) this.andTop = true;
      this.filterOptions = this.list.filter((e, i) => {
        return i >= this.baseLocation * 20 && i < this.baseLocation * 20 + 40;
      });

      this.scrollDom.scrollTo(0, 450);
    }
  }
};
</script>

<style lang="scss" scoped>
.option-box {
  overflow: auto;
  .load-style {
    cursor: pointer;
    color: #666;
    text-align: center;
    font-size: 14px;
    line-height: 30px;
    user-select: none;
  }
}
</style>
