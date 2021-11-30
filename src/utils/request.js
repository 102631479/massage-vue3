import axios from 'axios';
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://172.16.16.128:8888/api',
    timeout: 5000
});
let getToken = () => {
    if (localStorage.getItem("ms_token")) {
        return localStorage.getItem("ms_token")
    }
    return false
}

service.interceptors.request.use(
    config => {
        getToken() ? config.headers["Authorization"] = getToken() : delete config.headers["Authorization"]
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response.data)
        } else {
            return Promise.reject(response.data);
        }
    },
    err => {
        console.log(err);
        return Promise.reject(err);
    }
);

export default service;