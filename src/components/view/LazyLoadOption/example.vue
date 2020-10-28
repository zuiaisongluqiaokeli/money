<template>
  <div>
    <el-select v-model="value" multiple default-first-option clearable filterable allow-create>
      <LazyLoadOption
        :options="options"
        :search="filtered"
        :model-value="value"
      ></LazyLoadOption>
    </el-select>
  </div>
</template>

<script>
/**
 * LazyLoadOption 组件传值说明
 * 
 * @modelValue 必选  el-select的v-model绑定的值
 * 
 * @options 列表数据 
 * 数据类型：Array<number | string | object> 
 * 说明：对象的话必须是label和value字段
 * 
 * @search  是否可以搜索
 * 数据类型：Boolean 
 * 说明：如果不启用的话，又加了这个filterable字段 就使用elementui自带的搜索。 启用 就搜索所有的数据
 *
 * 
 */
import LazyLoadOption  from "./LazyLoadOption";
export default {
  components: {
    LazyLoadOption
  },
  data() {
    return {
      options: new Array(10000).fill(1).map((e, i) =>{ return {label:i+1,value:i+1}}),
      value: "",
      hasLazyLoad: true,
      filtered:true,
    };
  }
};
</script>

<style lang="scss" scoped>
</style>