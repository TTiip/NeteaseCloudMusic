<template>
  <div class="songs-list-main">
    <div class="list-header flex">
      <div class="columnIndex">
        序号
      </div>
      <div class="columnSong">
        歌曲
      </div>
      <div class="columnSinger">
        歌手
      </div>
      <div
        v-if="typeSize !== 'mini'"
        class="columnAlbum"
      >
        专辑
      </div>
      <div class="columnTime">
        时长
      </div>
    </div>
    <div
      ref="curSongRef"
      class="list-scroll"
      :style="{height: height + 'px'}"
    >
      <div
        class="list-main"
        :style="curSongSty"
      >
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="isCurSong(item, index)"
          @click.stop="tips($event, item)"
        >
          <div class="columnIndex">
            <span class="songlist-index">{{ indexMethod(index) }}</span>
            <div class="audio-icon">
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
            <i
              :class="playIcon(item)"
              @click="currentSong(item)"
            />
          </div>
          <div class="columnSong songlist-name">
            <router-link
              :class="typeSize"
              :to="{ path: '/song', query: { id: item.id }}"
            >
              <span :title="item.name">{{ item.name }}</span>
            </router-link>
            <template v-if="typeSize !== 'mini'">
              <router-link
                v-if="item.mvId"
                class="mv-name"
                :to="{ path: '/mvdetail', query: { id: item.mvId }}"
              >
                <i class="iconfont icon-video" />
              </router-link>
              <i
                v-if="item.vip"
                class="iconfont icon-vip"
              />
            </template>
          </div>
          <div class="columnSinger songlist-singer">
            <!--- 返回的数据里用户的uid有可能为0 --->
            <router-link
              v-for="(author, k) in item.singer"
              :key="author.name"
              :to="{ path: '/singer', query: { id: author.id }}"
              class="song_name"
            >
              {{ k !== 0 ? ' / ' + author.name : author.name }}
            </router-link>
          </div>
          <div
            v-if="typeSize !== 'mini'"
            class="columnAlbum"
          >
            <router-link
              v-if="item.album"
              class="songlist-album"
              :to="{ path: '/album', query: { id: item.album.id }}"
            >
              {{ item.album.name }}
            </router-link>
          </div>
          <div class="columnTime">
            <div class="songlist-time">
              {{ item.duration }}
            </div>
            <div class="songlist-oper">
              <i
                v-if="typeSize !== 'mini'"
                class="iconfont icon-add"
                title="添加到列表"
                @click="addSongList(item)"
              />
              <!-- <el-popover
                ref="popAddList"
                placement="bottom"
                trigger="click"
              >
                <template #reference>
                  <i
                    class="iconfont icon-add-list"
                    title="添加到歌单"
                    @click="closeAddListPop"
                  />
                </template>
              </el-popover> -->
              <i
                class="iconfont icon-collect"
                @click="likeSong(item)"
              />
              <i
                v-if="typeSize === 'mini'"
                class="iconfont icon-del"
                title="删除"
                @click.stop="delList(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isShowPagination"
      class="pagination"
    >
      <el-pagination
        v-model:current-page="currentPage"
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="songList.length"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script lang='ts' setup>
import store from '@/store'
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { getLocalStorage, setLocalStorage } from '@/hooks/useLocalStorage'
import useMessage from '@/hooks/useMessage'
import axios from '@/axios'

const props = defineProps({
  songList: {
    type: Array as any,
    required: true
  },
  typeSize: { // 播放列表展示类型， 默认normal是歌单下的展示列表，mini是播放条下的歌曲列表的
    type: String,
    default: 'normal'
  },
  stripe: { // 隔行变色
    type: Boolean,
    default: false
  },
  height: {
    type: [Number, String],
    default: 'auto'
  },
  // 分页加载 || 无限滚动加载
  isScroll: {
    type: Boolean,
    default: false
  },
  isShowTips: {
    type: Boolean,
    default: true
  }
})
/* data */

const pageSize = ref(30)
const currentPage = ref(1)
const timer: any = ref(null)
// 当前播放的音乐的位置
const curScroll = ref(0)

const flag = ref(true)

/* mounted */
// 加载完成默认滚动到当前播放的音乐位置。
onMounted(() => {
  if (flag.value) {
    flag.value = false
    scrollCurSong(curSongInfo.value)
  }
})

/* methods */

