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
        :style="`transform: translateY(10px)`"
      >
        <div
          v-for="(item, index) in songList"
          :key="item.id"
          :class="['list-item']"
        >
          <div class="columnIndex">
            <span class="songlist-index">{{ index }}</span>
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
              :class="['iconfont', 'playicon', 'icon-play']"
            />
          </div>
          <div class="columnSong songlist-name">
            <router-link
              :class="typeSize"
              :to="{ path: '/song', query: { id: item.id }}"
            >
              {{ item.name }}
            </router-link>
            <template v-if="typeSize !== 'mini'">
              <router-link
                v-if="item.mvId"
                class="mv-name"
                :to="{ path: '/mv', query: { id: item.mvId }}"
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
              <el-popover
                ref="popAddList"
                placement="bottom"
                trigger="click"
              >
                <i
                  slot="reference"
                  class="iconfont icon-add-list"
                  title="添加到歌单"
                  @click="closeAddListPop"
                />
                <!-- <add-list :tracks="item.id" @closeAddListPop="closeAddListPop"></add-list> -->
              </el-popover>
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
import { ref } from 'vue'

const pageSize = ref(30)
const currentPage = ref(1)
const isShowPagination = ref(true)

const addSongList = (item: any) => {}
const closeAddListPop = () => {}
const likeSong = (index: any) => {}
const delList = (index: any) => {}
const currentChange = () => {}

