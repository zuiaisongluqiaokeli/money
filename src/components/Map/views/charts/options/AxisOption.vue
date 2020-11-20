<template>
  <collapse-item :title="title" show-switch v-model="axis.visible" @update="updateConfig" :default-expand="false">
    <el-form label-width="80px">
      <el-form-item v-if="isNotNullOrUndefined(axis.line)" label="轴线">
        <el-switch v-model="axis.line.visible" @change="updateConfig"></el-switch>
      </el-form-item>
      <el-form-item v-if="isNotNullOrUndefined(axis.tickLine)" label="刻度">
        <el-switch v-model="axis.tickLine.visible" @change="updateConfig"></el-switch>
      </el-form-item>
      <el-form-item label="网格线">
        <el-switch v-model="axis.grid.visible" @change="updateConfig"></el-switch>
      </el-form-item>
      <div v-if="isNotNullOrUndefined(axis.title)">
        <el-form-item label="标题">
          <el-switch v-model="axis.title.visible" @change="updateConfig"></el-switch>
        </el-form-item>
        <div v-show="axis.title.visible">
          <el-form-item label="标题文本">
            <el-input v-model="axis.title.text" @change="updateConfig"></el-input>
          </el-form-item>
          <offset-option :option-form="optionForm" :object="axis.title"></offset-option>
        </div>
      </div>
      <div v-if="isNotNullOrUndefined(axis.label)">
        <el-form-item label="标签">
          <el-switch v-model="axis.label.visible" @change="updateConfig"></el-switch>
        </el-form-item>
        <el-collapse-transition>
          <div v-show="axis.label.visible">
            <el-form-item label="标签后缀">
              <el-input v-model="axis.label.suffix" @change="updateConfig"></el-input>
            </el-form-item>
            <el-form-item v-if="isNotNullOrUndefined(axis.label.autoRotate)" label="自动旋转轴标签" label-width="120px">
              <el-switch v-model="axis.label.autoRotate" @change="updateConfig"></el-switch>
            </el-form-item>
            <el-form-item v-if="isNotNullOrUndefined(axis.label.autoHide)" label="自动隐藏轴标签" label-width="120px">
              <el-switch v-model="axis.label.autoHide" @change="updateConfig"></el-switch>
            </el-form-item>
          </div>
        </el-collapse-transition>
      </div>
    </el-form>
  </collapse-item>
</template>

<script>
  import CollapseItem from '../CollapseItem'
  import { updateMixin } from '../js/mixin'
  import StyleOption from './StyleOption'
  import OffsetOption from './OffsetOption'

  export default {
    name      : 'AxisOption',
    components: { OffsetOption, StyleOption, CollapseItem },
    mixins    : [updateMixin],
    props     : {
      title: {
        type    : String,
        required: true
      },
      axis : {
        type    : Object,
        required: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .AxisOption {
  }
</style>
