<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="white"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="`#${item.icon}`"></use>
                            </svg>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="`#${item.icon}`"></use>
                        </svg>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../Layout/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'icon-food-doughnut',
                    index: 'dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'icon-food-bread',
                    index: 'table',
                    title: '基础表格'
                },

                {
                    icon: 'icon-food-avocado',
                    index: '2',
                    title: 'vxe表格',
                    subs: [
                        {
                            index: 'vxeTableCommon',
                            title: '普通表格'
                        },
                        {
                            index: 'vxeTableTree',
                            title: '树型表格'
                        }
                    ]
                },
                {
                    icon: 'icon-food-pudding',
                    index: '3',
                    title: '表单相关',
                    subs: [
                        {
                            index: 'form',
                            title: '基本表单'
                        },
                        {
                            index: 'upload',
                            title: '文件上传'
                        },
                        {
                            index: 'tabs',
                            title: 'tab选项卡'
                        },
                        {
                            index: 'pinyinCountry',
                            title: '拼音国家检索'
                        },
                    ]
                },
                {
                    icon: 'icon-food-strawberry',
                    index: 'scharts',
                    title: 'schart图表'
                },
                {
                    icon: 'icon-food-popsicle',
                    index: 'workFlowTable',
                    title: '审批流组件'
                },
                {
                    icon: 'icon-food-pizza',
                    index: '6',
                    title: '拖拽组件',
                    subs: [
                        {
                            index: 'drag',
                            title: '拖拽穿梭框'
                        },
                        {
                            index: 'dragTable',
                            title: '拖拽表格'
                        }
                    ]
                },
                {
                    icon: 'icon-food-popsicle',
                    index: 'G6地铁',
                    title: 'G6地铁'
                },
                {
                    icon: 'icon-food-eggyolkcake',
                    index: 'G6node-edge',
                    title: 'G6node-edge'
                },
                {
                    icon: 'icon-food-hotdog',
                    index: 'cesium',
                    title: 'cesium'
                },
                {
                    icon: 'icon-food-sushi',
                    index: 'MenuControl',
                    title: '菜单权限'
                },

                {
                    icon: 'icon-food-macaron',
                    index: 'icon',
                    title: '自定义图标'
                },
                {
                    icon: 'icon-food-cashew',
                    index: 'editor',
                    title: '富文本编辑器'
                },
                {
                    icon: 'icon-food-mochi',
                    index: 'markdown',
                    title: 'markdown编辑器'
                },
                {
                    icon: 'icon-food-pistachio',
                    index: 'i18n',
                    title: '国际化功能'
                },
                {
                    icon: 'icon-food-pecan',
                    index: '7',
                    title: '错误处理',
                    subs: [
                        {
                            index: 'permission',
                            title: '权限测试'
                        },
                        {
                            index: '403',
                            title: '403页面'
                        },
                        {
                            index: '404',
                            title: '404页面'
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', (msg) => {
            this.collapse = msg;
        });
    }
};
</script>

<style scoped>
/deep/ .el-submenu .el-menu-item{
    padding-left: 62px!important;
}
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
/* 选中的背景颜色 */
/* .el-menu-item:focus, .el-menu-item:hover {} */
</style>