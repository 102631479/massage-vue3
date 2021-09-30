import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};


export const getlogin = data => {
    return request({
        url: '/login',
        method: 'post',
        data
    });
};

export const getRegister = data => {
    return request({
        url: '/register',
        method: 'post',
        data
    });
};