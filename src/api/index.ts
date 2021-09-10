import { SearchHotProps, SuggestInfoProps, LoginQR } from '@/interface'

const apiList = {
  // 搜索
  getSearchHot: '/search/hot',
  getSearchSuggest: '/search/suggest',
  // 登录
  getLoginKey: '/login/qr/key',
  getQR: '/login/qr/create',
  getQRRefresh: '/login/refresh',
  cellPhoneLogin: '/login/cellphone'
}

export interface apiKeyDataType {
  getSearchHot: Promise<SearchHotProps>,
  getSearchSuggest: Promise<SuggestInfoProps>,
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
  }
}

export type apiKeyType = keyof typeof apiList

export default apiList
