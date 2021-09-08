
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
interface album {
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
interface suggestInfoResult {
  albums: album[]
  artists: any[]
  songs: any[]
  playlists: any[]
  order: any[]
}
interface suggestInfoProps extends Commom {
  result: suggestInfoResult
}

// interface
export {
  SearchHotItemProps,
  SearchHotProps,
  suggestInfoProps,
  suggestInfoResult
}
