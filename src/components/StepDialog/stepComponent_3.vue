<template>
    <el-card>第三步</el-card>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        saveTable() {
            return new Promise((resolve, reject) => {
                //执行保存
                resolve();
            });
        },
        getData() {
            if(this.$parent.stepDialog == 'edit'){
                
            }
        },
    }
};
</script>