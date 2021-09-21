<template>
  <div class="rank">
    <div class="w1200">
      <div class="rank-container">
        <div class="rank-aside">
          <div class="rank-type">
            <div class="type-hd">
              <span
                :class="type === 'Top' ? 'active' : ''"
                @click="selectType('Top')"
              >TOP榜</span>
              <span
                :class="type === 'Feature' ? 'active' : ''"
                @click="selectType('Feature')"
              >特色榜</span>
              <span
                :class="type === 'Other' ? 'active' : ''"
                @click="selectType('Other')"
              >场景榜</span>
            </div>
            <div class="type-main">
              <div
                v-for="(item, index) in list"
                :key="index"
                class="type-item"
                :class="rId == item.id ? 'active' : ''"
                @click="selectItem(item)"
              >
                <el-image
                  class="item-img"
                  :src="item.coverImgUrl"
                >
                  <template #placeholder>
                    <div class="image-slot">
                      <i class="iconfont icon-placeholder" />
                    </div>
                  </template>
                </el-image>
                <div class="item-info">
                  <div class="item-title">
                    {{ item.name }}
                  </div>
                  <div class="item-time">
                    {{ item.updateFrequency }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rank-main">
          <div class="rank-list-hd">
            <el-image
              class="rank-img"
              :src="rankInfo.coverImgUrl"
            >
              <template #placeholder>
                <div class="image-slot">
                  <i class="iconfont icon-placeholder" />
                </div>
              </template>
            </el-image>
            <div
              v-if="rankInfo"
              class="rank-info"
            >
              <div class="rank-title">
                {{ rankInfo.name }} <span>({{ utils.formartDate(rankInfo.updateTime, 'MM月dd日') }} 更新)</span>
              </div>
              <div
                v-if="rankInfo.tags"
                class="rank-tags"
              >
                <router-link
                  v-for="(tag, index) in rankInfo.tags"
                  :key="index"
                  :to="{ path: '/playlist', query: { cat: tag }}"
                  class="tag"
                >
                  #{{ tag }}
                </router-link>
              </div>
              <div class="rank-digital">
                <span class="rank-playCount"><i class="iconfont icon-playnum" /> {{ utils.formartNum(rankInfo.playCount) }}次</span>
                <span class="rank-collect"><i class="iconfont icon-collect" /> {{ utils.formartNum(rankInfo.subscribedCount) }}</span>
                <span class="rank-comment"><i class="iconfont icon-comment" /> {{ utils.formartNum(rankInfo.commentCount) }}</span>
              </div>
              <div class="rank-desc">
                {{ rankInfo.description }}
              </div>
            </div>
          </div>
          <div class="song-header">
            <h4>歌曲列表 <em>{{ total + '首歌' }}</em></h4>
            <span
              class="play-all"
              @click="playAllSongs"
            ><i class="iconfont icon-audio-play" /> 播放全部</span>
          </div>
          <SongList
            :song-list="songList"
            :stripe="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, Ref } from 'vue'
import { useRoute, LocationQueryValue } from 'vue-router'
import router from '@/router'
import utils from '@/utils'
import axios from '@/axios'
import store from '@/store'
import SongList from '@/components/song-list/song-list.vue'

const route = useRoute()

/* data */
const list: any = ref([])
const type: Ref<string | null | LocationQueryValue[]> = ref('Top')
const listTop = ref([])
const listFeature = ref([])
const listOther = ref([])
const rId: Ref<string | null | LocationQueryValue[]> = ref('')
const rankInfo: any = ref({})
const songList: any = ref([])
const total = ref(0)

/* mounted */
onMounted(() => {
  route.query.rId && (rId.value = route.query.rId)
  route.query.type && (type.value = route.query.type)
  getTopListDetail()
})

/* methods */
// 通过type设置当前列表的数据和rId
const setListAndType = () => {
  switch (type.value) {
    case 'Top':
      list.value = listTop.value
      rId.value = (listTop.value[0] as any).id
      break
    case 'Feature':
      list.value = listFeature.value
      rId.value = (listFeature.value[0] as any).id
      break
    case 'Other':
      list.value = listOther.value
      rId.value = (listOther.value[0] as any).id
      break
    default:
      list.value = listTop.value
      rId.value = (listTop.value[0] as any).id
      break
  }
}

const getTopListDetail = async () => {
  const getToplistDetailData = await axios({
    url: 'getToplistDetail',
    method: 'GET'
  })

  // 云音乐TOP榜
  listTop.value = getToplistDetailData.list.filter((item: any) => {
    return item.ToplistType
  })
  // 云音乐特色榜
  listFeature.value = getToplistDetailData.list.filter((item: any) => {
    return !item.ToplistType && item.name.indexOf('云音乐') >= 0
  })
  // 其他场景榜
  listOther.value = getToplistDetailData.list.filter((item: any) => {
    return !item.ToplistType && item.name.indexOf('云音乐') < 0
  })
  setListAndType()
}
const getListDetail = async () => {
  const getPlayListDetailData = await axios({
    url: 'getPlayListDetail',
    method: 'GET',
    params: {
      id: rId.value,
      s: -1
    }
  })

  rankInfo.value = getPlayListDetailData.playlist
  songList.value = _formatSongs(getPlayListDetailData.playlist.tracks, getPlayListDetailData.privileges)
  total.value = songList.value.length
}
const selectType = (typeStr: string) => {
  type.value = typeStr
  setListAndType()
  router.push({ path: 'rank', query: { type: type.value, rId: rId.value } })
}
const selectItem = (item: any) => {
  rId.value = item.id
  router.push({ path: 'rank', query: { type: type.value, rId: rId.value } })
}
const playAllSongs = () => {
  store.dispatch('playAll', {
    list: songList.value
  })
}
// 处理歌曲
const _formatSongs = (list: any, privileges: any) => {
  const ret: any = []
  list.map((item: any, index: number) => {
    if (item.id) {
      // 是否有版权播放
      item.license = !privileges[index].cp
      ret.push(utils.formatSongInfo(item))
    }
  })
  return ret
}

/* watch */
watch(() => rId.value, (newVal) => {
  rId.value = newVal
  if (rId.value) {
    getListDetail()
  }
})
</script>

<style scoped lang="less">
@import './index.less';
</style>
