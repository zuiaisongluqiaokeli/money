<template>
    <el-button @click="getParentData">拿取数据</el-button>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            dialogForm: {}
        };
    },
    methods: {
        detail(id) {
           // this.dialogForm = res.data;
        },
        getParentData(){
            console.log(this.$route.query.id)
        },
        dialgSave() {
            let form = {
                id: this.id,
                ...this.dialogForm
            };
        }
    },
    created() {
        if (this.$route.query.type == 'edit') {
            this.id = this.$route.query.id;
            this.detail(this.id);
        }
    }
};
</script>