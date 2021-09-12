interface StoreProps {
  isLoading: boolean,
  isLogin: boolean,
  userInfo: {
    avatarUrl: string
  }
}
interface Commom {
  code: number
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
  artist: any,
  publishTime: number,
  size: number,
  copyrightId: number,
  status: number,
  picId: number,
  mark: number
}
interface SuggestInfoResultProps {
  albums: Album[]
  artists: any[]
  songs: any[]
  playlists: any[]
  order: any[]
}
interface SuggestInfoProps extends Commom {
  result: SuggestInfoResultProps
}

interface LoginQRProps extends Commom {
  data: {
    qrimg: string
    qrurl: string
  }
}

interface BannerItemProps {
  imageUrl: string
  targetId?: number,
  adid?: string | null,
  targetType?: number,
  titleColor?: string,
  typeTitle?: string,
  url?: string | null,
  exclusive?: boolean,
  monitorImpress?: string | null,
  monitorClick?: string | null,
  monitorType?: string | null,
  monitorImpressList?: string | null,
  monitorClickList?: string | null,
  monitorBlackList?: string | null,
  extMonitor?: string | null,
  extMonitorInfo?: string | null,
  adSource?: string | null,
  adLocation?: string | null,
  adDispatchJson?: string | null,
  encodeId: string,
  program?: string | null,
  event?: string | null,
  video?: string | null,
  song?: string | null,
  scm?: string
}

interface BannerProps extends Commom {
  banners: BannerItemProps[]
}

// interface
export {
  StoreProps,
  SearchHotItemProps,
  SearchHotProps,
  SuggestInfoProps,
  SuggestInfoResultProps,
  LoginQRProps,
  BannerItemProps,
  BannerProps
}
