import { SearchHotProps, SuggestInfoProps, LoginQRProps, BannerProps, PlaylistHotProps, TopListProps } from '@/interface'

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
  getPlaylistHot: '/playlist/hot',
  getTopPlaylist: '/toplist'
}

export interface apiKeyDataType {
  // 搜索
  getSearchHot: Promise<SearchHotProps>,
  getSearchSuggest: Promise<SuggestInfoProps>,
  // 登录登出
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
  // 获取用户信息
  getuserDetail: any,
  // 获取banner
  getBanner: Promise<BannerProps>
  // 获取热门歌分类
  getPlaylistHot: Promise<PlaylistHotProps>,
  getTopPlaylist: Promise<TopListProps>
}

export type apiKeyType = keyof typeof apiList

export default apiList
