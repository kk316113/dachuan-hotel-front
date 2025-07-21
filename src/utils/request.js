import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router' // 1. 引入 router 用于跳转页面

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api',
  timeout: 50000
})

// 请求拦截器 (保持不变)
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
  /**
   * 成功响应处理部分 - 【完全保持不变】
   * 你的智能响应处理器，可以同时处理来自 json-server 和真实后端的数据
   */
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
  /**
   * 错误响应处理部分 - 【只在这里增加 401 判断】
   */
  error => {
    // 2. 检查响应错误，并判断是否为 401 状态码
    if (error.response && error.response.status === 401) {
      // 如果是 401 (Token 失效或未授权)
      Message({
        message: '登录已过期，请重新登录',
        type: 'error',
        duration: 3 * 1000
      })
      // 清除本地存储的所有用户信息
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('hasLogin');
      
      // 跳转到登录页
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