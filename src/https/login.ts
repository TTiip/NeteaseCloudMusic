import axios, { AxiosResponse } from '@/axios'

const getLoginKey = (): any => axios.get('/login/qr/key')
const getQR = async (): Promise<AxiosResponse> => {
  // 优先调用获取key的接口加上时间戳，避免缓存。
  const key = await getLoginKey()
  return axios.get('/login/qr/create', { params: { key, qrimg: true } })
}
const getRefesh = (params: any = {}): any => axios.get('/login/refresh', { params })

// 接口
export {
  getQR,
  getRefesh
}
