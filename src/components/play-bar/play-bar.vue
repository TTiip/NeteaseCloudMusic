<template>
  <div
    v-if="curSongInfo"
    :class="['play-bar', lockName]"
    @mouseenter="enterBar"
    @mouseleave="leaveBar"
  >
    <div class="fold">
      <div
        class="fold-btn"
        @click="lockBar"
      >
        <i
          class="iconfont icon-lock"
          :class="[lockedBar ? 'active': '']"
        />
      </div>
    </div>
    <ProgressLine
      class="audioProgress"
      :progress-width="audioProgressWidth"
      @setProgressLine="setAudioProgress"
    />
    <div class="w1200">
      <audio
        ref="audio"
        preload="auto"
        :src="curSongInfo.url"
        @canplay="canplaySong"
        @playing="playSong"
        @ended="endedSong"
        @error="errorSong"
        @timeupdate="updateSongTime"
      />
      <el-row class="play-bar-inside">
        <el-col
          :span="7"
          class="bar-l"
        >
          <router-link :to="{ path: '/song', query: { id: curSongInfo.id }}">
            <el-image
              :src="curSongInfo.album.picUrl"
              class="bar-cover-img"
            >
              <template #placeholder>
                <div class="image-slot">
                  <i class="iconfont icon-placeholder" />
                </div>
              </template>
            </el-image>
          </router-link>
          <div class="bar-name">
            <router-link
              :to="{ path: '/song', query: { id: curSongInfo.id }}"
              class="song_name"
            >
              {{ curSongInfo.name }}
            </router-link>
            <p>
              <router-link
                v-for="(author, index) in curSongInfo.singer"
                :key="author.name"
                :to="{ path: '/singer', query: { id: author.id }}"
                class="song_author"
              >
                {{ index !== 0 ? ' / ' + author.name : author.name }}
              </router-link>
            </p>
          </div>
          <div class="bar-time">
            <span>{{ utils.formatSongTime(currentTime * 1000) }}</span> / {{ curSongInfo.duration }}
          </div>
        </el-col>
        <el-col
          :span="9"
          class="bar-m"
        >
          <div class="bar-control">
            <i
              class="iconfont icon-audio-prev"
              title="上一首"
              @click.stop="audioHandler('prev')"
            />
            <i
              :class="['iconfont', playIcon]"
              @click.stop="audioHandler('play')"
            />
            <i
              class="iconfont icon-audio-next"
              title="下一首"
              @click.stop="audioHandler('next')"
            />
          </div>
        </el-col>
        <el-col
          :span="8"
          class="bar-r"
        >
          <div class="bar-oper">
            <div class="volume-main">
              <i
                :class="['iconfont', mutedIcon]"
                title="音量"
                @click.stop="volumeHandler"
              />
              <ProgressLine
                class="volumeLine"
                :progress-width="volumeProgressWidth"
                @setProgressLine="setvolumeProgress"
              />
            </div>
            <i
              class="iconfont"
              :class="modeIcon.className"
              :title="modeIcon.title"
              @click.stop="changePlayMode"
            />
            <div
              v-clickoutside="popverClose"
              class="popver"
            >
              <div class="lyric">
                <span
                  class="lyric-btn"
                  title="歌词"
                  @click="lyricsHandle"
                >词</span>
              </div>
              <div
                class="playlist"
                @click="playlistHandle"
              >
                <i
                  class="iconfont icon-playlist"
                  title="播放列表"
                />
                <div class="playlist-num">
                  {{ 99 > playList.length ? playList.length : '99+' }}
                </div>
              </div>
              <div
                v-show="lyricsVisible"
                v-lockBody
                class="lyrics-container"
              >
                <h3 class="lyrics-header">
                  <span>歌词</span>
                  <i
                    class="iconfont icon-closed"
                    @click="lyricsHandle"
                  />
                </h3>
                <Lyrics
                  :lyrics-id="curSongInfo.id"
                  :current-time="currentTime"
                  @lyricClick="lyricClick"
                />
              </div>
              <div
                v-show="playlistVisible"
                ref="playlistContainer"
                v-lockBody
                class="playlist-container"
              >
                <h3 class="playlist-header">
                  <span>播放列表<em>(共{{ playList.length }}首)</em></span>
                  <div
                    class="delSonglist"
                    @click="clearSonglist"
                  >
                    <i
                      class="iconfont icon-del"
                      title="清空列表"
                    />清空列表
                  </div>
                </h3>
                <SongList
                  :song-list="playList"
                  :is-scroll="true"
                  :height="400"
                  type-size="mini"
                  :is-show-tips="false"
                />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import store from '@/store'
