// 设置播放状态
import { createStore } from 'vuex'
import utils from '@/utils'
import {
  setLocalStorage
} from '@/hooks/useLocalStorage'

// 是否时播放状态
export const SET_PLAYS_TATUS = 'SET_PLAYS_TATUS'
// 当前正在播放列表
export const SET_PLAY_LIST = 'SET_PLAY_LIST'
// 当前播放索引
export const SET_PLAY_INDEX = 'SET_PLAY_INDEX'

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
    isLoading: false, // loading 显示
    isLogin: false, // 是否登录
    userInfo: { // 用户信息
      avatarUrl: ''
    },
    loginDialogVisible: false, // 登录弹窗显示与隐藏
    isPlayed: false, // 当前播放状态
    playList: [
      {
        id: '417859631',
        name: '我好像在哪见过你',
        mvId: 5342354,
        singer: [
          {
            id: 5781,
            name: '薛之谦',
            alia: [
              'Joker Xue'
            ]
          }
        ],
        album: {
          id: 34780271,
          name: '初学者',
          picUrl: 'https://p1.music.126.net/hti_a0LADoFMBHvOBwAtRA==/1369991500930171.jpg',
          pic_str: '1369991500930171',
          pic: 1369991500930171
        },
        alia: [
          '动画电影《精灵王座》主题曲'
        ],
        vip: false,
        duration: '04:39',
        url: 'https://music.163.com/song/media/outer/url?id=417859631.mp3',
        publishTime: 'NaN年NaN月NaN日'
      }
    ], // 播放列表
    playIndex: 0, // 当前播放歌曲在播放列表的所在位置
    playListTips: 0 // 添加及播放成功后，播放列表按钮提示的文字
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
    },
    [SET_PLAYS_TATUS] (state, val = false) {
      state.isPlayed = val
    },
    [SET_PLAY_LIST] (state, val = null) {
      state.playList = val
      setLocalStorage('playList', JSON.stringify(val))
    },
    [SET_PLAY_INDEX] (state, val = 0) {
      state.playIndex = val
      setLocalStorage('playIndex', val)
    }
  },
  actions: {
    // 播放歌曲列表里全部歌曲（清空当前播放列表）
    playAll ({ commit }, { list }) {
      commit(SET_PLAY_LIST, concatPlayList(list))
      commit(SET_PLAYS_TATUS, true)
      commit(SET_PLAY_INDEX, 0)
    },
    // 播放当前选中的歌曲
    selectPlay ({ commit, state }, { list }) {
      const listState: any = state.playList
      const playList = concatPlayList(list, listState)

      commit(SET_PLAY_LIST, playList)
      commit(SET_PLAYS_TATUS, true)
      commit(SET_PLAY_INDEX, findIndex(list[0], playList))
    },
    // 添加歌曲到当前播放列表
    addList ({ commit, state }, { list }) {
      const listState: any = state.playList
      const playList = concatPlayList(list, listState)

      commit(SET_PLAY_LIST, playList)
    }
  },
  modules: {}
})
