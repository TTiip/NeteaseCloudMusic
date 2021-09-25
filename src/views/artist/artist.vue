<template>
  <div class="artist">
    <div class="w1200">
      <div class="filter">
        <div class="filter-item">
          <span
            v-for="(item, index) in initial"
            :key="index"
            :class="index === initialIndex ? 'active' : ''"
            @click="selectType('initial', index)"
          >{{ item.label }}</span>
        </div>
        <div class="filter-item">
          <span
            v-for="(item, index) in area"
            :key="index"
            :class=" index === areaIndex ? 'active' : ''"
            @click="selectType('area', index)"
          >{{ item.label }}</span>
        </div>
        <div class="filter-item">
          <span
            v-for="(item, index) in type"
            :key="index"
            :class=" index === typeIndex ? 'active' : ''"
            @click="selectType('type', index)"
          >{{ item.label }}</span>
        </div>
      </div>
      <div
        v-infinite-scroll="loadMore"
        class="list-container"
      >
        <router-link
          v-for="item in list"
          :key="item.id"
          :to="{ path: '/singer', query: { id: item.id }}"
          class="item"
        >
          <div class="faceImg">
            <el-image :src="item.picUrl + '?param=120y120'">
              <template #placeholder>
                <div class="image-slot">
                  <i class="iconfont icon-placeholder" />
                </div>
              </template>
            </el-image>
          </div>
          <div class="info">
            <div class="name">
              {{ item.name }}
            </div>
            <div class="albumSize">
              专辑：{{ item.albumSize }}
            </div>
          </div>
        </router-link>
      </div>
      <div
        v-loading="isLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="width: 100%;margin: 10px 0;"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from '@/axios'
import { ref, watch, onMounted } from 'vue'

/* data */

const type = ref([
  { label: '全部', val: -1 },
  { label: '男歌手', val: 1 },
  { label: '女歌手', val: 2 },
  { label: '乐队', val: 3 }
])
const area = ref([
  { label: '全部', val: -1 },
  { label: '华语', val: 7 },
  { label: '欧美', val: 96 },
  { label: '日本', val: 8 },
  { label: '韩国', val: 16 },
  { label: '其他', val: 0 }
])
const initial: any = ref([
  { label: '热门', val: -1 },
  { label: '#', val: 0 }
])
const params: any = ref({
  area: '',
  type: '',
  initial: '',
  limit: 30,
  offset: 0
})
const typeIndex = ref(0)
const areaIndex = ref(0)
const initialIndex = ref(0)
const list: any = ref([])
const isLoading = ref(true)
const isLoadMv: any = ref(true)

/* watch */
watch(params.value, () => {
  getArtist(params.value)
})

/* mounted */
onMounted(() => {
  params.value.area = area.value[areaIndex.value].val
  params.value.type = type.value[typeIndex.value].val
  params.value.initial = initial.value[initialIndex.value].val
  renderInitial()
})
/* methods */

const renderInitial = () => {
  const alphabet = []
  for (let i = 0; i < 26; i++) {
    alphabet.push({
      label: String.fromCharCode(65 + i),
      val: String.fromCharCode(97 + i)
    })
  }
  initial.value = [initial.value[0], ...alphabet, initial.value[1]]
}
const selectType = (typeStr: any, index: any) => {
  switch (typeStr) {
    case 'initial':
      initialIndex.value = index
      params.value.initial = initial.value[index].val
      break
    case 'area':
      areaIndex.value = index
      params.value.area = area.value[index].val
      break
    case 'type':
      typeIndex.value = index
      params.value.type = type.value[index].val
      break
    default:
      break
  }
  list.value = []
  params.value.offset = 0
}
const getArtist = async (params: any) => {
  const getArtistListData: any = await axios({
    url: 'getArtistList',
    method: 'GET',
    params
  })

  list.value = params.offset !== 0 ? [...list.value, ...getArtistListData.artists] : getArtistListData.artists
  isLoadMv.value = !getArtistListData.more
  isLoading.value = getArtistListData.more
}
const loadMore = () => {
  isLoadMv.value = true
  params.value.offset = +list.value.length
}
</script>

<style scoped lang="less">
@import './index.less';
</style>
