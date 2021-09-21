<template>
  <div class="detail">
    <div class="w1200">
      <div class="detail-container">
        <div class="detail-main">
          <div class="cover">
            <div class="cover-img">
              <el-image :src="details.coverImgUrl">
                <template #placeholder>
                  <div class="image-slot">
                    <i class="iconfont icon-placeholder" />
                  </div>
                </template>
              </el-image>
            </div>
            <div class="cover-info">
              <div class="cover-title">
                {{ details.name }}
              </div>
              <div
                v-if="details.creator"
                class="cover-author"
              >
                <el-image
                  :src="details.creator.avatarUrl"
                  class="cover-avatar"
                >
                  <template #placeholder>
                    <div class="image-slot">
                      <i class="iconfont icon-placeholder" />
                    </div>
                  </template>
                </el-image>
                <div class="cover-name">
                  {{ details.creator.nickname }}
                </div>
                <div class="cover-date">
                  {{ utils.formartDate(details.createTime, 'yyyy-MM-dd') }}
                </div>
              </div>
              <div
                v-if="details.tags"
                class="cover-tags"
              >
                <router-link
                  v-for="(tag, index) in details.tags"
                  :key="index"
                  :to="{ path: '/playlist', query: { cat: tag }}"
                  class="tag"
                >
                  #{{ tag }}
                </router-link>
              </div>
              <div class="cover-digital">
                <span class="cover-playCount"><i class="iconfont icon-playnum" /> {{ utils.formartNum(details.playCount) }}次</span>
                <span class="cover-collect"><i class="iconfont icon-collect" /> {{ utils.formartNum(details.subscribedCount) }}</span>
                <span class="cover-comment"><i class="iconfont icon-comment" /> {{ utils.formartNum(details.commentCount) }}</span>
              </div>
              <div class="cover-desc">
                <h5>
                  歌单简介<em
                    v-if="isShowDesc"
                    class="desc-close"
                    @click="isShowDesc = false"
                  ><i class="iconfont icon-closed" /></em>
                </h5>
                <p @click="showAllDesc">
                  {{ details.description }}
                </p>
                <el-dialog
                  v-model="isShowDesc"
                  title="歌单简介"
                  width="60%"
                >
                  <div>
                    <pre class="cover-desc-all">
                      {{ details.description }}
                    </pre>
                  </div>
                </el-dialog>
              </div>
            </div>
          </div>
          <div class="song-main">
            <div class="song-header">
              <h4>歌曲列表 <em>{{ total + '首歌' }}</em></h4>
              <span
                :class="['play-all', songList.length ? '' : 'disabled']"
                @click="playAllSongs"
              ><i class="iconfont icon-audio-play" /> 播放全部</span>
              <span
                :class="['collect', details.subscribed ? 'active' : '']"
                @click="subPlayList(details)"
              ><i :class="['iconfont', 'icon-collect' + (details.subscribed ? '-active' : '')]" /> {{ details.subscribed ? '已收藏' : '收藏' }}</span>
            </div>
            <SongList
              :song-list="songList"
              :stripe="true"
            />
            <div
              v-if="!isLogin"
              class="showAllSongsTips"
            >
              <span @click="loginDialog">登录后查看全部歌曲</span>
            </div>
          </div>
        </div>
        <div class="detail-aside">
          <div class="playlist-collect">
            <h3 class="aside-title">
              喜欢这个歌单的人
            </h3>
            <div class="aside-main collect-main">
              <router-link
                v-for="item in collects"
                :key="item.userId"
                class="collect-author"
                :to="{ path: '/singer', query: { id: item.userId }}"
              >
                <el-image :src="item.avatarUrl">
                  <template #placeholder>
                    <div class="image-slot">
                      <i class="iconfont icon-placeholder" />
                    </div>
                  </template>
                </el-image>
              </router-link>
            </div>
          </div>
          <div class="playlist-recom">
            <h3 class="aside-title">
              相关歌单推荐
            </h3>
            <div class="aside-main recom-main">
              <router-link
                v-for="item in playlists"
                :key="item.id"
                class="recom-item"
                :to="{ path: '/playlist/detail', query: { id: item.id }}"
              >
                <el-image :src="item.coverImgUrl">
                  <template #placeholder>
                    <div class="image-slot">
                      <i class="iconfont icon-placeholder" />
                    </div>
                  </template>
                </el-image>
                <div class="recom-info">
                  <div class="recom-name">
                    {{ item.name }}
                  </div>
                  <div class="recom-author">
                    By. <router-link :to="{ path: '/user', query: { id: item.creator.userId }}">
                      {{ item.creator.nickname }}
                    </router-link>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
          <div class="playlist-comment">
            <h3 class="aside-title">
              歌单评论
            </h3>
            <div class="aside-main comment-main">
              <div
                v-for="item in comments"
                :key="item.commentId"
                class="comment-item"
              >
                <router-link :to="{ path: '/user', query: { id: item.commentId }}">
                  <el-image :src="item.user.avatarUrl">
                    <template #placeholder>
                      <div class="image-slot">
                        <i class="iconfont icon-placeholder" />
                      </div>
                    </template>
                  </el-image>
                </router-link>
                <div class="comment-info">
                  <div class="comment-userInfo">
                    <router-link
                      :to="{ path: '/user', query: { id: item.commentId }}"
                      class="comment-name"
                    >
                      {{ item.user.nickname }}
                    </router-link><span class="comment-date">{{ utils.formatMsgTime(item.time) }}</span>
                  </div>
                  <div class="comment-desc">
                    {{ item.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import store from '@/store'
import axios from '@/axios'
import { useRoute } from 'vue-router'
import utils from '@/utils'
import useMessage from '@/hooks/useMessage'
import SongList from '@/components/song-list/song-list.vue'

const route = useRoute()

/* data */
// 歌单详情
const details: any = ref({})
const songList = ref([])
const collects: any = ref([])
const playlists: any = ref([])
const comments: any = ref([])
const total = ref(0)
const isShowDesc = ref(false)

/* mounted */
onMounted(() => {
  _initialize(route.query.id)
})

/* computed */
const isLogin = computed(() => store.state.isLogin)

/* methods */
const _initialize = (id: any) => {
  // 歌单详情
  getDetail({ id: id, s: 8 })
  // 歌单收藏者
  getCollect({ id: id, limit: 18 })
  // 相关歌单推荐
  getRecom({ id: id })
  // // 歌单评论
  getComment({ id: id, limit: 9 })
}
// 登录及未登录下获取歌单中歌曲的列表
const getDetail = async (params: any) => {
  const getPlayListDetailData = await axios({
    url: 'getPlayListDetail',
    method: 'GET',
    params
  })
  details.value = getPlayListDetailData.playlist

  if (isLogin.value) {
    const ids = getPlayListDetailData.playlist.trackIds
    getAllSongs(ids)
  } else {
    songList.value = _formatSongsNoLogin(getPlayListDetailData.playlist.tracks)
    total.value = songList.value.length
  }
}
// 订阅该歌单的用户列表
const getCollect = async (params: any) => {
  const getPlayListSubscribersData = await axios({
    url: 'getPlayListSubscribers',
    method: 'GET',
    params
  })
  collects.value = getPlayListSubscribersData.subscribers
}
// 相关歌单推荐
const getRecom = async (params: any) => {
  const getRelatedPlaylistData = await axios({
    url: 'getRelatedPlaylist',
    method: 'GET',
    params
  })
  playlists.value = getRelatedPlaylistData.playlists
}
// 歌单精彩评论
const getComment = async (params: any) => {
  const getCommentPlaylistData = await axios({
    url: 'getCommentPlaylist',
    method: 'GET',
    params
  })
  comments.value = getCommentPlaylistData.comments
}
// 歌单简介查看更多
const showAllDesc = () => {
  if (details.value.description.length > 120) {
    isShowDesc.value = !isShowDesc.value
  }
}
// 登录后根据ids获取所有歌曲列表
const getAllSongs = async (ids: any) => {
  const sliceArr = []
  const num = 500
  let idsArr: any = []

  // 数组过长 每500份一组
  for (let index = 0; index < ids.length; index += num) {
    sliceArr.push(ids.slice(index, index + num))
  }

  for (let i = 0; i < sliceArr.length; i++) {
    const arrs: any = []
    sliceArr[i].map((d: any) => {
      arrs.push(d.id)
    })
    const getSongDetailData = await axios({
      url: 'getSongDetail',
      method: 'GET',
      params: {
        ids: arrs.join(','),
        timestamp: new Date().valueOf() + i
      }
    })
    idsArr = idsArr.concat(_formatSongsLogin(getSongDetailData))
  }

  songList.value = idsArr
  total.value = idsArr.length
}
// 未登录状态，点击登录按钮，显示登录框
const loginDialog = () => {
  store.commit('setShowLogin', true)
}
// 处理歌曲
const _formatSongsNoLogin = (list: any) => {
  const ret: any = []
  list.map((item: any, index: any) => {
    if (item.id) {
      // 是否有版权播放
      item.license = !list[index].cp
      ret.push(utils.formatSongInfo(item))
    }
  })
  return ret
}
// 处理歌曲
const _formatSongsLogin = (list: any) => {
  const ret: any = []
  list.songs.map((item: any, index: any) => {
    if (item.id) {
      // 是否有版权播放
      item.license = !list.privileges[index].cp
      ret.push(utils.formatSongInfo(item))
    }
  })
  return ret
}
// 播放列表为当前歌单的全部歌曲
const playAllSongs = () => {
  if (songList.value.length) {
    store.dispatch('playAll', {
      list: songList.value
    })
  }
}
// 收藏、取消歌单
const subPlayList = async (item: any) => {
  const getPlaylistSubscribeData = await axios({
    url: 'getPlaylistSubscribe',
    method: 'GET',
    params: {
      id: item.id,
      t: (item.subscribed ? 2 : 1)
    }
  })
  if (getPlaylistSubscribeData.code === 200) {
    useMessage('success', '操作成功!')
    details.value.subscribed = !details.value.subscribed
  }
}

/* watch */
watch(() => route.query, (newVal: any) => {
  if (newVal.id) {
    songList.value = []
    total.value = 0
    _initialize(newVal.id)
  }
})

watch(() => isLogin.value, (newVal: any) => {
  if (newVal) {
    const ids = details.value.trackIds
    getAllSongs(ids)
  } else {
    songList.value = _formatSongsNoLogin(details.value?.tracks ?? [])
    total.value = details.value?.tracks?.length ?? 0
  }
})
</script>

<style scoped lang="less">
@import './index.less';
</style>
