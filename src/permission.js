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
import { asyncRoutes } from '@/router/asyncRoutes'
// 创建白名单
const WHITELIST = ['/login', '/404']
// 路由前置守卫
router.beforeEach(async(to, from, next) => {
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
      // 在有token的情况下不允许去登录页，去登录页直接跳转回主页
      next('/')
    } else {
      // 这里！！！ 最合适！！ 触发action函数
      next()
      // 问题：因为请求是放在了拦截器里 每次路由跳转就会有重复的请求
      // 解决方案：如果已经请求过了 就不要再请求了
      // 这个请求结束之后 vuex中存入了userInfo 就可以以userInfo.userId做一个判断条件
      if (!store.state.user.userInfo.userId) {
        const res = await store.dispatch('user/fetchUserInfo')
        // console.log(res.roles.menus, asyncRoutes)
        // 权限控制
        // 1. 拿到当前用户的menus权限数据 以及 所有的动态路由表
        const menus = res.roles.menus
        // console.log(menus)
        // 2. 以menus为主对asyncRoutes做过滤 [filter] 找到符合条件的项 [路由的name能否在menus中找到 找得到就是符合条件
        const filterRouters = asyncRoutes.filter((item) => {
          // console.log(item.children[0].name)
          return menus.includes(item.children[0].name)
        })
        // console.log(filterRouters)
        // 调用router实例方法addRoutes添加路由
        // 3. 动态添加路由 把筛选出来有资格的路由添加到路由系统中
        // 让访问path的时候可以渲染组件
        // 404页 作为一个兜底路由 有一个要求得放在所有路由的最末尾
        // 如果放到了中间 会出现刷新的时候 会先匹配404页 相当于直接在中间就匹配上了
        // [静态 + 动态 + 404]
        router.addRoutes([
          ...filterRouters,
          // 404页放在最后
          {
            path: '/404',
            component: () => import('@/views/404'),
            hidden: true
          }
        ])
        // 4. 调用store的方法把过滤之后的动态路由表加入
        store.commit('menu/setMenuList', filterRouters)
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

