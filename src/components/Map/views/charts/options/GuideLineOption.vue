<template>
  <div class="GuideLineOption">
    <collapse-item title="辅助线" :default-expand="false">
      <el-button style="width:100%;" @click="addNewGuideLine">+ 新增辅助线</el-button>
      <el-collapse accordion>
        <guide-line-item v-for="(val,index) in optionForm.guideLine" :key="val.id" :option-form="optionForm"
                         :guide-line="val" @delete="removeGuideLine"></guide-line-item>
      </el-collapse>
    </collapse-item>
  </div>
</template>

<script>
  import CollapseItem from '../CollapseItem'
  import { updateMixin } from '../js/mixin'
  import OffsetOption from './OffsetOption'
  import StyleOption from './StyleOption'
  import GuideLineItem from './GuideLineItem'

  export default {
    name      : 'GuideLineOption',
    components: { GuideLineItem, StyleOption, OffsetOption, CollapseItem },
    mixins    : [updateMixin],
    methods   : {
      addNewGuideLine () {
        this.optionForm.guideLine.unshift({
          id       : this.optionForm.guideLine.length,
          start    : ['0%', '100%'],
          end      : ['0%', '100%'],
          lineStyle: {
            stroke  : 'red',
            lineDash: [4, 2],
          },
          text     : {
            position: 'start',
            content : '新建辅助线',
            offsetX : 0,
            offsetY : 0,
            style   : {
              fill    : 'red',
              fontSize: 16
            },
          }
        })
        this.updateConfig()
      },
      removeGuideLine (index) {
        this.optionForm.guideLine.splice(index, 1)
        this.updateConfig()
      },
    }
  }
</script>

<style scoped lang="scss">
  .GuideLineOption {
  }
</style>
