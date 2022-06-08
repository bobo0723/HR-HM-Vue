// 权限控制
// 应用启动的时候 权限控制就立刻生效
// main.js  初始化的事情  立刻执行一下permission.js

// 模块化  export import  直接导入js  会被立刻执行

// console.log('权限执行了')
import router from '@/router'
import store from '@/store'
// console.log(store)
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // 配套的进度条样式
import { getToken } from './utils/auth'
// 创建白名单
const WHITELIST = ['/login', '/404']
// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 在这里开启进度条展示
  NProgress.start()
  // to: 跳转到的目标路由对象
  // from: 来源路由对象
  // next: 放行函数 可执行的函数
  const token = getToken()
  if (token) {
    // 有token
    // 是否去登录页？
    if (to.path === '/login') {
      next('/')
    } else {
      // 这里！！！ 最合适！！ 触发action函数
      next()
      // 问题：因为请求是放在了拦截器里 每次路由跳转就会有重复的请求
      // 解决方案：如果已经请求过了 就不要再请求了
      // 这个请求结束之后 vuex中存入了userInfo 就可以以userInfo.userId做一个判断条件
      if (!store.state.user.userInfo.userId) {
        store.dispatch('user/fetchUserInfo')
      }
    }
  } else {
    // 没有token
    // 白名单：当前的路由不需要加控制 直接放行就行
    // 如何判断字符串是否在数组中找的到？
    if (WHITELIST.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  // 这里关闭进度条展示
  NProgress.done()
})

