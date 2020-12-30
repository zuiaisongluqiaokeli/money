<template>
  <div v-if="show" class="popper" :style="position" :class="'placement-' + placement">
    <div class="ysc-dynamic-layer ys-css3-box">
      <div class="point"></div>
      <div class="line"></div>
      <div class="main">
        风吹过已静下,风吹过已静下,风吹过已静下,风吹过已静下
        风吹过已静下,风吹过已静下,风吹过已静下,风吹过已静下
        风吹过已静下,风吹过已静下,风吹过已静下,风吹过已静下
        风吹过已静下,风吹过已静下,风吹过已静下,风吹过已静下
        风吹过已静下,风吹过已静下,风吹过已静下,风吹过已静下
      </div>
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
      text: '',
      defaultText: '未命名',
      canMove: false,
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
}

.ysc-dynamic-layer {
  /*重要*/
  user-select: none; /*禁止选中*/
  pointer-events: none; /*鼠标穿透*/
  /*重要*/
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 250px;
  z-index: 99999;
}
.ysc-dynamic-layer .point {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  top: 55px;
  left: -15px;
  background-color: #3679a5cc;
  animation: warn 1.5s ease-out 0s infinite;
}
@keyframes warn {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.ysc-dynamic-layer .line {
  position: absolute;
  position: absolute;
  left: -4px;
  height: 300px;
  bottom: -28px;
  background: url('../../../../assets/img/line.png') no-repeat;
  animation: goLine 1.5s forwards;
}
@keyframes goLine {
  from {
    width: 0;
  }
  to {
    width: 50px;
  }
}
.ysc-dynamic-layer .main {
  position: absolute;
  top: -138px;
  left: 42px;
  right: 0;
  background: url('../../../../assets/img/layer_border.png') no-repeat;
  background-size: 100% 100%;
  color: white;
  padding: 20px 5px 5px 20px;
  font-size: 14px;
  user-select: text;
  pointer-events: auto;
  opacity: 0;
  animation: goDynamicLayer 1.5s forwards;
  animation-delay: 1.5s;
}
@keyframes goDynamicLayer {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.ysc-dynamic-layer .light {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
}
.cesium-viewer-timelineContainer,
.cesium-viewer-bottom {
  display: none !important;
}
.ys-css3-box {
  position: fixed;
}
</style>
