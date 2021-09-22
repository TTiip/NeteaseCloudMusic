<template>
  <div class="swiper-container w1200">
    <div class="swiper-wrapper">
      <div
        v-for="item of bannerList"
        :key="item.imageUrl"
        class="swiper-slide"
        @click="sliderItemClick(item)"
      >
        <div class="banner-item">
          <img
            :src="item.imageUrl"
            alt=""
          >
          <div class="type-title">
            {{ item.typeTitle }}
          </div>
        </div>
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
    // 循环
    loop: true,
    // 在slide之间设置距离（单位px）
    spaceBetween: 0,
    // slide的切换效果，默认为"slide"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）。
    effect: 'coverflow',
    // 鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。
    grabCursor: true,
    // 设定为true时，active slide会居中，而不是默认状态下的居左。
    centeredSlides: true,
    // 添加点击左右两个跳转至对应的banner图
    slideToClickedSlide: true,
    // 当swiper在触摸时阻止默认事件（preventDefault），用于防止触摸时触发链接跳转。
    preventClicks: false,
    // 阻止click冒泡。拖动Swiper时阻止click事件
    preventClicksPropagation: true,
    // 设置slider容器能够同时显示的slides数量(carousel模式)。
    slidesPerView: 1.32,
    autoplay: {
      // 自动切换的时间间隔，单位ms
      delay: 5000,
      // 如果设置为true，当切换到最后一个slide时停止自动切换。（loop模式下无效）。
      stopOnLastSlide: false,
      // 如果设置为false，用户操作swiper之后自动切换不会停止，每次都会重新启动autoplay。
      disableOnInteraction: false,
      // 开启此功能，鼠标置于swiper时暂停自动切换，鼠标离开时恢复自动切换。
      pauseOnMouseEnter: true
    },
    coverflowEffect: {
      // slide做3d旋转时Y轴的旋转角度
      rotate: 0,
      // 每个slide之间的拉伸值，越大slide靠得越紧。5.3.6 后可使用%百分比
      stretch: 0,
      // slide的位置深度。值越大z轴距离越远，看起来越小。
      depth: 200,
      // depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。
      modifier: 1,
      // 是否开启slide阴影
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
      router.push({ path: '/mvdetail', query: { id: item.targetId } })
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
