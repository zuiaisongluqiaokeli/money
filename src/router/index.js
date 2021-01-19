import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
//一开始打开的路由，登录路由，layout路由，页面匹配不到404路由
//路由可以随便配（都会带上基础路径），但是函数式得写完整路径
export default new Router({
    mode: 'history',
    base: '/',
    routes: [{
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import('../components/Layout/Home.vue'), //首页面的组件
            meta: {
                title: '自述文件'
            },
            // 子目录如果前面没有'/'需要加上父目录才能完整跳转，如果有'/'直接可以跳转
            children: [{
                    path: '/dashboard',
                    component: () => import('../components/view/dashboard.vue'),
                    meta: {
                        title: '系统首页'
                    }
                },
                {
                    path: '/table',
                    component: () => import('../components/view/baseTable.vue'),
                    meta: {
                        title: '基础表格'
                    }
                },
                {
                    path: '/vxeTableCommon',
                    component: () => import('../components/view/vxeTableCommon.vue'),
                    meta: {
                        title: 'vxe普通表格'
                    }
                },
                {
                    path: '/vxeTableTree',
                    component: () => import('../components/view/vxeTableTree.vue'),
                    meta: {
                        title: 'vxe树型表格'
                    }
                },
                {
                    path: '/form',
                    component: () => import('../components/view/baseForm.vue'),
                    meta: {
                        title: '基本表单'
                    }
                },
                {
                    path: '/tabs',
                    component: () => import('../components/view/tabs.vue'),
                    meta: {
                        title: 'tab选项卡'
                    }
                },
                {
                    path: '/pinyinCountry',
                    component: () => import('../components/view/pinyinCountry.vue'),
                    meta: {
                        title: '拼音国家检索'
                    }
                },
                {
                    // vue-schart组件
                    path: '/scharts',
                    component: () => import('../components/view/baseCharts.vue'),
                    meta: {
                        title: 'schart图表'
                    }
                },
                {
                    //审批流组件
                    path: '/workFlowTable',
                    component: () => import('../components/view/WorkFlowTable.vue'),
                    meta: {
                        title: '审批流组件'
                    }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import('../components/view/dragList.vue'),
                    meta: {
                        title: '拖拽穿梭框'
                    }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dragTable',
                    component: () => import('../components/view/dragTable.vue'),
                    meta: {
                        title: '拖拽弹框'
                    }
                },
                {
                    // 拖拽Dialog组件
                    path: '/G6地铁',
                    component: () => import('../components/view/G6地铁.vue'),
                    meta: {
                        title: 'G6地铁'
                    }
                },
                {
                    // 拖拽Dialog组件
                    path: '/G6node-edge',
                    component: () => import('../components/view/G6node-edge.vue'),
                    meta: {
                        title: 'G6node-edge'
                    }
                },
                {
                    // 拖拽Dialog组件
                    path: '/cesium',
                    component: () => import('../components/view/cesium.vue'),
                    meta: {
                        title: 'cesium'
                    }
                },
                {
                    path: '/drakMagicTime',
                    component: () => import('../components/view/drakMagicTime.vue'),
                    meta: {
                        title: '黑暗魔法时间'
                    }
                },
                // {
                //     path: '/tiandiMap',
                //     component: () => import('../components/view/tiandiMap.vue'),
                //     meta: {
                //         title: '天地图'
                //     }
                // },
                {
                    path: '/jumpDialog',
                    component: () => import('../components/view/jumpDialog.vue'),
                    meta: {
                        title: '页面跳转编辑'
                    }
                },
                {
                    path: '/menuControl',
                    component: () => import('../components/view/menuControl.vue'),
                    meta: {
                        title: '权限菜单'
                    }
                },
                {
                    path: '/icon',
                    component: () => import('../components/view/icon.vue'),
                    meta: {
                        title: '自定义图标'
                    }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import('../components/view/vueEditor.vue'),
                    meta: {
                        title: '富文本编辑器'
                    }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import('../components/view/markdown.vue'),
                    meta: {
                        title: 'markdown编辑器'
                    }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import('../components/view/upload.vue'),
                    meta: {
                        title: '文件上传'
                    }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import('../components/view/i18n.vue'),
                    meta: {
                        title: '国际化'
                    }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import('../components/view/permission.vue'),
                    meta: {
                        title: '权限测试',
                        permission: true
                    }
                },
                {
                    path: '/404',
                    component: () => import('../components/view/404.vue'),
                    meta: {
                        title: '404'
                    }
                },
                {
                    path: '/403',
                    component: () => import('../components/view/403.vue'),
                    meta: {
                        title: '403'
                    }
                },
            ]
        },
        {
            path: '/login',
            component: () => import('../components/view/login.vue'),
            meta: {
                title: '登陆'
            }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition // 按下 后退/前进 按钮时，类似浏览器的原生表现
        } else {
            return {
                x: 0,
                y: 0
            } // 让页面滚动到顶部
        }
    }
});