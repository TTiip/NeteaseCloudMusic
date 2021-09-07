<template>
  <div class="header">
    <div class="w1200">
      <el-row class="wrapper">
        <el-col :span="4">
          <router-link to="/" class="logo">
            <img src="../../assets/logo.jpg" alt />
          </router-link>
        </el-col>
        <el-col :span="12">
          <ul class="nav">
            <li
              :class="[menuActive.indexOf(item.path) === 0 ? 'is-active' : '']"
              v-for="item in menuList"
              :key="item.path"
              @click="selectMenu(item.path)"
            >
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <div class="search" v-clickoutside="search.handleClose">
            <el-popover
              :width='200'
              ref="popover"
              placement="bottom-end"
              trigger="manual"
              v-model:visible="search.isShowSearch"
            >
              <template #reference>
                <el-input
                  class="keyVal"
                  placeholder="请输入歌名、歌词、歌手或专辑"
                  v-model="search.keyVal"
                  @focus="search.handleFocus"
                  @input="search.handleInput"
                  clearable
                ></el-input>
              </template>
              <div>
                <div class="hot-search">
                  <h5>热门搜索</h5>
                  <div class="hot-search-list" v-if="!search.keyVal">
                    <div
                      class="hot-item"
                      v-for="(item, index) in search.searchHotList"
                      :key="index"
                    >
                      <span :class="[index < 3 ? 'top-' + index : '']">{{ (index + 1) + '.' }}</span>
                      {{ item.first }}
                    </div>
                  </div>
                </div>
                <!-- <div class="search-key-list" v-else>
                  <div class="search-item" v-for="(item, index) in suggestInfo.order" :key="index">
                    <h6>{{ listType[item] }}</h6>
                    <div class="item-main">
                      <div
                        class="list"
                        v-for="(val, k) in suggestInfo[item]"
                        :key="k"
                        @click="jumpPage(val, item)"
                      >
                        {{ val.name }}
                        <template v-if="item === 'songs'">
                          -
                          <span
                            v-for="(a, i) in val.artists"
                            :key="i"
                          >{{ a.name + (i !== 0 ? ' / ' : '') }}</span>
                        </template>
                        <template v-else-if="item === 'albums'">
                          -
                          <span>{{ val.artist.name }}</span>
                        </template>
                      </div>
                    </div>
                  </div>
                </div> -->
              </div>
            </el-popover>
            <!-- <i class="iconfont icon-search" slot="suffix" @click="search"></i> -->
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import * as https from '@/https'
import router from '@/router'
import store from '@/store'
// 菜单相关
const menuActive = computed(() => router.currentRoute.value.path)
const isLogin = computed(() => store.state.isLogin)
const menuList = ref([
  {
    name: '首页',
    path: '/index'
  }, {
    name: '排行榜',
    path: '/rank'
  }, {
    name: '歌单',
    path: '/playlist'
  }, {
    name: 'MV',
    path: '/mvlist'
  }, {
    name: '歌手',
    path: '/artist'
  }, {
    name: '我的音乐',
    path: '/my'
  }
])
// search相关
const search = reactive({
  isShowSearch: false,
  keyVal: '',
  searchHotList: [] as https.SearchHotItemProps[],
  handleClose: () => {
    search.isShowSearch = false
  },
  handleFocus: async () => {
    if (!search.searchHotList.length) {
      const res = (await https.getSearchHot())
      search.searchHotList = res.result.hots
      search.isShowSearch = true
    } else {
      search.isShowSearch = true
    }
    // console.log(searchHotList.result.hots)
  },
  handleInput: (event: Event) => {
    console.log(event, 'handleInput')
  }
})

const selectMenu = (path: string): void => {
  if (isLogin.value || !path.includes('/my')) {
    router.push({
      path
    })
  } else {
    // this.loginDialog()
    console.log('aaaa')
  }
}
// curIndex: '0',
// keyVal: '',
// logined: true,
// profile: {},
// serachHot: [],
// suggestInfo: {},
// listType: {
//   songs: '单曲',
//   artists: '歌手',
//   albums: '专辑',
//   playlists: '歌单'
// },
// isShowSearch: false

