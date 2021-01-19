<template>
  <div>
    <svg>
      <defs>
        <marker
          :id="'arrow'+index"
          markerUnits="strokeWidth"
          markerWidth="12"
          markerHeight="12"
          viewBox="0 0 12 12"
          refX="6"
          refY="6"
          orient="auto"
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="M2,2 L10,6 L2,10 L6,6 L2,2"
            :style="{'fill': bgColor}"
          />
        </marker>
      </defs>
      <!-- <path d="M20,70 T80,100 T160,80 T200,90" fill="white" stroke="red" stroke-width="2" marker-start="url(#arrow)" marker-mid="url(#arrow)"
      marker-end="url(#arrow)" />-->
    </svg>
    <svg class="lineWrap">
      <line
        :id="`line${index}`"
        xmlns="http://www.w3.org/2000/svg"
        x1="0"
        y1="0"
        x2="50"
        y2="50"
        :stroke="bgColor"
        stroke-width="2"
        :marker-end="`url(#arrow${index})`"
        stroke-dasharray="10 10"
      />
    </svg>
    <svg>
      <!-- <path id="path" fill="white" stroke="red" stroke-width="2" marker-end="url(#arrow)" d="M20,20 L50,50"></path> -->
    </svg>
    <div class="itemwrap">
      <!-- <div
        class="item item1"
        :class="'popper1'+index"
        :style="{'border-color':bgColor}"
      >陆军参谋部；3个集团军司令部；4个军司令部（其中1个为空降军司令部）；2个装甲师；3个机械化师；2个轻步师；1个步兵师；1个空中突击师；1个空降师；1个步兵营群；1个空降营群；7个航空旅（其中1个航空旅为集团军直辖，4个航空旅为军直辖，2个航空旅为训练旅）；2个装甲骑兵团；6个炮兵旅；1个战区防空司令部；9个"爱国者"地空导弹营，3个"复仇者"地空导弹营</div>
      </div>-->
      <!-- 面板信息气泡框 -->
      <div
        class="divpoint divpoint-theme item item1"
        :style="{'border-color':bgColor,'top':movePosition.top,'left':movePosition.left}"
        :class="'popper1'+index"
      >
        <div class="divpoint-wrap">
          <div class="area">
            <div class="arrow-lt"></div>
            <div class="b-t" :style="{'background-color':bgColor,'box-shadow':bgColor}"></div>
            <div class="b-r" :style="{'background-color':bgColor,'box-shadow':bgColor}"></div>
            <div class="b-b" :style="{'background-color':bgColor,'box-shadow':bgColor}"></div>
            <div class="b-l" :style="{'background-color':bgColor,'box-shadow':bgColor}"></div>
            <div class="arrow-rb"></div>
            <div class="label-wrap">
              <div class="title">{{info.name}}</div>
              <div class="label-content">
                <div class="data-li">
                  <div class="data-label">国家</div>
                  <div class="data-value">
                    <span class="label-num">{{info.国家}}</span>
                  </div>
                </div>
                <div class="data-li">
                  <div class="data-label">兵员数量</div>
                  <div class="data-value">
                    <span class="label-num">{{info.兵员数量}}</span>
                  </div>
                </div>
                <div class="data-li">
                  <div class="data-label">驻军</div>
                  <div class="data-value">
                    <span class="label-num">{{info.驻军}}</span>
                  </div>
                </div>
                <div class="data-li">
                  <div class="data-label">驻扎部队</div>
                  <div class="data-value">
                    <span class="label-num">{{info.驻扎部队}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="b-t-l" :style="{'background-color':bgColor,'box-shadow':bgColor}"></div>
          <div class="b-b-r" :style="{'background-color':bgColor,'box-shadow':bgColor}"></div>
        </div>
      </div>
    </div>
    <!-- 实体外框 -->
    <div :class="'placement-' + placement">
      <div
        class="item item2"
        :class="'popper2'+index"
        :style="{'border-color':bgColor,'top':position.top,'left':position.left}"
      ></div>
    </div>
  </div>
</template>

<script>
import { emitter, EventType } from '../../src/EventEmitter'
import $ from './jquery.js'
export default {
  name: 'Popper',
  data() {
    return {
      //方块1的位置
      position: {
        top: '0px',
        left: '0px',
      },
      //方块2的位置
      movePosition: {
        top: '0px',
        left: '0px',
      },
      info: {
        name: '',
        兵员数量: '',
        所处国: '',
        驻军: '',
        驻扎部队: '',
      },
      state: true, //初始化状态，单例模式
      index: 0,
      text: '',
      defaultText: '未命名',
      canMove: false,
      show: true,
      placement: 'top',
      html: null,
      pointerEvent: 'auto',
      bgColor: '#FFFFFF',
    }
  },

  watch: {
    position(newValue) {},
    text(value) {},
  },
  methods: {},
  mounted() {
    this.$nextTick(() => {
      if (this.state) {
        debugger
        //初始化2的位置
        let height = window.screen.height
        let width = window.screen.width
        let objPositionLeft = this.position.left
        let objPositionTop = this.position.top
        if (objPositionLeft.split('px')[0] < width / 2) {
          this.movePosition.left =
            Number(objPositionLeft.split('px')[0]) - width / 4 + 'px'
        } else {
          this.movePosition.left =
            Number(objPositionLeft.split('px')[0]) + width / 12 + 'px'
        }
        if (objPositionTop.split('px')[0] < height / 3) {
          this.movePosition.top =
            Number(objPositionTop.split('px')[0]) - height / 12 + 'px'
        } else if (objPositionTop.split('px')[0] > height / 3) {
          this.movePosition.top =
            Number(objPositionTop.split('px')[0]) + height / 10 + 'px'
        }
      }
      this.state = false
      var that = this
      $(function () {
        function move() {
          if (!$(`.popper1${that.index}`)[0]) return
          var pos1 = getElCoordinate($(`.popper1${that.index}`)[0])
          var pos2 = getElCoordinate($(`.popper2${that.index}`)[0])
          var start = getPos(pos1, pos2).start
          var end = getPos(pos1, pos2).end

          $(`#line${that.index}`).attr({
            x1: start.x,
            y1: start.y,
            x2: end.x,
            y2: end.y,
          })
          //$(`#path${that.index}`).attr({ d: 'M20,20 L100,100' })
        }
        move() //开始时候的显示
        drag($(`.popper1${that.index}`), move) //拖拽的时候
        function getPos(pos1, pos2) {
          //分四种情况
          var x1, y1, x2, y2
          if (pos2.top < pos1.top) {
            //结束点位于左上角
            x1 = pos1.left + pos1.width / 2
            y1 = pos1.top
            y2 = pos2.top + pos2.height
            if (pos2.left < pos1.left) {
              x2 = pos2.left + pos2.width / 2
            } else {
              //右上角
              x2 = pos2.left + pos2.width / 2
            }
          } else {
            x1 = pos1.left + pos1.width / 2
            y1 = pos1.top + pos1.height
            x2 = pos2.left + pos2.width / 2
            y2 = pos2.top
          }
          return {
            start: { x: x1, y: y1 },
            end: { x: x2, y: y2 },
          }
        }
        function drag(obj, callback) {
          var dragEles = obj
          dragEles.each(function (index, dragEleDom) {
            var _move = false //移动标记
            var _x, _y //鼠标离控件左上角的相对位置
            var dragEle = $(dragEleDom)
            dragEle
              .click(function () {
                //alert("click");//点击（松开后触发）
              })
              .mousedown(function (e) {
                _move = true
                _x = e.pageX - parseInt(dragEle.css('left'))
                _y = e.pageY - parseInt(dragEle.css('top'))
                // dragEle.fadeTo(20, 0.9);//点击后开始拖动并透明显示
              })
            $(document)
              .mousemove(function (e) {
                if (_move) {
                  var x = e.pageX - _x //移动时根据鼠标位置计算控件左上角的绝对位置
                  var y = e.pageY - _y
                  dragEle.css({ top: y, left: x }) //控件新位置
                  if (callback) {
                    callback()
                  }
                }
              })
              .mouseup(function () {
                _move = false
                dragEle.fadeTo('fast', 1) //松开鼠标后停止移动并恢复成不透明
              })
          })
        }
        //获取元素左上角相对于某一元素的的位置
        function getElCoordinate(dom) {
          var t = dom.getBoundingClientRect().top
          var l = dom.getBoundingClientRect().left
          var w = dom.offsetWidth
          var h = dom.offsetHeight
          dom = dom.offsetParent
          return {
            top: t,
            left: l,
            width: w,
            height: h,
          }
        }
      })
    })
  },
  beforeDestroy() {
    this.$el.parentNode.removeChild(this.$el)
  },
}
</script>

<style lang="scss" scoped>
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

.lineWrap {
  position: absolute;
  left: 0%;
  top: -50px;
  overflow: visible;
}
.item {
  // position: absolute;
  // height: 50px;
  // line-height: 50px;
  // width: 50px;
  // text-align: center;
  // // border-radius: 50%;
  // // background-color: #3679a5cc;
  // animation: warn 1.5s ease-out 0s infinite;
  position: absolute;
  text-align: left;
  color: #ffffff;
}
.item1 {
  cursor: move;
  width: 300px;
  display: inline-block;
}
.item2 {
  transform: translate(-50%, -50%);
  height: 50px;
  width: 50px;
  pointer-events: none;

  border: 1px solid;
  border-radius: 5px;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
/* 2020-4-9 14:01:37 | 版权所有 火星科技 http://marsgis.cn */
.divpoint-wrap {
  position: relative;
}
.divpoint .area {
  position: relative;
  min-width: 180px;
}
.divpoint .b-t {
  position: absolute;
  top: 0;
  left: 44px;
  right: 0;
  height: 1px;
  z-index: 10;
}
.divpoint .b-r {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 44px;
  width: 1px;
  z-index: 10;
}
.divpoint .b-b {
  position: absolute;
  left: 0;
  right: 44px;
  bottom: 0;
  height: 1px;
  z-index: 10;
}
.divpoint .b-l {
  position: absolute;
  top: 44px;
  left: 0;
  bottom: 0;
  width: 1px;
  z-index: 10;
}
.divpoint .b-t-l {
  position: absolute;
  top: -30px;
  left: -30px;
  width: 1px;
  height: 62px;
  transform: rotate(45deg) translate(52px, -22px);
  z-index: 10;
}
.divpoint .b-b-r {
  position: absolute;
  bottom: -30px;
  right: -30px;
  width: 1px;
  height: 62px;
  transform: rotate(45deg) translate(-52px, 22px);
  z-index: 10;
}
.divpoint .label-wrap {
  padding-left: 12px;
  color: #fff;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
}
.divpoint .title {
  margin-top: 20px;
  padding: 0 12px 0 30px;
  height: 36px;
  line-height: 36px;
  position: relative;
}
.divpoint .title::before {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  z-index: 10;
  height: 2px;
}
.divpoint .label-content {
  padding: 15px 0;
}
.divpoint .data-li {
  padding: 4px 45px 4px 0;
  display: flex;
  justify-content: space-between;
}
.data-value,
.divpoint .data-label {
  display: inline-block;
  font-size: 14px;
}
.divpoint .data-value {
  font-size: 13px;
  width: 131px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
}
.divpoint .label-num {
  margin-right: 3px;
  color: #f09e28;
  font-weight: 600;
}
.divpoint .label-tag {
  display: inline-block;
  position: relative;
  margin-right: 6px;
  padding: 0 6px;
  font-weight: 600;
  cursor: pointer;
  background-color: #909399;
  border-radius: 4px;
}
.divpoint .label-tag::after {
  content: attr(alt);
  display: inline-block;
  position: absolute;
  bottom: -22px;
  right: -35px;
  z-index: -1;
  padding: 2px 4px;
  color: #fff;
  font-size: 14px;
  background-color: #333;
  border-radius: 3px;
  opacity: 0;
  transition: all 0.3s ease-in;
}
.divpoint .label-tag:hover::after {
  opacity: 1;
  z-index: 11;
}
.divpoint .data-value-status-0 {
  background-color: #f0285c;
}
.divpoint .data-value-status-1 {
  background-color: #35b15b;
}
.divpoint .data-value-status-2 {
  background-color: #f09e28;
}
.divpoint .arrow {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 45px;
  height: 2px;
  transform: rotate(-45deg) translate(5px, -15px);
}
// .divpoint-theme .b-b,
// .divpoint-theme .b-b-r,
// .divpoint-theme .b-l,
// .divpoint-theme .b-r,
// .divpoint-theme .b-t,
// .divpoint-theme .b-t-l {
//   background-color: #29baf1;
//   box-shadow: 0 0 10px 2px #29baf1;
// }
// .divpoint-theme .area {
//   background-image: linear-gradient(
//       135deg,
//       transparent 30px,
//       #28bbf06c 30px,
//       #28bbf06c 50%,
//       transparent 50%
//     ),
//     linear-gradient(
//       -45deg,
//       transparent 30px,
//       #28bbf06c 30px,
//       #28bbf06c 50.1%,
//       transparent 50%
//     );
// }
.area {
  background-image: linear-gradient(
      135deg,
      transparent 30px,
      #28bbf06c 30px,
      #28bbf06c 50%,
      transparent 50%
    ),
    linear-gradient(
      -45deg,
      transparent 30px,
      #28bbf06c 30px,
      #28bbf06c 50.1%,
      transparent 50%
    );
}
.divpoint-theme .title {
  background-image: linear-gradient(135deg, transparent 25px, #29baf1 25px);
}
.divpoint-theme .arrow,
.divpoint-theme .title::before {
  background-color: #29baf1;
}
</style>