// 全局设置当前播放歌曲
const currentSong = (item: any) => {
  // 若当前歌曲 或者 当前播放歌曲不是本歌单显示的歌曲  立即播放当前歌单
  if (!curSongInfo.value || item?.id !== curSongInfo.value?.id) {
    store.dispatch('selectPlay', { list: [item] })
  } else {
    store.commit('setPlayStatus', !isPlayed.value)
  }
}
// 表格列表序号格式化
const indexMethod = (page: any) => {
  if (!props.isScroll) {
    return (currentPage.value - 1) * pageSize.value + page + 1
  } else {
    return page + 1
  }
}
// 歌曲列表分页功能
const currentChange = (page: any) => {
  currentPage.value = page
}
// 添加当前歌曲到播放列表
const addSongList = (item: any) => {
  store.dispatch('addList', { list: [item] })
}
// 在播放列表删除当前歌曲
const delList = (index: any) => {
  const playIndex = Number(getLocalStorage('playIndex'))
  // 删除当前播放音乐之前的音乐会默认使用当前音乐的index去播放新的音乐。
  // 在删除当前音乐之前的音乐时重新设置一下playIndex来解决。
  if (index < playIndex) {
    setLocalStorage('playIndex', playIndex - 1)
    store.commit('setPlayIndex', playIndex - 1)
  }
  playList.value.splice(index, 1)
  store.commit('setPlayList', playList.value)
}
// 喜欢该歌曲
const likeSong = async (item: any) => {
  await axios({
    url: 'getLike',
    method: 'GET',
    params: {
      id: item.id,
      like: true
    },
    headers: {
      showLoading: false
    }
  })
  useMessage('success', '收藏成功！')
}
const tips = (e: any, item: any) => {
  if (item.license) {
    useMessage('error', '由于版权保护，您所在的地区暂时无法使用。')
  }

  if (item.vip) {
    useMessage('error', '付费歌曲，请在网易云音乐播放')
  }
}
// const popAddList = ref()
// const closeAddListPop = () => {
//   popAddList.value.forEach((item: any) => {
//     item.doClose()
//   })
// }
const curSongRef: any = ref('')
// 滚动到当前播放音乐的位置
const scrollCurSong = (cur: any) => {
  if (props.isScroll) {
    const curIndex = props.songList.findIndex((item: any) => item?.id === cur?.id)
    // 如果是第二页的数据，且不是最后一页数据，直接上划滚动至当前点击index前四个即可
    if (curIndex > 7 && curIndex < props.songList.length - 8) {
      curScroll.value = -(curIndex - 4) * 50
      // 如果是最后一页数据则直接滑动到最后最后一页。
    } else if (curIndex >= (props.songList.length - 8) && props.songList.length - 8 > 0) {
      curScroll.value = -(props.songList.length - 8) * 50
    } else {
      curScroll.value = 0
    }
    // 控制每次滑动50px
    curSongRef.value.addEventListener('wheel', (event: any) => {
      if (event.wheelDelta > 0 || event.detail < 0) {
        curScroll.value = Math.abs(curScroll.value) > 0 ? curScroll.value + 50 : 0
      } else {
        curScroll.value = Math.abs(curScroll.value) < (props.songList.length - 8) / 2 * 100 ? curScroll.value - 50 : curScroll.value
      }
    })
  }
  flag.value = true
}

/* compunted */

const isPlayed = computed(() => store.state.isPlayed)
const playList = computed(() => store.state.playList)
const playIndex = computed(() => store.state.playIndex)

const list = computed(() => {
  // 当存在歌曲列表时在计算操作。
  if (props.songList.length) {
    if (!props.isScroll) {
    // 分页加载数据
      return props.songList.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
    } else {
      return props.songList
    }
  } else {
    return []
  }
})

const isCurSong = computed(() => {
  return (item: any, index: any) => {
    return [
      'list-item', props.stripe ? (index % 2 === 0 ? 'stripe' : '') : '',
      isPlayed.value && (item?.id === curSongInfo.value?.id) ? 'active' : '',
      // 版权问题禁用
      (item.license || item.vip) ? 'disable' : '',
      // vip可用
      item.vip ? 'vip disable' : ''
    ]
  }
})
const isShowPagination = computed(() => {
  return (props.songList.length > pageSize.value) && !props.isScroll
})

const playIcon = computed(() => {
  return (item: any) => {
    return [
      'iconfont',
      'playicon',
      isPlayed.value && (item?.id === curSongInfo.value?.id)
        ? 'icon-pause'
        : 'icon-play'
    ]
  }
})
const curSongSty = computed(() => `transform: translateY(${curScroll.value}px)`)
const curSongInfo = computed(() => playList.value[playIndex.value])

/* watch */

watch(() => curSongInfo.value, (newVal) => {
  if (flag.value) {
    flag.value = false
    scrollCurSong(newVal)
  }
})

watch(props.songList, (newVal) => {
  if (flag.value) {
    flag.value = false
    scrollCurSong(newVal)
  }
})

// 组件注销释放事件避免内存泄漏。
onUnmounted(() => clearTimeout(timer.value))
</script>

<style scoped lang="less">
@import './index.less';
</style>
