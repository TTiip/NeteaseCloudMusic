import { SearchHotProps, SuggestInfoProps, LoginQR } from '@/interface'

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
  getuserDetail: '/user/detail'
}

export interface apiKeyDataType {
  // 搜索
  getSearchHot: Promise<SearchHotProps>,
  getSearchSuggest: Promise<SuggestInfoProps>,
  // 登录登出
  getLoginKey: string,
  getQR: LoginQR,
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
  getuserDetail: any
}

export type apiKeyType = keyof typeof apiList

export default apiList
