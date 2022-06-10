import axios from 'axios'
import { getToken } from './auth'

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
axios.defaults.timeout = 5000 // request timeout

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  const token = getToken()
  if (token) {
    // 对象点语法 和 [] 都可以获取属性 中括号语法更加通用 支持表达式 动态的
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, function(error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default axios
