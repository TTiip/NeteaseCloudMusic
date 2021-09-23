<template>
  <div style="text-align: center">
    <videoPlay
      ref="video"
      v-bind="options"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import videoPlay from '@/components/videoComponent/video/video.vue'

const options = reactive({
  width: '800px',
  height: '450px',
  color: '#ff641e',
  muted: false, // 静音
  webFullScreen: false,
  autoPlay: false, // 自动播放
  currentTime: 0,
  loop: false, // 循环播放
  mirror: false, // 镜像画面
  lightOff: false, // 关灯模式
  volume: 1, // 默认音量大小
  control: true, // 是否显示控制器
  title: '', // 视频名称
  // src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // 视频源
  src: 'http://vodkgeyttp8.vod.126.net/cloudmusic/mv/20171109073015/c85f270f-e0a1-4ed2-acca-a2f6a6e9b43b/eb16939544b818b4bde5a61d988b1d33.mp4?wsSecret=b6f4ec22787719d11cb4f07d57d30a36&wsTime=1632372530', // 视频源
  poster: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png', // 封面
  controlBtns: [
    'audioTrack',
    'quality',
    'speedRate',
    'volume',
    'setting',
    'pip',
    'pageFullScreen',
    'fullScreen'
  ]
})
const video = ref(null)

</script>

<style scoped>
</style>
