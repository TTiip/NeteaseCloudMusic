<template>
  <div class="singer">
    <div class="w1200">
      <div class="singer-info">
        <div class="singer-avatar">
          <el-image :src="artist.img1v1Url">
            <template #placeholder>
              <div class="image-slot">
                <i class="iconfont icon-placeholder" />
              </div>
            </template>
          </el-image>
        </div>
        <div class="singer-desc">
          <div class="singer-author">
            <div class="singer-name">
              {{ artist.name }}
            </div>
            <router-link
              v-if="artist.accountId"
              class="singer-btn singer-home"
              :to="{ path: '/user', query: { id: artist.accountId }}"
            >
              <i class="iconfont icon-home" /> 个人主页
            </router-link>
            <span
              :class="['singer-btn', 'singer-collect', artist.followed ? 'active' : '']"
              @click="getArtistSub(artist.followed ? 0 : 1)"
            ><i :class="['iconfont', 'icon-collect' + (artist.followed ? '-active' : '')]" /> {{ artist.followed ? '已收藏' : '收藏' }}</span>
          </div>
          <div class="singer-brief">
            {{ artist.briefDesc ? artist.briefDesc : '暂无简介' }} <span
              v-if="introduction.length"
              @click="moreDesc"
            >更多>></span>
          </div>
        </div>
      </div>
    </div>
    <div class="singer-main">
      <div class="w1200">
        <div class="singer-hd">
          <em>作品集</em>
          <div class="singer-tab">
            <span
              :class="[ type === 'hot' ? 'active' : '']"
              @click="changeType('hot')"
            >热门作品</span>
            <span
              :class="[ type === 'album' ? 'active' : '']"
              @click="changeType('album')"
            >所有专辑</span>
            <span
              :class="[ type === 'mv' ? 'active' : '']"
              @click="changeType('mv')"
            >相关MV</span>
          </div>
          <div
            v-if="type === 'hot'"
            class="singer-oper"
          >
            <span
              class="singer-btn playAll"
              @click="playAllList"
            ><i class="iconfont icon-audio-play" /> 播放全部</span>
            <span
              class="singer-btn addAll"
              @click="addAll"
            ><i class="iconfont icon-add" /> 添加到播放列表</span>
            <span
              class="singer-btn collectAll"
              @click="collectAll"
            ><i class="iconfont icon-collect" /> 收藏热门</span>
          </div>
        </div>
        <div class="singer-list">
          <SongList
            v-show="type === 'hot'"
            :song-list="hotSongs"
            :stripe="true"
          />
          <AlbumList
            v-show="type === 'album'"
            :album-list="hotAlbums"
          />
          <MvList
            v-show="type === 'mv'"
            v-infinite-scroll="loadMv"
            class="loadMv"
            :mv-list="hotMvs"
            infinite-scroll-distance="20"
          />
          <div
            v-loading="hasMoreMvs"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            style="width: 100%;margin: 10px 0;"
          />
        </div>
        <div
          v-if="type === 'album'"
          class="pagination"
        >
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="limit"
            :total="total"
            @current-change="currentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      v-model="dialogDescVisible"
      :title="artist.name"
      :destroy-on-close="true"
    >
      <div class="artist-desc-main">
        <dl class="introduction">
          <dt>艺人介绍</dt>
          <dd>{{ artist.briefDesc }}</dd>
        </dl>
        <dl
          v-for="(item, index) in introduction"
          :key="index"
          class="introduction"
        >
          <dt>{{ item.ti }}</dt>
          <dd>{{ item.txt }}</dd>
        </dl>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import utils from '@/utils'
import store from '@/store'
import axios from '@/axios'
import useMessage from '@/hooks/useMessage'

import SongList from '@/components/song-list/song-list.vue'
import AlbumList from '@/components/album-list/album-list.vue'
import MvList from '@/components/mv-list/mv-list.vue'

const route = useRoute()
const router = useRouter()

/* data */
const sUid = ref(route.query.id)
const artist: any = ref({})
const hotSongs = ref([])
const hotAlbums = ref([])
const hotMvs: any = ref([])
const introduction: any = ref([])
const type = ref(route.query.type || 'hot')
const limit = ref(12)
const offset = ref(0)
const total = ref(0)
const hasMoreMvs = ref(true)
const dialogDescVisible = ref(false)

/* mounted */
onMounted(() => {
  init()
  route.query.type && getArtists()
})

/* methods */
const getArtistDesc = async () => {
  const getArtistDescData = await axios({
    url: 'getArtistDesc',
    method: 'GET',
    params: {
      id: sUid.value,
      timestamp: +new Date()
    }
  })
  introduction.value = getArtistDescData.introduction
}
const getArtists = async () => {
  const getArtistsData = await axios({
    url: 'getArtists',
    method: 'GET',
    params: {
      id: sUid.value,
      timestamp: +new Date()
    }
  })
  artist.value = getArtistsData.artist
  hotSongs.value = getArtistsData.hotSongs.map((item: any) => {
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
}
const getArtistSub = async (t: any) => {
  await axios({
    url: 'getArtistsSub',
    method: 'GET',
    params: {
      id: sUid.value,
      t
    }
  })
  useMessage('success', '操作成功!')
  getArtists()
}
const getArtistAlbum = async () => {
  const getArtistsAlbumData = await axios({
    url: 'getArtistsAlbum',
    method: 'GET',
    params: {
      id: sUid.value,
      limit: limit.value,
      offset: offset.value
    }
  })

  total.value = getArtistsAlbumData.artist.albumSize
  hotAlbums.value = getArtistsAlbumData.hotAlbums
}
const getArtistMv = async () => {
  const getArtistsMvData = await axios({
    url: 'getArtistsMv',
    method: 'GET',
    params: {
      id: sUid.value,
      limit: 20,
      offset: offset.value
    }
  })
  hasMoreMvs.value = getArtistsMvData.hasMore
  hotMvs.value = [...hotMvs.value, ...getArtistsMvData.mvs]
  console.log(getArtistsMvData.hasMore, 'getArtistsMvData.hasMore')
  offset.value += 20
}
const loadMv = () => {
  getArtistMv()
}
const moreDesc = () => {
  dialogDescVisible.value = true
}
const changeType = (typeStr: any) => {
  console.log(11111)
  const params = {
    id: sUid.value,
    type: ''
  }
  type.value = typeStr
  offset.value = 0
  switch (typeStr) {
    case 'hot' :
      getArtists()
      break
    case 'album' :
      getArtistAlbum()
      break
    case 'mv' :
      hotMvs.value = []
      hasMoreMvs.value = true
      getArtistMv()
      break
  }
  if (type.value !== 'hot') {
    params.type = typeStr
  }
  router.push({ path: '/singer', query: params })
}
// 专辑分页
const currentChange = (page: number) => {
  offset.value = (page - 1) * limit.value
  getArtistAlbum()
}
const init = () => {
  sUid.value = route.query.id
  getArtistDesc()
  switch (type.value) {
    case 'hot' :
      getArtists()
      break
    case 'album' :
      getArtistAlbum()
      break
    case 'mv' :
      getArtistMv()
      break
  }
}
const playAllList = () => {
  store.dispatch('playAll', {
    list: hotSongs.value
  })
}
const addAll = () => {
  store.dispatch('addList', { list: hotSongs.value })
}
const collectAll = () => {}

/* watch */
watch(() => route.query.id, () => {
  sUid.value = route.query.id
  type.value = route.query.type || 'hot'
  getArtists()
})

</script>

<style scoped lang="less">
@import 'index.less';
</style>
