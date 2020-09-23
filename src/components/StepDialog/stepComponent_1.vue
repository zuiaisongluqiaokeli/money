<template>
    <el-card>
        第一步
        <el-form
            :inline="true"
            :model="firstStepForm"
            class="demo-form-inline"
            ref="firstStepForm"
            :rules="dialogFormRules"
        >
            <el-form-item label="审批人" prop="user">
                <el-input v-model="firstStepForm.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select v-model="firstStepForm.region" placeholder="活动区域">
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
            firstStepForm: {
                user: '',
                region: ''
            },
            dialogFormRules: {
                user: [{ required: true, trigger: 'blur', message: '请输入' }]
            }
        };
    },
    methods: {
        saveTable() {
            return new Promise((resolve, reject) => {
                this.$refs['firstStepForm'].validate((valid) => {
                    if (valid) {
                        // bus.$emit('stepInfo', {form:this.firstStepForm});
                        this.$parent.form = this.firstStepForm
                        resolve();
                    }
                });
            });
        },
    }
};
</script>