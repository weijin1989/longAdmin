import request from '@/utils/request'

export function userList(data) {
  return request({
    url: '/api/user/list',
    method: 'post',
    data
  })
}

export function getInfo(query) {
  return request({
    url: '/api/user/details',
    method: 'get',
    params: query
  })
}

export function disable(query) {
  return request({
    url: '/api/user/disable',
    method: 'get',
    params: query
  })
}


export function cancelDisable(query) {
  return request({
    url: '/api/user/cancel_disable',
    method: 'get',
    params: query
  })
}
