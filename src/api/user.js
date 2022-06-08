// 模块导入导出一定要对应
// 导入导出方式必须对应  当默认导出的时候名字可以随便  按需导出 导入的时候名字必须对应上
import request from '@/utils/request'

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function login(data) {
  // 1. request这个函数的作用是啥？ 类似于axios() 发送请求的
  // 2. request这个函数执行之后的返回值是什么？promise对象
  // 3. login函数执行完毕返回值又是什么？ login() -> promise
  // 结论：1.login()  完成了俩个事 发送请求 返回promise
  // 2. login().then(res=>{})  [async function doLogin(){ await login() }]
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户资料
 * @param {*} token
 * @return {*}
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/**
 * @description: 获取用户头像
 * @param {*} id 用户id
 * @return {*}
 */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

// login在业务中进行接口调用的函数封装
// 为什么要做？
// 1. api接口是语义化的函数 看到函数名字 接口的用处
// 2. 接口的信息已经封装完毕 业务直接拿来用 只需要传递正常的参数即可
// 3. 单独拎出来api模块 固定写码位置 增加可维护性

// 封装的思想一致的 写法可能不同  [读懂函数]
