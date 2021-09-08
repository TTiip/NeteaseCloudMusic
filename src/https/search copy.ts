import axios from '@/axios'
import { SearchHotProps } from '@/interface'
import apiList, { apiKeyType, apiKeyDataType } from '@/api'

type ResultDataType = apiKeyDataType[apiKeyType]

class GetHttpFunc {
  constructor () {
    Object.keys(apiList).map((key: string) => {
      const funcMethod = apiList[key].method.toLocaleLowerCase()
      this[key] = (params = {}) => {
        let requestParams = {}
        if (funcMethod === 'get') {
          requestParams = {
            params
          }
        } else {
          requestParams = {
            data: params
          }
        }
        return axios[funcMethod]<Promise<ResultDataType>>(apiList[key].url, requestParams)
      }
    })
  }
}

const getSearchHot = (params: any = {}): Promise<SearchHotProps> => axios.get('/search/hot', { params })
const getSearchSuggest = (params: any = {}): any => axios.get('/search/suggest', { params })

// 接口
export {
  getSearchHot,
  getSearchSuggest
}

const HttpInstance = new GetHttpFunc()

export default HttpInstance
