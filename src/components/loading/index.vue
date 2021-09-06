<template>
  <div class="loading-container" :style="{ background }">
    <div class='loader'>
      <div>
        <div>
          <div>
            <div>
              <div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
  background: {
    type: String,
    default: 'rgba(255, 255, 255, .4)'
  }
})

</script>

<style lang="less">
@import './index.less';
</style>
