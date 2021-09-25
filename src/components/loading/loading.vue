<template>
  <div
    class="loading-container"
    :style="{ background }"
  >
    <div class="loader">
      <div>
        <div>
          <div>
            <div>
              <div>
                <div />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  background: {
    type: String,
    default: 'rgba(255, 255, 255, .4)'
  }
})

</script>

<style lang="less" scoped>
@import './index.less';
</style>
