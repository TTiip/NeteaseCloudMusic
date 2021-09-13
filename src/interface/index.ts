interface StoreProps {
  isLoading: boolean
  isLogin: boolean
  userInfo: {
    avatarUrl: string
  }
}
interface Common {
  code?: number
  hasMore?: boolean
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
  id: number
  name: string
  artist: any
  publishTime: number
  size: number
  copyrightId: number
  status: number
  picId: number
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
  targetId?: number
  adid?: string | null
  targetType?: number
  titleColor?: string
  typeTitle?: string
  url?: string
  exclusive?: boolean
  monitorImpress?: string | null
  monitorClick?: string | null
  monitorType?: string | null
  monitorImpressList?: string | null
  monitorClickList?: string | null
  monitorBlackList?: string | null
  extMonitor?: string | null
  extMonitorInfo?: string | null
  adSource?: string | null
  adLocation?: string | null
  adDispatchJson?: string | null
  encodeId: string
  program?: string | null
  event?: string | null
  video?: string | null
  song?: string | null
  scm?: string
}

interface BannerProps extends Common {
  banners: BannerItemProps[]
}

interface PlaylistTagProps {
  id: number
  name: string
  category: number
  usedCount: number
  type: number
  position: number
  createTime: number
  highQuality: number
  highQualityPos: number
  officialPos: number
}
interface PlaylistHotItem {
  playlistTag?: PlaylistTagProps
  activity?: boolean
  hot?: boolean
  usedCount?: number
  position?: number
  category?: number
  createTime?: number
  name: string
  id?: number
  type?: number
}

interface PlaylistHotProps extends Common {
  tags: PlaylistHotItem[]
}

interface GetTopListItem {
  name: string
  id: number
  trackNumberUpdateTime: number,
  status: number
  userId: number
  createTime: number
  updateTime: number
  subscribedCount: number
  trackCount: number
  cloudTrackCount: number
  coverImgUrl: string
  coverImgId: number
  description: string
}

interface GetTopListProps extends Common {
  playlists: GetTopListItem[],
  total: number,
  more: boolean,
  cat: string
}

interface GetTopAlbumItem {
  songs: []
  paid: boolean
  onSale: boolean
  blurPicUrl: string
  commentThreadId: string
  publishTime: number
  picUrl: string
  briefDesc: ''
  picId: number
  artist: {
    img1v1Id: number
    topicPerson: number
    albumSize: number
    img1v1Url: string
    picUrl: string
    trans: string
    briefDesc: string
    picId: number
    followed: boolean
    musicSize: number
    alias: []
    name: string
    id: number
    'picId_str': string
    'img1v1Id_str': string
  }
  companyId: number
  company: string
  pic: number
  description: string
  tags: string
  status: number
  subType: string
  alias: []
  copyrightId: number
  artists: {
    img1v1Id: number
    topicPerson: number
    albumSize: number
    img1v1Url: string
    picUrl: string
    trans: string
    briefDesc: string
    picId: number
    followed: boolean
    musicSize: number
    alias: []
    name: string
    id: number
    'img1v1Id_str': string
    }[]
  name: string
  id: number
  type: string
  size: number
  'picId_str': string
  areaId: number
  exclusive: boolean
  isSub: boolean
}

interface GetTopAlbumProps extends Common {
  monthData: GetTopAlbumItem[]

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
  PlaylistHotProps,
  GetTopListItem,
  GetTopListProps,
  GetTopAlbumItem,
  GetTopAlbumProps
}
