<template>
  <div class="video">
    <video
      ref="videoPlayer"
      class="video-js video-skin"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeMount, nextTick } from 'vue'
import 'video.js/dist/video-js.css'
import '@/assets/css/video.less'
import videoJS from 'video.js'
import videoZhCN from 'video.js/dist/lang/zh-CN.json'
// 设置播放器的语言
videoJS.addLanguage('zh-CN', videoZhCN)

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
})

console.log(props.options, 'props.options')

const emits = defineEmits([
  'ready',
  'loadstart',
  'progress',
  'loadedmetadata',
  'canplaythrough',
  'waiting',
  'play',
  'playing',
  'pause',
  'ended',
  'error',
  'seek',
  'seeking',
  'seeked',
  'ratechange',
  'timeupdate',
  'volumechange',
  'stalled',
  'qualityChange'])

/* data */
//
const videoPlayer: any = ref(null)
const opt = ref({
  playbackRates: [0.5, 1, 1.5, 2], // 播放速度
  controls: true,
  autoplay: true, // 如果true,浏览器准备好时开始播放。
  muted: false, // 默认情况下将会消除任何音频。
  loop: false, // 导致视频一结束就重新开始。
  preload: 'auto', // auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  // languages: {
  //   'zh-CN': {
  //     Play: '播放',
  //     Pause: '暂停',
  //     Mute: '静音',
  //     Unmute: '取消静音',
  //     'Playback Rate': '播放速度'
  //   }
  // },
  aspectRatio: '16:9', // 播放器的比例。用冒号分隔的两个数字（例如"16:9"或"4:3"）
  fluid: true, // 当true时，播放器将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
  // sources: [{
  //     type: '',
  //     src: '' // url地址
  // }],
  poster: '', // 你的封面地址
  notSupportedMessage: '此视频暂无法播放，请稍后再试', // 无法播放媒体源时显示的默认信息。
  controlBar: {
    currentTimeDisplay: true, // 当前播放时长
    timeDivider: true, // 当前播放时间与总时间的斜杆分隔符
    durationDisplay: true, // 总时长
    remainingTimeDisplay: false, // 是否显示剩下的时间
    volumePanel: { // 音量组件
      inline: false // 调整音量调方向为纵向或者横向
    },
    QualitySelector: true,
    children: [
      'playToggle', // 播放暂停按钮
      'volumePanel', // 音量按钮
      'progressControl', // 视频进度条
      'currentTimeDisplay', // 当前播放时长
      'timeDivider', //  ‘/’ 分隔符
      'durationDisplay', // 视频总时长
      'PlaybackRateMenuButton', // 播放速度
      'qualityButton', // 视频高清切换
      'fullscreenToggle' // 全屏按钮
    ]
  },
  qualityList: [], // 当前可播放视频的分辨率列表
  quality: {}, // 当前播放视频的分辨率
  qualityType: { // 视频分辨率分类
    240: '标清',
    360: '普清',
    480: '高清',
    720: '超清',
    1080: '1080P'
  },
  errorDisplay: false,
  posterImage: false,
  bigPlayButton: true,
  textTrackDisplay: false
})
// new以后的播放器实例
const player: any = ref(null)

/* computed */
const src = computed(() => props.options.sources.src)
console.log(props.options.sources, 'props.options.sources')
console.log(src.value, 'srcsrcsrcsrc')

/* watch */
watch(() => src.value, (newVal) => {
  console.log(src, 'sssssss')
  player.value.src(newVal)
  // 切换MV视频 直接播放
  player.value.play()
})

/* mounted */
onMounted(() => {
  nextTick(() => {
    const videoOptions = { ...opt.value, ...props.options }
    player.value = videoJS(videoPlayer.value, videoOptions, function onPlayerReady () {
      emits('ready', this, '视频加载完成')
      this.on('loadstart', () => {
        emits('loadstart', this, '开始请求数据')
      })
      this.on('progress', () => {
        emits('progress', this, '正在请求数据')
      })
      this.on('loadedmetadata', () => {
        emits('loadedmetadata', this, '获取资源长度完成')
      })
      this.on('canplaythrough', () => {
        emits('canplaythrough', this, '视频源数据加载完成')
      })
      this.on('waiting', () => {
        emits('waiting', this, '等待数据')
      })
      this.on('play', () => {
        emits('play', this, '视频开始播放')
      })
      this.on('playing', () => {
        emits('playing', this, '视频播放中')
      })
      this.on('pause', () => {
        emits('pause', this, '视频暂停播放')
      })
      this.on('ended', () => {
        emits('ended', this, '视频播放结束')
      })
      this.on('error', () => {
        emits('error', this, 'error')
      })
      this.on('seek', () => {
        emits('seek', this, '视频跳转')
      })
      this.on('seeking', () => {
        emits('seeking', this, '视频跳转中')
      })
      this.on('seeked', () => {
        emits('seeked', this, '视频跳转结束')
      })
      this.on('ratechange', () => {
        emits('ratechange', this, '播放速率改变')
      })
      this.on('timeupdate', () => {
        emits('timeupdate', this, '播放时长改变')
      })
      this.on('volumechange', () => {
        emits('volumechange', this, '音量改变')
      })
      this.on('stalled', () => {
        emits('stalled', this, '网速异常')
      })
      this.on('qualityChange', () => {
        emits('qualityChange', this, '高清视频切换')
      })
    })
  })
})

/* beforeMount */
onBeforeMount(() => {
  if (player.value) {
    player.value.dispose()
  }
})

</script>

<style scoped lang="less">
@import './index.less';
</style>
