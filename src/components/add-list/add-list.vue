<template>
  <div class="addList">
    <div class="list-mian">
      <div
        v-for="item in list"
        :key="item.id"
        class="list-item"
        @click="addPlayList(item)"
      >
        <el-image
          :src="item.coverImgUrl"
          class="cover-img"
        >
          <template #placeholder>
            <div class="image-slot">
              <i class="iconfont icon-placeholder" />
            </div>
          </template>
        </el-image>
        <div class="list-name">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import store from '@/store'
import axios from '@/axios'
import useMessage from '@/hooks/useMessage'

const props = defineProps({
  tracks: {
    type: String,
    default: () => ('')
  }
})

const emits = defineEmits(['closeAddListPop'])

/* data */
const list: any = ref([])
const limit = ref(30)
const offset = ref(0)

/* computed */
const userInfo = computed(() => store.state.userInfo)

/* mounted */
onMounted(() => {
  getUserPlayList()
})

/* methods */
const getUserPlayList = async () => {
  const getUserPlaylistData = await axios({
    url: 'getUserPlaylist',
    method: 'GET',
    params: {
      uid: userInfo.value.userId,
      limit: limit.value,
      offset: offset.value
    }
  })
  list.value = getUserPlaylistData.playlist.filter((item: any) => !item.subscribed)
}
const addPlayList = async (item: any) => {
  // 此处接口有问题，看桌面exe歌曲是添加成功了，但是返回错误导致列表无法关闭。
  await axios({
    url: 'getPlaylistTracks',
    method: 'GET',
    params: {
      op: 'add',
      pid: item.id,
      tracks: props.tracks
    }
  })
  emits('closeAddListPop')
  useMessage('success', '收藏成功')
}

</script>

<style scoped lang="less">
@import './index.less';
</style>
