<template>
  <div class="search">
    <div class="search-hd">
      <div class="w1200">
        <div class="search-box">
          <el-popover
            ref="popover"
            v-model:visible="isShowSearch"
            placement="bottom-start"
            trigger="manual"
            :width="626"
          >
            <template #reference>
              <el-input
                v-model="keyVal"
                class="search-inp"
                placeholder="请输入歌名、歌词、歌手或专辑"
                clearable
                @focus="getListHandle"
                @input="getListHandle"
              />
            </template>
            <div class="search-key-list">
              <div
                v-for="(item, index) in suggestInfo.order"
                :key="index"
                class="search-item"
              >
                <h6>{{ listType[item] }}</h6>
                <div class="item-main">
                  <div
                    v-for="(val, k) in suggestInfo[item]"
                    :key="k"
                    class="list"
                    @click="jumpPage(val, item)"
                  >
                    {{ val.name }}
                    <template v-if="item === 'songs'">
                      -<span
                        v-for="(a, i) in val.artists"
                        :key="i"
                      >{{ a.name + (i !== 0 ? ' / ' : '') }}</span>
                    </template>
                    <template v-else-if="item === 'albums'">
                      -<span>{{ val.artist.name }}</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </el-popover>
          <i
            class="iconfont icon-search"
            @click.stop="jumpSearch(keyVal)"
          />
          <div
            v-if="history.length"
            class="search-history"
          >
            <span>历史搜索：</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w1200">
      <div class="search-main">
        <div class="search-tab">
          <h2>搜索结果<em>({{ searchInfo }})</em></h2>
          <div class="type">
            <span
              :class="type === '1' ? 'active' : ''"
              @click="selectType('1')"
            >单曲</span>
            <span
              :class="type === '10' ? 'active' : ''"
              @click="selectType('10')"
            >专辑</span>
            <span
              :class="type === '100' ? 'active' : ''"
              @click="selectType('100')"
            >歌手</span>
            <span
              :class="type === '1000' ? 'active' : ''"
              @click="selectType('1000')"
            >歌单</span>
            <span
              :class="type === '1004' ? 'active' : ''"
              @click="selectType('1004')"
            >MV</span>
            <span
              :class="type === '1014' ? 'active' : ''"
              @click="selectType('1014')"
            >视频</span>
          </div>
        </div>
        <div class="search-list">
          <SongList
            v-if="type === '1'"
            :song-list="list"
            :stripe="true"
            :offset="offset"
          />
          <AlbumList
            v-if="type === '10'"
            :album-list="list"
          />
          <ArtistList
            v-if="type === '100'"
            :artist-list="list"
          />
          <PlayList
            v-if="type === '1000'"
            :play-list="list"
          />
          <MvList
            v-if="type === '1004'"
            :mv-list="list"
          />
          <VideoList
            v-if="type === '1014'"
            :video-list="list"
          />
        </div>
        <div class="pagination">
          <el-pagination
            background
            :current-page="currentpage"
            :page-size="limit"
            layout="prev, pager, next"
            :total="total"
            @current-change="currentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/axios'
import utils from '@/utils'

import SongList from '@/components/song-list/song-list.vue'
import AlbumList from '@/components/album-list/album-list.vue'
import ArtistList from '@/components/artist-list/artist-list.vue'
import PlayList from '@/components/play-list/play-list.vue'
import MvList from '@/components/mv-list/mv-list.vue'
import VideoList from '@/components/video-list/video-list.vue'

const route = useRoute()
const router = useRouter()

/* data */
const keyVal = ref(route.query.key)
const suggestInfo: any = ref({})
const listType = ref({
  songs: '单曲',
  artists: '歌手',
  albums: '专辑',
  playlists: '歌单'
})
//  搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
const type: any = ref(route.query.type || '1')
const history = ref([])
const list = ref([])
const total = ref(0)
const offset = ref(0)
const limit = ref(30)
const currentpage = ref(1)
const isShowSearch = ref(false)

