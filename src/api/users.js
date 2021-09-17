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

export function disableAccount(query) {
  return request({
    url: '/api/user/disable_account',
    method: 'get',
    params: query
  })
}
