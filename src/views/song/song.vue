<template>
  <div
    v-if="info"
    class="song-container"
  >
    <div class="w1200">
      <div class="song-sidebar">
        <div class="sidebar">
          <div class="cover">
            <div
              class="cover-img"
              :class="[isCurSong ? 'active' : '']"
              @click.stop="plyaing(info)"
            >
              <img
                src="@/assets/stylus.png"
                class="cover-stylus"
              >
              <el-image :src="info.album.picUrl">
                <template #placeholder>
                  <div class="image-slot">
                    <i class="iconfont icon-placeholder" />
                  </div>
                </template>
              </el-image>
            </div>
            <div
              v-if="coverDesc"
              class="cover-desc"
            >
              <h5>专辑简介</h5>
              <p>{{ coverDesc }}</p>
            </div>
            <div class="simi-song">
              <h6>相似歌曲</h6>
              <div class="simi-main">
                <div
                  v-for="simiItem in simiSong"
                  :key="simiItem.id"
                  class="simi-item"
                >
                  <div class="simi-info">
                    <router-link
                      class="simi-name"
                      :to="{ path: '/song', query: { id: simiItem.id }}"
                    >
                      {{ simiItem.name }}
                    </router-link>
                    <div class="simi-author">
                      <router-link
                        v-for="(author, k) in simiItem.singer"
                        :key="author.name"
                        :to="{ path: '/singer', query: { id: author.id }}"
                        class="song-author"
                      >
                        {{ k !== 0 ? ' / ' + author.name : author.name }}
                      </router-link>
                    </div>
                  </div>
                  <div class="simi-song-status">
                    <i
                      v-if="simiItem.vip"
                      class="iconfont icon-vip"
                    />
                    <i
                      v-else
                      :class="['iconfont', playSimiIcon(simiItem)]"
                      @click="plyaing(simiItem)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="song-main">
        <h3 class="song-name">
          {{ info.name }}
          <router-link
            v-if="info.mvId"
            class="mv-name"
            :to="{ path: '/mv', query: { id: info.mvId }}"
          >
            <i class="iconfont icon-video" />
          </router-link>
          <i
            v-if="info.vip"
            class="iconfont icon-vip"
          />
          <div
            v-if="isCurSong"
            class="audio-icon"
          >
            <div
              class="column"
              style="animation-delay: -1.2s;"
            />
            <div class="column" />
            <div
              class="column"
              style="animation-delay: -1.5s;"
            />
            <div
              class="column"
              style="animation-delay: -0.9s;"
            />
            <div
              class="column"
              style="animation-delay: -0.6s;"
            />
          </div>
        </h3>
        <p>
          <router-link
            v-for="(author, k) in info.singer"
            :key="author.name"
            :to="{ path: '/singer', query: { id: author.id }}"
            class="song-author"
          >
            {{ k !== 0 ? ' / ' + author.name : author.name }}
          </router-link>
        </p>
        <p class="song-info">
          <span>专辑：<router-link
            class="song-album"
            :to="{ path: '/album', query: { id: info.album.id }}"
          >{{ info.album.name }}</router-link></span>
          <span>发行时间：<em>{{ info.publishTime }}</em></span>
        </p>
        <div class="song-oper">
          <span
            :class="['play-btn','play-all', songDisable]"
            @click="plyaing(info)"
          ><i :class="['iconfont', playFontIcon]" /> {{ info.vip ? 'VIP尊享' : '立即播放' }}</span>
          <template v-if="!isLogin">
            <span
              class="play-btn play-collect"
              @click="showAddList"
            ><i class="iconfont icon-collect" /> 收藏</span>
          </template>
          <el-popover
            v-else
            ref="popAddList"
            placement="bottom"
            trigger="click"
          >
            <template #reference>
              <span class="play-btn play-collect"><i class="iconfont icon-collect" /> 收藏</span>
            </template>
            <AddList
              :tracks="info.id"
              @closeAddListPop="closeAddListPop"
            />
          </el-popover>
          <span
            class="play-btn play-comment"
            @click="jumpComment"
          ><i class="iconfont icon-comment" /> 评论</span>
        </div>
        <div class="song-lyric">
          <Lyrics
            :lyrics-id="sId"
            local="page"
          />
        </div>
        <div
          ref="comment"
          class="song-comments"
        >
          <Comments
            :id="sId"
            :type="type"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'

