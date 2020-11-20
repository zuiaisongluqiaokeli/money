<template>
  <el-form :label-width="labelWidth" class="OffsetOption">
    <el-form-item v-if="isNotNullOrUndefined(object.offsetX)" :label="xLabel">
      <el-input-number v-model="object.offsetX" @change="updateConfig"></el-input-number>
    </el-form-item>
    <el-form-item v-if="isNotNullOrUndefined(object.offsetY)" :label="yLabel">
      <el-input-number v-model="object.offsetY" @change="updateConfig"></el-input-number>
    </el-form-item>
    <el-form-item v-if="isNotNullOrUndefined(object.offset)" :label="offsetLabel">
      <el-input-number v-model="object.offset" @change="updateConfig"></el-input-number>
    </el-form-item>
  </el-form>
</template>

<script>
  import { updateMixin } from '../js/mixin'

  export default {
    name  : 'OffsetOption',
    mixins: [updateMixin],
    props : {
      object: {
        type    : Object,
        required: true
      },
      yLabel: {
        type   : String,
        default: 'Y偏移'
      },
      xLabel: {
        type   : String,
        default: 'X偏移'
      },
      offsetLabel:{
        type   : String,
        default: '偏移'
      },
      labelWidth:{
        type:String,
        default:'80px'
      }
    }
  }
</script>
