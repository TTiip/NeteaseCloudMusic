// 设置播放状态
import { createStore } from 'vuex'
import utils from '@/utils'
import {
  setLocalStorage,
  getLocalStorage
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

const playList = [
  {
    id: '1413460561',
    name: '✘ 按 下 暫 停 你 將 變 的 清 醒 且 墮 落',
    mvId: 0,
    singer: [{
      id: 29070146,
      name: 'Mei',
      tns: [],
      alias: []
    }],
    album: {
      id: 84583444,
      name: '✘ 按 下 暫 停 你 將 變 的 清 醒 且 墮 落',
      picUrl: 'https://p2.music.126.net/ckqVNj6GW31JWEZYqjVGBA==/109951164595490721.jpg',
      tns: [],
      pic_str: '109951164595490721',
      pic: 109951164595490720
    },
    alia: [],
    duration: '03:52',
    url: 'https://music.163.com/song/media/outer/url?id=1413460561.mp3',
    vip: false,
    license: false,
    publishTime: '1970年01月01日'
  },
  {
    id: '135394',
    name: '该死的温柔',
    mvId: 5309639,
    singer: [{
      id: 4485,
      name: '马天宇',
      tns: [],
      alias: []
    }],
    album: {
      id: 13399,
      name: '宇光十色',
      picUrl: 'https://p2.music.126.net/x2A5RT8xqIeBbEiObw2_cg==/109951165541543112.jpg',
      tns: [],
      pic_str: '109951165541543112',
      pic: 109951165541543100
    },
    alia: [],
    duration: '03:44',
    url: 'https://music.163.com/song/media/outer/url?id=135394.mp3',
    vip: false,
    license: false,
    publishTime: '2007年02月03日'
  },
  {
    id: '1808492017',
    name: '错位时空',
    mvId: 0,
    singer: [{
      id: 12174057,
      name: '艾辰',
      tns: [],
      alias: []
    }],
    album: {
      id: 121076375,
      name: '错位时空',
      picUrl: 'https://p2.music.126.net/8C0lwLE88j9ZwLyPQ9a4FA==/109951165595770076.jpg',
      tns: [],
      pic_str: '109951165595770076',
      pic: 109951165595770080
    },
    alia: [],
    duration: '03:23',
    url: 'https://music.163.com/song/media/outer/url?id=1808492017.mp3',
    vip: false,
    license: false,
    publishTime: '1970年01月01日'
  },
  {
    id: '191254',
    name: '天下',
    mvId: 5779666,
    singer: [{
      id: 6472,
      name: '张杰',
      alia: ['Jason Zhang']
    }],
    album: {
      id: 19318,
      name: '明天过后',
      picUrl: 'https://p1.music.126.net/ixIs5kkukgNYMmeDsc35_g==/29686813955450.jpg',
      pic_str: '29686813955450',
      pic: 29686813955450
    },
    alia: [],
    vip: false,
    license: false,
    duration: '03:39',
    url: 'https://music.163.com/song/media/outer/url?id=191254.mp3',
    publishTime: 'NaN年NaN月NaN日'
  },
  {
    id: '1386460251',
    name: '天下',
    mvId: 0,
    singer: [{
      id: 32829923,
      name: '高鱼',
      tns: [],
      alias: []
    }],
    album: {
      id: 81090493,
      name: '天下',
      picUrl: 'https://p1.music.126.net/sAJx8EMZqPaLN1yXgDTvjg==/109951164874863256.jpg',
      tns: [],
      pic_str: '109951164874863256',
      pic: 109951164874863260
    },
    alia: [],
    duration: '03:31',
    url: 'https://music.163.com/song/media/outer/url?id=1386460251.mp3',
    vip: false,
    license: false,
    publishTime: '1970年01月01日'
  },
  {
    id: '1359356908',
    name: '晚安',
    mvId: 14301610,
    singer: [{
      id: 31376161,
      name: '颜人中'
    }],
    album: {
      id: 78570420,
      name: '晚安',
      picUrl: 'https://p2.music.126.net/8N1fsMRm2L5HyZccc6I3ew==/109951164007377169.jpg',
      pic_str: '109951164007377169',
      pic: 109951164007377170
    },
    alia: [],
    vip: false,
    license: false,
    duration: '04:49',
    url: 'https://music.163.com/song/media/outer/url?id=1359356908.mp3',
    publishTime: 'NaN年NaN月NaN日'
  },
  {
    id: '31134170',
    name: '小芳',
    mvId: 0,
    singer: [{
      id: 4292,
      name: '李荣浩',
      tns: [],
      alias: []
    }],
    album: {
      id: 3109627,
      name: '热门华语262',
      picUrl: 'https://p2.music.126.net/cpoUinrExafBHL5Nv5iDHQ==/109951166361218466.jpg',
      tns: [],
      pic_str: '109951166361218466',
      pic: 109951166361218460
    },
    alia: [],
    duration: '04:10',
    url: 'https://music.163.com/song/media/outer/url?id=31134170.mp3',
    vip: false,
    license: false,
    publishTime: '2015年01月01日'
  },
  {
    id: '28563317',
    name: '阴天快乐',
    mvId: 377104,
    singer: [{
      id: 2116,
      name: '陈奕迅',
      tns: [],
      alias: []
    }],
    album: {
      id: 2801259,
      name: 'rice & shine',
      picUrl: 'https://p2.music.126.net/itkdsMFR8nYzaTiDdHO3tA==/109951165995320408.jpg',
      tns: [],
      pic_str: '109951165995320408',
      pic: 109951165995320420
    },
    alia: [],
    duration: '04:20',
    url: 'https://music.163.com/song/media/outer/url?id=28563317.mp3',
    vip: false,
    license: false,
    publishTime: '2014年01月01日'
  },
  {
    id: '1873049720',
    name: '初恋',
    mvId: 0,
    singer: [{
      id: 27730224,
      name: '回春丹',
      tns: [],
      alias: []
    }],
    album: {
      id: 132354811,
      name: '初恋',
      picUrl: 'https://p2.music.126.net/4NJvc1HOi4uv7cs4501Bjg==/109951166324714668.jpg',
      tns: [],
      pic_str: '109951166324714668',
      pic: 109951166324714670
    },
    alia: [],
    duration: '03:42',
    url: 'https://music.163.com/song/media/outer/url?id=1873049720.mp3',
    vip: false,
    license: false,
    publishTime: '1970年01月01日'
  },
  {
    id: '2526628',
    name: 'Blow Me a Kiss',
    mvId: 0,
    singer: [
      {
        id: 55350,
        name: 'Deep Side',
        tns: [],
        alias: []
      }
    ],
    album: {
      id: 254362,
      name: 'Git Fresh',
      picUrl: 'https://p1.music.126.net/dUSiZ5ASRpWgaq9OTMtoDw==/860917604602698.jpg',
      tns: [],
      pic: 860917604602698
    },
    alia: [],
    duration: '04:11',
    url: 'https://music.163.com/song/media/outer/url?id=2526628.mp3',
    vip: false,
    license: false,
    publishTime: '2008年01月01日'
  },
  {
    id: '36270426',
    name: '来自天堂的魔鬼',
    mvId: 503273,
    singer: [{
      id: 7763,
      name: 'G.E.M.邓紫棋',
      tns: [],
      alias: ['G.E.M.'],
      alia: ['G.E.M.']
    }],
    album: {
      id: 3189002,
      name: '新的心跳',
      picUrl: 'http://p4.music.126.net/kVwk6b8Qdya8oDyGDcyAVA==/1364493930777368.jpg',
      tns: [],
      pic: 1364493930777368
    },
    alia: [],
    vip: false,
    license: false,
    duration: '04:05',
    url: 'https://music.163.com/song/media/outer/url?id=36270426.mp3',
    publishTime: '2015年11月06日'
  },
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
    license: false,
    duration: '04:39',
    url: 'https://music.163.com/song/media/outer/url?id=417859631.mp3',
    publishTime: 'NaN年NaN月NaN日'
  },
  {
    id: '1498342485',
    name: '耗尽',
    mvId: 0,
    singer: [{
      id: 5781,
      name: '薛之谦',
      alia: ['Joker Xue']
    },
    {
      id: 12479356,
      name: '郭聪明'
    }],
    album: {
      id: 121012393,
      name: '天外来物',
      picUrl: 'https://p2.music.126.net/jOrfzq4tB9ENWQVWLhi3Ag==/109951165591010361.jpg',
      pic_str: '109951165591010361',
      pic: 109951165591010370
    },
    alia: [],
    vip: false,
    license: false,
    duration: '04:19',
    url: 'https://music.163.com/song/media/outer/url?id=1498342485.mp3',
    publishTime: 'NaN年NaN月NaN日'
  }
]

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
    playList: playList,
    // 播放模式 0循环播放、1单曲循环、2随机播放
    playMode: getLocalStorage('playMode') || 0,
    // 播放列表
    playIndex: getLocalStorage('playIndex') || 0,
    // 当前播放歌曲在播放列表的所在位置
    playListTips: '' // 添加及播放成功后，播放列表按钮提示的文字
  },
  mutations: {
    // setPhoneAndPassword (state, { phone, password }) {
    //   state.phone = phone
    //   state.password = password
    //   setLocalStorage('PhoneAndPassword', JSON.stringify({ phone, password }))
    // },
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
    setPlayListTips (state, val = null) {
      state.playListTips = val
    },
    setPlayMode (state, mode = 0) {
      state.playMode = mode
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
      const playList = concatPlayList(list, listState.value)

      commit(SET_PLAY_LIST, playList)
    }
  },
  modules: {}
})
