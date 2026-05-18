<template>
  <div class="flex flex-col gap-6">
    <div class="rounded-xl bg-[rgba(20,20,35,0.85)] border border-[rgba(0,240,255,0.15)] p-5" style="backdrop-filter:blur(12px)">
      <div class="flex gap-3">
        <img
          :src="resolveAvatar(userStore.isLoggedIn ? userStore.avatar : '')"
          :alt="userStore.nickname"
          class="w-10 h-10 rounded-full border border-[rgba(0,240,255,0.2)] shrink-0 object-cover"
          @error="handleAvatarError"
        />
        <div class="flex-1 min-w-0">
          <textarea
            v-model="commentContent"
            :placeholder="replyTarget ? `回复 @${replyTarget.creator?.nickname}...` : userStore.isLoggedIn ? '写下你的评论...' : '请先登录后评论'"
            :disabled="!userStore.isLoggedIn"
            class="w-full min-h-[80px] p-3 rounded-lg bg-[rgba(0,0,0,0.3)] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none resize-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          ></textarea>
          <div class="flex items-center justify-between mt-2">
            <button
              v-if="replyTarget"
              class="text-xs text-[#6b7280] hover:text-[#00f0ff] transition-colors"
              @click="cancelReply"
            >
              取消回复
            </button>
            <span v-else></span>
            <button
              class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] text-[#00f0ff] text-sm font-semibold transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_10px_rgba(0,240,255,0.15)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!userStore.isLoggedIn || !commentContent.trim() || submitting"
              @click="submitComment"
            >
              <Send class="w-4 h-4" />
              发送
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col gap-4">
      <div v-for="i in 3" :key="i" class="h-24 rounded-xl bg-[rgba(20,20,35,0.5)] border border-[rgba(0,240,255,0.1)] animate-pulse"></div>
    </div>

    <div v-else-if="comments.length > 0" class="flex flex-col gap-4">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :article-id="articleId"
        @reply="handleReply"
      />
    </div>

    <EmptyState v-else message="暂无评论，快来抢沙发吧" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Send } from 'lucide-vue-next'
import type { Comment, CommentCreateDTO } from '@/types/comment.d'
import { getComments, createComment } from '@/api/comment'
import { useUserStore } from '@/stores/user'
import { resolveAvatar, handleAvatarError } from '@/utils/format'
import CommentItem from './CommentItem.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const props = defineProps<{
  articleId: number
}>()

const userStore = useUserStore()
const comments = ref<Comment[]>([])
const commentContent = ref('')
const loading = ref(true)
const submitting = ref(false)
const replyTarget = ref<Comment | null>(null)

async function loadComments() {
  loading.value = true
  try {
    const res = await getComments({ id: props.articleId, current: 1, size: 50 }) as any
    const pageData = res.data
    if (pageData && pageData.records) {
      comments.value = pageData.records
    } else if (Array.isArray(pageData)) {
      comments.value = pageData
    } else {
      comments.value = []
    }
  } catch {
    comments.value = []
  } finally {
    loading.value = false
  }
}

async function submitComment() {
  if (!commentContent.value.trim() || submitting.value) return
  submitting.value = true
  try {
    const data: CommentCreateDTO = {
      articleId: props.articleId,
      content: commentContent.value.trim(),
      parentId: replyTarget.value?.id || 0,
      rootId: replyTarget.value?.id || 0,
    }
    await createComment(data)
    commentContent.value = ''
    replyTarget.value = null
    await loadComments()
  } catch {
    // handled by interceptor
  } finally {
    submitting.value = false
  }
}

function handleReply(comment: Comment) {
  replyTarget.value = comment
  commentContent.value = `@${comment.creator?.nickname} `
}

function cancelReply() {
  replyTarget.value = null
  commentContent.value = ''
}

onMounted(() => {
  loadComments()
})
</script>