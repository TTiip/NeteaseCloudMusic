<template>
  <div class="playlist">
    <div
      v-for="item in playList"
      :key="item.id"
      class="item"
    >
      <a
        :to="{ path: 'playlist/detail', query: { id: item.id }}"
        class="faceImg"
      >
        <el-image
          :src="item.coverImgUrl"
          lazy
        >
          <template #placeholder>
            <div class="image-slot">
              <i class="iconfont icon-placeholder" />
            </div>
          </template>
        </el-image>
        <span class="playCount"><i class="iconfont icon-playnum" /><em>{{ item.playCount }}</em></span>
      </a>
      <div class="info">
        <a
          :to="{ path: 'playlist/detail', query: { id: item.id }}"
          class="info_name"
        >
          {{ item.name }}
        </a>
        <div class="tags">
          <a
            v-for="(tag, index) in item.tags"
            :key="index"
            :to="{ path: '/playlist', query: { cat: tag }}"
            class="tag"
          >
            #{{ tag }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { GetTopListItem } from '@/interface'
defineProps({
  playList: {
    type: Array as PropType<GetTopListItem[]>,
    default: () => ([])
  }
})

</script>

<style scoped lang="less">
@import './index.less';
</style>
