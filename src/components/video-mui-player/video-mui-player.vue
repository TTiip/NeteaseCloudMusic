<template>
  <div class="video">
    <div id="mui-player" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'

import 'mui-player/dist/mui-player.min.css'
import MuiPlayer from 'mui-player'
import MuiPlayerDesktopPlugin from 'mui-player-desktop-plugin'

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['changeResolution'])

/* data */
// video实例
const myPlayerInstance: any = ref(null)
const currentTime = ref(null)
// 配置选项
const customSetting = [
  {
    customSetKey: 'Resolution',
    functions: '清晰度',
    model: 'select',
    show: true,
    zIndex: 0,
    childConfig: [
      // { functions: '蓝光1080P' },
      // { functions: '超清' },
      // { functions: '高清', selected: true },
      // { functions: '标清' }
    ],
    onToggle: (data: any, selected: any, back: any) => {
      emits('changeResolution', data)
      // 切换清晰度的时候记录当前播放时间
      currentTime.value = myPlayerInstance.value.video().currentTime
      // 选中当前点击的
      selected()
      // 返回上一级设置项，接受一个数字在xxx毫秒以后返回
      back(100)
    }
  }
]

// 邮件菜单
const contextmenu = [
  {
    name: 'copyPlayUrl',
    context: '复制视频链接',
    zIndex: 0,
    show: true,
    click: (close: any) => {
      console.log(close)
    }
  }
]

/* computed */
const src = computed(() => props.options.sources.src)
// change分辨率
customSetting.map(item => {
  if (item.customSetKey === 'Resolution') {
    item.childConfig = props.options.qualityList.map((it: any) => ({
      // 清晰度label
      functions: String(it.br),
      // 请求清晰度接口参数
      point: it.point,
      // 是否选中
      selected: it.br === props.options.quality.dl
    }))
    return item
  }
})

/* watch */
watch(() => src.value, (newVal) => {
  // 重新加载url
  myPlayerInstance.value.reloadUrl(newVal)
})

/* methods */
const _init = () => {
  // 更多配置 https://muiplayer.gitee.io/zh/
  myPlayerInstance.value = new MuiPlayer({
    plugins: [
      new MuiPlayerDesktopPlugin({
        customSetting, // 设置组配置
        contextmenu // 右键菜单组配置
      })
    ],
    // 指定播放器容器
    container: '#mui-player',
    // 初始化播放器宽度
    width: 'auto',
    // 初始化播放器高度
    height: 'auto',
    // 播放器容器是否自适应视频高度
    autoFit: true,
    // 视频title
    title: props.options.quality.name,
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
  myPlayerInstance.value.on('ready', () => {
    // 将记录的时间重新赋值。
    myPlayerInstance.value.video().currentTime = currentTime.value
    // 切换清晰度以后自动播放
    currentTime.value && myPlayerInstance.value.video() && myPlayerInstance.value.video().play()
  })

  // 当视频时长已更改时触发，只有当时长大于1时发生，单位为秒（s）
  myPlayerInstance.value.on('duration-change', ({ duration }: any) => {
    console.log(`总时长是：${duration} 秒`)
  })

  // 返回按钮点击时触发， Tag：仅在非全屏模式下触发
  myPlayerInstance.value.on('back', (event: any) => {
    console.log(event, 'back')
  })

  // 播放发生错误
  myPlayerInstance.value.on('error', (event: any) => {
    console.log('播放出错啦~ 错误信息：', event)
  })

  // 当用户在视频寻址时触发 (进度条修改时触发)
  myPlayerInstance.value.on('seek-progress', ({ percentage }: any) => {
    console.log(`当前播放百分比为：${percentage} %`)
  })

  // 视频销毁事件
  myPlayerInstance.value.on('destory', (event: any) => {
    console.log(event, 'destory')
  })
}

/* mounted */
onMounted(() => {
  _init()
})

</script>

<style scoped lang="less">
@import './index.less';
</style>

<style lang="less">
#mplayer-media-wrapper {
  .video-wrapper {
    video {
      max-height: 675px;
    }
  }
}
</style>
