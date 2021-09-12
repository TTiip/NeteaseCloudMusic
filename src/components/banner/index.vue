<template>
  <div class="swiper-container w1200">
    <div class="swiper-wrapper">
      <div
        v-for="item of bannerList"
        :key="item.imageUrl"
        class="swiper-slide"
        @click="sliderItemClick(item)"
      >
        <img
          :src="item.imageUrl"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import { BannerItemProps } from '@/interface'
import router from '@/router'
import axios from '@/axios'
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

// 渲染banner
const renderBanner = () => {
  Swiper.use([Autoplay, EffectCoverflow, EffectCube, Pagination, Navigation])
  /* eslint-disable no-new */
  new Swiper('.swiper-container', {
    // observer: true,
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
      // 自动切换的时间间隔，单位ms
      delay: 3000,
      // 如果设置为true，当切换到最后一个slide时停止自动切换。（loop模式下无效）。
      stopOnLastSlide: false,
      // 如果设置为false，用户操作swiper之后自动切换不会停止，每次都会重新启动autoplay。
      disableOnInteraction: false,
      // 开启此功能，鼠标置于swiper时暂停自动切换，鼠标离开时恢复自动切换。
      pauseOnMouseEnter: true
    },
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    }
  })
}
// banner点击事件。
const sliderItemClick = (item: BannerItemProps) => {
  switch (item.targetType) {
    case 1: // 单曲
      router.push({ path: '/song', query: { id: item.targetId } })
      break
    case 10: // 专辑
      router.push({ path: '/album', query: { id: item.targetId } })
      break
    case 1000: // 歌单
      router.push({ path: '/playlist', query: { id: item.targetId } })
      break
    case 1004: // MV
      router.push({ path: '/mv', query: { id: item.targetId } })
      break
    case 3000: // 外链
      window.open(item.url, '_blank')
      break
  }
}

// 虽然不建议这么使用但是好像可以使用，主要是不想调用的时候bannerList.list这样调用。
const bannerList = ref<BannerItemProps[]>([])
onMounted(async () => {
  const res = await axios({
    url: 'getBanner',
    method: 'GET'
  })
  bannerList.value = res.banners
  // 在数据加载完成以后使用 nextTick 去 调调取微任务渲染。
  nextTick(() => renderBanner())
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
