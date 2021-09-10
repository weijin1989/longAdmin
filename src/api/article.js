import request from '@/utils/request'

export function articleList(data) {
  return request({
    url: '/api/article/list',
    method: 'post',
    data
  })
}

export function articleAdd(data) {
  return request({
    url: '/api/article/add',
    method: 'post',
    data
  })
}

export function articleDelete(query) {
  return request({
    url: '/api/article/delete',
    method: 'get',
    params: query
  })
}

export function articleRecommend(query) {
  return request({
    url: '/api/article/set_recommend',
    method: 'get',
    params: query
  })
}

export function articleTop(query) {
  return request({
    url: '/api/article/set_top',
    method: 'get',
    params: query
  })
}
export function articleOne(query) {
  return request({
    url: '/api/article/get',
    method: 'get',
    params: query
  })
}

export function articleUpdate(data) {
  return request({
    url: '/api/article/update',
    method: 'post',
    data
  })
}
