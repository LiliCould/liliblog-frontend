<template>
  <div class="flex flex-col gap-6">
    <div class="rounded-xl bg-[rgba(var(--color-card-rgb),0.85)] border border-t-border p-5" style="backdrop-filter:blur(12px)">
      <div class="flex gap-3">
        <img
          :src="resolveAvatar(userStore.isLoggedIn ? userStore.avatar : '')"
          :alt="userStore.nickname"
          class="w-10 h-10 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)] shrink-0 object-cover"
          @error="handleAvatarError"
        />
        <div class="flex-1 min-w-0">
          <textarea
            v-model="commentContent"
            :placeholder="replyTarget ? `回复 @${replyTarget.creator?.nickname}...` : userStore.isLoggedIn ? '写下你的评论...' : '请先登录后评论'"
            :disabled="!userStore.isLoggedIn"
            class="w-full min-h-[80px] p-3 rounded-lg bg-[rgba(var(--color-bg-rgb),0.3)] border border-t-border text-t-body text-sm placeholder-t-muted outline-none resize-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div class="flex items-center justify-between mt-2">
            <button v-if="replyTarget" class="text-xs text-t-muted hover:text-t-primary transition-colors" @click="cancelReply">
              取消回复
            </button>
            <span v-else />
            <button
              class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[rgba(var(--color-primary-rgb),0.1)] border border-[rgba(var(--color-primary-rgb),0.3)] text-t-primary text-sm font-semibold transition-all duration-300 hover:bg-[rgba(var(--color-primary-rgb),0.2)] hover:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.15)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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

    <div v-if="pending" class="flex flex-col gap-4">
      <div v-for="i in 3" :key="i" class="h-24 rounded-xl bg-[rgba(var(--color-card-rgb),0.5)] border border-[rgba(var(--color-primary-rgb),0.1)] animate-pulse" />
    </div>

    <div v-else-if="comments.length > 0" class="flex flex-col gap-4">
      <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" :article-id="articleId" @reply="handleReply" />
    </div>

    <EmptyState v-else message="暂无评论，快来抢沙发吧" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Send } from 'lucide-vue-next'
import type { Comment, CommentCreateDTO, PageResult } from '~/types'
import { handleAvatarError, resolveAvatar } from '~/utils/format'

const props = defineProps<{
  articleId: number
}>()

const api = useApi()
const userStore = useUserStore()
const toast = useToast()

const commentContent = ref('')
const submitting = ref(false)
const replyTarget = ref<Comment | null>(null)

const emptyPage: PageResult<Comment> = {
  records: [],
  total: 0,
  size: 0,
  current: 1,
  totalPage: 0,
  hasPrevious: false,
  hasNext: false,
}

const { data: commentPage, pending, refresh } = await useAsyncData(
  () => `comments:${props.articleId}`,
  () => api.get<PageResult<Comment>>('/api/comment', { id: props.articleId, current: 1, size: 50 }),
  {
    watch: [() => props.articleId],
    default: () => emptyPage,
  },
)

const comments = computed(() => commentPage.value?.records || [])

async function submitComment(): Promise<void> {
  if (!commentContent.value.trim() || submitting.value) return
  submitting.value = true
  try {
    const target = replyTarget.value
    const data: CommentCreateDTO = {
      articleId: props.articleId,
      content: commentContent.value.trim(),
      parentId: target?.id || 0,
      rootId: target?.rootId || target?.id || 0,
    }
    await api.post('/api/comment', data)
    commentContent.value = ''
    replyTarget.value = null
    await refresh()
    toast.success('评论已发布')
  } catch (error) {
    toast.error(error)
  } finally {
    submitting.value = false
  }
}

function handleReply(comment: Comment): void {
  if (!userStore.isLoggedIn) {
    useAuthModal().open('login')
    return
  }
  replyTarget.value = comment
  commentContent.value = `@${comment.creator?.nickname} `
}

function cancelReply(): void {
  replyTarget.value = null
  commentContent.value = ''
}
</script>
