import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoading: false
  },
  mutations: {
    setLoading (state, loading) {
      state.isLoading = loading
    }
  },
  actions: {

  },
  modules: {
  }
})
