<template>
  <div
    id="refPlayerWrap"
    ref="refPlayerWrap"
    class="d-player-wrap"
    :class="{
      'web-full-screen': state.webFullScreen,
      'is-lightoff': state.lightOff,
      'd-player-wrap-hover':
        state.playBtnState == 'play' || state.isVideoHovering,
    }"
    @mousemove="mouseMovewWarp"
  >
    <!-- 如果是移动端并且支持倍速 controls=true 否则为flase -->
    <div
      id="dPlayerVideo"
      class="d-player-video"
    >
      <!-- <div
        class="d-player-video-poster"
        v-show="props.poster && state.playBtnState == 'play' && state.currentTime == '00:00:00'"
      >
        <img :src="props.poster" :alt="props.title" />
      </div>-->
      <video
        id="dPlayerVideoMain"
        ref="refdVideo"
        class="d-player-video-main"
        :controls="isMobile && state.speed ? true : false"
        :class="{ 'video-mirror': state.mirror }"
        :webkit-playsinline="props.playsinline"
        :playsinline="props.playsinline"
        v-bind="videoEvents"
        :volume="state.volume"
        :muted="state.muted"
        :loop="state.loop"
        :preload="preload"
        width="100%"
        height="100%"
        :src="props.src"
        :poster="props.poster"
      >您的浏览器不支持Video标签。</video>
    </div>
    <!-- 缓冲动画 -->
    <!-- <d-waitingloading text="正在缓冲..." v-show="state.waitingLoading" /> -->

    <transition name="d-fade-in">
      <div
        v-show="state.lightOff"
        class="d-player-lightoff"
      />
    </transition>
    <!-- 全屏模式&&鼠标滑过 顶部显示的内容 -->
    <DPlayerTop
      v-if="state.fullScreen"
      :title="props.title"
    />
    <!-- 状态栏 移动端不显示-->
    <div
      v-if="!isMobile"
      class="d-player-state"
    >
      <transition name="d-scale-out">
        <!-- 播放按钮 -->
        <div
          v-show="state.playBtnState == 'play'"
          class="d-play-btn"
        >
          <DIcon
            icon="icon-play"
            :size="40"
          />
        </div>
      </transition>
      <!-- 操作信息通知 -->
      <DStatus :state="state" />
    </div>
    <!-- 移动端不显示 -->
    <input
      v-if="!isMobile"
      ref="refInput"
      type="input"
      readonly
      class="d-player-input"
      maxlength="0"
      @dblclick="toggleFullScreenHandle"
      @keyup.f="toggleFullScreenHandle"
      @keyup.esc="state.webFullScreen = false"
      @click="togglePlay"
      @keydown.space="togglePlay"
      @keyup="keypress"
      @keydown.arrow-left="keydownLeft"
      @keydown.arrow-up.arrow-down="volumeKeydown"
      @keydown="keypress"
    >
    <!-- 预加载动画 -->
    <DLoading :load-type="state.loadStateType" />
    <DContextmenu />
    <!-- PC端播放按钮控制器  移动端调用自带控制器-->
    <div
      v-if="!isMobile && state.control"
      ref="refPlayerControl"
      class="d-player-control"
    >
      <div class="d-control-progress">
        <DSlider
          v-model="state.playProgress"
          class="d-progress-bar"
          :disabled="!state.speed"
          :hover-text="state.progressCursorTime"
          :preload="state.preloadBar"
          @onMousemove="onProgressMove"
          @change="progressBarChange"
        />
      </div>

      <div
        class="d-control-tool"
        @click="inputFocusHandle"
      >
        <div class="d-tool-bar">
          <div
            class="d-tool-item"
            @click="togglePlay"
          >
            <DIcon
              size="24"
              :icon="`icon-${state.playBtnState}`"
            />
          </div>
          <!-- 播放器时间进度: 当前时间:总时间 -->
          <div
            v-if="props.controlBtns.includes('audioTrack')"
            class="d-tool-item d-tool-time audioTrack-btn"
          >
            <span>{{ state.currentTime }}</span>
            <span style="margin: 0 3px">/</span>
            <span class="total-time">{{ state.totalTime }}</span>
          </div>
        </div>
        <div class="d-tool-bar">
          <!-- 清晰度 -->
          <div
            v-if="state.qualityLevels.length && props.controlBtns.includes('quality')"
            class="d-tool-item quality-btn"
          >
            {{ state.qualityLevels.length && (state.qualityLevels[state.currentLevel] || {}).height }}P
            <div class="d-tool-item-main">
              <ul
                class="speed-main"
                style="text-align:center"
              >
                <li
                  v-for="(row,index) of state.qualityLevels"
                  :key="row"
                  :class="{ 'speed-active': state.currentLevel == index }"
                  @click="qualityLevelsHandle(row, index)"
                >
                  {{ row.height }}P
                </li>
              </ul>
            </div>
          </div>
          <!-- 倍速播放 -->
          <div
            v-if="props.controlBtns.includes('speedRate')"
            class="d-tool-item speedRate-btn"
          >
            {{ state.speedActive == "1.0" ? "倍速" : state.speedActive + "x" }}
            <div class="d-tool-item-main">
              <ul class="speed-main">
                <li
                  v-for="row of state.speedRate"
                  :key="row"
                  :class="{ 'speed-active': state.speedActive == row }"
                  @click="playbackRate(row)"
                >
                  {{ row }}x
                </li>
              </ul>
            </div>
          </div>
          <!-- 音量 -->
          <div
            v-if="props.controlBtns.includes('volume')"
            class="d-tool-item volume-btn"
          >
            <div
              class="d-tool-item-main volume-box"
              style="width: 52px"
            >
              <div
                class="volume-main"
                :class="{ 'is-muted': state.muted }"
              >
                <span class="volume-text-size">{{ state.muted ? 0 : ~~(state.volume * 100) }}%</span>
                <!-- @change 如果修改音量则取消静音 -->
                <DSlider
                  v-model="state.volume"
                  :hover="false"
                  size="5px"
                  :vertical="true"
                  @change="state.muted = false"
                />
              </div>
            </div>
            <span
              style="display: flex"
              @click="mutedHandler"
            >
              <DIcon
                size="20"
                :icon="`icon-volume-${state.volume == 0 || state.muted
                  ? 'mute'
                  : state.volume > 0.5
                    ? 'up'
                    : 'down'
                }`"
              />
            </span>
          </div>
          <!-- 设置 -->
          <div
            v-if="props.controlBtns.includes('setting')"
            class="d-tool-item setting-btn"
          >
            <DIcon
              size="20"
              class="rotateHover"
              icon="icon-settings"
            />
            <div class="d-tool-item-main">
              <ul class="speed-main">
                <li>
                  镜像画面
                  <DSwitch
                    v-model="state.mirror"
                    @change="mirrorChange"
                  />
                </li>
                <li>
                  循环播放
                  <DSwitch
                    v-model="state.loop"
                    @change="loopChange"
                  />
                </li>
                <li>
                  关灯模式
                  <DSwitch
                    v-model="state.lightOff"
                    @change="lightOffChange"
                  />
                </li>
              </ul>
            </div>
          </div>
          <!-- 画中画 -->
          <div
            v-if="props.controlBtns.includes('pip')"
            class="d-tool-item pip-btn"
            @click="requestPictureInPictureHandle"
          >
            <DIcon
              size="20"
              icon="icon-pip"
            />
            <div class="d-tool-item-main">
              画中画
            </div>
          </div>
          <!-- 网页全屏 -->
          <div
            v-if="props.controlBtns.includes('pageFullScreen')"
            class="d-tool-item pip-btn"
            @click="state.webFullScreen = !state.webFullScreen"
          >
            <DIcon
              size="20"
              icon="icon-web-screen"
            />
            <div class="d-tool-item-main">
              网页全屏
            </div>
          </div>
          <!-- 全屏 -->
          <div
            v-if="props.controlBtns.includes('fullScreen')"
            class="d-tool-item fullScreen-btn"
            @click="toggleFullScreenHandle"
          >
            <div class="d-tool-item-main">
              全屏
            </div>
            <DIcon
              size="20"
              icon="icon-screen"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
</script>
<script setup lang="ts">
import {
  reactive,
  ref,
  onMounted,
  useAttrs,
  watch,
  nextTick
} from 'vue'
import { debounce } from 'throttle-debounce'
import HlsJs from 'hls.js'
import DIcon from '../components/d-icon.vue'
import DPlayerTop from '../components/d-player-top.vue'
import DStatus from '../components/d-status.vue' // 倍速播放状态
import DSwitch from '../components/d-switch.vue' // switch
import DLoading from '../components/d-loading.vue' // loading
import DSlider from '../components/d-slider.vue' // slider
import DContextmenu from '../components/d-contextmenu.vue' // slider
import {
  hexToRgba,
  timeFormat,
  requestPictureInPicture,
  toggleFullScreen,
  isMobile,
  firstUpperCase
} from '../utils/util'
import { videoEmits, videoDefineProps } from './plugins/index'

const props = defineProps(videoDefineProps) // props
const emits = defineEmits([
  'mirrorChange',
  'loopChange',
  'lightOffChange',
  'durationchange',
  'progress',
  'timeupdate'
]) // emits

const refPlayerWrap: any = ref(null) // wrap
const refdVideo: any = ref(null) // 视频播放器
const refPlayerControl: any = ref(null) // 播放器控制器
const refInput: any = ref(null) // 快捷键操作
const Hls: any = ref(null)
const state: any = reactive({
  ...props, // 如果有自定义配置就会替换默认配置
  dVideo: null,
  muted: props.muted,
  playBtnState: props.autoPlay ? 'pause' : 'play', // 播放按钮状态
  loadStateType: 'loadstart', // 加载状态类型 //loadstart初始化  waiting缓冲 ended播放结束
  fullScreen: false,
  handleType: '', // 当前操作类型
  // 当前播放时间
  currentTime: '00:00:00',
  // 当前缓冲进度
  preloadBar: 0,
  // 总时长
  totalTime: '00:00:00',
  isVideoHovering: true,
  speedActive: '1.0', // 倍速
  playProgress: 0, // 播放进度
  isMultiplesPlay: false, // 是否倍速播放
  longPressTimeout: null,
  progressCursorTime: '00:00:00', // 进度条光标时间
  qualityLevels: [
    // {
    //   height: 240
    // },
    // {
    //   height: 480
    // },
    // {
    //   height: 640
    // },
    // {
    //   height: 720
    // },
    // {
    //   height: 1080
    // }
  ], // 分辨率数组，网易接口目前还没提供暂时不弄。
  currentLevel: 0 // 首选分辨率
})
const compose =
  (...args: any) =>
    (value: any) => {
      console.log(value, 'value')
      console.log(args.reverse(), 'args.reverse()')
      console.log(...args, '...args')
      return args.reverse().reduce((acc: any, fn: any) => fn(acc), value)
    }
// 收集video事件
const videoEvents: any = videoEmits.reduce((events, emit: any) => {
  const name = `on${firstUpperCase(emit)}`
  events[name] = (ev: any) => {
    state.loadStateType = emit
    emits(emit, ev)
  }

  return events
}, {})
// 可以播放
videoEvents['onCanplay'] = compose(videoEvents['onCanplay'], () => {
  if (state.playBtnState !== 'play') {
    // 如果是自动播放 则显示暂停按钮
    state.dVideo.play()
  }
  if (state.autoPlay) {
    // 如果是自动播放 则显示暂停按钮
    state.dVideo.play()
    state.playBtnState = 'pause'
  }
})
// 播放结束// 合并函数
videoEvents['onEnded'] = compose(videoEvents['onEnded'], () => {
  state.playBtnState = 'replay' // 此时的控制按钮应该显示重新播放
})

// 资源长度改变
videoEvents['onDurationchange'] = (ev: any) => {
  emits('durationchange', ev)
  if (props.currentTime !== 0) {
    state.dVideo.currentTime = props.currentTime
  }

  // 更新当前时长的所有状态
  videoEvents.onTimeupdate(ev)
}

// 缓冲下载中
videoEvents['onProgress'] = (ev: any) => {
  emits('progress', ev)
  const duration = ev.target.duration // 媒体总长
  const length = ev.target.buffered
  const end = ev.target.buffered.length && ev.target.buffered.end(length - 1)
  state.preloadBar = end / duration // 缓冲比例
}

// 当前播放进度
videoEvents['onTimeupdate'] = (ev: any) => {
  emits('timeupdate', ev)
  const duration = ev.duration || ev.target.duration || 0 // 媒体总长
  const currentTime = ev.currentTime || ev.target.currentTime // 当前媒体播放长度
  state.playProgress = currentTime / duration // 播放进度比例
  state.currentTime = timeFormat(currentTime)
  state.totalTime = timeFormat(duration)
}
// error
videoEvents['onError'] = compose(videoEvents['onError'], () => {
  state.playBtnState = 'replay' // 此时的控制按钮应该显示重新播放
})

// 获取用户自定义事件
const attrs = useAttrs()
for (const emit in attrs) {
  videoEvents[emit] = attrs[emit]
}

// 把颜色格式化为rgb格式
const hexToRgbaColor = hexToRgba(state.color)
// 清空当前操作类型
const clearHandleType = debounce(500, () => {
  state.handleType = ''
})
// 音量 +++ --
const volumeKeydown = (ev: any) => {
  ev.preventDefault()
  if (ev.code === 'ArrowUp') {
    state.volume = state.volume + 0.1 > 1 ? 1 : state.volume + 0.1
  } else {
    state.volume = state.volume - 0.1 < 0 ? 0 : state.volume - 0.1
  }
  state.muted = false
  state.handleType = 'volume' // 操作类型  音量
  clearHandleType() // 清空 操作类型
}
const keydownLeft = (ev: any) => {
  if (!props.speed) return // 如果不支持快进快退s
  state.dVideo.currentTime =
    state.dVideo.currentTime < 10 ? 0.1 : state.dVideo.currentTime - 10
  videoEvents.onTimeupdate(state.dVideo)
  playHandle()
}
const keypress = (ev: any) => {
  ev.preventDefault()
  const pressType = ev.type
  if (ev.key === 'ArrowRight') {
    playHandle()
    if (pressType === 'keyup') {
      clearTimeout(state.longPressTimeout)
      // 如果不支持快进快退 如果关闭快进快退必须在没有长按倍速播放的情况下
      if (!props.speed && !state.longPressTimeout) return
      if (state.isMultiplesPlay) {
        // 如果倍速播放中
        state.dVideo.playbackRate = state.speedActive
        state.isMultiplesPlay = false
      } else {
        // 进度加10s
        state.dVideo.currentTime = state.dVideo.currentTime + 10
        videoEvents.onTimeupdate(state.dVideo)
      }
      // 如果长按5倍速播放
    } else if (pressType === 'keydown') {
      if (!props.speed) return // 如果不支持快进快退 也不能支持长按倍速播放
      if (state.isMultiplesPlay) {
        clearTimeout(state.longPressTimeout)
      }
      state.longPressTimeout = setTimeout(() => {
        state.isMultiplesPlay = true
        state.dVideo.playbackRate = 5
        state.handleType = 'playbackRate' // 操作类型 倍速播放
        clearHandleType() // 清空 操作类型
      }, 500)
    }
  }
}
// 聚焦到播放器
const inputFocusHandle = () => {
  if (isMobile) return
  refInput.value.focus()
}
// 播放方法
const playHandle = () => {
  state.loadStateType = 'play'
  state.dVideo.play().catch(() => {
    setTimeout(() => {
      state.playBtnState = 'replay'
      state.loadStateType = 'error'
    }, 500)
  })
  state.playBtnState = 'pause'
  // 播放后清空状态
  // state.loadStateType = ''
}
// 暂停
const pauseHandle = () => {
  // state.loadStateType = 'pause' // 暂停状态
  state.dVideo.pause()
  state.playBtnState = 'play' // 暂停后要显示播放按钮
}

// 播放暂停
const togglePlay = (ev: any) => {
  if (ev) ev.preventDefault()
  if (state.playBtnState === 'play' || state.playBtnState === 'replay') {
    // 点击播放按钮 或 重新播放按钮 后
    playHandle()
  } else if (state.playBtnState === 'pause') {
    // 点击暂停按钮后...
    pauseHandle()
  }
}

// 静音事件
const mutedHandler = () => {
  state.muted = !state.muted
  // 如果之前音量调整为0 取消静音时会把音量设置为5
  if (state.volume === 0) {
    state.volume = 0.05
  }
}

// 进度条事件
const progressBarChange = (ev: Event, val: any) => {
  const duration = state.dVideo.duration || state.dVideo.target.duration // 媒体总长
  state.dVideo.currentTime = duration * val
  if (state.playBtnState === 'play') {
    state.dVideo.play()
    state.playBtnState = 'pause'
  }
}
// 进度条移动
const onProgressMove = (ev: any, val: any) => {
  state.progressCursorTime = timeFormat(state.dVideo.duration * val)
}

// 隐藏控制器
const hideControl = debounce(2500, () => {
  state.isVideoHovering = false
})

const mouseMovewWarp = (ev: any) => {
  state.isVideoHovering = true
  hideControl()
}

// 播放清晰度
const qualityLevelsHandle = (row: any, index: any) => {
  console.log(Hls.value, 'Hls.value')
  // Hls.value.currentLevel = index
  state.currentLevel = index
}
// 播放速度
const playbackRate = (row: any) => {
  state.speedActive = row
  state.dVideo.playbackRate = row
}
// 镜像画面事件
const mirrorChange = (val: any) => {
  // console.log(val)
  emits('mirrorChange', val, state.dVideo)
}
// 是否循环事件
const loopChange = (val: any) => {
  // console.log(val)
  emits('loopChange', val, state.dVideo)
}
// 关灯事件
const lightOffChange = (val: any) => {
  // console.log(val)
  emits('lightOffChange', val, state.dVideo)
}

const requestPictureInPictureHandle = () => {
  requestPictureInPicture(state.dVideo)
}
// 全屏按钮
const toggleFullScreenHandle = () => {
  state.fullScreen = toggleFullScreen(refPlayerWrap.value)
}

const init = (): void => {
  // 如果url里面包含m3u8 则视为Hls解析数据源。
  if (HlsJs.isSupported() && props.src.includes('.m3u8')) {
    Hls.value = new HlsJs()
    Hls.value.loadSource(props.src)
    Hls.value.attachMedia(state.dVideo)
    // 视频加载完成以后做的操作
    // Hls.value.on(HlsJs.Events.MANIFEST_PARSED, function () {
    //   state.dVideo.play()
    // })
    // 视频加载出错以后做的操作
    // Hls.value.on(HlsJs.Events.ERROR, function () {})
  } else {
    // 否则视为video直接可以解析的数据源
    state.dVideo.src = props.src
    // 视频加载完成以后做的操作
    // state.dVideo.addEventListener('loadedmetadata', function () {
    //   state.dVideo.play()
    // })
  }
}

watch(() => props.src, () => {
  nextTick(() => {
    // 初始化
    init()
  })
}, { immediate: true })
onMounted(() => {
  state.dVideo = refdVideo
  inputFocusHandle()
})
defineExpose({
  play: playHandle, // 播放
  pause: pauseHandle, // 暂停
  togglePlay // 暂停或播放
})
</script>

<style lang="less" scoped>
@import "../style/reset.less";
@import "../style/transition.less";
@import "../style/animate.less";
@import "../style/base.less";
.d-player-wrap {
  --primary-color: v-bind(hexToRgbaColor);
  width: v-bind(width);
  height: v-bind(height);
}
@import "../style/vPlayer.less";
</style>
