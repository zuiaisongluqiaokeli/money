<template>
    <div class="wrapper">
        <div class="mask" v-if="!mask"></div> <!-- 遮罩层 -->
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <!-- 折叠与不折叠 改变的是状态与left -->
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content" :style="{'overflow: auto;':!mask}">
                <transition name="el-zoom-in-left">
                    <!-- include对应路由的name -->
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <changeBackground />
                <el-backtop target=".content" :style="{'background-color':appBackground}"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import changeBackground from './changeBackground.vue';
import bus from './bus';
export default {
    data() {
        return {
            tagsList: [],
            collapse: false,
            mask: true,
            appBackground: '',
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags,
        changeBackground
    },
    created() {
        bus.$on('collapse', msg => {
            this.collapse = msg;
        });
        bus.$on('changeBackground', val => {
            this.appBackground = val;
        });
        bus.$on('showMask', val => {
            this.mask = val;
        });
        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    },
    methods: {
    }
};
</script>

<style lang="css" scoped>
.mask {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: black;
    opacity: 0.3;
    z-index: 990;
}
</style>
