<template>
  <div
    v-show="state.handleType || state.isMultiplesPlay"
    class="d-status"
  >
    <li
      v-show="state.handleType == 'volume'"
      class="d-flex-center"
    >
      <d-icon
        size="18"
        class="d-status-icon"
        :icon="`icon-volume-${state.volume == 0 ? 'mute' : state.volume > 0.5 ? 'up' : 'down'
        }`"
      />
      {{ ~~(state.volume * 100) }}%
    </li>
    <li
      v-show="state.handleType == 'playbackRate' || state.isMultiplesPlay"
      class="d-flex-center"
    >
      <d-icon
        size="12"
        icon="icon-play"
      />
      <d-icon
        size="12"
        icon="icon-play"
        style="margin-right:5px"
      />5X速播放中
    </li>
  </div>
</template>

<script setup lang='ts'>
import DIcon from './d-icon.vue'
defineProps({
  state: {
    type: Object,
    default: () => ({})
  }
})

</script>

<style scoped lang='less'>
@import "../style/base.less";
.d-status {
    text-align: center;
    font-size: 14px;
    vertical-align: middle;
    background: rgba(0, 0, 0, 0.8);
    padding: 0 8px;
    height: 30px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.95);

    .d-status-icon {
        width: 24px !important;
        display: inline-block;
        margin-right: 5px;
    }
}
</style>
