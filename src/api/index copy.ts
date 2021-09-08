import { SearchHotProps } from '@/interface'

const apiList = {
  getSearchHot: {
    method: 'GET',
    url: '/search/hot'
  },
  getSearchSuggest: {
    method: 'GET',
    url: '/search/suggest'
  }
}

interface apiKeyDataType {
  'getSearchHot': Promise<SearchHotProps>,
  'getSearchSuggest': any
}

// typekey
type apiKeyType = keyof typeof apiList

// interface
export {
  apiKeyType,
  apiKeyDataType
}

export default apiList
