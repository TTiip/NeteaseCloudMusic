<template>
  <div class="reply-comment">
    <h3>我回复 @{{ params.user.nickname }}:</h3>
    <div class="comment_textarea">
      <textarea
        id="leave_msg"
        v-model="msg"
        class="J_inpBox inp-paragraph"
        name="leave_msg"
        placeholder="期待你的神评论……"
      />
    </div>
    <div class="comment_box_footer">
      <span class="comment_limit"><em class="num">{{ msg.length }}</em>/{{ maxLen }}</span>
      <el-button
        type="primary"
        size="mini"
        round
        @click="subReplyComment"
      >
        评论
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['replyMsg'])

/* data */
const msg = ref('')
const maxLen = ref(140)

/* watch */
watch(() => msg.value, () => {
  msg.value = maxLen.value >= msg.value.length ? msg.value : msg.value.substring(0, maxLen.value)
})

/* methods */
const subReplyComment = () => {
  emit('replyMsg', msg.value)
}
</script>

<style scoped lang="less">
@import './index.less';
</style>