import ProgressLine from '@/components/progress/progress.vue'
import utils from '@/utils'
import SongList from '@/components/song-list/song-list.vue'
import Lyrics from '@/components/lyrics/lyrics.vue'
import { setLocalStorage } from '@/hooks/useLocalStorage'

// 初始化audio标签ref
const audio = ref<any>(null)
// 初始化音频准备
const initAudioReady = ref(false)
// 是否禁音
const isMuted = ref(false)
// 音频当前时长
const currentTime = ref(0)
// 音频总时长
const totalTime = ref(0)
// 音量值(0~1)
const volumeNum = ref(1)
// 取消禁音的时候，设置保留的上一次的音量值
const oldVolume = ref(0)
const timer: any = ref(null)
const lyricsVisible = ref(false)
const playlistVisible = ref(false)
// 歌词或者播放列表展示弹窗时，固定播放条
const isLock = ref(false)
// 固定palyBar组件
const lockedBar = ref(false)
const lockName = ref('')

/* computed */

// 播放模式  0循环播放、1单曲循环、2随机播放
const playMode = computed(() => store.state.playMode)
const playIndex = computed(() => store.state.playIndex)
const playList = computed(() => store.state.playList)
const isPlayed = computed(() => store.state.isPlayed)
// 播放暂停按钮
const playIcon = computed(() => !isPlayed.value ? 'icon-audio-play' : 'icon-audio-pause')
// 是否静音
const mutedIcon = computed(() => isMuted.value ? 'icon-volume-active' : 'icon-volume')
// 播放模式 0循环播放、1单曲循环、2随机播放
const modeIcon = computed(() => [{
  className: 'icon-loop',
  title: '循环模式'
}, {
  className: 'icon-single-cycle',
  title: '单曲循环'
}, {
  className: 'icon-shuffle',
  title: '随机播放'/*  */
}][playMode.value])
// 音频进度条长度
const audioProgressWidth = computed(() => currentTime.value / totalTime.value * 100 + '%')
const volumeProgressWidth = computed(() => volumeNum.value / 1 * 100 + '%')
const curSongInfo = computed(() => playList.value[playIndex.value])

/* methods */

// 歌词点击事件
const lyricClick = (lrcItem: any) => {
  currentTime.value = lrcItem.time
  audio.value.currentTime = lrcItem.time
}

