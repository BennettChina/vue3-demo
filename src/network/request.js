import axios from 'axios';
import {Notify, Toast} from "vant";
import router from "@/router";

export function request(conf) {
    const instance = axios.create({
        baseURL: 'https://api.shop.eduwork.cn',
        // timeout: 5000,
    });

    // 请求拦截
    instance.interceptors.request.use((config) => {
        const token = window.localStorage.getItem('token');
        if (token && token.length > 0) {
            config.headers.Authorization = token
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // 响应拦截
    instance.interceptors.response.use((resp) => resp.data ? resp.data : resp, (error) => {
        if (error.response.config.url === '/api/auth/login' && error.response.status === 401) {
            Notify('登录失败')
            return Promise.reject(error)
        }

        if (error.response.config.url !== '/api/auth/login' && error.response.status === 401) {
            Toast.fail({
                message: '登录过期，请先登录',
                duration: 1000,
                onClose: () => {
                    router.push({path: '/login'});
                }
            })
            return Promise.reject(error)
        }

        Notify(error.response.data.message || error.response.data.errors[Object.keys(error.response.data.errors)[0]][0])
        return Promise.reject(error)
    });

    return instance(conf);
}
