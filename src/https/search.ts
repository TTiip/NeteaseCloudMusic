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

const getSearchHot = (): Promise<SearchHotProps> => axios.get('/search/hot')
// interface
export {
  SearchHotItemProps,
  SearchHotProps
}

// 接口
export {
  getSearchHot
}
