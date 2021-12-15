import {request} from "@/network/request";

export function getContent(id) {
    return request({
        url: '/api/goods/' + id
    })
}
