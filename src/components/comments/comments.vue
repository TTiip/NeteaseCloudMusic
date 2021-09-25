<template>
  <div class="comments">
    <div class="comment_hd">
      <h2>评论<em>共{{ total }}条评论</em></h2>
      <div
        v-if="userInfo.nickname"
        class="userInfo"
      >
        <span>{{ userInfo.nickname }}</span>
        <el-image
          :src="userInfo.avatarUrl"
          class="avatar"
        >
          <template #placeholder>
            <div class="image-slot">
              <i class="iconfont icon-placeholder" />
            </div>
          </template>
        </el-image>
      </div>
    </div>
    <el-form class="comment_box">
      <div class="comment_textarea">
        <div class="pre">
          {{ msg }}
        </div>
        <textarea
          id="leave_msg"
          v-model="msg"
          class="J_inpBox inp-paragraph"
          name="leave_msg"
          placeholder="期待你的神评论……"
        />
      </div>
      <div class="comment_box_footer">
        <el-button
          type="primary"
          size="mini"
          @click="subComment"
        >
          评论
        </el-button>
        <span class="comment_limit"><em class="num">{{ msg.length }}</em>/{{ maxLen }}</span>
      </div>
    </el-form>
    <div class="comment_area">
      <template v-if="comments.length">
        <div
          v-for="(item, index) in comments"
          :key="item.commentId + Number(index) + ''"
          class="comment_item"
        >
          <router-link
            :to="{ path: '/user', query: { id: item.user.userId }}"
            class="comment_avatar"
          >
            <el-image :src="item.user.avatarUrl + '?param=120y120'">
              <template #placeholder>
                <div class="image-slot">
                  <i class="iconfont icon-placeholder" />
                </div>
              </template>
            </el-image>
          </router-link>
          <div class="comment_info">
            <router-link :to="{ path: '/user', query: { id: item.user.userId }}">
              {{ item.user.nickname }}
            </router-link>
            <div class="comment_content">
              {{ item.content }}
            </div>
            <div
              v-for="replyItem in item.beReplied"
              :key="replyItem.beRepliedCommentId"
              class="comment_reply"
            >
              <router-link :to="{ path: '/user', query: { id: replyItem.user.userId }}">
                {{ replyItem.user.nickname }}
              </router-link>: {{ replyItem.content }}
            </div>
            <div class="comment_footer">
              <div class="comment_time">
                {{ utils.formatMsgTime(item.time) }}
              </div>
              <div class="comment_oper">
                <em
                  v-if="userInfo && userInfo.userId === item.user.userId"
                  class="comment_del"
                  @click="delComment(item)"
                ><i class="iconfont icon-del" /></em>
                <span
                  :class="[ item.liked ? 'active' : '']"
                  @click="likeComment(item)"
                ><i class="iconfont icon-praise" />({{ item.likedCount }})</span>
                <span
                  class="replyComment"
                  @click="replyComment(item, index)"
                ><i class="iconfont icon-comment" /></span>
              </div>
            </div>
            <div
              v-if="item.isHot"
              class="isHot"
            >
              <i class="iconfont icon-choicest" />
            </div>
            <transition
              name="fade"
              mode="out-in"
            >
              <ReplyComment
                v-if="isShowReply(item, index)"
                :params="item"
                @replyMsg="replyMsg"
              />
            </transition>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="currentChange"
          />
        </div>
      </template>
      <div
        v-else
        class="comments_status"
      >
        <div
          v-if="!isEmpty"
          class="loading"
        >
          评论加载中...
        </div>
        <div
          v-else
          class="empty"
        >
          <p><i class="iconfont icon-empty-main" /></p>
          <p>暂无留言</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import ReplyComment from '@/components/reply-comment/reply-comment.vue'
import useConfirm from '@/hooks/useConfirm'
import useMessage from '@/hooks/useMessage'
import store from '@/store'
import axios from '@/axios'
import utils from '@/utils'

const props = defineProps({
  // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
  type: {
    type: Number,
    default: 0
  },
  id: {
    type: String,
    default: '0'
  }
})

const msg = ref('')
const maxLen = ref(140)
const curId = ref(props.id)
const limit = ref(20)
const offset = ref(0)
const before = ref(0)
const hotComments = ref([])
const comments: any = ref([])
const total = ref(0)
const isEmpty = ref(false)
const replyCommentId = ref(0)
const replyIndex = ref(-1)

/* computed */
const userInfo = computed(() => store.state.userInfo)
const isLogin = computed(() => store.state.isLogin)

const isShowReply = computed(() => {
  return function (item: any, index: any) {
    return item.commentId === replyCommentId.value && replyIndex.value === index
  }
})

