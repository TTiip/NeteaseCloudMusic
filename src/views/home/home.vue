<template>
  <div class="home">
    <div class="w1200">
      <Banner style="margin-top: 20px;" />
      <div class="recom_list">
        <div class="h_title">
          <h3>热门歌单</h3>
          <span
            v-for="(item, index) in playlistTags"
            :key="item.id"
            :class="index === playlistIndex ? 'active' : ''"
            @click="getTopPlayList(index)"
          >{{ item.name }}</span>
        </div>
        <div class="wrapper">
          <PlayList :play-list="playList" />
        </div>
      </div>
      <div class="album_list">
        <div class="h_title">
          <h3>新碟上架</h3>
          <span
            v-for="(item, index) in albumArea"
            :key="item.code"
            :class="index === albumIndex ? 'active' : ''"
            @click="getTopAlbum(index)"
          >{{ item.name }}</span>
        </div>
        <div class="wrapper">
          <AlbumList :album-list="albumList" />
        </div>
      </div>
      <div class="top_list">
        <div class="h_title">
          <h3>排行榜</h3>
        </div>
        <el-row
          class="wrapper"
          :gutter="20"
        >
          <el-col
            v-for="item in topList"
            :key="item.id"
            :span="6"
            class="toplist_item"
          >
            <div class="coverImg">
              <el-image :src="item.coverImgUrl" />
            </div>
            <div class="toplist_wrapper">
              <h4 class="toplist_hd">
                {{ item.name }}
              </h4>
              <div class="toplist_songlist">
                <div
                  v-for="(songItem, index) in songList[item.id]"
                  :key="songItem.id"
                  class="songitem"
                >
                  <div class="songnum">
                    {{ Number(index) + 1 }}
                  </div>
                  <div class="songinfo">
                    <router-link
                      :to="{ path: '/song', query: { id: item.id }}"
                      class="song_title"
                    >
                      {{ songItem.name }}
                    </router-link>
                    <div class="song_author">
                      <router-link
                        v-for="(author, k) in songItem.ar"
                        :key="k"
                        :to="{ path: '/singer', query: { id: author.id }}"
                        class="song_name"
                      >
                        {{ k !== 0 ? '/ ' + author.name : author.name }}
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="mv_list">
        <div class="h_title">
          <h3>最新MV</h3>
          <span
            v-for="(item, index) in mvArea"
            :key="item"
            :class="index === mvIndex ? 'active' : ''"
            @click="getMvList(index)"
          >{{ item }}</span>
        </div>
        <div class="wrapper">
          <MvList
            class="loadMv"
            :mv-list="mvList"
          />
        </div>
      </div>
      <div class="artists_list">
        <div class="h_title">
          <h3>热门歌手</h3>
        </div>
        <div class="wrapper">
          <router-link
            v-for="item in artistsList"
            :key="item.id"
            :to="{ path: '/singer', query: { id: item.id }}"
            class="artists_item"
          >
            <div class="faceImg">
              <el-image :src="item.picUrl + '?param=120y120'">
                <template #placeholder>
                  <div
                    class="image-slot"
                  >
                    <i class="iconfont icon-placeholder" />
                  </div>
                </template>
              </el-image>
            </div>
            <div class="info">
              <div class="name">
                {{ item.name }}
              </div>
              <div class="albumSize">
                专辑：{{ item.albumSize }}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  PlaylistHotItem,
  GetTopListItem,
  GetTopAlbumItem,
  GetTopListPropItem,
  GetMvFirstDataItem,
  GetArtists
} from '@/interface'
import axios from '@/axios'
import Banner from '@/components/banner/banner.vue'
import PlayList from '@/components/play-list/play-list.vue'
import AlbumList from '@/components/album-list/album-list.vue'
import MvList from '@/components/mv-list/mv-list.vue'

const albumIndex = ref(0)
const playlistIndex = ref(0)
const mvIndex = ref(0)
//
const albumArea = [
  {
    name: '全部',
    code: 'all'
  }, {
    name: '华语',
    code: 'zh'
  }, {
    name: '欧美',
    code: 'ea'
  }, {
    name: '韩国',
    code: 'kr'
  }, {
    name: '日本',
    code: 'jp'
  }
]
const mvArea = ['全部', '内地', '港台', '欧美', '日本', '韩国']
const playlistTags = ref<PlaylistHotItem[]>([])
const playlistParams = { limit: 5, offset: 0, cat: '' }
const albumParams = { limit: 9, area: '' }
const mvParams = { limit: 10, area: '' }
const playList = ref<GetTopListItem[]>([])
const albumList = ref<GetTopAlbumItem[]>([])
const topList = ref<GetTopListPropItem[]>([])
const mvList = ref<GetMvFirstDataItem[]>([])
const artistsList = ref<GetArtists[]>([])
const songList = ref({})

const getPlaylistHot = async () => {
  const getPlaylistHotData = await axios({
    url: 'getPlaylistHot',
    method: 'GET',
    headers: {
      showLoading: false
    }
  })
  playlistTags.value = getPlaylistHotData.tags
  playlistTags.value.unshift({ name: '为您推荐' })
}
// 热门歌单tab切换
const getTopPlayList = async (index: number) => {
  // change index
  playlistIndex.value = index
  // 处理参数
  playlistParams.cat = index !== 0 ? playlistTags.value[index].name : ''
  const getTopPlayListData = await axios({
    url: 'getTopPlayList',
    method: 'GET',
    params: {
      ...playlistParams
    },
    headers: {
      showLoading: false
    }
  })
  playList.value = getTopPlayListData.playlists.splice(0, 5)
}
// 新碟上架tab切换
const getTopAlbum = async (index: number) => {
  // change index
  albumIndex.value = index
  albumParams.area = index !== 0 ? albumArea[index].code : ''
  const getTopAlbumData = await axios({
    url: 'getTopAlbum',
    method: 'GET',
    params: {
      ...albumParams
    },
    headers: {
      showLoading: false
    }
  })
  albumList.value = getTopAlbumData.monthData.splice(0, 9)
}
// 获取排行榜相关
const getTopList = async () => {
  const getTopListData = await axios({
    url: 'getTopList',
    method: 'GET',
    headers: {
      showLoading: false
    }
  })
  topList.value = getTopListData.list.splice(0, 4)
  topList.value.forEach(async item => {
    const getTopListDetailData = await axios({
      url: 'getTopListDetail',
      method: 'GET',
      params: {
        id: item.id
      },
      headers: {
        showLoading: false
      }
    })
    songList.value = {
      ...songList.value,
      [item.id]: getTopListDetailData.playlist.tracks.splice(0, 5)
    }
  })
}

const getMvList = async (index: number) => {
  mvIndex.value = index
  mvParams.area = index !== 0 ? mvArea[index] : ''
  const getMvFirstData = await axios({
    url: 'getMvFirst',
    method: 'GET',
    params: {
      ...mvParams
    },
    headers: {
      showLoading: false
    }
  })
  mvList.value = getMvFirstData.data
}

const getTopArtists = async () => {
  const getTopArtistsData = await axios({
    url: 'getTopArtists',
    method: 'GET',
    params: {
      limit: 8,
      offset: 0
    },
    headers: {
      showLoading: false
    }
  })
  artistsList.value = getTopArtistsData.artists
}

onMounted(async () => {
  Promise.allSettled([
    getPlaylistHot(),
    getTopPlayList(0),
    getTopAlbum(0),
    getTopList(),
    getMvList(0),
    getTopArtists()
  ])
})

</script>
<style scoped lang="less">
@import './index.less';
</style>
