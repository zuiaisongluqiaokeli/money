import axios from 'axios';
import router from '@/router';
//let baseURL = process.env.baseURL
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
})
let token = localStorage.getItem("token")
if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer${token}`
}
//基于promise，响应请求也可以拦截请求
service.interceptors.request.use(config => {
    return config;
}, error => {
    console.log(error);
    return Promise.reject();
})

service.interceptors.response.use(response => {
    if (response.status === 200) {
        return response.data;
    } else {
        if (error.response.status === 401 || error.response.status === 403) {
            router.push({
                path: '/login',
            })
        }
        Promise.reject();
    }
}, error => {
    console.log(error);
    return Promise.reject();
})

export default service;