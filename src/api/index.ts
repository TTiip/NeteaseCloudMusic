import {
  SearchHotProps,
  SuggestInfoProps,
  LoginQRProps,
  BannerProps,
  PlaylistHotProps,
  getPlayListProps
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
  getPlayList: '/top/playlist'
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
  getPlayList: Promise<getPlayListProps>
}

export type apiKeyType = keyof typeof apiList

export default apiList
