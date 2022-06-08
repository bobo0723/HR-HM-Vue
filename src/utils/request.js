import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from './auth'

// create() -> 创建axios新实例 (new)
// 1. baseURL 接口基地址
// 2. timeout 超时时间 超过了时间如果还没返回 取消掉

// service实例 = axios + 额外的配置  [更加强大定制话的axios]
// create方法是可以执行多次的 多个实例对应不同的配置项 应付大型的应用

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000 // request timeout
})

// 请求拦截器：在请求正式发送之前 可以对请求参数做一些额外的定制
// 做什么？request header添加了token
request.interceptors.request.use(
  config => {
    // config 请求配置参数对象 可以在发送请求前操作请求参数
    // 不能丢失retrun 否则请求将没有参数
    // 把token存入请求头 [vuex cookie 都可以获取 他俩是同步的]
    const token = getToken()
    if (token) {
      // 对象点语法 和 [] 都可以获取属性 中括号语法更加通用 支持表达式 动态的
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器：返回数据到客户端之前对返回值做一些处理
// ? token失效时 接口 401 退出登录
// 成功回调和失败回调什么时候执行？ http码判断的 200-300 成功 走第一个回调 不在这个之间走失败回调

// 解决办法：以后端实际返回的判断字段为主 前端进行错误自行抛出
request.interceptors.response.use(
  response => {
    // 不能丢失return 否则拿不到后端的数据
    // 这里axios默认会把后端返回的数据存入一个自己包装的对象里面
    // 放到一个名称为data的属性上，如果你想简化它的使用 就可以直接return xx.data
    // 保证在组件中拿到的数据和后端返回的数据是一致的
    const { data, message, success } = response.data
    if (success) {
      // 接口成功 -> 正常返回数据
      return data
    } else {
      // 给出一个错误提示
      Message.warning(message)
      // 接口失败 -> 自行抛出错误
      return Promise.reject(message)
    }
  },
  error => {
    console.dir(error)
    if (error.response.status === 401) {
      // 1. 清空数据
      store.commit('user/removeUserInfo')
      // 2. 跳转登录
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default request
