<template>
  <div class="home">
    <div class="w1200">
      <Banner />
      <div class="recom_list">
        <div class="h_title">
          <h3>热门歌单</h3>
          <span
            v-for="(item, index) in playlistTags"
            :key="item.id"
            :class="index === playlistIndex ? 'active' : ''"
            @click="choosePlayListType(index)"
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
            @click="chooseAlbumType(index)"
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
      <!-- <div class="mv_list">
        <div class="h_title">
          <h3>最新MV</h3>
          <span
            v-for="(item, index) in mvArea"
            :key="item.id"
            :class="index === mvIndex ? 'active' : ''"
            @click="chooseMvType(index)"
          >{{ item }}</span>
        </div>
        <div class="wrapper">
          <mv-list
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
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  PlaylistHotItem,
  GetTopListItem,
  GetTopAlbumItem,
  GetTopListPropItem
} from '@/interface'
import axios from '@/axios'
import Banner from '@/components/banner/banner.vue'
import PlayList from '@/components/play-list/play-list.vue'
import AlbumList from '@/components/album-list/album-list.vue'

const albumIndex = ref(0)
const playlistIndex = ref(0)
// const mvIndex = ref(0)
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
// const mvArea = ref(['全部', '内地', '港台', '欧美', '日本', '韩国'])
const playlistTags = ref<PlaylistHotItem[]>([])
const playlistParams = { limit: 5, offset: 0, cat: '' }
const albumParams = { limit: 9, area: '' }
const playList = ref<GetTopListItem[]>([])
const albumList = ref<GetTopAlbumItem[]>([])
const topList = ref<GetTopListPropItem[]>([])
const songList = ref({})
// const artistsList = ref([])
const getPlaylistHotFunc = async () => {
  // 热门歌单分类
  const getPlaylistHot = await axios({
    url: 'getPlaylistHot',
    method: 'GET'
  })
  playlistTags.value = getPlaylistHot.tags
  playlistTags.value.unshift({ name: '为您推荐' })
}
// 热门歌单tab切换
const choosePlayListType = async (index: number) => {
  // change index
  playlistIndex.value = index
  // 处理参数
  playlistParams.cat = index !== 0 ? playlistTags.value[index].name : ''
  const getTopPlayList = await axios({
    url: 'getTopPlayList',
    method: 'GET',
    params: {
      ...playlistParams
    }
  })
  playList.value = getTopPlayList.playlists.splice(0, 10)
}
// 新碟上架tab切换
const chooseAlbumType = async (index: number) => {
  // change index
  albumIndex.value = index
  albumParams.area = index !== 0 ? albumArea[index].code : ''
  const getTopAlbum = await axios({
    url: 'getTopAlbum',
    method: 'GET',
    params: {
      ...albumParams
    }
  })
  albumList.value = getTopAlbum.monthData.splice(0, 9)
}
// 获取排行榜相关
const getToplist = async () => {
  const getTopList = await axios({
    url: 'getTopList',
    method: 'GET'
  })
  topList.value = getTopList.list.splice(0, 8)
  topList.value.forEach(async item => {
    const getTopListDetail = await axios({
      url: 'getTopListDetail',
      method: 'GET',
      params: {
        id: item.id
      }
    })
    songList.value = {
      ...songList.value,
      [item.id]: getTopListDetail.playlist.tracks.splice(0, 5)
    }
  })
}

onMounted(async () => {
  getToplist()
  getPlaylistHotFunc()
  choosePlayListType(0)
  chooseAlbumType(0)
})

</script>
<style scoped lang="less">
@import './index.less';
</style>
