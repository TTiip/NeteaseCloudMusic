<template>
  <div class="header">
    <div class="w1200">
      <el-row class="wrapper">
        <el-col :span="4">
          <router-link
            to="/"
            class="logo"
          >
            <img
              src="../../assets/logo.jpg"
              alt
            >
          </router-link>
        </el-col>
        <el-col :span="12">
          <ul class="nav">
            <li
              v-for="item in menuList"
              :key="item.path"
              :class="[menuActive.indexOf(item.path) === 0 ? 'is-active' : '']"
              @click="selectMenu(item.path)"
            >
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <div
            v-clickoutside="search.handleClose"
            class="search"
          >
            <el-popover
              ref="popover"
              v-model:visible="search.isShowSearch"
              :width="226"
              placement="bottom-end"
              trigger="manual"
            >
              <template #reference>
                <el-input
                  v-model="search.keyVal"
                  class="keyVal"
                  placeholder="请输入歌名、歌词、歌手或专辑"
                  clearable
                  @focus="search.handleFocus"
                  @input="search.handleInput"
                />
              </template>
              <div>
                <div
                  v-if="!search.keyVal"
                  class="hot-search"
                >
                  <h5>热门搜索</h5>
                  <div class="hot-search-list">
                    <div
                      v-for="(item, index) in search.searchHotList"
                      :key="index"
                      class="hot-item"
                      @click="jumpSearch(item)"
                    >
                      <span :class="[index < 3 ? 'top-' + index : '']">{{ (index + 1) + '.' }}</span>
                      {{ item.first }}
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="search-key-list"
                >
                  <div
                    v-for="(item, index) in search.suggestInfo.order"
                    :key="index"
                    class="search-item"
                  >
                    <h6>{{ listType[item] }}</h6>
                    <div class="item-main">
                      <div
                        v-for="(val, k) in search.suggestInfo[item]"
                        :key="k"
                        class="list"
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
                </div>
              </div>
            </el-popover>
            <i
              class="iconfont icon-search"
              @click="searchFunc"
            />
          </div>
        </el-col>
        <el-col
          :span="2"
          :class="isLogin ? 'user-avatar' : 'login'"
        >
          <div
            v-if="isLogin"
            class="logined"
          >
            <el-dropdown
              placement="bottom"
              @command="dropDownItemClick"
            >
              <el-image
                :src="userInfo.avatarUrl"
                class="avatar"
              >
                <template #placeholder>
                  <div class="image-slot">
                    <i class="iconfont icon-placeholder" />
                  </div>
                </template>
              </el-image>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="user">
                    <router-link to="/">
                      <i class="iconfont icon-home" />我的主页
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item command="quit">
                    <i class="iconfont icon-quit" />退出
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <span
            class="login-btn"
            @click="loginClick"
          >登录</span>
        </el-col>
      </el-row>
    </div>
    <div>
      <teleport to="#login">
        <Login
          v-if="showLogin"
          @closeDialog="closeDialog"
        />
      </teleport>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { SearchHotItemProps, SuggestInfoResultProps } from '@/interface'
import useMessage from '@/hooks/useMessage'
import { removeSessionStorage } from '@/hooks/useSessionStorage'
//
import Login from '@/components/login/login.vue'
//
// import router from '@/router'
import { useRoute, useRouter } from 'vue-router'
import store from '@/store'
import axios from '@/axios'

const route = useRoute()
const router = useRouter()

// 菜单相关
const menuActive = computed(() => router.currentRoute.value.path)
const isLogin = computed(() => store.state.isLogin)
const userInfo = computed(() => store.state.userInfo)
const menuList = ref([
  {
    name: '首页',
    path: '/home'
  },
  {
    name: '排行榜',
    path: '/rank'
  },
  {
    name: '歌单',
    path: '/playlist'
  },
  {
    name: 'MV',
    path: '/mvlist'
  },
  {
    name: '歌手',
    path: '/artist'
  }
])

const searchFunc = () => {
  // 点击搜索关键词，跳转到搜索结果页面
  if (search.keyVal) {
    router.push({ path: '/search', query: { key: search.keyVal } })
    search.isShowSearch = false
  }
}

// 默认热门搜索列表，点击后台跳转到搜索结果页面
const jumpSearch = (item: any) => {
  search.isShowSearch = false
  search.keyVal = item.first
  console.log(item, 'item')
  if (item.first === route.query.key) {
    return
  }
  router.push({ path: '/search', query: { key: item.first } })
}
// 搜索建议列表，点击后跳转到相对应的落地页
const jumpPage = (item: any, type: any) => {
  search.keyVal = item.name
  switch (type) {
    case 'songs':
      router.push({ path: '/song', query: { id: item.id } })
      break
    case 'artists':
      router.push({ path: '/singer', query: { id: item.id } })
      break
    case 'albums':
      router.push({ path: '/album', query: { id: item.id } })
      break
    case 'playlists':
      router.push({ path: '/playlist/detail', query: { id: item.id } })
      break
  }
  search.isShowSearch = false
}

const getLoginOut = async () => {
  const res = await axios({ url: 'getLogout', method: 'GET' })
  if (res.code !== 200) {
    useMessage('error', '退出操作出现错误，稍后再试！~')
    return false
  }
  useMessage('success', '退出成功!~')
  // 存储session
  removeSessionStorage('isLogin')
  removeSessionStorage('token')
  removeSessionStorage('cookie')
  removeSessionStorage('userInfo')
  // 设置登录相关信息
  store.commit('setLogin', false)
  store.commit('setUserInfo', {})
}
const dropDownItemClick = (command: string) => {
  switch (command) {
    case 'home' :
      console.log('home')
      break
    case 'grade' :
      console.log('home')
      break
    case 'set':
      console.log('home')
      break
    case 'quit':
      getLoginOut()
      // reload && reload()
      break
  }
}
// search相关
const listType = reactive({
  songs: '单曲',
  artists: '歌手',
  albums: '专辑',
  playlists: '歌单'
})
const search = reactive({
  isShowSearch: false,
  keyVal: '',
  suggestInfo: {} as SuggestInfoResultProps,
  searchHotList: [] as SearchHotItemProps[],
  handleClose: () => {
    search.isShowSearch = false
  },
  handleFocus: async () => {
    if (!search.searchHotList.length) {
      const res = await axios({
        url: 'getSearchHot',
        method: 'GET',
        headers: {
          showLoading: false
        }
      })
      search.searchHotList = res.result.hots
      search.isShowSearch = true
    } else {
      search.isShowSearch = true
    }
  },
  handleInput: async (event: Event) => {
    const res = await axios({
      url: 'getSearchSuggest',
      method: 'GET',
      params: {
        keywords: event
      }
    })
    search.suggestInfo = res.result
  }
})
// login
const showLogin = computed(() => store.state.showLogin)
const loginClick = async () => {
  store.commit('setShowLogin', true)
}
const closeDialog = () => {
  store.commit('setShowLogin', false)
}

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
</script>
<style scoped lang="less">
@import "./index.less";
</style>
