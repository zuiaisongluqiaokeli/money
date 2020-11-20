<template>
  <div class="ChartHeader">
    <div class="step" :class="{active:step===-1,cursor:step>=-1}" @click="onChange(-1)">
      <span v-if="step<=-1" class="number">1</span>
      <span v-else class="number check">
        <i class="el-icon-check"></i>
      </span>
      <span class="text">选择数据</span>
    </div>
    <div class="arrow">
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="step" :class="{active:step===0,cursor:step>=0}" @click="onChange(0)">
      <span v-if="step<=0" class="number">2</span>
      <span v-else class="number check">
        <i class="el-icon-check"></i>
      </span>
      <span class="text">选择图表</span>
    </div>
    <div class="arrow">
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="step" :class="{active:step===1,cursor:step>=1}" @click="onChange(1)">
      <span v-if="step<=1" class="number">3</span>
      <span v-else class="number check">
        <i class="el-icon-check"></i>
      </span>
      <span class="text">配置图表</span>
    </div>
    <div class="arrow">
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="step" :class="{active:step===2,cursor:step>=2}" @click="onChange(2)">
      <span v-if="step<=2" class="number">4</span>
      <span v-else class="number check">
        <i class="el-icon-check"></i>
      </span>
      <span class="text">导出图表</span>
    </div>
  </div>
</template>

<script>
  export default {
    name   : 'ChartHeader',
    model  : {
      prop : 'step',
      event: 'change'
    },
    props  : {
      step: {
        type    : Number,
        required: true
      }
    },
    methods: {
      onChange (index) {
        if (index >= this.step) return
        this.$emit('change', index)
      }
    }
  }
</script>

<style scoped lang="scss">
  .ChartHeader {
    display: flex;
    align-items: center;
    justify-content: center;

    .arrow {
      font-size: 18px;
    }

    .step {
      display: flex;
      align-items: center;
      padding: 18px 50px;
      text-align: center;
      font-size: 20px;
      opacity: 0.7;
      cursor: default;

      .number {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
        border: 1px solid var(--color-text-regular);
        box-sizing: border-box;
        font-size: 16px;
      }

      .check {
        color: var(--color-primary);
        border-color: var(--color-primary);
      }

      .text {
        color: var(--color-text-regular);
        font-size: 16px;
      }
    }

    .cursor {
      cursor: pointer;
    }

    .active {
      border-bottom: 1px solid var(--color-primary);
      opacity: 1;
      transform: translateY(1px);

      .number {
        background-color: var(--color-primary);
        color: white;
        border-color: transparent;
      }
    }
  }
</style>
