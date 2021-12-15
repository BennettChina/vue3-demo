import {request} from "@/network/request";

export function createOrder(data) {
    return request({
        url: '/api/orders',
        method: 'post',
        data
    })
}

export function previewOrder() {
    return request({
        url: '/api/orders/preview'
    })
}

export function getPayCode(order, type='') {
    return request({
        url: `/api/orders/${order}/pay`,
        params: {
            type
        }
    })
}

export function getPayStatus(order) {
    return request({
        url: `/api/orders/${order}/status`
    })
}

export function getOrderList(page = 1, title, status, include) {
    return request({
        url: '/api/orders',
        params: {
            page,
            title,
            status,
            include
        }
    })
}

export function getOrderDetail(order, include) {
    return request({
        url: `/api/orders/${order}`,
        params: {
            include
        }
    })
}

export function confirmOrder(order) {
    return request({
        url: `/api/orders/${order}/confirm`,
        method: 'patch'
    })
}

export function getOrderExpress(order) {
    return request({
        url: `/api/orders/${order}/express`
    })
}
