<template>
  <div class="video-detail">
    <div
      class="v-video"
      :class="[isNight ? 'active' : '']"
    >
      <div class="w1200">
        <div class="video-main">
          <VideoPlay
            v-if="videoOptions.sources.src"
            :options="videoOptions"
            @changeResolution="changeResolution"
          />
          <div
            class="v-light"
            :class="[isNight ? 'active' : '']"
            @click="toggleLight"
          >
            <i
              class="iconfont"
              :class="[isNight ? 'icon-night' : 'icon-day']"
            />
          </div>
        </div>
        <div class="v-info">
          <div class="v-info-hd">
            <div class="info-name">
              {{ videoDetail.title }}
            </div>
            <router-link
              v-if="videoDetail.creator"
              :to="{ path: '/user', query: { id: videoDetail.creator.userId }}"
              class="song-author"
            >
              By. {{ videoDetail.creator.nickname }}
            </router-link>
            <div class="v-info-count">
              <span class="info-count">播放量：{{ utils.formartNum(videoDetail.playTime) }}</span><span class="info-time">发布时间：{{ utils.formartDate(videoDetail.publishTime, 'yyyy-MM-dd') }}</span>
            </div>
          </div>
          <div class="v-desc">
            {{ videoDetail.briefDesc ? videoDetail.briefDesc : '暂无简介' }}
          </div>
        </div>
      </div>
    </div>
    <div class="w1200">
      <div class="v-container">
        <div class="v-main">
          <Comments
            :id="vId"
            :type="type"
          />
        </div>
        <div class="v-aside">
          <div class="simi-video">
            <h3 class="aside-title">
              相关视频
            </h3>
            <div class="aside-main v-main">
              <div
                v-for="(item, index) in simiVideo"
                :key="'' + item.id + String(index)"
                class="item"
              >
                <router-link
                  :to="{ path: item.type ? '/videodetail' : '/mv', query: { id: item.vid }}"
                  class="faceImg"
                >
                  <i class="iconfont icon-play" />
                  <el-image :src="item.coverUrl">
                    <template #placeholder>
                      <div class="image-slot">
                        <i class="iconfont icon-placeholder" />
                      </div>
                    </template>
                  </el-image>
                  <span class="playCount"><i class="iconfont icon-video" /><em>{{ utils.formartNum(item.playTime) }}</em></span>
                  <div class="v-time">
                    {{ utils.formatSongTime(item.durationms) }}
                  </div>
                </router-link>
                <div class="info">
                  <router-link
                    :to="{ path: '/videodetail', query: { id: item.vid }}"
                    class="v-name"
                  >
                    {{ item.title }}
                  </router-link>
                  <router-link
                    v-for="(author, k) in item.creator"
                    :key="k"
                    :to="{ path: '/user', query: { uid: author.userId }}"
                    class="v-author"
                  >
                    By. {{ k !== 0 ? ' / ' + author.userName : author.userName }}
                  </router-link>
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
import { ref, onMounted, watch } from 'vue'
import utils from '@/utils'
import stroe from '@/store'
import axios from '@/axios'
import { useRoute } from 'vue-router'
import VideoPlay from '@/components/video-mui-player/video-mui-player.vue'
import Comments from '@/components/comments/comments.vue'

const route = useRoute()

/* data */
const vId: any = ref(route.query.id)
const videoDetail: any = ref({})
// 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
const type = ref(5)
const videoOptions = ref({
  sources: {
    type: '',
    src: '' // url地址
  },
  qualityList: [],
  quality: {}
})
// 当前视频播放的时长
const currentTime = ref(0)
const simiVideo: any = ref([])
const isNight = ref(false)

/* mounted */
onMounted(() => {
  init()
  stroe.commit('setPlayStatus', false)
})

/* methods */
const changeResolution = () => {}
// ...mapMutations({
//       setPlayStatus: 'SET_PLAYSTATUS'
//     }),
const getVideoDetail = async () => {
  const getVideoDetailData = await axios({
    url: 'getVideoDetail',
    method: 'GET',
    params: {
      id: vId.value
    }
  })

  videoDetail.value = getVideoDetailData.data
  videoOptions.value.qualityList = getVideoDetailData.data.brs
  videoOptions.value.quality = getVideoDetailData.mp
}
const getMvUrl = async (r = 1080) => {
  const getVideoUrlData = await axios({
    url: 'getVideoUrl',
    method: 'GET',
    params: {
      id: vId.value,
      r
    }
  })

  videoOptions.value.sources = {
    type: 'video/mp4',
    src: getVideoUrlData.urls[0].url
  }
}
const getSimiMv = async () => {
  const getRelatedAllvideoData = await axios({
    url: 'getRelatedAllvideo',
    method: 'GET',
    params: {
      id: vId.value
    }
  })
  simiVideo.value = getRelatedAllvideoData.data
}
const init = () => {
  getVideoDetail()
  getMvUrl()

  currentTime.value = 0
  getSimiMv()
}
const toggleLight = () => {
  isNight.value = !isNight.value
}

/* watch */
watch(() => route, () => {
  vId.value = route.query.id
  if (vId.value) {
    init()
  }
})
</script>

<style scoped lang="less">
@import './index.less';
</style>
