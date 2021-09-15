<template>
  <div
    ref="progress"
    class="progress"
    @click.stop=""
  >
    <div class="progress-line" />
    <div
      class="progress-bg"
      :style="{ width: progressWidth }"
    >
      <div
        class="progress-btn"
        @mousedown.self.stop=""
      />
    </div>
  </div>
</template>

<script lang='ts'>
export default {
  components: {},
  props: {
    progressWidth: {
      type: String,
      default: () => ('10%')
    }
  },
  data () {
    // 这里存放数据
    return {
    }
  },
  // 监听属性 类似于data概念
  computed: {
  },
  // 方法集合
  methods: {}
}
</script>

<style scoped lang="less">
@import './index.less';
</style>
