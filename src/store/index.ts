import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoading: false,
    isLogin: false,
    userInfo: {
      avatarUrl: ''
    }
  },
  mutations: {
    setLoading (state, loading) {
      state.isLoading = loading
    },
    setLogin (state, isLogin) {
      state.isLogin = isLogin
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {

  },
  modules: {
  }
})
