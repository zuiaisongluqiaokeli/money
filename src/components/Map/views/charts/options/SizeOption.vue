<template>
  <el-form-item label="尺寸">
    <div class="canvas-size-inputs">
      <el-input-number class="input-number" v-model="width" :min="500" :controls="false"
                       @change="onWidthChange"></el-input-number>
      <span>x</span>
      <el-input-number class="input-number" v-model="height" :min="200" :controls="false"
                       @change="onHeightChange"></el-input-number>
    </div>
  </el-form-item>
</template>

<script>
  import { updateMixin } from '../js/mixin'
  import { EVENT_UPDATE_SIZE, eventBus } from '../js/event'

  export default {
    name   : 'SizeOption',
    mixins : [updateMixin],
    data () {
      return {
        width    : 0,
        height   : 0,
        canUpdate: false
      }
    },
    methods: {
      updateSize (width, height, update = true) {
        this.width = width
        this.height = height
        this.optionForm.width = this.width
        this.optionForm.height = this.height
        update && this.updateConfig()
      },
      onWidthChange () {
        if (this.width >= 100) {
          this.optionForm.width = this.width
          this.updateConfig()
        }
      },
      onHeightChange () {
        if (this.height >= 100) {
          this.optionForm.height = this.height
          this.updateConfig()
        }
      },
    },
    created () {
      this.width = this.optionForm.width
      this.height = this.optionForm.height
      eventBus.$on(EVENT_UPDATE_SIZE, this.updateSize)
    },
    beforeDestroy () {
      eventBus.$off(EVENT_UPDATE_SIZE, this.updateSize)
    }
  }
</script>

<style scoped lang="scss">
  .canvas-size-inputs {
    display: flex;
    align-items: center;

    .input-number {
      flex-grow: 1;
    }

    .input {
      margin-left: 10px;
    }

    span {
      display: inline-block;
      padding: 0 10px;
      flex-shrink: 0;
      color: var(--color-text-regular);
    }
  }
</style>
