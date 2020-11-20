<template>
  <div class="PaddingOption">
    <collapse-item title="内边距" :default-expand="false">
      <el-form label-width="80px">
        <el-form-item label="上">
          <el-input-number v-model="optionForm.padding[0]" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="下">
          <el-input-number v-model="optionForm.padding[2]" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="左">
          <el-input-number v-model="optionForm.padding[3]" @change="updateConfig"></el-input-number>
        </el-form-item>
        <el-form-item label="右">
          <el-input-number v-model="optionForm.padding[1]" @change="updateConfig"></el-input-number>
        </el-form-item>
      </el-form>
    </collapse-item>
  </div>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import CollapseItem from '../CollapseItem'

  export default {
    name      : 'PaddingOption',
    components: { CollapseItem },
    mixins    : [updateMixin]
  }
</script>
