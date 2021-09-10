<template>
  <div class="swiper-container swiper2">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <img src="http://p1.music.126.net/F2hTcWUCUXV4OtZYA9kr4A==/109951166370295682.jpg" alt="" />
      </div>
      <div class="swiper-slide">
        <img src="http://p1.music.126.net/F2hTcWUCUXV4OtZYA9kr4A==/109951166370295682.jpg" alt="" />
      </div>
      <div class="swiper-slide">
        <img src="http://p1.music.126.net/F2hTcWUCUXV4OtZYA9kr4A==/109951166370295682.jpg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
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

export default defineComponent({
  name: 'Home',
  components: {},
  setup () {
    onMounted(() => {
      /* eslint-disable no-new */
      new Swiper('.swiper1', {
        pagination: {
          el: '.swiper-pagination'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          hideOnClick: true
        },
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        on: {
          navigationShow: function () {
            console.log('按钮显示了')
          }
        }
      })

      new Swiper('.swiper2', {
        // 循环
        loop: true,
        // 每张播放时长3秒，自动播放
        spaceBetween: 25,
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
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

      new Swiper('.swiper3', {
        loop: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        effect: 'cube',
        cubeEffect: {
          slideShadows: true,
          shadow: true,
          shadowOffset: 100,
          shadowScale: 0.6
        }
      })
    })
  }
})
</script>

<style lang="less" scoped>
.title {
  text-align: center;
  line-height: 50px;
}

.swiper-slide {
  img {
    width: 100%;
  }
}
</style>
