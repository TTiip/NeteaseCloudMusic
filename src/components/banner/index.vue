<template>
  <div class="swiper-container w1200">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img
          src="http://p1.music.126.net/F2hTcWUCUXV4OtZYA9kr4A==/109951166370295682.jpg"
          alt=""
        >
      </div>
      <div class="swiper-slide">
        <img
          src="http://p1.music.126.net/F2hTcWUCUXV4OtZYA9kr4A==/109951166370295682.jpg"
          alt=""
        >
      </div>
      <div class="swiper-slide">
        <img
          src="http://p1.music.126.net/F2hTcWUCUXV4OtZYA9kr4A==/109951166370295682.jpg"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import Swiper, {
  Autoplay,
  EffectCoverflow,
  EffectCube,
  Pagination,
  Navigation
} from 'swiper'
// swiper-bundle.min.css 决定了小圆点和左右翻页标签，如果不需要可以不引用
import 'swiper/swiper-bundle.min.css'
// swiper.less/sass/css 决定了基础的样式
import 'swiper/swiper.less'

Swiper.use([Autoplay, EffectCoverflow, EffectCube, Pagination, Navigation])
onMounted(() => {
  /* eslint-disable no-new */
  new Swiper('.swiper-container', {
    // 循环
    loop: true,
    // 每张播放时长3秒，自动播放
    spaceBetween: 25,
    effect: 'coverflow',
    // 鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。
    grabCursor: true,
    centeredSlides: true,
    // 添加点击左右两个跳转至对应的banner图
    slideToClickedSlide: true,
    slidesPerView: 1.32,
    autoplay: {
      delay: 3000,
      stopOnLastSlide: false,
      disableOnInteraction: false
    },
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    }
  })
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
