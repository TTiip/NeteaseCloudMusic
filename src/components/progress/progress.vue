<template>
  <div
    ref="progress"
    class="progress"
    @click.stop="point"
  >
    <div class="progress-line" />
    <div
      class="progress-bg"
      :style="{ width: progressWidth }"
    >
      <div
        class="progress-btn"
        @mousedown.self.stop="move"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'

defineProps({
  progressWidth: {
    type: String,
    default: () => ('0')
  }
})

const emit = defineEmits(['setProgressLine'])

const progress: any = ref(null)
// 进度条拖拽
const move = () => {
  document.onmousemove = (e: MouseEvent) => {
    setProgressLine(e, false)
  }
  // 拖拽进度条的时候 禁止页面文字选中
  document.body.onselectstart = function () { return false }
  document.onmouseup = function (e) {
    // 拖拽结束时候 设置当前音频时间
    setProgressLine(e)
    // 操作完成时情调相关的事件
    document.onmousemove = document.onmouseup = document.body.onselectstart = null
  }
  return false
}
// 点击音频进度条
const point = (e: Event) => {
  setProgressLine(e)
}
const setProgressLine = (e: any, flag = true) => {
  // 实时获取鼠标横坐标，若是超过进度条最大宽度，则值为进度条的宽度
  const curProgress = e.clientX - getOffsetLeft(progress.value) >=
    progress.value.offsetWidth
    ? progress.value.offsetWidth
    : (
      e.clientX - getOffsetLeft(progress.value) <= 0
        ? 0
        : e.clientX - getOffsetLeft(progress.value)
    )

  emit('setProgressLine', { val: curProgress / progress.value.offsetWidth, flag: flag })
}
// 获取元素到浏览器左侧距离
const getOffsetLeft = (progress: any) => {
  let oLeft = progress.offsetLeft
  // 需要考虑到该子元素定义过的父元素的位置
  let oParent = progress.offsetParent

  while (oParent !== null) {
    oLeft += oParent.offsetLeft
    oParent = oParent.offsetParent
  }

  return oLeft
}

</script>

<style scoped lang="less">
@import './index.less';
</style>
