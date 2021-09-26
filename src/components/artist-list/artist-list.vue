<template>
  <div class="artist">
    <router-link
      v-for="item in artistList"
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
</template>

<script lang='ts' setup>
defineProps({
  artistList: {
    type: Array as any,
    default: () => ([])
  }
})
</script>

<style scoped lang="less">
@import './index.less';
</style>
