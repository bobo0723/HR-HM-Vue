import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import menu from './modules/menu'
import user from './modules/user'

Vue.use(Vuex)

// 实例化
const store = new Vuex.Store({
  // 组合模块的配置项
  modules: {
    app,
    settings,
    menu,
    user
  },
  // 注册getters
  getters
})

export default store
