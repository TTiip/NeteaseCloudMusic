<template>
  <div>
    <VideoPlay
      v-bind="options"
      poster="https://go.dreamwq.com/videos/ironMan.jpg"
    />
  </div>
</template>

<script lang="ts" setup>
import 'vue3-video-play/dist/style.css'
import VideoPlay from 'vue3-video-play'

defineProps({
  options: {
    type: Object,
    required: true
  }
})
</script>

<style lang="less" scoped></style>
