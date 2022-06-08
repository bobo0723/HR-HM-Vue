import Layout from '../layout'

export const asyncRoutes = [

  // 组织架构
  {
    path: '/department',
    component: Layout,
    children: [{
      path: '',
      name: 'department',
      component: () => import('@/views/Department/index'),
      meta: { title: '组织架构', icon: 'tree' }
    }]
  },
  // 角色管理
  {
    path: '/setting',
    component: Layout,
    children: [{
      path: '',
      name: 'setting',
      component: () => import('@/views/Setting/index'),
      meta: { title: '角色管理', icon: 'setting' }
    }]
  },
  // 员工管理
  {
    path: '/employee',
    component: Layout,
    children: [{
      path: '',
      name: 'employee',
      component: () => import('@/views/Employee/index'),
      meta: { title: '员工管理', icon: 'people' }
    }]
  },

  // 权限点
  {
    path: '/permission',
    component: Layout,
    children: [{
      path: '',
      name: 'permission',
      component: () => import('@/views/Permission/index'),
      meta: { title: '权限点管理', icon: 'lock' }
    }]
  },

  {
    path: '/salarys',
    component: Layout,
    hidden: false,
    children: [{
      path: '', // 如果children path置空的话 当前这个路由会作为一级渲染的默认路由
      name: 'salarys',
      component: () => import('@/views/Salary'),
      meta: { title: '工资管理', icon: 'money' }
    }]
  }
]
