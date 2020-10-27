<template>
  <div class="pinyin-index">
    <!-- 字母列表 -->
    <ul class="characters">
      <li
        class="character"
        v-for="{ label } in characters"
        :key="label"
        :class="{ 'is-active': activeLabel === label }"
        @click="handleCharacterClick(label)"
        :ref="defaultProps.label + label"
      >
        <b v-if="label === otherLabel">{{ label }}</b>
        <template v-else>{{ label }}</template>
      </li>
    </ul>
    <!-- 内容区域 -->
    <ul class="list">
      <li
        class="section"
        v-for="character in characters"
        :key="character.label"
        :ref="character.label"
        v-show="character.visible && character.children.length"
      >
        <div class="label" @click="handleLabelClick(character.label)">
          {{ character.label }}
        </div>
        <div class="content">
          <slot v-bind="character">
            <p class="no-content">暂无数据</p>
          </slot>
        </div>
      </li>
    </ul>
    <!-- 快速点击盘 -->
    <transition name="el-zoom-in-center">
      <ul
        class="quick-pane"
        v-if="quickPaneVisible"
        @click="handleQuickPaneBackgroundClick"
      >
        <li
          class="character"
          v-for="{ label } in characters"
          :key="label"
          @click="handleQuickPaneClick(label)"
        >
          <b v-if="label === otherLabel">{{ label }}</b>
          <template v-else>{{ label }}</template>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import "./src/pinyin_dict_notone";
import "./src/pinyinUtil";

export default {
  name: "PinyinIndex",

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          label: "label"
        };
      }
    },
    filterMethod: {
      type: Function,
      default: null
    }
  },

  data() {
    return {
      characters: [],
      otherLabel: "*",
      quickPaneVisible: false,
      activeLabel: ""
    };
  },

  watch: {
    data: {
      handler() {
        if (!this.characters.length) {
          this.initCharacters();
        } else {
          this.resetCharacterChildren();
        }

        this.indexSort();
        this.sectionSort();
      },
      immediate: true
    }
  },

  mounted() {},

  methods: {
    /**
     * 初始化字母表
     */
    initCharacters() {
      for (let index = 0; index < 26; index++) {
        this.characters.push({
          label: String.fromCharCode(65 + index),
          visible: true,
          children: []
        });
      }
      // 其它类
      this.characters.push({
        label: this.otherLabel,
        visible: true,
        children: []
      });

      this.activeLabel = this.characters[0].label;
    },
    /**
     * 根据key从props的data里面取值
     * @param {string} key
     * @returns {string}
     */
    getPropertyKeyByKey(key) {
      const prop = this.defaultProps[key];

      if (prop) {
        return prop;
      }

      return key;
    },
    /**
     * 得到首字母
     */
    getFirstLetter(pinyin) {
      const firstLetter = pinyin.slice(0, 1).toUpperCase();

      return firstLetter;
    },
    /**
     * 索引排序
     */
    indexSort() {
      this.data.forEach(item => {
        const label = this.getPropertyKeyByKey("label");
        const character = item[label];
        const pinyin = pinyinUtil.getPinyin(character, " ", false);
        const firstLetter = pinyin.slice(0, 1).toUpperCase();

        this.pushIntoSection(firstLetter, { ...item, pinyin });
      });
    },
    /**
     * 推入区间分类内
     */
    pushIntoSection(section, data) {
      const target = this.characters.find(
        character => character.label === section
      );

      if (target) {
        target.children.push(data);
      } else {
        const { children } = this.characters.find(
          character => character.label === this.otherLabel
        );

        children.push(data);
      }
    },
    /**
     * 区间内排序
     */
    sectionSort() {
      this.characters.forEach(character => {
        const { children } = character;

        children.sort((a, b) => {
          if (a.pinyin < b.pinyin) {
            return -1;
          }
          if (a.pinyin > b.pinyin) {
            return 1;
          }

          return 0;
        });
      });
    },
    /**
     * 字母列表点击
     */
    handleCharacterClick(label) {
      this.activeLabel = label;
      this.scrollIntoView(label);
    },
    /**
     * 点击区间标题
     */
    handleLabelClick() {
      this.openQuickPane();
    },
    /**
     * 快速点击
     */
    handleQuickPaneClick(label) {
      this.activeLabel = label;
      this.scrollToActiveLabel();
      this.scrollIntoView(label);
      this.closeQuickPane();
    },
    /**
     * 跳转到视窗内
     */
    scrollIntoView(label) {
      const [ref] = this.$refs[label];

      ref.scrollIntoView();
    },
    /**
     * 当前的激活字母滚动到视窗内
     */
    scrollToActiveLabel() {
      const label = this.defaultProps.label + this.activeLabel;
      const [ref] = this.$refs[label];

      ref.scrollIntoView();
    },
    /**
     * 打开快速跳转盘
     */
    openQuickPane() {
      this.quickPaneVisible = true;
    },
    /**
     * 关闭快速跳转盘
     */
    closeQuickPane() {
      this.quickPaneVisible = false;
    },
    /**
     * 清空已有的字母列表里的数据
     */
    resetCharacterChildren() {
      this.characters.forEach(character => {
        character.children = [];
      });
    },
    /**
     * 过滤
     */
    filter(value) {
      if (!this.filterMethod) {
        throw new Error("[PinyinIndex] filterMethod is required when filter");
      }

      this.characters.forEach((character, index) => {
        if (!character.children.length) {
          return;
        }

        character.visible = this.filterMethod(value, character, index);
      });
    },
    /**
     * 点击快速盘背景
     */
    handleQuickPaneBackgroundClick() {
      this.closeQuickPane();
    }
  }
};
</script>

<style lang="scss" scoped>
.pinyin-index {
  height: 100%;
  position: relative;
  display: flex;
  background-color: #2b2b2b;

  .characters {
    height: 100%;
    display: inline-block;
    color: #fafafa;
    overflow: auto;
    user-select: none;
    margin: 0;
    padding: 0;
    list-style: none;

    .character {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.2);
      cursor: pointer;

      &:hover,
      &.is-active {
        background-color: rgba(66, 66, 66, 0.5);
      }
    }
  }

  .list {
    flex: 1;
    color: #fafafa;
    overflow: auto;
    scroll-behavior: smooth;
    margin: 0;
    padding: 0;
    list-style: none;

    .section {
      .label {
        padding: 8px;
        padding-left: 12px;
        background-color: rgba(255, 255, 255, 0.4);
        transition: background-color 0.3s;
        cursor: pointer;
        user-select: none;

        &:hover {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }

      .content {
        .no-content {
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
      }
    }
  }

  .quick-pane {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    grid-template-columns: repeat(4, 40px);
    grid-auto-rows: 40px;
    justify-content: center;
    align-content: center;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(1px);
    user-select: none;
    margin: 0;
    padding: 0;
    list-style: none;

    .character {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fafafa;
      background-color: rgba(0, 0, 0, 0.5);
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }
  }
}
</style>
