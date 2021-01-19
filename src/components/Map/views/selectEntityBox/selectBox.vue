<template>
  <div class="selectBox" :style="position" :class="'placement-' + placement" v-if="show">
    <div class="selectionWrapper">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <g transform="translate(80,80)">
          <path
            d="M -34 -34 L -34 -11.25 L -30 -15.25 L -30 -30 L -15.25 -30 L -11.25 -34 L -34 -34 z M 11.25 -34 L 15.25 -30 L 30 -30 L 30 -15.25 L 34 -11.25 L 34 -34 L 11.25 -34 z M -34 11.25 L -34 34 L -11.25 34 L -15.25 30 L -30 30 L -30 15.25 L -34 11.25 z M 34 11.25 L 30 15.25 L 30 30 L 15.25 30 L 11.25 34 L 34 34 L 34 11.25 z"
            transform="scale(1)"
          />
        </g>
      </svg>
    </div>
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
      placement: 'top',
      show: true,
    }
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
.selectBox {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
  color: #4c4c4c;

  &.placement-top {
    transform: translate(-50%, calc(-50% - 20px));
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
  .selectionWrapper {
    position: absolute;
    top: -10px;
    width: 160px;
    height: 160px;
    pointer-events: none;
    visibility: visible;
    opacity: 1;
    transition: visibility 0s 0.2s, opacity 0.2s ease-in;
  }
  .selectionWrapper svg {
    fill: #2e2;
    stroke: #000;
    stroke-width: 1.1px;
  }
}
</style>
