export default {
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
    const dt = new Date(dateString)
    const opt = {
      yyyy: dt.getFullYear(),
      MM: (dt.getMonth() + 1 + '').padStart(2, '0'),
      dd: (dt.getDate() + '').padStart(2, '0'),
      HH: (dt.getHours() + '').padStart(2, '0'),
      mm: (dt.getMinutes() + '').padStart(2, '0'),
      ss: (dt.getSeconds() + '').padStart(2, '0')
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
    const m = (Math.floor(duration / 60) + '').padStart(2, '0')
    const s = (Math.floor(duration % 60) + '').padStart(2, '0')
    return `${m}:${s}`
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
  }
}
