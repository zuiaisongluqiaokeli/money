<template>
  <el-form-item label="暗黑主题">
    <el-switch v-model="optionForm.theme" @change="onChange"
               active-value="dark" :inactive-value="false"></el-switch>
  </el-form-item>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import { EVENT_UPDATE_THEME, eventBus } from '../js/event'

  export default {
    name   : 'ThemeOption',
    mixins : [updateMixin],
    methods: {
      onChange () {
        this.updateConfig()
        eventBus.$emit(EVENT_UPDATE_THEME)
      },
      // onMount () {
      //   if (this.isPie) {
      //     this.optionForm.theme = false
      //   }
      // }
    },
    // created () {
    //   eventBus.$on(EVENT_CHART_MOUNTED, this.onMount)
    // },
    // beforeDestroy () {
    //   eventBus.$off(EVENT_CHART_MOUNTED, this.onMount)
    // }
  }
</script>
