class Song {
  protected id: ''
  protected name: ''
  protected mvId: ''
  protected singer: ''
  protected album: ''
  protected alia: ''
  protected duration: ''
  protected url: ''
  protected vip: ''
  protected license: ''
  protected publishTime: ''
  constructor ({
    id,
    name,
    mvId,
    singer,
    album,
    alia,
    duration,
    url,
    vip,
    license,
    publishTime
  }: {[props: string]: any}) {
    this.id = id
    this.name = name
    this.mvId = mvId
    this.singer = singer
    this.album = album
    this.alia = alia
    this.duration = duration
    this.url = url
    this.vip = vip
    this.license = license
    this.publishTime = publishTime
  }
}

const utils = {
  // 数字过万的处理
  formartNum (val: any) {
    let num: any = 0
    if (val > 9999) {
      num = Math.round(val / 10000 * 10) / 10 + '万'
    } else {
      num = val
    }

    return num
  },
  // 时间毫秒格式化处理 2020-10-30 09:30:00
  formartDate (dateString: any, format: any) {
    const date = new Date(dateString)
    const opt = {
      yyyy: date.getFullYear(),
      MM: (date.getMonth() + 1 + '').padStart(2, '0'),
      dd: (date.getDate() + '').padStart(2, '0'),
      HH: (date.getHours() + '').padStart(2, '0'),
      mm: (date.getMinutes() + '').padStart(2, '0'),
      ss: (date.getSeconds() + '').padStart(2, '0')
    }

    for (const k in opt) {
      const ret = new RegExp('(' + k + ')').exec(format)
      if (ret) {
        format = format.replace(ret[1], opt[k])
      }
    }

    return format
  },
  // 歌曲毫秒格式化处理 03:30
  formatSongTime (duration = 0) {
    duration = duration / 1000
    const min = (Math.floor(duration / 60) + '').padStart(2, '0')
    const second = (Math.floor(duration % 60) + '').padStart(2, '0')
    return `${min}:${second}`
  },
  // 评论时间格式化处理
  formatMsgTime (duration: any) {
    let result = ''
    const NOW = new Date()
    const PAST = new Date(duration)

    // 判断是当天的时间 显示格式 10：30
    if (NOW.toDateString() === PAST.toDateString()) {
      result = this.formartDate(duration, 'HH:mm')
      // 时间为当年 显示月日 时间戳
    } else if (PAST.getFullYear() === NOW.getFullYear()) {
      result = this.formartDate(duration, 'MM月dd日 HH:mm')
    } else {
      result = this.formartDate(duration, 'yyyy年MM月dd日')
    }

    return result
  },
  // 添加歌曲到播放列表，过滤重复的歌曲
  concatPlayList (newList = [], oldList = []) {
    const arr: any[] = [...oldList, ...newList]
    const map = new Map()
    for (const item of arr) {
      if (!map.has(item.id)) {
        map.set(item.id, item)
      }
    }
    return [...map.values()]
  },
  formatSongInfo (params: any) {
    return new Song({
      id: String(params.id),
      name: params.name,
      mvId: params.mv,
      singer: params.ar,
      album: params.al,
      alia: params.alia,
      vip: params.fee === 1,
      license: params.license,
      duration: utils.formatSongTime(params.dt),
      url: `https://music.163.com/song/media/outer/url?id=${params.id}.mp3`,
      publishTime: utils.formatMsgTime(params.publishTime)
    })
  }
}

export default utils
