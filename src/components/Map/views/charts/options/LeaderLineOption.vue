<template>
    <div class="LeaderLineOption">
      <collapse-item title="连接线" show-switch v-model="optionForm.leaderLine.visible">
        <style-option :option-form="optionForm" :styles="optionForm.leaderLine.style"></style-option>
      </collapse-item>
    </div>
</template>

<script>
  import CollapseItem from '../CollapseItem'
  import { updateMixin } from '../js/mixin'
  import StyleOption from './StyleOption'
  export default {
    name: 'LeaderLineOption',
    components: { StyleOption, CollapseItem },
    mixins:[updateMixin]
  }
</script>

<style scoped lang="scss">
    .LeaderLineOption {
    }
</style>
