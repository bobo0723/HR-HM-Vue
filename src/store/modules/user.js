import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken() || '', // 前面的满足就用前面的 否则采用后面的
    userInfo: {}
  },

  mutations: {
    setToken(state, payload) {
      state.token = payload
      // 往本地也存一份
      setToken(payload)
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    // 清空数据
    removeUserInfo(state) {
      state.token = ''
      state.userInfo = {}
      // 清空一下cookie
      removeToken()
    }
  },
  // 定义异步方法 ajax api   处理异步
  actions: {
    // 接口请求  登录接口
    async fetchLogin(ctx, payload) {
      const token = await login(payload)
      // 提交mutation
      ctx.commit('setToken', token)
    },
    // 获取用户信息的接口请求
    async fetchUserInfo(ctx, payload) {
      // 1. 调用接口 - api
      const res = await getUserInfo()
      // 2. 调用获取用户头像的接口 然后把用户name的接口数据组合在一起 然后再存起来
      const resPhoto = await getUserDetailById(res.userId)
      // 2. 提交mutation
      // 如何把俩个对象合并为一个对象？ {...res,...resPhoto}
      ctx.commit('setUserInfo', { ...res, ...resPhoto })
    }
  }
}

// 管理的模式： dispatch(action) -> 获取异步数据 -> commit（mutation）-> state被修改 -> 影响视图
