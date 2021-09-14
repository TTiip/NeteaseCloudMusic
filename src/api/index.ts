import {
  SearchHotProps,
  SuggestInfoProps,
  LoginQRProps,
  BannerProps,
  PlaylistHotProps,
  GetTopListProps,
  GetTopAlbumProps,
  GetTopList,
  GetTopListDetail,
  GetMvFirst
} from '@/interface'

const apiList = {
  // 热门搜索
  getSearchHot: '/search/hot',
  // 输入条件搜索
  getSearchSuggest: '/search/suggest',
  // 获取二维码key
  getLoginKey: '/login/qr/key',
  // 获取二维码
  getQR: '/login/qr/create',
  // 轮询查询扫码状态
  getQRRefresh: '/login/refresh',
  // 手机登录
  cellPhoneLogin: '/login/cellphone',
  // 登出
  getLogout: '/logout',
  // 获取用户信息
  getuserDetail: '/user/detail',
  // 获取banner
  getBanner: '/banner',
  // 热门歌单分类
  getPlaylistHot: '/playlist/hot',
  // 获取热门歌单
  getTopPlayList: '/top/playlist',
  // 获取新碟上架
  getTopAlbum: '/top/album',
  // 获取排行榜
  getTopList: '/toplist',
  // 获取排行榜详情
  getTopListDetail: '/playlist/detail',
  // 获取 最新 mv
  getMvFirst: '/mv/first'
}

export interface apiKeyDataType {
  getSearchHot: Promise<SearchHotProps>,
  getSearchSuggest: Promise<SuggestInfoProps>,
  getLoginKey: string,
  getQR: Promise<LoginQRProps>,
  getQRRefresh: any,
  cellPhoneLogin: Promise<{
    code: number
    message?: string
    msg?: string,
    account?: any
    bindings?: any[]
    cookie?: string
    loginType?: number
    profile?: any
    token?: string
  }>,
  getLogout: Promise<{
    code: number
  }>,
  getuserDetail: any,
  getBanner: Promise<BannerProps>
  getPlaylistHot: Promise<PlaylistHotProps>,
  getTopPlayList: Promise<GetTopListProps>,
  getTopAlbum: Promise<GetTopAlbumProps>,
  getTopList: Promise<GetTopList>,
  getTopListDetail: Promise<GetTopListDetail>,
  getMvFirst: Promise<GetMvFirst>
}

export type apiKeyType = keyof typeof apiList

export default apiList