import utils from '@/utils'
import Lyrics from '@/components/lyrics/lyrics.vue'
import Comments from '@/components/comments/comments.vue'
import AddList from '@/components/add-list/add-list.vue'
import axios from '@/axios'
import useMessage from '@/hooks/useMessage'

const route = useRoute()
/* data */
const info: any = ref(null)
const sId = ref('0')
const type = ref(0) // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
const simiSong: any = ref([])

const comment: any = ref(null)
const popAddList: any = ref(null)

/* mounted */
onMounted(() => {
  sId.value = String(route.query.id)
  init()
})

/* computed */
const isLogin = computed(() => store.state.isLogin)
const isCurSong = computed(() => {
  return isPlayed.value && curSongInfo.value && curSongInfo.value.id === sId.value
})
// 当前播放状态
const playFontIcon = computed(() => {
  return isCurSong.value ? 'icon-audio-pause' : 'icon-audio-play'
})
// 若是无版权获取vip歌曲 播放按钮置灰
const songDisable = computed(() => {
  return (info.value.license || info.value.vip) ? 'disable' : ''
})
// 显示歌曲简介
const coverDesc = computed(() => {
  return info.value.alia.join(' / ')
})
const playSimiIcon = computed(() => {
  return function (item: any) {
    return String(item.id) === curSongInfo.value.id && isPlayed.value ? 'icon-audio-pause' : 'icon-audio-play'
  }
})
const curSongInfo = computed(() => {
  const { playList, playIndex } = store.state
  return playList[playIndex]
})
const isPlayed = computed(() => store.state.isPlayed)

/* methods */
const getSongDetail = async () => {
  const getSongDetailData = await axios({
    url: 'getSongDetail',
    method: 'GET',
    params: {
      ids: sId.value,
      timestamp: +new Date()
    }
  })

  // 是否有版权播放
  getSongDetailData.songs[0] && (getSongDetailData.songs[0].license = !getSongDetailData.privileges[0].cp)
  getSongDetailData.songs[0] && (info.value = utils.formatSongInfo(getSongDetailData.songs[0]))
}
// 获取相似音乐
const getSimiSong = async () => {
  const getSimiSongData = await axios({
    url: 'getSimiSong',
    method: 'GET',
    params: {
      id: sId.value
    }
  })
  simiSong.value = getSimiSongData.songs.map((item: any) => {
    return {
      id: String(item.id),
      name: item.name,
      mvId: item.mvid,
      singer: item.artists,
      album: item.album,
      alia: item.alias,
      duration: utils.formatSongTime(item.duration),
      url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
      vip: item.fee === 1,
      license: item.license,
      publishTime: item.publishTime
    }
  })
}
const plyaing = (params: any) => {
  // 若当前唔歌曲 或者 当前播放歌曲不是本页显示的歌曲  立即播放当前页面歌曲
  if (!curSongInfo.value || curSongInfo.value.id !== params.id) {
    // 无版权及vip不可播放
    if (params.license) {
      useMessage('error', '由于版权保护，您所在的地区暂时无法使用。')
      return
    }

    if (params.vip) {
      useMessage('error', '付费歌曲，请在网易云音乐播放')
      return
    }
    store.dispatch('selectPlay', {
      list: [params]
    })
  } else {
    store.commit('setPlayStatus', !isPlayed.value)
  }
}
const closeAddListPop = () => {
  popAddList.value.doClose()
}
const jumpComment = () => {
  // 点击评论 滚动到评论区域。
  comment.value.scrollIntoView({ behavior: 'smooth' })
}
const init = () => {
  getSongDetail()
  getSimiSong()
}
const showAddList = () => {
  if (!isLogin.value) {
    store.commit('setShowLogin', true)
  }
}

/* watch */
watch(() => route.query.id, (newVal) => {
  console.log(newVal, 'newVal')
  sId.value = String(newVal)
  newVal && init()
})

</script>

<style scoped lang="less">
@import './index.less';
</style>
