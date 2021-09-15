<template>
  <div>
    <div :class="['lyrics-main', lyricName]">
      <div
        v-if="lyricObj.length"
        ref="lyrics"
        class="lyrics"
        :style="transform"
      >
        <p
          v-for="(item, index) in lyricObj"
          :key="index"
          :class="[isCurLyric(index)]"
          @click="lyricClick(item)"
        >
          {{ item.txt }}
        </p>
      </div>
      <div
        v-else
        class="lyric-empty"
      >
        <p v-if="lyric">
          纯音乐，无歌词
        </p>
        <p v-else>
          歌词加载中......
        </p>
      </div>
    </div>
    <div
      v-if="local === 'page' && lyricObj.length > 6"
      class="lyric-more"
    >
      <p v-if="!isFull">
        ...
      </p>
      <span @click.stop="fullLyric">{{ isFull ? '收起' : '展开' }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from '@/axios'

const props = defineProps({
  lyricsId: {
    type: [Number, String],
    default: 0
  },
  currentTime: {
    type: Number,
    default: 0
  },
  local: {
    type: String,
    default: ''
  }
})

/* data */

const lyric = ref<string | boolean>('')
const lyricObj: any = ref([])
const curIndex = ref(0)
const isFull = ref(false)

/* computed */

const lyricName = computed(() => {
  return [props.local === 'page' ? 'page-lyrics' : '', isFull.value ? 'fullLyrics' : '']
})
const transform = computed(() => {
  if (curIndex.value > 6) {
    return `transform: translateY(-${30 * (curIndex.value - 6)}px)`
  } else {
    return 'transform: translateY(0)'
  }
})

/* watch */
watch(() => props.lyricsId, newVal => {
  console.log('sssss')
  lyric.value = ''
  lyricObj.value = []
  curIndex.value = 0
  getLyrics(newVal)
})
watch(() => props.currentTime, newVal => {
  // 无歌词的时候 不做动画滚动
  if (!lyricObj.value.length) {
    return
  }
  curIndex.value = findCurIndex(newVal) - 1
})

/* mounted */
// mounted的时候默认获取一次当前歌曲的歌词。
onMounted(() => {
  getLyrics(props.lyricsId)
})

/* methods */
const lyricClick = (lyricItem: string) => {
  console.log(lyricItem, 'lyricItem')
}
const isCurLyric = (index: any) => index === curIndex.value && !props.local ? 'active' : ''
const getLyrics = async (id: string | number) => {
  const getLyricData = await axios({
    url: 'getLyric',
    method: 'GET',
    params: {
      id
    }
  })
  formartLyric(getLyricData.lrc)
}
const formartLyric = (lrc: { version: number, lyric: string }) => {
  const lrcReg = /^\[(\d{2}):(\d{2}.\d{2,})\]\s*(.+)$/
  if (!lrc) {
    lyric.value = true
    return
  }
  const lyricLis = lrc.lyric.split('\n')

  lyric.value = lrc.lyric
  lyricLis.forEach((item: any) => {
    console.log(item, 'itemitemitem')
    const arr = lrcReg.exec(item)
    if (!arr) {
      return
    }
    lyricObj.value.push({ time: arr[1] * 60 * 1 + arr[2] * 1, txt: arr[3] })
    console.log(lyricObj.value, 'lyricObj.value')
  })

  // 根据时间轴重排顺序
  lyricObj.value.sort((a: any, b: any) => {
    return a.t - b.t
  })
}
const findCurIndex = (t: any) => {
  for (let i = 0; i < lyricObj.value.length; i++) {
    if (t <= lyricObj.value[i].time) {
      return i
    }
  }
  return lyricObj.value.length
}
// 页面歌词可以展开查看更多
const fullLyric = () => {
  isFull.value = !isFull.value
}
</script>
<style scoped lang="less">
@import './index.less';
</style>
