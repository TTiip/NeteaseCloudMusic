import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/home/home.vue')
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import(/* webpackChunkName: "Singer" */ '../views/singer/singer.vue')
  },
  {
    path: '/song',
    name: 'Song',
    component: () => import(/* webpackChunkName: "Song" */ '../views/song/song.vue')
  },
  {
    path: '/playlist',
    name: 'PlayList',
    component: () => import(/* webpackChunkName: "PlayList" */ '../views/play-list/play-list.vue')
  },
  {
    path: '/playlist/detail',
    name: 'PlayListDetail',
    component: () => import(/* webpackChunkName: "PlayListDetail" */ '../views/play-list-detail/play-list-detail.vue')
  },
  {
    path: '/album',
    name: 'Album',
    component: () => import(/* webpackChunkName: "PlayListDetail" */ '../views/album/album.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import(/* webpackChunkName: "User" */ '../views/user/user.vue')
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import(/* webpackChunkName: "Rank" */ '../views/rank/rank.vue')
  },
  {
    path: '/artist',
    name: 'Artist',
    component: () => import(/* webpackChunkName: "Artist" */ '../views/artist/artist.vue')
  },
  {
    path: '/mvlist',
    name: 'MvList',
    component: () => import(/* webpackChunkName: "MvList" */ '../views/mv-list/mv-list.vue')
  },
  {
    path: '/mvdetail',
    name: 'MvDetail',
    component: () => import(/* webpackChunkName: "MvDetail" */ '../views/mv-detail/mv-detail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
