// 设置播放状态
import { createStore } from 'vuex'
import utils from '@/utils'
import { setLocalStorage, getLocalStorage } from '@/hooks/useLocalStorage'

// 是否时播放状态
export const setPlayStatus = 'setPlayStatus'
// 当前正在播放列表
export const setPlaylist = 'setPlaylist'
// 当前播放索引
export const setPlayIndex = 'setPlayIndex'

// 合并歌曲到播放列表查重
const concatPlayList = (list: any, playList = []) => {
  // filter过滤无版权及vip歌曲
  return utils.concatPlayList(list.filter((item: any) => !item.license && !item.vip), playList)
}
// 当前歌曲在播放列表的索引
const findIndex = (list: any, playList: any) => {
  return playList.findIndex((item: any) => item.id === list.id)
}

export default createStore({
  state: {
    phone: JSON.parse(getLocalStorage('PhoneAndPassword') || '{}')?.phone || '',
    password: JSON.parse(getLocalStorage('PhoneAndPassword') || '{}')?.password || '',
    isSave: getLocalStorage('isSave') || false, // 是否记住账号密码
    isLoading: false, // loading 显示
    isLogin: false, // 是否登录
    showLogin: false, // 是否展示login dialog
    userInfo: { // 用户信息
      avatarUrl: '',
      nickname: '',
      userId: ''
    },
    loginDialogVisible: false, // 登录弹窗显示与隐藏
    isPlayed: false, // 当前播放状态
    playList: JSON.parse(getLocalStorage('playList') || '{}'),
    // 播放模式 0循环播放、1单曲循环、2随机播放
    playMode: getLocalStorage('playMode') || 0,
    // 播放列表
    playIndex: getLocalStorage('playIndex') || 0
  },
  mutations: {
    setIsSave (state, isSave) {
      state.isSave = isSave
      setLocalStorage('isSave', isSave)
    },
    setLoading (state, loading) {
      state.isLoading = loading
    },
    setLogin (state, isLogin) {
      state.isLogin = isLogin
    },
    setShowLogin (state, showLogin) {
      state.showLogin = showLogin
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    setPlayMode (state, mode = 0) {
      state.playMode = mode
    },
    setPlayStatus (state, val = false) {
      state.isPlayed = val
    },
    setPlaylist (state, val = null) {
      state.playList = val
      setLocalStorage('playList', JSON.stringify(val))
    },
    setPlayIndex (state, val = 0) {
      state.playIndex = val
      setLocalStorage('playIndex', val)
    }
  },
  actions: {
    // 播放歌曲列表里全部歌曲（清空当前播放列表）
    playAll ({ commit }, { list }) {
      commit(setPlaylist, concatPlayList(list))
      commit(setPlayStatus, true)
      commit(setPlayIndex, 0)
    },
    // 播放当前选中的歌曲
    selectPlay ({ commit, state }, { list }) {
      const listState: any = state.playList
      const playList = concatPlayList(list, listState)

      commit(setPlaylist, playList)
      commit(setPlayStatus, true)
      commit(setPlayIndex, findIndex(list[0], playList))
    },
    // 添加歌曲到当前播放列表
    addList ({ commit, state }, { list }) {
      const listState: any = state.playList
      const playList = concatPlayList(list, listState.value)

      commit(setPlaylist, playList)
    }
  },
  modules: {}
})
