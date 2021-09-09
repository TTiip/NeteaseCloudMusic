interface StoreProps {
  isLoading: boolean,
  isLogin: boolean,
  userInfo: {
    avatarUrl: string
  }
}
interface Commom {
  code: number
  result: any
}

interface SearchHotItemProps {
  first: string
  iconType: number
  second: number
  third?: null
}
interface SearchHotProps extends Commom {
  result: {
    hots: SearchHotItemProps[]
  }
}
interface Album {
  id: number,
  name: string,
  artist: {},
  publishTime: number,
  size: number,
  copyrightId: number,
  status: number,
  picId: number,
  mark: number
}
interface SuggestInfoResult {
  albums: Album[]
  artists: any[]
  songs: any[]
  playlists: any[]
  order: any[]
}
interface SuggestInfoProps extends Commom {
  result: SuggestInfoResult
}

interface LoginQR extends Commom {
  data: {
    qrimg: string
    qrurl: string
  }
}

// interface
export {
  StoreProps,
  SearchHotItemProps,
  SearchHotProps,
  SuggestInfoProps,
  SuggestInfoResult,
  LoginQR
}
