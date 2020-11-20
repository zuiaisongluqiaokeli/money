<template>
  <div class="CanvasOption">
    <el-form :model="optionForm" label-width="80px">
      <size-option :option-form="optionForm"></size-option>
      <el-form-item label="标题">
        <div v-if="isNotNullOrUndefined(optionForm.title)" class="canvas-form-item">
          <el-switch v-model="optionForm.title.visible" @change="updateConfig"></el-switch>
          <el-input class="input" v-model="optionForm.title.text" :disabled="!optionForm.title.visible"
                    @change="updateConfig"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="副标题">
        <div v-if="isNotNullOrUndefined(optionForm.description)" class="canvas-form-item">
          <el-switch v-model="optionForm.description.visible" @change="updateConfig"></el-switch>
          <el-input class="input" v-model="optionForm.description.text" @change="updateConfig"
                    :disabled="!optionForm.description.visible"></el-input>
        </div>
      </el-form-item>
      <theme-option :option-form="optionForm"></theme-option>
    </el-form>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import SizeOption from './SizeOption'
  import ThemeOption from './ThemeOption'

  export default {
    name      : 'CanvasOption',
    components: { ThemeOption, SizeOption },
    mixins    : [updateMixin],
  }
</script>

<style lang="scss">
  .canvas-form-item {
    display: flex;
    align-items: center;

    .input {
      margin-left: 10px;
    }
  }
</style>
