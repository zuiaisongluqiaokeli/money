<template>
  <div class="basic">
    <div class="img-wrapper">
      <div class="source">
        <img
          v-if="source.properties.avatar"
          :src="source.properties.avatar"
          class="img"
          @error="errorImg"
        />
        <img v-else :src="defaultImgSrc" class="img" />
      </div>
      <div class="target">
        <img
          v-if="target.properties.avatar"
          :src="target.properties.avatar"
          class="img"
          @error="errorImg"
        />
        <img v-else :src="defaultImgSrc" class="img" />
      </div>
    </div>
    <div class="direction">
      关系方向：
      {{ source.name }} > {{ target.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  inject: ["provide"],

  data() {
    return {
      errorImg: `this.src='./img/default.png'`,
      defaultImgSrc: require("@/assets/img/empty.svg"),
      source: null,
      target: null
    };
  },

  watch: {
    data: {
      handler() {
        this.getAvatar();
      },
      immediate: true
    }
  },

  methods: {
    getAvatar() {
      if (Object.keys(this.data).length) {
        const { source, target } = this.data;
        const { graph } = this.provide();

        this.source = graph.getEdgeSource(this.data);
        this.target = graph.getEdgeTarget(this.data);
      }
    }
  }
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

    .source,
    .target {
      height: 100%;
      flex: 1;
      text-align: center;
    }

    .target {
      margin-left: 16px;
    }
  }

  .direction {
    margin-top: 24px;
  }
}
</style>
