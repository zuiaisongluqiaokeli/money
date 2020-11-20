<template>
  <div class="SliderOption">
    <collapse-item title="缩略条" show-switch v-model="switchValue" @update="onChange">
      <el-form label-width="80px">
        <el-form-item label="显示范围">
          <el-slider range v-model="range" :max="1" :step="0.05" @change="onRangeChange"></el-slider>
        </el-form-item>
      </el-form>
    </collapse-item>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CollapseItem from '../CollapseItem'
  import { removeItem } from '../js/util'

  export default {
    name      : 'SliderOption',
    components: { CollapseItem },
    mixins    : [updateMixin],
    data () {
      return {
        switchValue: false,
        range      : [0, 1],
        slideOption: {
          type: 'slider',
          cfg : {
            start: 0,
            end  : 1,
          },
        },
      }
    },
    methods   : {
      onChange () {
        if (this.switchValue) {
          this.optionForm.interactions.push(this.slideOption)
        } else {
          removeItem(this.optionForm.interactions, this.slideOption)
        }
        this.repaint()
      },
      onRangeChange () {
        this.slideOption.cfg.start = this.range[0]
        this.slideOption.cfg.end = this.range[1]
        this.repaint()
      }
    }
  }
</script>
