<template>
   <el-card>第二步</el-card>
</template>

<script>
import bus from '@/components/common/bus';
export default {
    data(){
        return{

        }
    },
    methods:{
        prevStep(){
            this.$store.dispatch("theme/setStep",1).then(()=>{
                this.$router.push("/stepDialog_1")
            })
        },
        getTable(){
            bus.$emit("data",1)
        },
    }
}
</script>