<template>
    <div class="datalist-div">
        <el-tabs v-model="active" @tab-click="handleClick" class="tabmanage-tabs">
            <el-tab-pane label="租户信息" name="1">
                <tn-info ref="tabDialog_1" :father="father"></tn-info>
            </el-tab-pane>
            <el-tab-pane label="租户数据源" name="2">
                <tn-data-source ref="tabDialog_2"></tn-data-source>
            </el-tab-pane>
            <el-tab-pane label="租户安全" name="3">
                <tn-secure ref="tabDialog_3"></tn-secure>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import tnDataSource from './tnDataSource';
import tnSecure from './tnSecure';
import tnInfo from './tnInfo';
export default {
    data() {
        return {
            active: '1',
        };
    },
    methods: {
        father(){
            console.log("子掉父的方法")
        },
        handleClick() {
            this.$refs[`tabDialog_${this.active}`].getTable();
        }
    },
    mounted() {
        this.handleClick()
    },
    components: {
        tnDataSource,
        tnSecure,
        tnInfo
    }
};
</script>
