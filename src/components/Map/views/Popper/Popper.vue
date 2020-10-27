<template>
  <div class="popper" :style="position" :class="'placement-' + placement">
    <div class="move" v-if="canMove" @click="handleMoveClick" title="移动位置">
      <i class="el-icon-rank"></i>
    </div>
    <div class="text">{{ text || defaultText }}</div>
    <template v-if="html" v-html="html"></template>
  </div>
</template>

<script>
import { emitter, EventType } from "../../src/EventEmitter";

export default {
  name: "Popper",

  data() {
    return {
      position: {
        top: 0,
        left: 0
      },
      text: "",
      defaultText: "未命名",
      canMove: false,
      placement: "top",
      html: null
    };
  },

  watch: {
    position(newValue) {},
    text(value) {
      console.log("text -> value", value);
    }
  },

  beforeDestroy() {
    console.log("Popper beforeDestroy");
    this.$el.parentNode.removeChild(this.$el);
  },

  methods: {
    handleMoveClick() {
      emitter.emit(EventType.POPPER_MOVE);
    }
  }
};
</script>

<style lang="scss" scoped>
.popper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  padding: 8px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  color: #4c4c4c;

  &.placement-top {
    transform: translate(-50%, calc(-50% - 60px));
  }

  &.placement-right {
    transform: translate(40px, -50%);
  }

  .move {
    font-size: 16px;
    cursor: pointer;
  }

  .text {
    margin-left: 8px;
    white-space: pre-line;
  }
}
</style>
