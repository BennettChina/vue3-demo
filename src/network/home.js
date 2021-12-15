import {request} from '@/network/request';

export function getAll() {
    return request({
        url: '/api/index',
    });
}

export function getGoods(type = 'sales', pages = 1) {
    return request({
        url: '/api/index?' + type + '=1&page=' + pages
    })
}
