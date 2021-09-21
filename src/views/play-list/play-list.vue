<template>
  <div class="playlist">
    <div class="w1200">
      <div class="filter">
        <div
          v-for="(item, index) in categories"
          :key="index"
          class="filter-item"
        >
          <div class="filter-title">
            {{ item.name }}
          </div>
          <div class="filter-box">
            <span
              v-for="subItem in item.children.slice(0, 8)"
              :key="subItem.name"
              :class="['item-box', curType === subItem.name ? 'active' : '']"
            ><em @click="selectType(subItem)">{{ subItem.name }}</em></span>
            <el-popover
              v-if="item.children.length > 9"
              placement="bottom"
              :width="200"
              trigger="click"
            >
              <template #reference>
                <div :class="['item-box', 'filter-more', moreTxt[index] ? 'active' : '']">
                  <em>
                    {{ moreTxt[index] ? curType : '更多' }}<i class="iconfont icon-arrow" />
                  </em>
                </div>
              </template>
              <div class="filter-drop">
                <span
                  v-for="subItem in item.children.slice(9)"
                  :key="subItem.name"
                  :class="['item-box', curType === subItem.name ? 'active' : '']"
                ><em @click="selectType(subItem)">{{ subItem.name }}</em></span>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
      <div class="list-container">
        <div class="list-head">
          <h2>
            {{ curType }} <em
              v-if="curType !== allList.name"
              class="filter-close"
              @click="closed"
            ><i class="iconfont icon-closed" /></em>
          </h2>
          <div class="type">
            <span
              :class="params.order === 'hot' ? 'active' : ''"
              @click="selectOrder('hot')"
            >热门</span>
            <span
              :class="params.order === 'new' ? 'active' : ''"
              @click="selectOrder('new')"
            >最新</span>
          </div>
        </div>
        <PlayListPage
          :params="params"
          :is-scroll="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/axios'

import PlayListPage from '@/components/play-list-page/play-list-page.vue'
const route = useRoute()
const router = useRouter()

/* data */
const sub = ref([])
const categories: any = ref([])
const curType = ref('')
const moreTxt = ref({})
const allList: any = ref({})
const params: any = ref({
  order: 'hot',
  cat: '',
  limit: 50,
  offset: 0
})

/* methods */
const getCatlist = async () => {
  const getPlaylistCatlistData = await axios({
    url: 'getPlaylistCatlist',
    method: 'GET'
  })
  sub.value = getPlaylistCatlistData.sub

  for (const k in getPlaylistCatlistData.categories) {
    const params = {
      name: getPlaylistCatlistData.categories[k],
      children: []
    }

    params.children = sub.value.filter((subItem: any) => { return subItem.category === Number(k) })
    categories.value.push(params)
  }

  curType.value = route.query.cat ? route.query.cat : getPlaylistCatlistData.all.name
  allList.value = getPlaylistCatlistData.all
  getMoreTxt()
}
const selectType = (item: any) => {
  curType.value = item.name
  router.push({ path: '/playlist', query: { cat: item.name, order: params.value.order } })
}
const closed = () => {
  curType.value = '全部歌单'
  router.push({ path: '/playlist' })
}
const selectOrder = (type: any) => {
  router.push({ path: 'playlist', query: { cat: params.value.cat, order: type } })
}
const getMoreTxt = () => {
  // 查询当前显示的歌单分类详情，如：全部歌单、华语
  const itemInfo: any = sub.value.find((subItem: any) => { return subItem.name === curType.value })
  moreTxt.value = {}
  if (itemInfo) {
    // 若有歌单分类，且分类歌单的索引在更多里面，则渲染moreText数据
    const index = categories.value[itemInfo.category].children.indexOf(itemInfo)
    index >= 8 && (moreTxt.value[itemInfo.category] = itemInfo)
  }
}

/* mounted */
onMounted(() => {
  params.value.cat = route.query.cat
  getCatlist()
})

/* watch */
watch(() => route.query, (newVal) => {
  const { cat, order } = newVal

  curType.value = cat || allList.value.name
  params.value = Object.assign({}, { order: 'hot', cat: '', limit: 50, offset: 0 }, { cat: cat || '', order: order || 'hot' })
  getMoreTxt()
})

</script>

<style scoped lang="less">
@import './index.less';
</style>
