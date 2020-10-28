<template>
  <div class="basic">
    <div class="img-wrapper">
      <img
        v-if="properties.avatar"
        :src="properties.avatar"
        class="img"
        @error="errorImg"
      />
      <img v-else :src="defaultImgSrc" class="img" />
    </div>
    <p class="name">{{ properties.name }}</p>
    <div
      v-if="properties.summary || properties['事件内容'] || properties['概要']"
      class="description"
    >
      <div v-if="properties['名称']">
        <span>名称：</span>
        <span>{{ properties["名称"] }}</span>
      </div>
      <p>简介</p>
      <p class="content" :title="properties.summary">
        {{
          properties.summary ||
            properties["事件内容"] ||
            properties["概要"] | filterLength
        }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    filterLength(string) {
      let content;

      if (string) {
        content = string.length < 200 ? string : string.substr(0, 200) + " ···";
      }

      return content;
    }
  },

  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      errorImg: `this.src='./img/default.png'`,
      defaultImgSrc: require("@/assets/img/empty.svg"),
    };
  },

  computed: {
    properties() {
      return this.data.properties;
    }
  },

  watch: {},

  methods: {}
};
</script>

<style lang="scss" scoped>
.basic {
  .img-wrapper {
    height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;
    .img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .name {
    font-size: 13px;
  }

  .description {
  }

  .content {
  }
}
</style>
