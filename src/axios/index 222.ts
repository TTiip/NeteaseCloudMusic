import axios, { Method, AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosInterceptorManager, AxiosResponse } from 'axios'
import qs from 'qs'
import { apiKeyType, apiKeyDataType } from '@/api'

type ResultDataType = apiKeyDataType[apiKeyType]
interface NewAxiosInstance extends AxiosInstance {
  /*
  设置泛型T，默认为any，将请求后的结果返回变成AxiosPromise<T>
  */
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse<ResultDataType>>
  }
}

const http: NewAxiosInstance = axios.create({
  baseURL: '',
  timeout: 10 * 1000
})

// 请求拦截器
const QS_METHOD: Method[] = ['POST', 'post', 'PUT', 'put']
const GET_METHOD: Method[] = ['GET', 'get', 'DELETE', 'delete']
http.interceptors.request.use(response => {
  if (response.method && QS_METHOD.includes(response.method)) {
    // 这里只处理post请求，根据自己情况修改
    response.data = qs.stringify(response.data)
  } else if (response.method && GET_METHOD.includes(response.method)) {
    // 设置GET的请求参数
    response.params = qs.parse(response.data)
    response.data = undefined
  }
  return response
}, error => {
  return error
})

// 响应拦截器
http.interceptors.response.use(response => {
  return Promise.resolve(response)
}, error => {
  return error
})

export default http

export {
  Method,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosPromise,
  AxiosInterceptorManager,
  AxiosResponse
}
