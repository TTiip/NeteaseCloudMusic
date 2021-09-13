<template>
  <div class="album">
    <router-link
      v-for="item in albumList"
      :key="item.id"
      :to="{ path: '/album', query: { id: item.id }}"
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
        <div class="album-type">
          {{ item.type }}
        </div>
        <div
          v-if="item.name"
          class="album-name"
        >
          {{ item.name }}
        </div>
        <div
          v-if="item.artist"
          class="artist-name"
        >
          {{ item.artist.name }}
        </div>
      </div>
    </router-link>
  </div>
</template>

<script lang='ts' setup>
import { PropType } from 'vue'
import { GetTopAlbumItem } from '@/interface'
defineProps({
  albumList: {
    type: Array as PropType<GetTopAlbumItem[]>,
    default: () => ([])
  }
})

</script>
<style scoped lang="less">
@import './index.less';
</style>
