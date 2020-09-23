import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
//支持翻译
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: 'zh',
    messages
});
import store from './store'
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import VCharts from 'v-charts'
import 'babel-polyfill';
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts
Vue.use(VCharts);
//打印方法
import Print from "./utils/print"
Vue.use(Print);
// WebSocket封装方法
import * as socketApi from '@/api/socket'
Vue.prototype.socketApi = socketApi
import 'xe-utils'
//vxe表格
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
Vue.use(VXETable)
//进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import VueAMap from 'vue-amap' // 引入高德地图
// // 高德地图初始化
// Vue.use(VueAMap);
// VueAMap.initAMapApiLoader({
//     key: 'e73e6901911c9d4c3403883d23327ad4', // 如果没有这个key请去高德地图开放平台申请
//     plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geolocation', 'AMap.Geocoder', 'AMap.AMapManager', 'AMap.Marker'],
//     v: '1.4.4'
// })
Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});
//新手引导页
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
Vue.prototype.$driver = new Driver({
    doneBtnText: '完成',              // Text on the final button
    closeBtnText: '关闭',            // Text on the close button for this step
    stageBackground: 'salmon',       // Background color for the staged behind highlighted element
    nextBtnText: '下一步',              // Next button text for this step
    prevBtnText: '上一步',          // Previous button text for this step
})
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    //这里是项目在浏览器的标题
    document.title = `${to.meta.title}-后台管理系统`;
    const role = localStorage.getItem('ms_username');
    NProgress.start()
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});
//页面跳转到顶部
router.afterEach(() => {
    NProgress.done()
    window.scrollTo(0, 0)
})

new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app');

// 格式化时间
Vue.filter('formatDate', function (value) {
    let date = new Date(value);
    let y = date.getFullYear();
    let MM = date.getMonth() + 1 + "";
    MM = parseInt(MM) < 10 ? "0" + MM : MM;
    let d = date.getDate() + "";
    d = parseInt(d) < 10 ? "0" + d : d;
    // let h = date.getHours() + "";
    // h = parseInt(h) < 10 ? "0" + h : h;
    // let m = date.getMinutes() + "";
    // m = parseInt(m) < 10 ? "0" + m : m;
    // let s = date.getSeconds() + "";
    // s = parseInt(s) < 10 ? "0" + s : s;
    // return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    return y + "-" + MM + "-" + d
})
//百分数转化为小数
function toPoint(percent) {
    var str = percent.replace("%", "");
    str = str / 100;
    return str;
}
//小数转化为百分数
function toPercent(point) {
    var str = Number(point * 100).toFixed(1);
    str += "%";
    return str;
}
//输入两位小数验证
Vue.prototype.$twoNumReg = function (value) {
    value = value.replace(/[^\d.]/g, "")
    value = value.replace(/^\./g, "")
    value = value.replace(/\.{2,}/g, "")
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    return value
}
//全局捕获异常
const errorHandler = (error, vm) => {
    console.error('抛出全局异常');
    console.error(vm);
    console.error(error);

}
Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error) => errorHandler(error, this);

window.onerror = function (msg, url, line) {
    console.log('ONE ERROR HANDLER TO RULE THEM ALL:', msg, url, line);
}