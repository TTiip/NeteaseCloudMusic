<template>
  <div id="code">
    <canvas id='canvas'></canvas>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, defineProps } from 'vue'
import QRCode from 'qrcode'
const props = defineProps<{
  qrUrl: string
}>()

const useQrcode = () => {
  const canvas = document.getElementById('canvas')
  QRCode.toCanvas(canvas, props.qrUrl, (error: any) => {
    if (error) console.error(error)
    console.log('QRCode success!')
  })
}

onMounted(() => {
  useQrcode()
})
</script>
