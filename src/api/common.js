import request from '@/utils/request'

export function uploadImg(data) {
  return request({
    url: '/api/common/upload_img',
    method: 'post',
    data
  })
}

export function uploadEditorImg() {
  return process.env.VUE_APP_BASE_API + '/api/common/upload_editor_img'
}

export function getCategory(query) {
  return request({
    url: '/api/common/category',
    method: 'get',
    params: query
  })
}

export function domain_name() {
  return 'https://sns-static.codefav.com'
}