/* computed */
const searchInfo = computed(() => {
  const txt = {
    1: '首单曲',
    10: '张专辑',
    100: '个歌手',
    1000: '个歌单',
    1002: '个用户',
    1004: '个MV',
    1014: '个视频',
    1018: '个'
  }
  return total.value + txt[type.value]
})

/* methods */
const getSerachSuggest = async () => {
  const getSearchSuggestData = await axios({
    url: 'getSearchSuggest',
    method: 'GET',
    params: {
      keywords: keyVal.value
    }
  })
  suggestInfo.value = getSearchSuggestData.result
}
const getSerachMatch = async () => {
  const getCloudsearchData = await axios({
    url: 'getCloudsearch',
    method: 'GET',
    params: {
      keywords: keyVal.value,
      type: type.value,
      limit: limit.value,
      offset: offset.value
    }
  })
  console.log({
    keywords: keyVal.value,
    type: type.value,
    limit: limit.value,
    offset: offset.value
  })

  if (type.value === '1') {
    list.value = getCloudsearchData?.result?.songs.map((item: any) => {
      return {
        id: String(item.id),
        name: item.name,
        mvId: item.mv,
        singer: item.ar,
        album: item.al,
        alia: item.alia,
        vip: item.fee === 1,
        license: item.license,
        duration: utils.formatSongTime(item.dt),
        url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        publishTime: utils.formatMsgTime(item.publishTime)
      }
    })
    total.value = getCloudsearchData?.result?.songCount
  } else if (type.value === '10') {
    list.value = getCloudsearchData?.result?.albums
    total.value = getCloudsearchData?.result?.albumCount
  } else if (type.value === '100') {
    list.value = getCloudsearchData?.result?.artists
    total.value = getCloudsearchData?.result?.artistCount
  } else if (type.value === '1000') {
    list.value = getCloudsearchData?.result?.playlists
    total.value = getCloudsearchData?.result?.playlistCount
  } else if (type.value === '1004') {
    list.value = getCloudsearchData?.result?.mvs
    total.value = getCloudsearchData?.result?.mvCount
  } else if (type.value === '1014') {
    list.value = getCloudsearchData?.result?.videos
    total.value = getCloudsearchData?.result?.videoCount
  }
}
const jumpSearch = (k: any) => {
  if (!k) {
    return
  }
  if (keyVal.value && keyVal.value !== route.query.key) {
    // 点击搜索关键词，跳转到搜索结果页面
    router.push({ path: '/search', query: { key: k, type: type.value } })
    isShowSearch.value = false
  } else {
    list.value = []
    getSerachMatch()
  }
}
const jumpPage = (item: any, type: any) => {
  keyVal.value = item.name
  switch (type) {
    case 'songs':
      router.push({ path: '/song', query: { id: item.id } })
      break
    case 'artists':
      router.push({ path: '/singer', query: { id: item.id } })
      break
    case 'albums':
      router.push({ path: '/album', query: { id: item.id } })
      break
    case 'playlists':
      router.push({ path: '/playlist/detail', query: { id: item.id } })
      break
  }
  isShowSearch.value = false
}
const getListHandle = () => {
  if (keyVal.value) {
    suggestInfo.value = {}
    getSerachSuggest()
    isShowSearch.value = true
  } else {
    isShowSearch.value = false
  }
}
const selectType = (typeStr: any) => {
  type.value = typeStr
  offset.value = 0
  currentpage.value = 1
  router.push({ path: '/search', query: { key: keyVal.value, type: typeStr } })
}
const currentChange = (page: any) => {
  offset.value = (page - 1) * limit.value
  currentpage.value = page
  getSerachMatch()
}

/* watch */
watch([() => route.query.key, () => route.query.type], ([newKey, newType]) => {
  keyVal.value = newKey ?? ''
  type.value = newType ?? '1'
  keyVal.value && type.value && getSerachMatch()
}, { immediate: true })
</script>

<style scoped lang="less">
@import './index.less';
</style>
