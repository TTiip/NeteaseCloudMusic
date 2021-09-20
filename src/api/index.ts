import {
  SearchHotProps,
  SuggestInfoProps,
  LoginQRProps,
  BannerProps,
  PlaylistHotProps,
  GetTopListProps,
  GetTopAlbumProps,
  GetTopList,
  GetTopListDetail,
  GetMvFirst,
  GetTopArtists,
  GetLyric
} from '@/interface'

const apiList = {
  // 热门搜索
  getSearchHot: '/search/hot',
  // 输入条件搜索
  getSearchSuggest: '/search/suggest',
  // 获取二维码key
  getLoginKey: '/login/qr/key',
  // 获取二维码
  getQR: '/login/qr/create',
  // 轮询查询扫码状态
  getQRRefresh: '/login/refresh',
  // 手机登录
  cellPhoneLogin: '/login/cellphone',
  // 登出
  getLogout: '/logout',
  // 获取用户信息
  getuserDetail: '/user/detail',
  // 获取banner
  getBanner: '/banner',
  // 热门歌单分类
  getPlaylistHot: '/playlist/hot',
  // 获取热门歌单
  getTopPlayList: '/top/playlist',
  // 获取新碟上架
  getTopAlbum: '/top/album',
  // 获取排行榜
  getTopList: '/toplist',
  // 获取排行榜详情
  getTopListDetail: '/playlist/detail',
  // 获取 最新 mv
  getMvFirst: '/mv/first',
  // 获取首页热门歌手
  getTopArtists: '/top/artists',
  // 获取歌曲的歌词
  getLyric: '/lyric',
  // 喜欢音乐
  getLike: '/like',
  // 获取专辑内容
  getAlbum: '/album',
  // 调用此接口 , 传入专辑 id, 可获得专辑动态信息,如是否收藏,收藏数,评论数,分享数
  getAlbumDetail: '/album/detail/dynamic',
  // 调用此接口 , 传入歌手 id, 可获得歌手专辑内容
  getArtistAlbum: '/artist/album',
  // 调用此接口,可收藏/取消收藏专辑
  getAlbumSub: '/album/sub',
  // 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该音乐的所有评论 ( 不需要登录 )
  getCommentMusic: '/comment/music',
  // 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该 mv 的所有评论 ( 不需要 登录 )
  getCommentMv: '/comment/mv',
  // 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该专辑的所有评论 ( 不需要 登录 )
  getCommentAlbum: '/comment/album',
  // 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该 视频 的所有评论 ( 不需要登录 )
  getCommentVideo: '/comment/video',
  // 调用此接口,可发送评论或者删除评论
  getCommit: '/comment',
  // 调用此接口 , 传入 type, 资源 id, 和评论 id cid 和 是否点赞参数 t 即可给对 应评论点赞 ( 需要登录 )
  getCommitLike: '/comment/like',
  // 说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可 以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)
  // 但是返回的trackIds是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一次 song/detail 接口获取所有歌曲的详情
  getPlayListDetail: '/playlist/detail',
  // 调用此接口 , 传入歌单 id 可获取歌单的所有收藏者
  getPlayListSubscribers: '/playlist/subscribers',
  // 调用此接口 , 传入歌单 id 可获取歌单的所有收藏者
  getRelatedPlaylist: '/related/playlist',
  // 调用此接口 , 传入音乐 id 和 limit 参数 , 可获得该歌单的所有评论 ( 不需要 登录 )
  getCommentPlaylist: '/comment/playlist',
  // 调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情
  getSongDetail: '/song/detail',
  // 调用此接口 , 传入类型和歌单 id 可收藏歌单或者取消收藏歌单
  getPlaylistSubscribe: '/playlist/subscribe'
}

export interface apiKeyDataType {
  getSearchHot: Promise<SearchHotProps>,
  getSearchSuggest: Promise<SuggestInfoProps>,
  getLoginKey: string,
  getQR: Promise<LoginQRProps>,
  getQRRefresh: any,
  cellPhoneLogin: Promise<{
    code: number
    message?: string
    msg?: string,
    account?: any
    bindings?: any[]
    cookie?: string
    loginType?: number
    profile?: any
    token?: string
  }>,
  getLogout: Promise<{
    code: number
  }>,
  getuserDetail: any,
  getBanner: Promise<BannerProps>
  getPlaylistHot: Promise<PlaylistHotProps>,
  getTopPlayList: Promise<GetTopListProps>,
  getTopAlbum: Promise<GetTopAlbumProps>,
  getTopList: Promise<GetTopList>,
  getTopListDetail: Promise<GetTopListDetail>,
  getMvFirst: Promise<GetMvFirst>,
  getTopArtists: Promise<GetTopArtists>,
  getLyric: Promise<GetLyric>,
  // 此处不需要返回的接口做后续操作，偷个懒直接any
  getLike: Promise<any>,
  // 接口字段太多了，不想加了，直接全部any？
  getAlbum: Promise<any>,
  getAlbumDetail: Promise<any>,
  getArtistAlbum: Promise<any>,
  getAlbumSub: Promise<any>,
  getCommentMusic: Promise<any>,
  getCommentMv: Promise<any>,
  getCommentAlbum: Promise<any>,
  getCommentVideo: Promise<any>,
  getCommit: Promise<any>,
  getCommitLike: Promise<any>,
  getPlayListDetail: Promise<any>,
  getPlayListSubscribers: Promise<any>,
  getRelatedPlaylist: Promise<any>,
  getCommentPlaylist: Promise<any>,
  getSongDetail: Promise<any>,
  getPlaylistSubscribe: Promise<any>,
}

export type apiKeyType = keyof typeof apiList

export default apiList
