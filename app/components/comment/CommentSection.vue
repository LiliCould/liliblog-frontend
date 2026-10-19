<template>
  <div class="flex flex-col gap-6">
    <div class="card-glass p-5">
      <div v-if="!userStore.isLoggedIn" class="flex flex-col items-center gap-3 py-3 text-center">
        <p class="text-sm text-t-muted">登录后即可参与评论</p>
        <button class="btn-primary px-4 py-2 text-sm" @click="authModal.open('login')">
          登录 / 注册
        </button>
      </div>

      <div v-else class="flex gap-3">
        <img
          :src="resolveAvatar(userStore.avatar)"
          :alt="userStore.nickname"
          class="w-10 h-10 rounded-full border border-[rgba(var(--color-primary-rgb),0.2)] shrink-0 object-cover"
          @error="handleAvatarError"
        />
        <div class="flex-1 min-w-0">
          <textarea
            v-model="commentContent"
            :placeholder="replyTarget ? `回复 @${replyTarget.creator?.nickname}...` : '写下你的评论...'"
            class="w-full min-h-[80px] p-3 rounded-control bg-[rgba(var(--color-bg-rgb),0.35)] border border-t-border text-t-body text-sm placeholder-t-muted outline-none resize-none transition-all duration-300 focus:border-t-primary focus:shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.1)]"
          />
          <div class="flex items-center justify-between mt-2">
            <button v-if="replyTarget" class="text-xs text-t-muted hover:text-t-primary transition-colors" @click="cancelReply">
              取消回复
            </button>
            <span v-else />
            <button
              class="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!commentContent.trim() || submitting"
              @click="submitComment"
            >
              <Send class="w-4 h-4" />
              发送
            </button>
          </div>
        </div>
      </div>
    </div>

    <LoadingState v-if="pending" variant="list" :count="2" />

    <ErrorState v-else-if="error && comments.length === 0" title="评论加载失败" @retry="refresh" />

    <div v-else-if="comments.length > 0" class="flex flex-col gap-4">
      <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" :article-id="articleId" @reply="handleReply" />
      <button v-if="hasMore" class="btn-glass mx-auto px-4 py-2 text-sm" @click="loadMore">
        加载更多评论
      </button>
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
const authApi = useAuthApi()
const userStore = useUserStore()
const toast = useToast()
const authModal = useAuthModal()

const commentContent = ref('')
const submitting = ref(false)
const replyTarget = ref<Comment | null>(null)
const extraComments = ref<Comment[]>([])
const loadedPage = ref(1)
const loadingMore = ref(false)

const emptyPage: PageResult<Comment> = {
  records: [],
  total: 0,
  size: 0,
  current: 1,
  totalPage: 0,
  hasPrevious: false,
  hasNext: false,
}

const { data: commentPage, pending, error, refresh } = await useAsyncData(
  () => `comments:${props.articleId}`,
  () => api.get<PageResult<Comment>>('/api/comment', { id: props.articleId, current: 1, size: 50 }),
  {
    watch: [() => props.articleId],
    default: () => emptyPage,
  },
)

const comments = computed(() => [
  ...(commentPage.value?.records || []),
  ...extraComments.value,
])

const totalComments = computed(() => commentPage.value?.total || 0)
const hasMore = computed(() => comments.value.length < totalComments.value)

async function loadMore(): Promise<void> {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const nextPage = loadedPage.value + 1
    const page = await api.get<PageResult<Comment>>('/api/comment', {
      id: props.articleId,
      current: nextPage,
      size: 50,
    })
    extraComments.value.push(...(page.records || []))
    loadedPage.value = nextPage
  } catch (loadError) {
    toast.error(loadError)
  } finally {
    loadingMore.value = false
  }
}

async function submitComment(): Promise<void> {
  if (!commentContent.value.trim() || submitting.value) return
  if (!userStore.isLoggedIn) {
    authModal.open('login')
    return
  }
  submitting.value = true
  try {
    const target = replyTarget.value
    const data: CommentCreateDTO = {
      articleId: props.articleId,
      content: commentContent.value.trim(),
      parentId: target?.id || 0,
      rootId: target?.rootId || target?.id || 0,
    }
    await authApi.post('/api/comment', data)
    commentContent.value = ''
    replyTarget.value = null
    extraComments.value = []
    loadedPage.value = 1
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
