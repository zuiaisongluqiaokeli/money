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
            style="fill: #FFFFFF;"
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
        stroke="#FFFFFF"
        stroke-width="2"
        :marker-end="`url(#arrow${index})`"
        stroke-dasharray="10 10"
      />
    </svg>
    <svg>
      <!-- <path id="path" fill="white" stroke="red" stroke-width="2" marker-end="url(#arrow)" d="M20,20 L50,50"></path> -->
    </svg>
    <div class="itemwrap">
      <div
        class="item item1"
        :class="'popper1'+index"
      >陆军参谋部；3个集团军司令部；4个军司令部（其中1个为空降军司令部）；2个装甲师；3个机械化师；2个轻步师；1个步兵师；1个空中突击师；1个空降师；1个步兵营群；1个空降营群；7个航空旅（其中1个航空旅为集团军直辖，4个航空旅为军直辖，2个航空旅为训练旅）；2个装甲骑兵团；6个炮兵旅；1个战区防空司令部；9个"爱国者"地空导弹营，3个"复仇者"地空导弹营</div>
    </div>
    <div :class="'placement-' + placement">
      <div class="item item2" :style="position" :class="'popper2'+index"></div>
    </div>
  </div>
</template>

<script>
import { emitter, EventType } from '../../src/EventEmitter'
import $ from './jquery.js'
export default {
  directives: {
    drag(el) {
      el.onmousedown = function (e) {
        var disx = e.pageX - el.offsetLeft
        var disy = e.pageY - el.offsetTop
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
        }
        document.onmouseup = function (e) {
          document.onmouseup = document.onmousemove = null
          //移动结束的时候绘制线
        }
        e.preventDefault()
      }
    },
  },
  name: 'Popper',
  data() {
    return {
      position: {
        top: 0,
        left: 0,
      },
      index: 0,
      text: '',
      defaultText: '未命名',
      canMove: false,
      show: true,
      placement: 'top',
      html: null,
      pointerEvent: 'auto',
    }
  },

  watch: {
    position(newValue) {},
    text(value) {},
  },
  methods: {},
  mounted() {
    this.$nextTick(() => {
      var that = this
      $(function () {
        function move() {
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
  top: -7%;
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
  left: 50%;
  top: 50%;
  text-align: left;
  color: #ffffff;
  border: 1px solid #ffffff;
}
.item2 {
  transform: translate(-50%, -50%);
  height: 50px;
  width: 50px;
  pointer-events: none;
}
.item1 {
  cursor: move;
  width: 300px;
  display: inline-block;
  text-indent: 2em;
}
</style>
