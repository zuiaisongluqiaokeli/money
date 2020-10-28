<template>
  <div class="tags">
    <el-tag v-for="(tag, index) in tags" :key="index" class="label">
      {{ tag }}
    </el-tag>
  </div>
</template>

<script>
export default {
  components: {},

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
      tags: []
    };
  },

  computed: {
    labels() {
      return this.data.labels;
    }
  },

  watch: {
    labels: {
      handler(value) {
        if (value) {
          this.tags = this.getTags();
        } else {
          this.tags = [];
        }
      },
      immediate: true,
      deep: true
    }
  },

  created() {},

  methods: {
    getTags() {
      return this.labels.filter(item => {
        return (
          item !== "DATAEXA" &&
          item !== "VirtualVertex" &&
          item !== "DATAEXA_OBJECT"
        );
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tags {
  .label {
    margin-right: 8px;
    margin-bottom: 8px;
    background-color: rgba(2, 179, 252, 0.2);
  }
}
</style>