// 音频播放/暂停/上一首/下一首事件
const audioHandler = (type: string) => {
  if (type === 'play') {
    store.commit('setPlayStatus', !isPlayed.value)
    store.commit('setPlayIndex', playIndex.value)
  } else {
    changeSong(type)
  }
}
// 监听音频时间， 实时更新当前播放时间
const updateSongTime = (e: any) => {
  if (!initAudioReady.value) {
    return
  }
  currentTime.value = e.target.currentTime
}
// 解决刷新页面时候，音频准备就绪
const canplaySong = () => {
  initAudioReady.value = true
}
// 音频播放时候 初始化状态，获取音频总时长
const playSong = (e: any) => {
  initAudioReady.value = true
  store.commit('setPlayStatus', true)
  totalTime.value = e.target.duration
}
// 音频播放结束 自动播放下一首
const endedSong = () => {
  if (Number(playMode.value) === 1) {
    loopSong()
  } else {
    changeSong('next')
  }
}
// 音频加载失败
const errorSong = () => {
  initAudioReady.value = false
  store.commit('setPlayStatus', false)
}
// 音量禁音及取消操作
const volumeHandler = () => {
  isMuted.value = audio.value.muted = !isMuted.value
  isMuted.value && (oldVolume.value = volumeNum.value)
  volumeNum.value = isMuted.value
    ? 0
    : oldVolume.value === 0
      ? 1
      : oldVolume.value

  // 如果禁用的时候音量为0这直接设置成1
  audio.value.volume = volumeNum.value
}
// 点击拖拽进度条，设置当前时间
const setAudioProgress = (params: any) => {
  initAudioReady.value = false
  currentTime.value = params.val * totalTime.value

  // 拖拽的时候，不实时更改音频的时间
  if (params.flag) {
    audio.value.currentTime = params.val * totalTime.value
  }
}
// 点击拖拽音量条，设置当前音量
const setvolumeProgress = (params: any) => {
  volumeNum.value = params.val
  oldVolume.value = params.val
  audio.value.volume = params.val
  isMuted.value = audio.value.muted = !params.val
}
// 切换播放模式
const changePlayMode = () => {
  // 这里不建议直接写在下方的赋值，因为在判断逻辑之后还会在执行一次，影响结果。
  let mode = Number(playMode.value) + 1
  mode > 2 && (mode = 0)
  // 修改vuex中的模式
  store.commit('setPlayMode', mode)
  // 设置 localStorage 中的 playMode值
  setLocalStorage('playMode', mode)
}
// 清空播放列表
const clearSonglist = () => {
  // window.localStorage.removeItem('playList')
  store.commit('setPlayList', [])
  store.commit('setPlayStatus', false)
  store.commit('setPlayIndex', 0)
}
// 手动切换歌曲
// type: prev/next  上一首/下一首
const changeSong = (type: string) => {
  // 若播放列表只有一首歌则单曲循环
  if (playList.value.length !== 1) {
    let index = Number(playIndex.value)
    if (Number(playMode.value) === 2) {
      // 随机模式
      // 先减一在加一： 因为只能向下取整，不能丢掉index为0的歌，所以就要最后—+1
      // 但是直接取整在加一，会出现第十首歌index是9但是存入的index变成10从而使播放器出现问题。
      // 如果直接在赋值的时候减一会导致大概率少最后一首歌。
      index = Math.floor(Math.random() * playList.value.length - 1) + 1
    } else {
      if (type === 'prev') {
        index = index === 0 ? playList.value.length - 1 : --index
      } else {
        index = index >= playList.value.length - 1 ? 0 : ++index
      }
    }

    initAudioReady.value = false
    store.commit('setPlayStatus', false)
    store.commit('setPlayIndex', index)
  } else {
    loopSong()
  }
}
// 单曲循环歌曲
const loopSong = () => {
  audio.value.currentTime = 0
  audio.value.play()
  store.commit('setPlayStatus', true)
}
const enterBar = () => {
  clearTimeout(timer.value)
  lockName.value = 'active'
}
const leaveBar = () => {
  if (!isLock.value && !lockedBar.value) {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      lockName.value = isLock.value ? 'active' : ''
    }, 3000)
  }
}
const lockBar = () => {
  lockedBar.value = !lockedBar.value
  isLock.value = lockedBar.value
  leaveBar()
}
const lyricsHandle = () => {
  lyricsVisible.value = !lyricsVisible.value
  playlistVisible.value = false
  isLock.value = lyricsVisible.value
}
const playlistHandle = () => {
  playlistVisible.value = !playlistVisible.value
  lyricsVisible.value = false
  isLock.value = playlistVisible.value
}
const popverClose = () => {
  lyricsVisible.value = playlistVisible.value = isLock.value = false
  leaveBar()
}

/* watch */

watch(() => curSongInfo.value, (newVal, olVal) => {
  if (!olVal || (olVal && newVal?.id === olVal?.id)) {
    return
  }
  // 当前播放歌曲变化的时候  重置状态及当前播放的时长
  initAudioReady.value = false
  currentTime.value = 0
  nextTick(() => {
    if (audio.value) {
      audio.value.play()
    }
  })
})
watch(() => isPlayed.value, (newVal) => {
  // 等待音频加载成功完成后播放
  if (!initAudioReady.value) {
    return
  }
  nextTick(() => {
    if (audio.value) {
      newVal ? audio.value.play() : audio.value.pause()
    }
  })
})

</script>

<style scoped lang="less">
@import './index.less';
</style>
