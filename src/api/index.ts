import { SearchHotProps, SuggestInfoProps, LoginQRProps, BannerProps, PlaylistHotProps } from '@/interface'

const apiList = {
  // 搜索
  getSearchHot: '/search/hot',
  getSearchSuggest: '/search/suggest',
  // 登录登出
  getLoginKey: '/login/qr/key',
  getQR: '/login/qr/create',
  getQRRefresh: '/login/refresh',
  cellPhoneLogin: '/login/cellphone',
  getLogout: '/logout',
  // 获取用户信息
  getuserDetail: '/user/detail',
  // 获取banner
  getBanner: '/banner',
  // 获取热门歌分类
  getPlaylistHot: '/playlist/hot'
}

export interface apiKeyDataType {
  // 搜索
  getSearchHot: Promise<SearchHotProps>,
  getSearchSuggest: Promise<SuggestInfoProps>,
  // 登录登出
  getLoginKey: string,
  getQR: LoginQRProps,
  getQRRefresh: any,
  cellPhoneLogin: {
    code: number
    message?: string
    msg?: string,
    account?: any
    bindings?: any[]
    cookie?: string
    loginType?: number
    profile?: any
    token?: string
  },
  getLogout: {
    code: number
  },
  // 获取用户信息
  getuserDetail: any,
  // 获取banner
  getBanner: BannerProps
  // 获取热门歌分类
  getPlaylistHot: PlaylistHotProps
}

export type apiKeyType = keyof typeof apiList

export default apiList
