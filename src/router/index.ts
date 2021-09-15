import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/home/index.vue')
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import(/* webpackChunkName: "Singer" */ '../views/singer/index.vue')
  },
  {
    path: '/mv',
    name: 'MV',
    component: () => import(/* webpackChunkName: "MV" */ '../views/mv/index.vue')
  },
  {
    path: '/song',
    name: 'Song',
    component: () => import(/* webpackChunkName: "Song" */ '../views/song/index.vue')
  },
  {
    path: '/playlist',
    name: 'PlayList',
    component: () => import(/* webpackChunkName: "PlayList" */ '../views/play-list/index.vue')
  },
  {
    path: '/playlist/detail',
    name: 'PlayListDetail',
    component: () => import(/* webpackChunkName: "PlayListDetail" */ '../views/play-list-detail/index.vue')
  },
  {
    path: '/album',
    name: 'Album',
    component: () => import(/* webpackChunkName: "PlayListDetail" */ '../views/album/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
