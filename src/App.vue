<template>
  <div id="nav">
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> -->
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

const isLoading = computed(() => store.state.isLoading)
</script>

<style lang="less"></style>
