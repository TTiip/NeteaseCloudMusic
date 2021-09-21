<template>
  <div
    v-if="details"
    class="album"
  >
    <div class="w1200">
      <div class="album-cover">
        <div class="album-img">
          <el-image :src="details.picUrl">
            <template #placeholder>
              <div class="image-slot">
                <i class="iconfont icon-placeholder" />
              </div>
            </template>
          </el-image>
        </div>
        <div class="album-info">
          <div class="album-title">
            {{ details.name }}
            <span>{{ '#' + details.type }}</span>
          </div>
          <div class="album-singer">
            歌手：<router-link
              v-for="(author, k) in details.artists"
              :key="author.name"
              :to="{ path: '/singer', query: { id: author.id }}"
              class="song_name"
            >
              {{ k !== 0 ? ' / ' + author.name : author.name }}
            </router-link>
          </div>
          <div class="album-time">
            发行时间：{{ utils.formartDate(details.publishTime, 'yyyy-MM-dd') }}
          </div>
          <div class="album-company">
            发行公司：{{ details.company }}
          </div>
          <div
            v-if="details.description"
            class="album-desc"
          >
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
                <pre class="album-desc-all">
                  {{ details.description }}
                </pre>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
      <div class="detail-container">
        <div class="detail-main">
          <div class="song-header">
            <h4>包含歌曲列表 <em>{{ details.size + '首歌' }}</em></h4>
            <span
              :class="['play-all', songList.length ? '' : 'disabled']"
              @click="playAllSongs"
            ><i class="iconfont icon-audio-play" /> 播放全部</span>
            <span
              :class="['collect', dynamic.isSub ? 'active' : '']"
              @click="subAlbum"
            ><i :class="['iconfont', 'icon-collect' + (dynamic.isSub ? '-active' : '')]" /> {{ dynamic.isSub ? '已收藏' : '收藏' }}</span>
          </div>
          <div />
          <SongList
            :song-list="songList"
            :stripe="true"
          />
          <div
            ref="comment"
            class="album-comments"
          >
            <Comments
              :id="albumId"
              :type="type"
            />
          </div>
        </div>
        <div class="detail-aside">
          <h3 class="aside-title">
            {{ details.artists[0].name }}的其他专辑<router-link
              :to="{ path: '/singer', query: { id: details.artists[0].id, type: 'album' }}"
              class="album-more"
            >
              全部>>
            </router-link>
          </h3>
          <div class="aside-main aside-album-main">
            <router-link
              v-for="item in hotAlbums"
              :key="item.id"
              class="aside-album-item"
              :to="{ path: '/album', query: { id: item.id }}"
            >
              <el-image :src="item.picUrl">
                <template #placeholder>
                  <div class="image-slot">
                    <i class="iconfont icon-placeholder" />
                  </div>
                </template>
              </el-image>
              <div class="aside-album-info">
                <div class="aside-album-name">
                  {{ item.name }}
                </div>
                <div class="aside-album-time">
                  {{ utils.formartDate(details.publishTime, 'yyyy-MM-dd') }}
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import utils from '@/utils'
import SongList from '@/components/song-list/song-list.vue'
import axios from '@/axios'
import store from '@/store'
import Comments from '@/components/comments/comments.vue'

const route = useRoute()

/* data */
const albumId = ref('')
const details: any = ref(null)
const songList: any = ref([])
const dynamic: any = ref({})
const hotAlbums: any = ref([])
const type = ref(3) // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
const isShowDesc = ref(false)

/* methods */
// 相关歌单推荐
const getAlbum = async (params: any) => {
  const getAlbumData = await axios({
    url: 'getAlbum',
    method: 'GET',
    params,
    headers: {
      showLoading: false
    }
  })
  details.value = getAlbumData.album
  // 按照字段映射以后的数据返回。
  songList.value = _formatSongs(getAlbumData.songs)
  getArtistAlbum()
}
const getAlbumDynamic = async (params: any) => {
  const getAlbumDetailData = await axios({
    url: 'getAlbumDetail',
    method: 'GET',
    params,
    headers: {
      showLoading: false
    }
  })
  dynamic.value = getAlbumDetailData
}
const getArtistAlbum = async () => {
  const getArtistAlbumData = await axios({
    url: 'getArtistAlbum',
    method: 'GET',
    params: {
      id: details.value.artists[0].id,
      limit: 10,
      offset: 0
    }
  })
  hotAlbums.value = getArtistAlbumData.hotAlbums
}
// 专辑简介查看更多
const showAllDesc = () => {
  if (details.value.description.length > 120) {
    isShowDesc.value = !isShowDesc.value
  }
}
const playAllSongs = () => {
  if (songList.value.length) {
    store.dispatch('playAll', {
      list: songList.value
    })
  }
}
const subAlbum = async () => {
  const getAlbumSubData = await axios({
    url: 'getAlbumSub',
    method: 'GET',
    params: {
      id: details.value.artists[0].id,
      t: Number(!dynamic.value.isSub)
    },
    headers: {
      showLoading: false
    }
  })
  // 比较特殊，可能出现没有专辑版权的情况，暂时这么判断
  if (getAlbumSubData.code === 200) {
    dynamic.value.isSub = Number(!dynamic.value.isSub)
  }
}
// 处理歌曲
const _formatSongs = (list: any) => {
  const ret: any = []
  list.map((item: any, index: number) => {
    if (item.id) {
      // 是否有版权播放
      item.license = !list[index].privilege.cp
      ret.push(utils.formatSongInfo(item))
    }
  })
  return ret
}
const _initialize = () => {
  albumId.value && getAlbum({ id: albumId.value })
  albumId.value && getAlbumDynamic({ id: albumId.value })
}

/* watch */
watch(() => route.query, (newVal) => {
  // 直接赋值会出现类型报错问题，因为route出来的是一个特殊类型的，已经确定id是一个string直接转换一下赋值。
  albumId.value = String(newVal.id)
  if (newVal.id) {
    _initialize()
  }
})

/* mounted */
onMounted(() => {
  // 直接赋值会出现类型报错问题，因为route出来的是一个特殊类型的，已经确定id是一个string直接转换一下赋值。
  albumId.value = String(route.query.id)
  _initialize()
})

</script>
<style scoped lang="less">
@import './index.less';
</style>
