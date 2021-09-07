import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoading: false,
    isLogin: false,
    userInfo: {
      // avatarUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20171221%2F2a14e6b09df846a1908379c06045ba96.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1633621583&t=04cfc29ad3c93e6a6cffa65cd87c20ac'
      avatarUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
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
