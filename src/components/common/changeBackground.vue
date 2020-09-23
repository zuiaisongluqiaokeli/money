<template>
    <div>
        <el-button
            @click="changeMask"
            :class="[changeBackground?'originPosition':'movedPosition']"
            :type="changeBackground?'primary':'danger'"
            :icon="changeBackground?'el-icon-check':'el-icon-close'"
            style="z-index: 1000;font-size:25px"
        ></el-button>
        <el-row v-if="!changeBackground" class="colorPicker">
            <el-row>系统布局配置</el-row>
            <el-row style="display:flex;align-items:center;padding:20px;">
                <el-col :span="15">主题色</el-col>
                <el-col :span="9">
                    <el-color-picker
                        @change="chooseBackground"
                        style="z-index: 99999!important;"
                        size="medium"
                        v-model="color"
                        show-alpha
                        :predefine="predefineColors"
                    ></el-color-picker>
                </el-col>
            </el-row>
        </el-row>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            changeBackground: true,
            color: 'rgba(255, 69, 0, 0.68)',
            //颜色选择器
            predefineColors: [
                '#ff4700',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577'
            ]
        };
    },
    methods: {
        changeMask() {
            this.changeBackground = !this.changeBackground;
            bus.$emit('showMask', this.changeBackground);
        },
        chooseBackground(val) {
            this.$store.dispatch("theme/setBackground",val)
            bus.$emit('changeBackground', val);
            this.changeMask()
        }
    }
};
</script>
<style lang="css" scoped>
.originPosition {
    position: absolute;
    top: 45%;
    right: 0;
    height: 50px;
    width: 50px;
}
.movedPosition {
    position: absolute;
    top: 45%;
    right: 300px;
    height: 50px;
    width: 50px;
}
.colorPicker {
    width: 300px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    padding: 30px 20px;
    bottom: 0;
    background: white;
    z-index: 1000;
}
</style>
