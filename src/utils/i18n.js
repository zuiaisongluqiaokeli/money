import VueI18n from "vue-i18n";
import zhLocale from './locales/zh.js';/* 引入本地简体中文语言包 */
import zhTWLocale from './locales/zh-TW.js';/* 引入本地繁体中文语言包 */
import enLocale from './locales/en.js';/* 引入本地英语语言包 */
import zhElemment from 'element-ui/lib/locale/lang/zh-CN'//引入elementUI简体中文语言包
import zhTWElemment from 'element-ui/lib/locale/lang/zh-TW'//引入elementUI繁体中文语言包
import enElemment from 'element-ui/lib/locale/lang/en'//引入elementUI英语语言包

Vue.use(VueI18n);
const messages = {//语言包
    zh: Object.assign(zhLocale, zhElemment),//本地语言包加入elementUI的语言包
    'zh-TW': Object.assign(zhTWLocale, zhTWElemment),//本地语言包加入elementUI的语言包
    en: Object.assign(enLocale, enElemment)//本地语言包加入elementUI的语言包
};
const i18n = new VueI18n({
    locale: "zh", //zh默认是简体中文
    messages
});

Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
})