import {request} from "@/network/request";

export function addToCart(data) {
    return request({
        url: '/api/carts',
        method: 'post',
        data
    })
}

export function updateNum(cartId, num = {num: 1}) {
    return request({
        url: '/api/carts/' + cartId,
        method: 'put',
        data: num
    })
}

export function remove(cartId) {
    return request({
        url: '/api/carts/' + cartId,
        method: 'delete'
    })
}

export function checked(data = []) {
    return request({
        url: '/api/carts/checked',
        method: 'patch',
        data
    })
}

export function getCartList(include = {}) {
    return request({
        url: '/api/carts',
        method: 'get',
        params: include
    })
}