/* methods */
// 获取页面评论
const getComment = () => {
  // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
  switch (props.type) {
    case 0:
      getSongComment()
      break
    case 1:
      getMvComment()
      break
    case 3:
      getAlbumComment()
      break
    case 5:
      getVideoComment()
      break
  }
}
const getSongComment = async () => {
  const params = {
    id: curId.value,
    limit: limit.value,
    offset: offset.value,
    before: before.value
  }
  const getCommentMusicData = await axios({
    url: 'getCommentMusic',
    method: 'GET',
    params,
    headers: {
      showLoading: false
    }
  })
  msgHandler(getCommentMusicData)
}
const getMvComment = async () => {
  const params = {
    id: curId.value,
    limit: limit.value,
    offset: offset.value,
    before: before.value
  }
  const getCommentMvData = await axios({
    url: 'getCommentMv',
    method: 'GET',
    params,
    headers: {
      showLoading: false
    }
  })
  msgHandler(getCommentMvData)
}
const getAlbumComment = async () => {
  const params = {
    id: curId.value,
    limit: limit.value,
    offset: offset.value,
    before: before.value
  }
  const getCommentAlbumData = await axios({
    url: 'getCommentAlbum',
    method: 'GET',
    params,
    headers: {
      showLoading: false
    }
  })
  msgHandler(getCommentAlbumData)
}
const getVideoComment = async () => {
  const params = {
    id: curId.value,
    limit: limit.value,
    offset: offset.value,
    before: before.value
  }
  const getCommentVideoData = await axios({
    url: 'getCommentVideo',
    method: 'GET',
    params,
    headers: {
      showLoading: false
    }
  })
  msgHandler(getCommentVideoData)
}
const msgHandler = (msgData: any) => {
  total.value = msgData.total
  hotComments.value = msgData.hotComments || []
  hotComments.value.map((item: any) => {
    item.isHot = true
    return item
  })
  comments.value = [...hotComments.value, ...msgData.comments]
  // 当前评论是否为空
  isEmpty.value = before.value === 0 && !comments.value.length
}
// 发布/删除/回复评论
const commentHandler = async (t: any, content: any, commentId?: any) => {
  const params = {
    t: t, // 0删除 1发送 2回复
    type: props.type, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
    id: curId.value, // 对应资源id
    content: content, // 发送的内容/对应内容的id
    commentId: commentId // 回复的评论id
  }
  const getCommitData = await axios({
    url: 'getCommit',
    method: 'GET',
    params,
    headers: {
      showLoading: false
    }
  })
  if (getCommitData.code === 200) {
    msg.value = ''
    getComment()
    if (t === 0) {
      useMessage('success', '删除评论成功！')
    } else if (t === 1) {
      useMessage('success', '评论成功！')
    } else if (t === 2) {
      useMessage('success', '回复评论成功！')
      replyCommentId.value = 0
      replyIndex.value = -1
    }
  }
}
// 发布评论
const subComment = () => {
  if (!isLogin.value) {
    store.commit('setShowLogin', true)
    return
  }
  commentHandler(1, msg.value)
}
// 删除评论
const delComment = (item: any) => {
  useConfirm(
    '确定删除评论？',
    '提示',
    () => {
      commentHandler(0, '', item.commentId)
    },
    (error: any) => {
      useMessage('error', error)
    }
  )
}
// 回复评论
const replyComment = (item: any, index: any) => {
  if (!isLogin.value) {
    store.commit('setShowLogin', true)
    return
  }
  replyCommentId.value = (replyCommentId.value === item.commentId && replyIndex.value === index) ? 0 : item.commentId
  replyIndex.value = index
}
const replyMsg = (msg: string) => {
  if (!isLogin.value) {
    store.commit('setShowLogin', true)
    return
  }
  commentHandler(2, msg, replyCommentId.value)
}
// 给评论点赞
const likeComment = async (item: any) => {
  if (!isLogin.value) {
    store.commit('setShowLogin', true)
  }
  const params = {
    id: curId.value,
    cid: item.commentId,
    t: Number(!item.liked),
    type: props.type
  }

  await axios({
    url: 'getCommitLike',
    method: 'GET',
    params
  })
  // 标记喜欢 不喜欢。
  item.liked = !item.liked
  getComment()
}
// 留言分页
const currentChange = (page: number) => {
  offset.value = (page - 1) * limit.value
  getComment()
}

/* mounted */
onMounted(() => {
  getComment()
})

/* watch */
watch(() => props.id, (newVal) => {
  curId.value = newVal
  offset.value = 0
  getComment()
})
watch(msg, () => {
  msg.value = maxLen.value >= msg.value.length ? msg.value : msg.value.substring(0, maxLen.value)
})

</script>

<style scoped lang="less">
@import './index.less';
</style>
