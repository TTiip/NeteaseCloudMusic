import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoading: false,
    isLogin: false,
    userInfo: {
      avatarUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  },
  mutations: {
    setLoading (state, loading) {
      state.isLoading = loading
    },
    setLogin (state, isLogin) {
      state.isLogin = isLogin
    }
  },
  actions: {

  },
  modules: {
  }
})
