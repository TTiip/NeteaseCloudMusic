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
              :width="226"
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
                <div v-if="!search.keyVal" class="hot-search">
                  <h5>热门搜索</h5>
                  <div class="hot-search-list">
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
                <div class="search-key-list" v-else>
                  <div
                    class="search-item"
                    v-for="(item, index) in search.suggestInfo.order"
                    :key="index"
                  >
                    <h6>{{ listType[item] }}</h6>
                    <div class="item-main">
                      <div class="list" v-for="(val, k) in search.suggestInfo[item]" :key="k">
                        <!-- @click="jumpPage(val, item)" -->
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
            <i class="iconfont icon-search"></i>
          </div>
        </el-col>
        <el-col :span="2" :class="isLogin ? 'user-avatar' : 'login'">
          <div class="logined" v-if="isLogin">
            <el-dropdown placement="bottom">
              <el-image :src="userInfo.avatarUrl" class="avatar">
                <template #placeholder>
                  <div class="image-slot">
                    <i class="iconfont icon-placeholder"></i>
                  </div>
                </template>
              </el-image>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="user">
                    <router-link to="/">
                      <i class="iconfont icon-home"></i>我的主页
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item command="grade">
                    <i class="iconfont icon-grade"></i>我的等级
                  </el-dropdown-item>
                  <el-dropdown-item command="set">
                    <i class="iconfont icon-set"></i>设置
                  </el-dropdown-item>
                  <el-dropdown-item command="quit">
                    <i class="iconfont icon-quit"></i>退出
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <span class="login-btn" v-else @click="loginClick">登录</span>
        </el-col>
      </el-row>
    </div>
  </div>
  <Login v-if="qrUrl" :qrUrl='qrUrl' />
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { SearchHotItemProps, suggestInfoResult } from '@/interface'
import Login from '@/components/login/index.vue'
import router from '@/router'
import store from '@/store'
import http from '@/http'
// 菜单相关
const menuActive = computed(() => router.currentRoute.value.path)
const isLogin = computed(() => store.state.isLogin)
const userInfo = computed(() => store.state.userInfo)
const qrUrl = ref('')
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
const listType = reactive({
  songs: '单曲',
  artists: '歌手',
  albums: '专辑',
  playlists: '歌单'
})
const search = reactive({
  isShowSearch: false,
  keyVal: '',
  suggestInfo: {} as suggestInfoResult,
  searchHotList: [] as SearchHotItemProps[],
  handleClose: () => {
    search.isShowSearch = false
  },
  handleFocus: async () => {
    if (!search.searchHotList.length) {
      const res = await http({
        url: 'getSearchHot',
        method: 'GET'
      })
      search.searchHotList = res.result.hots
      search.isShowSearch = true
    } else {
      search.isShowSearch = true
    }
  },
  handleInput: async (event: Event) => {
    const res = await http({
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
const loginClick = async () => {
  // const res: any = await getQR()
  // qrUrl.value = res.data.qrurl
  // console.log(res.data.qrurl, 'resssss')
  // qrimg
  // qrurl
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
