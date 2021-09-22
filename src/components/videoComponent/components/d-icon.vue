<template>
  <i
    class="d-icon iconfont"
    :class="icon"
    :style="iconSize"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
// const emits = defineEmits('click')
const props: any = defineProps({
  icon: {
    type: String,
    default: () => ('')
  },
  size: {
    type: [Number, String],
    default: () => (0)
  }
})
const iconSize = computed(() => {
  const size = /^\d+$/.test(props.size) ? props.size + 'px' : props.size
  return { fontSize: size }
})

</script>
<style lang = "less" scoped >
@import "../style/iconfont.css";
.d-icon {
  display: inline-block;
  cursor: pointer;
  overflow: hidden;
}
</style>
