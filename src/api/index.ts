import { SearchHotProps, suggestInfoProps } from '@/interface'

const apiList = {
  getSearchHot: '/search/hot',
  getSearchSuggest: '/search/suggest',
  getLoginKey: '/login/qr/key',
  getQR: '/login/qr/create',
  getQRRefresh: '/login/refresh'
}

export interface apiKeyDataType {
  getSearchHot: Promise<SearchHotProps>,
  getSearchSuggest: Promise<suggestInfoProps>,
  getLoginKey: any,
  getQR: any,
  getQRRefresh: any
}

export type apiKeyType = keyof typeof apiList

export default apiList
