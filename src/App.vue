<template>
  <div id="nav">
    <Header />
  </div>
  <router-view/>
  <teleport to="#loading">
    <Loading v-if="isLoading"/>
  </teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Loading from '@/components/loading/index.vue'
import Header from '@/components/header/index.vue'
import store from '@/store'
import { getSessionStorage } from '@/hooks/useSessionStorage'

const isLogin = getSessionStorage('isLogin') || false
const userInfo = getSessionStorage('userInfo') || '{}'
// 获取是否登录等相关信息
store.commit('setLogin', isLogin)
store.commit('setUserInfo', JSON.parse(userInfo))

const isLoading = computed(() => store.state.isLoading)
</script>

<style lang="less"></style>
