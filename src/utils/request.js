import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const request = (params) => {
  // create an axios instance
  let baseURL = process.env.VUE_APP_BASE_API
  // console.log('params', params);
  // console.log('process.env.VUE_APP_BASE_API_GO', process.env.VUE_APP_BASE_API_GO);
  if (params.types === 'dev') {
    // eslint-disable-next-line no-const-assign
    baseURL = process.env.VUE_APP_BASE_API_DEV
  }
  const service = axios.create({
    baseURL: baseURL, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 80000 // request timeout
  })

  // request interceptor
  service.interceptors.request.use(
    config => {
      // do something before request is sent
      // 设置locale
      // config.headers['X-Locale'] = global.rootVm.$i18n.locale;

      // 上传文件模式
      if (config.isFileUpload) {
        config.headers['Content-Type'] = 'multipart/form-data'
      }

      if (store.getters.token) {
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        config.headers['X-Token'] = getToken()
      }

      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
    */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
      const res = response.data

      // if the custom code is not 20000, it is judged as an error.
      if (res.code !== 0 && res.code !== 20000) {
        if (!params.disableToast) {
          global.rootVm.showToast(global.rootVm.$t(res.message || 'Error'))
        }

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          // to re-login
          MessageBox.alert(
            global.rootVm.$t('login.forceLogoutTip'),
            global.rootVm.$t('login.confirmLogout'),
            {
              confirmButtonText: global.rootVm.$t('login.reLogin'),
              type: 'warning'
            }).then(() => {
            store.dispatch('admin-user/resetToken').then(() => {
              location.reload()
            })
          })
        }
        return Promise.reject(new Error(res.message || 'Error'))
      }
      else {
        return res
      }
    },
    error => {
      console.log('err' + error) // for debug
      if (!params.disableToast) {
        global.rootVm.showToast(global.rootVm.$t(error.message || 'Error'))
      }
      return Promise.reject(error)
    }
  )

  return service(params)
};

export default request
