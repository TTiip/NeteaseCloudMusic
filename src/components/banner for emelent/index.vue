<template>
  <div id="banner">
    <el-carousel
      :interval="4000"
      type="card"
      height="280px"
    >
      <el-carousel-item
        v-for="item of bannerList"
        :key="item.imageUrl"
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
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
// 还有bug -> 样式无法设置、首次渲染的时候第一页不显示，等待后续修复。
import { onMounted, ref } from 'vue'
import { BannerItemProps } from '@/interface'
import router from '@/router'
import axios from '@/axios'

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
})
</script>

<style>
@import './index.less';
</style>
