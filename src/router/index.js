import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import { asyncRoutes } from './asyncRoutes'
// 这里面的都是静态的所有人进来都可以访问 -> 静态路由数组 + 动态路由数组
// 现在虽然效果上和之前是一样的 但是从概念语义上 我们的路由已经有区别了
// 分成了俩类 一类叫动态 将来这个动态路由里面需要加权限控制
// 静态路由不需要加权限控制的

export const constantRoutes = [
  // 登录页
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // 员工详情页
  {
    path: '/detail',
    hidden: true,
    component: Layout,
    children: [{
      path: '',
      name: 'EmployeesDetail',
      component: () => import('@/views/EmployeesDetail/index')
    }]
  },
  // 用Excel批量导入员工 - 上传Excel表格
  {
    path: '/upload-excel',
    hidden: true,
    component: Layout,
    children: [{
      path: '',
      name: 'UploadExcel',
      component: () => import('@/views/UploadExcel/index')
    }]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  // routes: [...constantRoutes, ...asyncRoutes]
  routes: [...constantRoutes]
})

const router = createRouter()

// reset 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher // reset router
}

export default router
