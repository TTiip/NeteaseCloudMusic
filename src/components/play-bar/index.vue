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
          :class="[locked ? 'active': '']"
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
                v-for="(author, k) in curSongInfo.singer"
                :key="author.name"
                :to="{ path: '/singer', query: { id: author.id }}"
                class="song_author"
              >
                {{ k !== 0 ? ' / ' + author.name : author.name }}
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
                class="lyrics-container"
              >
                <h3 class="lyrics-header">
                  <span>歌词</span>
                  <i
                    class="iconfont icon-closed"
                    @click="lyricsHandle"
                  />
                </h3>
                <!-- <lyrics
                  :s-id="curSongInfo.id"
                  :current-time="currentTime"
                /> -->
              </div>
              <div
                v-show="playlistVisible"
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
                <!-- <song-list
                  :song-list="playList"
                  :is-scroll="true"
                  :height="400"
                  :type-size="'mini'"
                  :is-show-tips="false"
                /> -->
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import store, { SET_PLAYS_TATUS, SET_PLAY_LIST, SET_PLAY_INDEX } from '@/store'
import ProgressLine from '@/components/progress/index.vue'
import utils from '@/utils'
// import songList from '@/components/song-list.vue'
// import Lyrics from '@/components/lyrics.vue'

// 初始化音频准备
const initAudioReady = ref(false)
// 是否禁音
const isMuted = ref(false)
// 音频当前时长
const currentTime = ref(0)
// 音频总时长
const totalTime = ref(0)
// 音量值(0~1)
const volumeNum = ref(0.5)
// 取消禁音的时候，设置保留的上一次的音量值
const oldVolume = ref(0)
// 播放模式  0循环播放、1单曲循环、2随机播放
const playMode = ref(0)
const timer: any = ref(null)
const lyricsVisible = ref(false)
const playlistVisible = ref(false)
// 歌词弹窗时，固定播放条
const isLock = ref(false)
const locked = ref(false)
const lockName = ref('active')

// computed
const playIndex = computed(() => store.state.playIndex)
const playList = computed(() => store.state.playList)
const isPlayed = computed(() => store.state.isPlayed)
// 播放暂停按钮
const playIcon = computed(() => !isPlayed.value ? 'icon-audio-play' : 'icon-audio-pause')
// 是否静音
const mutedIcon = computed(() => isMuted.value ? 'icon-volume-active' : 'icon-volume')
// 播放模式
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
const curSongInfo: any = computed(() => playList.value[playIndex.value])

// methods
// 音频播放/暂停/上一首/下一首事件
const audioHandler = (type: string) => {
  if (type === 'play') {
    store.commit(SET_PLAYS_TATUS, isPlayed.value)
    store.commit(SET_PLAY_INDEX, playIndex.value)
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
  store.commit(SET_PLAYS_TATUS, true)
  totalTime.value = e.target.duration
}
// 音频播放结束 自动播放下一首
const endedSong = () => {
  if (playMode.value === 1) {
    loopSong()
  } else {
    changeSong('next')
  }
}
// 音频加载失败
const errorSong = () => {
  initAudioReady.value = false
  store.commit(SET_PLAYS_TATUS, false)
}
// 音量禁音及取消操作
const volumeHandler = () => {
  // isMuted.value = this.$refs.audio.muted = this.isMuted ? 0 : 1
  isMuted.value && (oldVolume.value = volumeNum.value)
  volumeNum.value = isMuted.value ? 0 : oldVolume.value
}
// 点击拖拽进度条，设置当前时间
const setAudioProgress = (params: any) => {
  initAudioReady.value = false
  currentTime.value = params.val * totalTime.value

  // 拖拽的时候，不实时更改音频的时间
  if (params.flag) {
    // this.$refs.audio.currentTime = params.val * this.totalTime
  }
}
// 点击拖拽音量条，设置当前音量
const setvolumeProgress = (params: any) => {
  volumeNum.value = params.val
  oldVolume.value = params.val
  // this.$refs.audio.volume = params.val
  // this.isMuted = this.$refs.audio.muted = params.val ? 0 : 1
}
// 切换播放模式
const changePlayMode = () => {
  playMode.value = playMode.value >= 2 ? 0 : playMode.value + 1
}
// 清空播放列表
const clearSonglist = () => {
  // window.localStorage.removeItem('playList')
  store.commit(SET_PLAY_LIST, [])
  store.commit(SET_PLAYS_TATUS, false)
  store.commit(SET_PLAY_INDEX, 0)
}
// 手动切换歌曲
const changeSong = (type: string) => { // type: prev/next  上一首/下一首
  if (playList.value.length !== 1) { // 若播放列表只有一首歌则单曲循环
    let index = playIndex.value
    if (playMode.value === 2) { // 随机模式
      index = Math.floor(Math.random() * playList.value.length - 1) + 1
    } else {
      if (type === 'prev') {
        index = index === 0 ? playList.value.length - 1 : --index
      } else {
        index = index >= playList.value.length - 1 ? 0 : ++index
      }
    }

    initAudioReady.value = false
    store.commit(SET_PLAYS_TATUS, false)
    store.commit(SET_PLAY_INDEX, index)
  } else {
    loopSong()
  }
}
// 单曲循环歌曲
const loopSong = () => {
  // this.$refs.audio.currentTime = 0
  // this.$refs.audio.play()
  store.commit(SET_PLAYS_TATUS, true)
}
const enterBar = () => {
  clearTimeout(timer.value)
  lockName.value = 'active'
}
const leaveBar = () => {
  // 点击锁住按钮，会触发mouseleave 事件 此时的e的值是 undefined  而正常通过鼠标移出的时候 e是个对象
  // if (!e) return
  if (!isLock.value && !locked.value) {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      lockName.value = isLock.value ? 'active' : ''
    }, 3000)
  }
}
const lockBar = () => {
  locked.value = !locked.value
  isLock.value = locked.value
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

</script>

<style scoped lang="less">
@import './index.less';
</style>
