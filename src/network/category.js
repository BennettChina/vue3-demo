import {request} from "@/network/request";

export function getCategory() {
    return request({
        url: '/api/index'
    })
}

export function getGoodsList(orderType = 'sales', page = 1, cid = 0) {
    return request({
        url: '/api/goods?page=' + page + '&category_id=' + cid + '&' + orderType + '=1'
    })
}
