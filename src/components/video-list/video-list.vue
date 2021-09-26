<template>
  <div class="video">
    <div
      v-for="(item, index) in videoList"
      :key="'' + item.id + Number(index)"
      class="item"
    >
      <router-link
        :to="{ path: item.type ? '/videodetail' : '/mvdetail', query: { id: item.vid }}"
        class="faceImg"
      >
        <i class="iconfont icon-play" />
        <el-image :src="item.coverUrl">
          <template #placeholder>
            <div class="image-slot">
              <i class="iconfont icon-placeholder" />
            </div>
          </template>
        </el-image>
        <span class="playCount"><i class="iconfont icon-video" /><em>{{ utils.formartNum(item.playTime) }}</em></span>
        <div class="v-time">
          {{ utils.formatSongTime(item.durationms) }}
        </div>
      </router-link>
      <div class="info">
        <router-link
          :to="{ path: '/videodetail', query: { id: item.vid }}"
          class="v-name"
        >
          {{ item.title }}
        </router-link>
        <router-link
          v-for="(author, k) in item.creator"
          :key="k"
          :to="{ path: '/user', query: { uid: author.userId }}"
          class="v-author"
        >
          By. {{ k !== 0 ? ' / ' + author.userName : author.userName }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import utils from '@/utils'
defineProps({
  videoList: {
    type: Array as any,
    default: () => ([])
  }
})
</script>

<style scoped lang="less">
@import './index.less';
</style>