defineProps({
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
  offset: { // 若是列表有分页，偏移数量
    type: Number,
    default: 0
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
// import { mapGetters, mapMutations, mapActions } from 'vuex'
// export default {
//   name: 'SongList',
//   components: {
//   },
//   props: {
//     songList: {
//       type: Array,
//       required: true
//     },
//     typeSize: { // 播放列表展示类型， 默认normal是歌单下的展示列表，mini是播放条下的歌曲列表的
//       type: String,
//       default: 'normal'
//     },
//     stripe: { // 隔行变色
//       type: Boolean,
//       default: false
//     },
//     offset: { // 若是列表有分页，偏移数量
//       type: Number,
//       default: 0
//     },
//     height: {
//       type: [Number, String],
//       default: 'auto'
//     },
//     // 分页加载 || 无限滚动加载
//     isScroll: {
//       type: Boolean,
//       default: false
//     },
//     isShowTips: {
//       type: Boolean,
//       default: true
//     }
//   },
//   data () {
//     // 这里存放数据
//     return {
//       pageSize: 30,
//       currentPage: 1,
//       playing: false,
//       timer: null,
//       curScroll: -1 || 1
//     }
//   },
//   // 监听属性 类似于data概念
//   computed: {
//     ...mapGetters(['playList', 'playIndex', 'isPlayed']),
//     list () {
//       if (!this.isScroll) { // 分页加载数据
//         return this.songList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
//       } else {
//         return this.songList
//       }
//     },
//     isCurSong () {
//       const self = this

//       return (item, index) => {
//         return ['list-item', self.stripe ? (index % 2 === 0 ? 'stripe' : '') : '', self.isPlayed && (item.id === self.curSongInfo.id) ? 'active' : '', (item.license || item.vip) ? 'disable' : '', item.vip ? 'vip' : '']
//       }
//     },
//     isShowPagination () {
//       return this.songList.length > this.pageSize && !this.isScroll
//     },
//     playIcon () {
//       const self = this

//       return (item) => {
//         return ['iconfont', 'playicon', this.isPlayed && (item.id === self.curSongInfo.id) ? 'icon-pause' : 'icon-play']
//       }
//     },
//     curSongSty () {
//       return `transform: translateY(${this.curScroll}px)`
//     },
//     curSongInfo () {
//       return this.playList[this.playIndex]
//     }
//   },
//   mounted () {
//     this.scrollCurSong(this.curSongInfo)
//   },
//   // 方法集合
//   methods: {
//     ...mapMutations({
//       setPlayStatus: 'SET_PLAYSTATUS',
//       setPlayList: 'SET_PLAYLIST',
//       setPlayListTips: 'setPlayListTips',
//       setPlayIndex: 'SET_PLAYINDEX'
//     }),
//     // 全局设置当前播放歌曲
//     currentSong (item) {
//       // 若当前唔歌曲 或者 当前播放歌曲不是本歌单显示的歌曲  立即播放当前歌单
//       if (!this.curSongInfo || item.id !== this.curSongInfo.id) {
//         this.selectPlay({ list: [item] })
//         if (this.isShowTips) {
//           this.setPlayListTips({ flag: true, txt: '已开始播放' })
//           clearTimeout(this.timer)
//           this.timer = setTimeout(() => {
//             this.setPlayListTips({ flag: false, txt: '已开始播放' })
//           }, 2000)
//         }
//       } else {
//         this.setPlayStatus(!this.isPlayed)
//       }
//     },
//     // 表格列表序号格式化
//     indexMethod (page) {
//       if (!this.isScroll) {
//         return (this.currentPage - 1) * this.pageSize + page + 1 + this.offset
//       } else {
//         return page + 1
//       }
//     },
//     // 歌曲列表分页功能
//     currentChange (page) {
//       this.currentPage = page
//     },
//     // 添加当前歌曲到播放列表
//     addSongList (item) {
//       this.addList({ list: [item] })

//       if (this.isShowTips) {
//         this.setPlayListTips({ flag: true, txt: '已添加到播放列表' })
//         clearTimeout(this.timer)
//         this.timer = setTimeout(() => {
//           this.setPlayListTips({ flag: false, txt: '已添加到播放列表' })
//         }, 2000)
//       }
//     },
//     // 在播放列表删除当前歌曲
//     delList (index) {
//       this.playList.splice(index, 1)
//       this.setPlayList(this.playList)
//     },
//     // 喜欢该歌曲
//     async likeSong (item) {
//       const { data: res } = await this.$http.likeSong({ id: item.id, like: !item.like })

//       if (res.code !== 200) {
//         return this.$msg.error('数据请求失败')
//       }
//       this.$msg.success('收藏成功')
//     },
//     tips (e, item) {
//       if (e.target.nodeName !== 'A') {
//         if (item.license) {
//           this.$msg.error('由于版权保护，您所在的地区暂时无法使用。')
//         }

//         if (item.vip) {
//           this.$msg.error('付费歌曲，请在网易云音乐播放')
//         }
//       }
//     },
//     closeAddListPop () {
//       this.$refs.popAddList.forEach(item => {
//         item.doClose()
//       })
//     },
//     // 滚动到当前播放音乐的位置
//     scrollCurSong (cur) {
//       const self = this
//       if (self.isScroll) {
//         const curIndex = self.songList.findIndex(item => {
//           return item.id === cur.id
//         })

//         if (curIndex > 7 && curIndex < self.songList.length - 8) {
//           self.curScroll = -(curIndex - 4) * 50
//         } else if (curIndex >= (self.songList.length - 8) && self.songList.length - 8 > 0) {
//           self.curScroll = -(self.songList.length - 8) * 50
//         } else {
//           self.curScroll = 0
//         }
//         self.$refs.curSongRef.addEventListener('wheel', (event) => {
//           if (event.wheelDelta > 0 || event.detail < 0) {
//             self.curScroll = Math.abs(self.curScroll) > 0 ? self.curScroll + 50 : 0
//           } else {
//             self.curScroll = Math.abs(self.curScroll) < (self.songList.length - 8) / 2 * 100 ? self.curScroll - 50 : self.curScroll
//           }
//         })
//       }
//     },
//     ...mapActions(['selectPlay', 'addList'])
//   },
//   watch: {
//     curSongInfo: {
//       handler (val, oldVal) {
//         this.scrollCurSong(val)
//       },
//       deep: true
//     },
//     songList () {
//       this.currentPage = 1
//     }
//   },
//   beforeUnmount () {
//     clearTimeout(this.timer)
//   }
// }
</script>
<style scoped lang="less">
@import './index.less';
</style>
