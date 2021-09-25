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
      style="width: 100%;margin-bottom: 10px;"
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
    method: 'GET',
    params
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
