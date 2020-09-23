<template>
    <el-card>第一步</el-card>
</template>

<script>
import bus from '@/components/common/bus';
export default {
    data() {
        return {};
    },
    created() {
        this.father()
    },
    props:{
        father:{
            type:Function,
            default:null
        }
    },
    methods: {
        prevStep() {
            this.$store.dispatch('theme/setStep', 1).then(() => {
                this.$router.push('/stepDialog_1');
            });
        },
        getTable() {
            bus.$on('data', val => {
                console.log(val);
            });
        }
    }
};
</script>