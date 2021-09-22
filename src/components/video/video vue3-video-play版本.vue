<template>
  <div>
    <VideoPlay
      v-bind="options"
      poster="https://go.dreamwq.com/videos/ironMan.jpg"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import 'vue3-video-play/dist/style.css'
import VideoPlay from 'vue3-video-play'

defineProps({
  options: {
    type: Object,
    required: true
  }
})

const options = reactive({
  width: '800px', // 播放器高度
  height: '450px', // 播放器高度
  color: '#409eff', // 主题色
  title: '', // 视频名称
  src: 'https://go.dreamwq.com/videos/IronMan.mp4', // 视频源
  muted: false, // 静音
  webFullScreen: false,
  speedRate: ['0.75', '1.0', '1.25', '1.5', '2.0'], // 播放倍速
  autoPlay: false, // 自动播放
  loop: false, // 循环播放
  mirror: false, // 镜像画面
  ligthOff: false, // 关灯模式
  volume: 0.3, // 默认音量大小
  control: true, // 是否显示控制
  controlBtns: ['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'pip', 'pageFullScreen', 'fullScreen'] // 显示所有按钮,
})
</script>

<style lang="less" scoped></style>
