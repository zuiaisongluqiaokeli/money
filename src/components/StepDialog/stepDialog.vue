// 1.组件间的通信2.一开始的显示信息3.保存之后的页面跳转

<template>
    <div>
        <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
            <el-step :title="item" v-for="(item,index) in titleStep" :key="index"></el-step>
        </el-steps>
        <div style="margin-bottom:40px;"></div>
        <!-- 动态子组件 -->
        <!-- <component :is="stepComponent" :ref="stepComponent"></component> -->
        <stepComponent_1 ref="stepComponent_1" v-show="active==1" />
        <stepComponent_2 ref="stepComponent_2" v-show="active==2" />
        <stepComponent_3 ref="stepComponent_3" v-show="active==3" />
        <el-row style="text-align:center;margin-top:40px;">
            <el-button type="primary" @click="prevStep()" v-show="active!=1">上一步</el-button>
            <el-button type="primary" @click="nextStep()" v-show="active!=3">下一步</el-button>
        </el-row>
    </div>
</template>
<script>
import stepComponent_1 from './stepComponent_1.vue';
import stepComponent_2 from './stepComponent_2.vue';
import stepComponent_3 from './stepComponent_3.vue';
export default {
    components: {
        stepComponent_1,
        stepComponent_2,
        stepComponent_3
    },
    data() {
        return {
            titleStep: ['步骤1', '步骤2', '步骤3'],
            active: 1,
            stepDialog:"",
            form:{}
        };
    },
    methods: {
        prevStep() {
            this.active -= 1;
        },
        nextStep() {
            this.$nextTick(() => {
                this.$refs[`stepComponent_${this.active}`].saveTable().then(() => {
                    this.active += 1;
                    this.$refs[`stepComponent_${this.active}`].getData(); 
                });
            });
        }
    }
};
</script>