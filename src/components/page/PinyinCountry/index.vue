<template>
  <div class="pinyin-index">
    <!-- 内容区域 -->
    <ul class="list">
      <template v-for="character in characters">
        <li
          v-show="character.visible && character.children.length"
          :key="character.label"
          :ref="character.label"
          class="section"
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
      </template>
    </ul>
    <!-- 字母列表 -->
    <div class="characters">
      <ul class="character-list">
        <li
          v-for="{ label } in characters"
          :key="label"
          class="character"
          @click="handleCharacterClick(label)"
        >
          <b v-if="label === otherLabel">{{ label }}</b>
          <template v-else>{{ label }}</template>
        </li>
      </ul>
    </div>
    <!-- 快速点击盘 -->
    <transition name="el-zoom-in-center">
      <ul v-if="quickPanelVisible" class="quick-panel">
        <li
          v-for="{ label } in characters"
          :key="label"
          class="character"
          @click="handleQuickPanelClick(label)"
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
      quickPanelVisible: false
    };
  },

  watch: {
    data: {
      handler() {
        // OPTIMIZE 数据变化要重置下characters里的children数据，不然会出现数据重复。现在先整个拼音表重新渲染，其实可以只重置数据
        // if (!this.characters.length) {
        this.initCharacters();
        // }

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
      this.characters = [];
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
        const { length } = this.characters;

        this.characters[length - 1].children.push(data);
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
      this.scrollIntoView(label);
    },
    /**
     * 点击区间标题
     */
    handleLabelClick() {
      this.openQuickPanel();
    },
    /**
     * 快速点击
     */
    handleQuickPanelClick(label) {
      this.scrollIntoView(label);
      this.closeQuickPanel();
    },
    /**
     * 跳转到视窗内
     */
    scrollIntoView(label) {
      this.$refs[label][0].scrollIntoView({ behavior: "smooth" });
    },
    /**
     * 打开快速跳转盘
     */
    openQuickPanel() {
      this.quickPanelVisible = true;
    },
    /**
     * 关闭快速跳转盘
     */
    closeQuickPanel() {
      this.quickPanelVisible = false;
    },
    /**
     * 过滤
     */
    filter(val) {
      if (!this.filterMethod)
        throw new Error("[PinyinIndex] filterMethod is required when filter");
      this.characters.forEach((character, index) => {
        if (!character.children.length) return;
        character.visible = this.filterMethod(val, character, index);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.pinyin-index {
  height: calc(100vh - 100px);
  min-height: 300px;
  display: flex;

  .list {
    flex: 1;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: auto;

    .section {
      .label {
        padding: 8px;
        padding-left: 12px;
        color: #636363;
        font-weight: bold;
        background-color: #f5f5f5;
        transition: background-color 0.3s;
        cursor: pointer;
        user-select: none;

        &:hover {
          background-color: #e6e6e6;
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

  .characters {
    display: inline-block;
    height: 100%;
    user-select: none;

    .character-list {
      height: 100%;
      color: #000;
      margin: 0;
      padding: 0;
      overflow: auto;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;

      .character {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        cursor: pointer;

        &:hover {
          background-color: #f0f2f5;
          color: #1a8bfd;
        }
      }
    }
  }

  .quick-panel {
    margin: 0;
    padding: 0;
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
