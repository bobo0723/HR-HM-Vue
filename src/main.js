import Vue from 'vue'
import 'normalize.css/normalize.css'
// 导入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css 当成js模块对待的

// 导入自定义的axios
import http from '@/utils/http.js'

// 导入根组件
import App from './App'
// 导入vuex
import store from './store'
// 导入router
import router from './router'

// 执行全局指令注册
import '@/directive'

// 执行权限文件
import './permission'
import '@/icons' // icon

// 导入ComponentsIndex全局插件
import ComponentsIndex from '@/components'

// 注册ComponentsIndex全局插件
// 当执行use方法的时候会自动执行插件中的install方法并且把实参Vue传入
Vue.use(ComponentsIndex)

// 以插件化的注册方式做全局注册 任何一个.vue组件中都可以使用组件
Vue.use(ElementUI)

// 往Vue原型上挂载方法
Vue.prototype.$http = http

Vue.config.productionTip = false

// 挂载？ render 把组件显示到页面中其实就是挂载
// 测试环境变量
// 对象！
// console.log(process.env)
// vue实例化
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
