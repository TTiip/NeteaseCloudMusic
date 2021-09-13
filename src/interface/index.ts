interface StoreProps {
  isLoading: boolean,
  isLogin: boolean,
  userInfo: {
    avatarUrl: string
  }
}
interface Common {
  code: number
}

interface SearchHotItemProps {
  first: string
  iconType: number
  second: number
  third?: null
}
interface SearchHotProps extends Common {
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
interface SuggestInfoProps extends Common {
  result: SuggestInfoResultProps
}

interface LoginQRProps extends Common {
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

interface BannerProps extends Common {
  banners: BannerItemProps[]
}

interface PlaylistTagProps {
  id: number,
  name: string,
  category: number,
  usedCount: number,
  type: number,
  position: number,
  createTime: number,
  highQuality: number,
  highQualityPos: number,
  officialPos: number
}
interface PlaylistHotItem {
  playlistTag: PlaylistTagProps,
  activity: boolean,
  hot: boolean,
  usedCount: number,
  position: number,
  category: number,
  createTime: number,
  name: string,
  id: number,
  type: number
}

interface PlaylistHotProps extends Common {
  tags: PlaylistHotItem[]
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
  BannerProps,
  PlaylistTagProps,
  PlaylistHotItem,
  PlaylistHotProps
}
