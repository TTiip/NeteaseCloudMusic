<template>
  <div class="video">
    <div id="mui-player" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeMount } from 'vue'

import 'mui-player/dist/mui-player.min.css'
import MuiPlayer from 'mui-player'
import MuiPlayerDesktopPlugin from 'mui-player-desktop-plugin'
import { customSetting, contextmenu } from './options'

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
})

console.log(props.options, 'props.options')

/* data */

// new以后的播放器实例
const player: any = ref(null)

/* computed */
const src = computed(() => props.options.sources.src)

/* watch */
watch(() => src.value, (newVal) => {
  console.log(newVal)
})

/* mounted */
onMounted(() => {
  // 更多配置 https://muiplayer.gitee.io/zh/
  const myPlayerInstance = new MuiPlayer({
    plugins: [
      new MuiPlayerDesktopPlugin({
        customSetting, // 设置组配置
        contextmenu // 右键菜单组配置
      })
    ],
    // 指定播放器容器
    container: '#mui-player',
    // 视频title
    title: '标题',
    // 视频播放的资源地址
    src: src.value,
    // 初始化是否网页全屏播放
    initFullFixed: false,
    // 是否循环播放
    autoplay: false,
    // 设置进度条拖动点的形状，可选 circula | square
    dragSpotShape: 'circula',
    // 视频大小与 video 容器的表现形式。可选 contain | cover
    objectFit: 'contain',
    // 主题颜色
    themeColor: '#ff641e'
  })

  // 监听播放器已创建完成
  myPlayerInstance.on('ready', (event: any) => {
    console.log(event)
  })

  // 返回按钮点击时触发， Tag：仅在非全屏模式下触发
  myPlayerInstance.on('back', (event: any) => {
    console.log(event)
  })

  // 播放发生错误
  myPlayerInstance.on('error', (event: any) => {
    console.log(event)
  })

  // 视频销毁事件
  myPlayerInstance.on('destory', (event: any) => {
    console.log(event)
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
