<template>
    <el-card>
        第二步
        <el-form
            :inline="true"
            :model="secondStepForm"
            class="demo-form-inline"
            ref="secondStepForm"
        >
            <el-form-item label="审批人" prop="user">
                <el-input v-model="secondStepForm.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select v-model="secondStepForm.region" placeholder="活动区域">
                    <el-option label="区域一" value="上海"></el-option>
                    <el-option label="区域二" value="北京"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item></el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import bus from './bus';
export default {
    data() {
        return {
            secondStepForm: {
                user: '',
                region: ''
            }
        };
    },
    created() {},
    methods: {
        saveTable() {
            return new Promise((resolve, reject) => {
                //执行保存
                resolve();
            });
        },
        getData() {
            // bus.$on('stepInfo', (val) => {
            //     this.secondStepForm = { ...val.form };
            // });
            this.secondStepForm = this.$parent.form
            //调接口
            if(this.$parent.stepDialog == 'edit'){
                
            }
        },
    }
};
</script>