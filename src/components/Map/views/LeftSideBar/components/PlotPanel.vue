<template>
  <div class="plot-panel">
    <div class="left">
      <div class="item" @click="drawShapes('spaceDisMeasure')">
        <span class="iconfont qbxx2-icon-Distancemeasurement"></span>
        <div>测距离</div>
      </div>
      <div class="item" @click="drawShapes('areaMeasure')">
        <span class="iconfont qbxx2-icon-Measuringpolygonarea"></span>
        <div>测多边形面积</div>
      </div>
      <div class="item" @click="drawShapes('circleMeasure')">
        <span class="iconfont qbxx2-icon-Measuringcirculararea"></span>
        <div>测圆形面积</div>
      </div>
    </div>
    <div class="right">
      <div class="item" @click="drawShapes('polyline')">
        <span class="iconfont qbxx2-icon-straightline"></span>
        <div>折线</div>
      </div>
      <div class="item" @click="drawShapes('rectangle')">
        <span class="iconfont qbxx2-icon-rectangle"></span>
        <div>矩形</div>
      </div>
      <div class="item" @click="drawShapes('circle')">
        <span class="iconfont qbxx2-icon-circular"></span>
        <div>圆形</div>
      </div>
      <div class="item" @click="drawShapes('label')">
        <span class="iconfont qbxx2-icon-Text"></span>
        <div>文本</div>
      </div>
      <div class="item" @click="drawShapes('straightArrow')">
        <span class="iconfont qbxx2-icon-arrow"></span>
        <div>直线箭头</div>
      </div>
      <div class="item" @click="drawShapes('attackArrow')">
        <span class="iconfont qbxx2-icon-arrow"></span>
        <div>攻击箭头</div>
      </div>
      <div class="item" @click="drawShapes('editShape')">
        <span class="iconfont qbxx2-icon-zu3064"></span>
        <div>编辑</div>
      </div>
      <div class="item" @click="drawShapes('deleteShape')">
        <span class="iconfont qbxx2-icon-close1"></span>
        <div>删除</div>
      </div>
    </div>
  </div>
</template>
<script>
import { emitter, EventType } from '../../../src/EventEmitter'

export default {
  data() {
    return {
      shapeData: {},
    }
  },
  methods: {
    drawShapes(type) {
      switch (type) {
        case 'polyline':
          gisvis.plot.drawPolyline()
          break
        case 'spaceDisMeasure':
          gisvis.plot.spaceDisMeasure()
          break
        case 'areaMeasure':
          gisvis.plot.areaMeasure()
          break
        case 'circleMeasure':
          gisvis.plot.circleMeasure()
          break
        case 'rectangle':
          gisvis.plot.drawRectangle()
          break
        case 'straightArrow':
          gisvis.plot.straightArrow()
          break
        case 'attackArrow':
          gisvis.plot.attackArrow()
          break
        case 'circle':
          gisvis.plot.drawCircle()
          break
        case 'label':
          gisvis.plot.drawLabel()
          break
        case 'editShape':
          gisvis.plot.editShape()
          break
        case 'deleteShape':
          gisvis.plot.deleteShape()
          break
      }
    },
    // drawPolyline() {
    //   gisvis.plot.drawPolyline();
    // },
    // spaceDisMeasure() {
    //   gisvis.plot.spaceDisMeasure();
    // },
    // areaMeasure() {
    //   gisvis.plot.areaMeasure();
    // },
    // circleMeasure() {
    //   gisvis.plot.circleMeasure();
    // },
    // drawRectangle() {
    //   gisvis.plot.drawRectangle();
    // },
    // drawCircle() {
    //   gisvis.plot.drawCircle();
    // },
    // straightArrow() {
    //   gisvis.plot.straightArrow();
    // },
    // attackArrow() {
    //   gisvis.plot.attackArrow();
    // },
    // editShape() {
    //   gisvis.plot.editShape();
    // },
    // deleteShape() {
    //   gisvis.plot.deleteShape();
    // },
  },
}
</script>
<style>
@import url('../../../src/Plot/css/index.css');
</style>
<style lang="scss" scoped>
.plot-panel {
  position: absolute;
  left: 30%;
    top: 2%;
  padding: 5px 10px 10px;
  justify-items: center;
  display: flex;
  border-radius: 5px;
  background-color: var(--background-color-panel);
  color: var(--color-text-regular);
  text-align: center;
  & > .left {
    display: flex;
    border-right: 1px solid var(--color-text-primary);
    .item {
      margin: 0 10px;
      cursor: pointer;
      &:hover {
        color: var(--color-text-primary);
      }
      & > div {
        margin-top: 5px;
      }
    }
  }
  & > .right {
    display: flex;
    .item {
      margin: 0 10px;
      cursor: pointer;
      &:hover {
        color: var(--color-text-primary);
      }
      & > div {
        margin-top: 5px;
      }
    }
  }
}
</style>
