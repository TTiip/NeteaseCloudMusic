<template>
  <div class="mv">
    <div class="w1200">
      <div class="filter">
        <div class="filter-item">
          <span>区域</span>
          <em
            v-for="(item, index) in area"
            :key="index"
            :class=" index === areaIndex ? 'active' : ''"
            @click="selectType('area', index)"
          >{{ item }}</em>
        </div>
        <div class="filter-item">
          <span>类型</span>
          <em
            v-for="(item, index) in type"
            :key="index"
            :class=" index === typeIndex ? 'active' : ''"
            @click="selectType('type', index)"
          >{{ item }}</em>
        </div>
      </div>
      <div class="list-container">
        <div class="list-head">
          <h2>全部MV</h2>
          <div class="type">
            <span
              v-for="(item, index) in order"
              :key="index"
              :class=" index === orderIndex ? 'active' : ''"
              @click="selectType('order', index)"
            >{{ item }}</span>
          </div>
        </div>
        <MvList
          v-infinite-scroll="loadMv"
          class="loadMv"
          :mv-list="list"
          infinite-scroll-disabled="isLoadMv"
          infinite-scroll-distance="50"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import axios from '@/axios'

import MvList from '@/components/mv-list/mv-list.vue'

/* data */
const area = ref(['全部', '内地', '港台', '欧美', '日本', '韩国'])
const type = ref(['全部', '官方版', '原生', '现场版', '网易出品'])
const order = ref(['上升最快', '热门', '最新'])
const areaIndex = ref(0)
const typeIndex = ref(0)
const orderIndex = ref(0)
const params = ref({
  area: '',
  type: '',
  order: '',
  limit: 30,
  offset: 0
})
const list = ref([])
const isLoading = ref(true)
const isLoadMv = ref(true)

/* mounted */
onMounted(() => {
  params.value.area = area.value[areaIndex.value]
  params.value.type = type.value[typeIndex.value]
  params.value.order = order.value[orderIndex.value]
})

/* watch */
watch(params.value, (newVal) => {
  getMv(newVal)
})

/* methods */
const getMv = async (params: any) => {
  const getMvAllData = await axios({
    url: 'getMvAll',
    method: 'GET',
    params
  })

  list.value = params.offset !== 0
    ? [...list.value, ...getMvAllData.data]
    : getMvAllData.data
  isLoadMv.value = !getMvAllData.hasMore
  isLoading.value = getMvAllData.hasMore
}
const selectType = (typeStr: any, index: any) => {
  switch (typeStr) {
    case 'area':
      areaIndex.value = index
      params.value.area = area.value[index]
      break
    case 'type':
      typeIndex.value = index
      params.value.type = type.value[index]
      break
    case 'order':
      orderIndex.value = index
      params.value.order = order.value[index]
      break
    default:
      break
  }
  list.value = []
  params.value.offset = 0
}
const loadMv = () => {
  isLoadMv.value = true
  params.value.offset = +list.value.length
}

</script>

<style scoped lang="less">
@import './index.less';
</style>
