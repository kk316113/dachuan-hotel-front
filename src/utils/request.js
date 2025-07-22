import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api',
  timeout: 50000
})
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    const res = response.data

    if (Array.isArray(res)) {
      return res
    }

    if (res && typeof res.code !== 'undefined') {
      if (res.code === 1) {
        return res.data
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.msg || 'Error'))
      }
    }
    
    return res
  },
  error => {
    if (error.response && error.response.status === 401) {
      Message({
        message: '登录已过期，请重新登录',
        type: 'error',
        duration: 3 * 1000
      })
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('hasLogin');
      router.push('/login');

    } else {
      // 如果是其他网络错误，执行原来的逻辑
      console.error('响应错误', error)
      Message({
        message: error.message || '网络错误',
        type: 'error',
        duration: 2000
      })
    }
    return Promise.reject(error)
  }
)

export default service