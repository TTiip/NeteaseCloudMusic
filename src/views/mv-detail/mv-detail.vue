<template>
  <div class="mv-detail">
    <div
      class="mv-video"
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
            class="mv-light"
            :class="[isNight ? 'active' : '']"
            @click="toggleLight"
          >
            <i
              class="iconfont"
              :class="[isNight ? 'icon-night' : 'icon-day']"
            />
          </div>
        </div>
        <div class="mv-info">
          <div class="mv-info-hd">
            <div class="info-name">
              {{ mvDetail.name }}
            </div>
            <router-link
              v-for="(author, k) in mvDetail.artists"
              :key="author.name"
              :to="{ path: '/singer', query: { id: author.id }}"
              class="song-author"
            >
              {{ k !== 0 ? ' / ' + author.name : author.name }}
            </router-link>
            <div class="mv-info-count">
              <span class="info-count">播放量：{{ utils.formartNum(mvDetail.playCount) }}</span><span class="info-time">发布时间：{{ mvDetail.publishTime }}</span>
            </div>
          </div>
          <div class="mv-desc">
            {{ mvDetail.briefDesc ? mvDetail.briefDesc : '暂无简介' }}
          </div>
        </div>
      </div>
    </div>
    <div class="w1200">
      <div class="mv-container">
        <div class="mv-main">
          <Comments
            :id="mvId"
            :type="type"
          />
        </div>
        <div class="mv-aside">
          <div class="simi-mv">
            <h3 class="aside-title">
              相似MV
            </h3>
            <div class="aside-main mv-main">
              <div
                v-for="(item, index) in simiMv"
                :key="'' + item.id + Number(index)"
                class="item"
              >
                <router-link
                  :to="{ path: '/mvdetail', query: { id: item.id }}"
                  class="faceImg"
                >
                  <i class="iconfont icon-play" />
                  <el-image :src="item.cover || item.imgurl">
                    <template #placeholder>
                      <div class="image-slot">
                        <i class="iconfont icon-placeholder" />
                      </div>
                    </template>
                  </el-image>
                </router-link>
                <div class="info">
                  <router-link
                    :to="{ path: '/mvdetail', query: { id: item.id }}"
                    class="mv-name"
                  >
                    {{ item.name }}
                  </router-link>
                  <router-link
                    v-if="!item.publishTime"
                    :to="{ path: '/singer', query: { id: item.artistId }}"
                    class="mv-author"
                  >
                    {{ item.artistName }}
                  </router-link>
                  <div class="mv-playCount">
                    <i class="iconfont icon-video" /> {{ utils.formartNum(item.playCount) }}
                  </div>
                  <div
                    v-if="item.publishTime"
                    class="mv-time"
                  >
                    发布时间：{{ item.publishTime }}
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import utils from '@/utils'
import store from '@/store'
import axios from '@/axios'
// import VideoPlay from '@/components/video/video.vue'
import VideoPlay from '@/components/video-mui-player/video-mui-player.vue'
import Comments from '@/components/comments/comments.vue'

const route = useRoute()

/* data */
const mvId = ref(String(route.query.id))
const mvDetail: any = ref({})
const type = ref(1) // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
const videoOptions: any = ref({
  sources: {},
  qualityList: [],
  quality: {}
})

const simiMv: any = ref([])
const isNight = ref(false)

/* mountd */
onMounted(() => {
  getMvDetail()
  store.commit('setPlayStatus', false)
})

/* methods */
const getMvDetail = async () => {
  const getMvDetailData = await axios({
    url: 'getMvDetail',
    method: 'GET',
    params: {
      mvid: mvId.value
    }
  })

  mvDetail.value = getMvDetailData.data
  videoOptions.value.qualityList = getMvDetailData.data.brs
  videoOptions.value.quality = {
    ...getMvDetailData.mp,
    name: mvDetail.value.name
  }
  getMvUrl()
  getSimiMv()
}
const getMvUrl = async (Resolution = 1080) => {
  const getMvUrlData = await axios({
    url: 'getMvUrl',
    method: 'GET',
    params: {
      id: mvId.value,
      r: Resolution
    }
  })
  videoOptions.value.sources = {
    type: 'video/mp4',
    src: getMvUrlData.data.url
  }
}
const getSimiMv = async () => {
  const getSimiMvData = await axios({
    url: 'getSimiMv',
    method: 'GET',
    params: {
      mvid: mvId.value
    }
  })
  simiMv.value = getSimiMvData.mvs
}
const changeResolution = (data: any) => {
  // 切换清晰度时候的后续操作
  getMvUrl(data.functions)
}
const toggleLight = () => {
  isNight.value = !isNight.value
}

/* watch */
watch(route, () => {
  mvId.value = String(route.query.id)
  getMvDetail()
})

</script>

<style scoped lang="less">
@import './index.less';
</style>
