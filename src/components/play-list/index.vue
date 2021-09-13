<template>
  <div class="playlist">
    <div
      v-for="item in playList"
      :key="item.id"
      class="item"
    >
      <router-link
        :to="{ path: 'playlist/detail', query: { id: item.id }}"
        class="faceImg"
      >
        <el-image
          :src="item.coverImgUrl"
          lazy
        >
          <div
            slot="placeholder"
            class="image-slot"
          >
            <i class="iconfont icon-placeholder" />
          </div>
        </el-image>
        <span class="playCount"><i class="iconfont icon-playnum" /><em>{{ $utils.formartNum(item.playCount) }}</em></span>
      </router-link>
      <div class="info">
        <router-link
          :to="{ path: 'playlist/detail', query: { id: item.id }}"
          class="info_name"
        >
          {{ item.name }}
        </router-link>
        <div class="tags">
          <router-link
            v-for="(tag, index) in item.tags"
            :key="index"
            :to="{ path: '/playlist', query: { cat: tag }}"
            class="tag"
          >
            #{{ tag }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  components: {},
  props: {
    playList: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    // 这里存放数据
    return {
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 方法集合
  methods: {
  }
}
</script>
<style scoped lang="less">
@import './index.less'
</style>
