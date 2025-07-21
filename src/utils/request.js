import axios from 'axios'
import { Message } from 'element-ui'

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

// --- 核心修改：响应拦截器 ---
service.interceptors.response.use(
  /**
   * 智能响应处理器
   * 它会识别响应的数据格式，并始终尝试返回最核心的数据部分给 .then() 回调
   */
  response => {
    const res = response.data

    // 1. 如果返回的数据直接就是个数组 (通常来自 json-server 的列表请求)
    //    直接返回这个数组，让组件接收。
    if (Array.isArray(res)) {
      return res
    }

    // 2. 如果返回的是我们标准的对象格式 (通常来自真实后端)
    //    检查 code 字段来判断业务是否成功。
    if (res && typeof res.code !== 'undefined') {
      if (res.code === 1) {
        // 业务成功，只返回核心的 data 部分。
        // 组件的 .then(data => ...) 中，data 就是我们需要的数组或对象。
        return res.data
      } else {
        // 业务失败 (例如 code: 0)，弹出错误消息并中断 Promise 链。
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.msg || 'Error'))
      }
    }

    // 3. 如果返回的是一个没有 code 字段的对象 (通常来自 json-server 的增删改操作)
    //    我们也认为它是成功的，直接返回整个对象。
    return res
  },
  error => {
    // 处理网络层面的错误 (保持不变)
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