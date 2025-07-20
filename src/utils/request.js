import axios from 'axios'
import {
  Message
} from 'element-ui'
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

    // ✅ 如果是数组，直接返回（比如 /rooms 接口）
    if (Array.isArray(res)) {
      return res
    }

    // ✅ 如果是对象但没有 code 字段，也认为合法
    if (res.code === undefined || res.code === 200 || res.code === 1) {
      return res
    }

    // ❌ 其余情况视为错误
    Message({
      message: res.message || '请求出错',
      type: 'error',
      duration: 2000
    })
    return Promise.reject(new Error(res.message || 'Error'))
  },
  error => {
    console.error('响应错误', error)
    Message({
      message: error.message || '网络错误',
      type: 'error',
      duration: 2000
    })
    return Promise.reject(error)
  }
)


export default service