// import { mapGetters, mapMutations } from 'vuex'
// export default {
//   name: 'myHeader',
//   components: {
//   },
//   data () {
//     // 这里存放数据
//     return {
//       curIndex: '0',
//       keyVal: '',
//       logined: true,
//       profile: {},
//       serachHot: [],
//       suggestInfo: {},
//       listType: {
//         songs: '单曲',
//         artists: '歌手',
//         albums: '专辑',
//         playlists: '歌单'
//       },
//       menuList: [{
//         name: '首页',
//         path: '/index'
//       }, {
//         name: '排行榜',
//         path: '/rank'
//       }, {
//         name: '歌单',
//         path: '/playlist'
//       }, {
//         name: 'MV',
//         path: '/mvlist'
//       }, {
//         name: '歌手',
//         path: '/artist'
//       }, {
//         name: '我的音乐',
//         path: '/my'
//       }],
//       isShowSearch: false
//     }
//   },
//   // 监听属性 类似于data概念
//   computed: {
//     ...mapGetters(['isLogin', 'userInfo']),
//     menuActive () {
//       return this.$route.path
//     }
//   },
//   // 方法集合
//   methods: {
//     ...mapMutations(['setLogin', 'setUserInfo', 'setLoginDialog']),
//     async getSearchHot () {
//       const { data: res } = await this.$http.serachHot()

//       if (res.code !== 200) {
//         return this.$msg.error('数据请求失败')
//       }

//       this.serachHot = res.result.hots
//     },
//     async getSerachSuggest () {
//       const { data: res } = await this.$http.serachSuggest({ keywords: this.keyVal })

//       if (res.code !== 200) {
//         return this.$msg.error('数据请求失败')
//       }

//       this.suggestInfo = res.result
//     },
//     async logout () {
//       const { data: res } = await this.$http.logout()

//       if (res.code !== 200) {
//         return this.$msg.error('数据请求失败')
//       }

//       this.$msg.success('退出成功')
//       window.sessionStorage.removeItem('isLogin')
//       window.sessionStorage.removeItem('token')
//       window.sessionStorage.removeItem('cookie')
//       window.sessionStorage.removeItem('userInfo')
//       this.setLogin(false)
//       this.setUserInfo()

//       if (this.$route.path.indexOf('/my') >= 0) {
//         this.$router.push({ path: '/' })
//       }
//     },
//     loginDialog () {
//       this.setLoginDialog(true)
//     },
//     // 顶部头像下拉菜单
//     userMenuHandler (type) {
//       switch (type) {
//         case 'home':
//           this.$router.push({
//             name: 'homePage'
//           })
//           break
//         case 'grade':
//           this.$router.push({
//             name: 'grade'
//           })
//           break
//         case 'set':
//           this.$router.push({
//             name: 'setting'
//           })
//           break
//         case 'quit':
//           this.logout()
//           break
//       }
//     },
//     // 默认热门搜索列表，点击后台跳转到搜索结果页面
//     jumpSearch (item) {
//       this.isShowSearch = false
//       this.keyVal = item.first
//       if (item.first === this.$route.query.key) {
//         return
//       }
//       this.$router.push({ path: '/search', query: { key: item.first } })
//     },
//     // 搜索建议列表，点击后跳转到相对应的落地页
//     jumpPage (item, type) {
//       this.keyVal = item.name
//       switch (type) {
//         case 'songs':
//           this.$router.push({ path: '/song', query: { id: item.id } })
//           break
//         case 'artists':
//           this.$router.push({ path: '/singer', query: { id: item.id } })
//           break
//         case 'albums':
//           this.$router.push({ path: '/album', query: { id: item.id } })
//           break
//         case 'playlists':
//           this.$router.push({ path: '/playlist/detail', query: { id: item.id } })
//           break
//       }
//       this.isShowSearch = false
//     },
//     showSearch () {
//       // 显示搜索列表 若有关键词显示搜索建议，否则显示默认热门搜索列表
//       if (!this.keyVal) {
//         this.serachHot = []
//         this.getSearchHot()
//       } else {
//         this.suggestInfo = {}
//         this.getSerachSuggest()
//       }
//     },
//     search () {
//       // 点击搜索关键词，跳转到搜索结果页面
//       if (this.keyVal) {
//         this.$router.push({ path: '/search', query: { key: this.keyVal } })
//         this.isShowSearch = false
//       }
//     },
//     handleInput () {
//       if (this.keyVal) {
//         this.showSearch()
//         this.isShowSearch = true
//       } else {
//         this.isShowSearch = false
//       }
//     },
//     handleFocus () {
//       this.showSearch()
//       this.isShowSearch = true
//     },
//     handleClose () {
//       this.isShowSearch = false
//     },
//     selectMenu (item) {
//       if (this.isLogin || item.indexOf('/my') < 0) {
//         this.$router.push({
//           path: item
//         })
//       } else {
//         this.loginDialog()
//       }
//     }
//   },
//   watch: {
//     keyVal (newVal, oldVal) {
//       this.keyVal = newVal
//     }
//   }
// }
</script>
<style scoped lang="less">
  @import "./index.less";
</style>
