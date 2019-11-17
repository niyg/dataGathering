import axios from 'axios'
import qs from 'qs'
import config from '@/config'
import { Message } from 'element-ui'
import wsCache from '@/cache'
import router from '@/router'
import { resetRouter } from '@/router'
import store from '@/store'

const PATH_URL = process.env.NODE_ENV === 'development'
  ? config.base_url.dev
  : config.base_url.pro

// 创建axios实例
const service = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: 20000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers['X-themis-Client'] = 'web'
    config.headers['X-themis-Client-Infos'] = 'web'
    if (wsCache.get('userInfo')) {
      config.headers['X-themis-Token'] = wsCache.get('userInfo').tokenMap.token
    }
    if (config.method === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.data.resultCode === '0000') {
      return response.data.data
    } else if (response.data.resultCode === '1026' || response.data.resultCode === '1027' || response.data.resultCode === '1014' || response.data.resultCode === '1013') {
      Message.error(response.data.message)
      wsCache.delete('userInfo')
      store.dispatch('delAllViews')
      resetRouter()
      router.replace({
        path: '/login'
      })
    } else {
      Message.error(response.data.message)
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message.error(error.message)
    return Promise.reject(error)
  }
)

export default service
