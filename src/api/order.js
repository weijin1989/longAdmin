import request from '@/utils/request'

export function orderList(data) {
  return request({
    url: '/api/order/query_order_list',
    method: 'post',
    data
  })
}

export function getOrderInfo(query) {
  return request({
    url: '/api/order/query_order',
    method: 'get',
    params: query
  })
}

export function updateOrder(data) {
  return request({
    url: '/api/order/update_order',
    method: 'post',
    data
  })
}
