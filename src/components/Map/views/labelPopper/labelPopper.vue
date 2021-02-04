<template>
  <div v-if="show" class="popper" :style="position" :class="'placement-' + placement">
    <div class="text">{{ text }}</div>
  </div>
</template>

<script>
import { emitter, EventType } from '../../src/EventEmitter'

export default {
  name: 'Popper',
  data() {
    return {
      position: {
        top: 0,
        left: 0,
      },
      text: '',
      defaultText: '未命名',
      show: true,
      placement: 'top',
      html: null,
    }
  },

  watch: {
    position(newValue) {},
    text(value) {},
  },

  beforeDestroy() {
    this.$el.parentNode.removeChild(this.$el)
  },

  methods: {
    handleMoveClick() {
      emitter.emit(EventType.POPPER_MOVE)
    },
  },
}
</script>

<style lang="scss" scoped>
.popper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  padding: 8px;
  background-color: #000;
  border-radius: 4px;
  color: #fff;

  &.placement-top {
    transform: translate(50%, calc(130%));
  }

  &.placement-right {
    transform: translate(40px, -50%);
  }

  .move {
    font-size: 16px;
    cursor: pointer;
  }

  .text {
    white-space: pre-line;
  }
}
</style>
