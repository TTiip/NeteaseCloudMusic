<template>
  <div
    v-infinite-scroll="loadMore"
    class="wrapper infinite-list"
    infinite-scroll-distance="50"
  >
    <playList :play-list="list" />
    <div
      v-loading="isLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="width: 100%;margin-bottom: 10px"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import axios from '@/axios'
import playList from '@/components/play-list/play-list.vue'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  },
  // 是否有滚动条
  isScroll: {
    type: Boolean,
    default: false
  }
})

/* data */
const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`

const list: any = ref([])
const isLoading: any = ref(false)

/* watch */
watch(() => props.params, (newVal, oldVal) => {
  if (newVal.cat !== oldVal.cat) {
    list.value = []
  }
  getPlayList(newVal)
})

/* mounted */
onMounted(() => {
  getPlayList(props.params)
})

/* methods */
const getPlayList = async (params: any) => {
  isLoading.value = true
  const getTopPlayListData = await axios({
    url: 'getTopPlayList',
    method: 'GET'
  })

  list.value = params.offset !== 0 ? [...list.value, ...getTopPlayListData.playlists] : getTopPlayListData.playlists
  isLoading.value = false
}
const loadMore = () => {
  if (props.isScroll) {
    props.params.offset = +list.value.length
    getPlayList(props.params)
  }
}
</script>

<style scoped lang="less">
@import './index.less';
</style>
