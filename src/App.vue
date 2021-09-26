<template>
  <div
    v-if="isRouterAlive"
    id="container"
  >
    <el-container>
      <el-header height="80px">
        <Header />
      </el-header>
      <el-main>
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
      </el-main>
      <PlayBar />
    </el-container>
  </div>
  <teleport to="#loading">
    <Loading v-if="isLoading" />
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref, provide, nextTick } from 'vue'
import Loading from '@/components/loading/loading.vue'
import Header from '@/components/header/header.vue'
import PlayBar from '@/components/play-bar/play-bar.vue'
import store from '@/store'
import { getSessionStorage } from '@/hooks/useSessionStorage'

const isRouterAlive = ref(true)
const reload = () => {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}

provide('reload', reload)

// 回到顶部功能实现参考element源码backTop部分。
// 展示回到顶部按钮ref
const showBackTop: any = ref(null)
// 滚动条的高度
const scrollTop = ref(0)
// 计算每次滚动的比例。
const getScrollRatio = (value: number) => value < 0.5 ? 1 - Math.pow(value * 2, 3) / 2 : Math.pow((1 - value) * 2, 3) / 2

const backTopFunc = () => {
  const beginTime = Date.now()
  const beginValue = document.documentElement.scrollTop
  const rAF = window.requestAnimationFrame || ((func) => setTimeout(func, 16))
  const frameFunc = () => {
    // 通过调用时间和第一次触发时间的差值作为滚动的比例的参数
    const progress = (Date.now() - beginTime) / 500
    if (progress < 1) {
      document.documentElement.scrollTop = beginValue * getScrollRatio(progress)
      rAF(frameFunc)
    } else {
      document.documentElement.scrollTop = 0
    }
  }
  rAF(frameFunc)
}
const backTop = () => {
  backTopFunc()
}

const handleScroll = () => {
  scrollTop.value = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  // 如果滚动条滚动距离大于300 则显示返回顶部按钮
  if (Number(scrollTop.value) > 300) {
    showBackTop.value && (showBackTop.value.style.opacity = '1')
  } else {
    showBackTop.value && (showBackTop.value.style.opacity = '0')
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

<style lang='less'>
// 全局样式修改
  #body {
    .el-pagination {
      .el-pager {
        .active {
          background: @color-theme;
        }
        li:not(.active):hover {
          color: @color-theme;
        }
      }
    }
    .login {
      .el-button {
        background: @color-theme;
        border: 1px solid @color-theme;
      }
    }
  }
</style>
