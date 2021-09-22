<template>
  <div class="mv">
    <!-- 列表有重复的MV， 相同id的key会报错，加上字符串的index -->
    <div
      v-for="(item, index) in mvList"
      :key="'' + item.id + index"
      class="item"
    >
      <router-link
        :to="{ path: '/mvdetail', query: { id: item.id }}"
        class="faceImg"
      >
        <i class="iconfont icon-play" />
        <el-image :src="item.cover || item.imgurl">
          <template #placeholder>
            <div
              class="image-slot"
            >
              <i class="iconfont icon-placeholder" />
            </div>
          </template>
        </el-image>
      </router-link>
      <div class="info">
        <router-link
          :to="{ path: '/mvdetail', query: { id: item.id }}"
          class="mv-name"
        >
          {{ item.name }}
        </router-link>
        <router-link
          v-if="!item.publishTime"
          :to="{ path: '/singer', query: { id: item.artistId }}"
          class="mv-author"
        >
          {{ item.artistName }}
        </router-link>
        <div class="mv-playCount">
          <i class="iconfont icon-video" /> {{ utils.formartNum(item.playCount) }}
        </div>
        <div
          v-if="item.publishTime"
          class="mv-time"
        >
          发布时间：{{ item.publishTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import utils from '@/utils'
import { PropType } from 'vue'
import { GetMvFirstDataItem } from '@/interface'

defineProps({
  mvList: {
    type: Array as PropType<GetMvFirstDataItem[]>,
    default: () => ([])
  }
})
</script>
<style scoped lang="less">
@import './index.less';
</style>
