<template>
  <div class="QuadrantOption">
    <collapse-item title="区分象限" default-expand show-switch v-model="quadrant.visible" @update="updateConfig">
      <el-form label-width="80px">
        <el-form-item label="X轴基准">
          <el-input-number v-model="quadrant.xBaseline" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="Y轴基准">
          <el-input-number v-model="quadrant.yBaseline" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-divider content-position="center">第1象限</el-divider>
        <div class="sub-area">
          <el-form-item label="说明文本">
            <el-input v-model="quadrant.label.text[2]" @change="updateConfig"></el-input>
          </el-form-item>
          <el-form-item label="背景色">
            <el-color-picker v-model="quadrant.regionStyle[2].fill" @change="updateConfig"></el-color-picker>
          </el-form-item>
          <el-form-item label="背景透明度" label-width="100px">
            <el-input-number v-model="quadrant.regionStyle[2].opacity" @change="updateConfig"></el-input-number>
          </el-form-item>
        </div>
        <el-divider content-position="center">第2象限</el-divider>
        <div class="sub-area">
          <el-form-item label="说明文本">
            <el-input v-model="quadrant.label.text[0]" @change="updateConfig"></el-input>
          </el-form-item>
          <el-form-item label="背景色">
            <el-color-picker v-model="quadrant.regionStyle[0].fill" @change="updateConfig"></el-color-picker>
          </el-form-item>
          <el-form-item label="背景透明度" label-width="100px">
            <el-input-number v-model="quadrant.regionStyle[0].opacity" @change="updateConfig"></el-input-number>
          </el-form-item>
        </div>
        <el-divider content-position="center">第3象限</el-divider>
        <div class="sub-area">
          <el-form-item label="说明文本">
            <el-input v-model="quadrant.label.text[1]" @change="updateConfig"></el-input>
          </el-form-item>
          <el-form-item label="背景色">
            <el-color-picker v-model="quadrant.regionStyle[1].fill" @change="updateConfig"></el-color-picker>
          </el-form-item>
          <el-form-item label="背景透明度" label-width="100px">
            <el-input-number v-model="quadrant.regionStyle[1].opacity" @change="updateConfig"></el-input-number>
          </el-form-item>
        </div>
        <el-divider content-position="center">第4象限</el-divider>
        <div class="sub-area">
          <el-form-item label="说明文本">
            <el-input v-model="quadrant.label.text[3]" @change="updateConfig"></el-input>
          </el-form-item>
          <el-form-item label="背景色">
            <el-color-picker v-model="quadrant.regionStyle[3].fill" @change="updateConfig"></el-color-picker>
          </el-form-item>
          <el-form-item label="背景透明度" label-width="100px">
            <el-input-number v-model="quadrant.regionStyle[3].opacity" @change="updateConfig"></el-input-number>
          </el-form-item>
        </div>
        <style-option collapse-title="说明文本样式" :option-form="optionForm" :styles="quadrant.label.style"
                      :down-divider="false"></style-option>
        <style-option collapse-title="象限线样式" :option-form="optionForm"
                      :styles="quadrant.lineStyle"></style-option>
      </el-form>
    </collapse-item>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CollapseItem from '../CollapseItem'
  import StyleOption from './StyleOption'

  export default {
    name      : 'QuadrantOption',
    components: { StyleOption, CollapseItem },
    mixins    : [updateMixin],
    computed  : {
      quadrant () {
        return this.optionForm.quadrant
      },
    }
  }
</script>

<style scoped lang="scss">
  .QuadrantOption {
    .sub-area {
      padding: 0 20px;
    }
  }
</style>
