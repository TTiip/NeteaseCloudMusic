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
              class="is-active"
              v-for="item in menuList"
              :key="item.path"
            >
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
const menuList = reactive([
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
@import './index.less';
</style>
