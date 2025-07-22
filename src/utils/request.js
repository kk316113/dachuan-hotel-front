import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const service = axios.create({
  // 【核心修正】将 baseURL 固定为 '/api'
  // 这样无论开发还是部署，所有请求都会带上 /api 前缀
  baseURL: '/api',
  timeout: 50000
})

// 请求拦截器
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

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 如果返回的是数组，直接返回 (兼容旧接口)
    if (Array.isArray(res)) {
      return res
    }

    // 如果返回的是标准 { code, msg, data } 结构
    if (res && typeof res.code !== 'undefined') {
      if (res.code === 1) {
        // 成功，直接返回 data 部分
        return res.data
      } else {
        // 业务失败 (code !== 1)，弹出后端 msg
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.msg || 'Error'))
      }
    }
    
    // 如果返回的不是标准结构，直接返回整个响应体
    return res
  },
  error => {
    // 处理网络层面的错误
    if (error.response && error.response.status === 401) {
      Message({
        message: '登录已过期，请重新登录',
        type: 'error',
        duration: 3 * 1000
      })
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('hasLogin');
      localStorage.removeItem('id'); // 确保 id 也被清除
      router.push('/login');

    } else {
      // 其他网络错误 (如 500, 404 等)
      console.error('响应错误', error)
      let errorMsg = error.message || '网络错误';
      // 尝试从 500 错误的响应体中提取 msg
      if (error.response && error.response.data && error.response.data.msg) {
        errorMsg = error.response.data.msg;
      }
      Message({
        message: errorMsg,
        type: 'error',
        duration: 2000
      })
    }
    return Promise.reject(error)
  }
)

export default service
