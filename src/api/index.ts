const apiList = {
  'getData': '/getData',
  'othersData': '/othersData'
}

export interface apiKeyDataType {
  'getData': {
    code: number;
    data: {
      name: string;
      age: number;
      work: string[]
    }
  },
  'othersData': {
    code: number;
    data: string[]
  }
}

export type apiKeyType = keyof typeof apiList

export default apiList
