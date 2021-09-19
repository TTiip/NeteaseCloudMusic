<template>
  <div id="container">
    <Header />
    <div class="layout">
      <router-view />
      <div
        ref="showBackTop"
        class="back-top"
        @click="backTop"
      >
        <img
          src="./assets/goTop.png"
          alt=""
        >
      </div>
    </div>
    <PlayBar />
  </div>
  <teleport to="#loading">
    <Loading v-if="isLoading" />
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import Loading from '@/components/loading/loading.vue'
import Header from '@/components/header/header.vue'
import PlayBar from '@/components/play-bar/play-bar.vue'
import store from '@/store'
import { getSessionStorage } from '@/hooks/useSessionStorage'

// 展示回到顶部按钮ref
const showBackTop: any = ref(null)
// 滚动条的高度
const scrollTop = ref(0)

const backTopFunc = () => {
  document.body.scrollTop = document.documentElement.scrollTop = 0
  // if (document.documentElement.scrollTop >= 0) {
  //   document.body.style.transform = `translateY(${scrollTop.value -= 10}px)`
  // }
  // window.requestAnimationFrame(backTopFunc)
}
const backTop = () => {
  backTopFunc()
}

const handleScroll = () => {
  scrollTop.value = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  // 如果滚动条滚动距离大于300 则显示返回顶部按钮
  if (Number(scrollTop.value) > 300) {
    showBackTop.value.style.opacity = '1'
  } else {
    showBackTop.value.style.opacity = '0'
  }
}

window.addEventListener('scroll', handleScroll, true)

const isLogin = getSessionStorage('isLogin') || false
const userInfo = getSessionStorage('userInfo') || '{}'
// 获取是否登录等相关信息
store.commit('setLogin', isLogin)
store.commit('setUserInfo', JSON.parse(userInfo))

const isLoading = computed(() => store.state.isLoading)
</script>

<style lang="less">
@import './App.less';
</style>
