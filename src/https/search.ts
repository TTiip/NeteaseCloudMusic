import axios from '@/axios'

interface SearchHotItemProps {
  first: string
  iconType: number
  second: number
  third?: null
}

interface SearchHotProps {
  code: number
  result: {
    hots: SearchHotItemProps[]
  }
}

const getSearchHot = (params: any = {}): Promise<SearchHotProps> => axios.get('/search/hot', { params })
const getSearchSuggest = (params: any = {}): any => axios.get('/search/suggest', { params })

// interface
export {
  SearchHotItemProps,
  SearchHotProps
}

// 接口
export {
  getSearchHot,
  getSearchSuggest
}
