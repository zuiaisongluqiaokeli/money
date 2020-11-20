<template>
  <div class="TimeLineOption">
    <collapse-item title="播放轴" show-switch v-model="switchValue" @update="onSwitchChange">
      <el-form label-width="80px">
        <el-form-item label="筛选字段">
          <el-select v-model="timeLine.cfg.field" @change="updateConfig">
            <el-option v-for="val in optionForm.fields" :value="val" :key="val" :label="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标识字段">
          <el-select v-model="timeLine.cfg.key" @change="updateConfig">
            <el-option v-for="val in optionForm.fields" :value="val" :key="val" :label="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="循环播放">
          <el-switch v-model="timeLine.cfg.loop" @change="repaint"></el-switch>
        </el-form-item>
        <el-form-item label="自动播放">
          <el-switch v-model="timeLine.cfg.auto" @change="repaint"></el-switch>
        </el-form-item>
        <el-form-item label="播放速度">
          <el-input-number v-model="timeLine.cfg.speed" @change="repaint"></el-input-number>
        </el-form-item>
        <el-form-item label="播放轴高度" label-width="100px">
          <el-input-number v-model="timeLine.cfg.height" @change="repaint"></el-input-number>
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
    name      : 'TimeLineOption',
    components: { CollapseItem },
    mixins    : [updateMixin],
    data () {
      return {
        switchValue: false,
        timeLine   : {
          type: 'timeline',
          cfg : {
            field : '',
            key   : '',
            loop  : true,
            auto  : true,
            speed : 1,
            height: 50
          },
        },
      }
    },
    methods   : {
      onSwitchChange () {
        if (this.switchValue) {
          this.optionForm.interactions.push(this.timeLine)
        } else {
          removeItem(this.optionForm.interactions, this.timeLine)
        }
        this.repaint()
      }
    },
    created () {
      this.switchValue = this.optionForm.interactions.length > 0
      const field = this.optionForm.fields
      this.timeLine.cfg.field = field[0]
      this.timeLine.cfg.key = field[1]
    }
  }
</script>

<style scoped lang="scss">
  .TimeLineOption {
  }
</style>
