<template>
   <el-card>第三步</el-card>
</template>

<script>
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
        },
    }
}
</script>