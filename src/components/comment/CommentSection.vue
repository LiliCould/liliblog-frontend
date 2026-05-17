<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { MessageSquare } from 'lucide-vue-next'
import type { Comment } from '@/types'
import { getCommentsByArticle, getChildComments, createComment } from '@/api'
import CommentItem from './CommentItem.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

interface Props {
  articleId: number
}

const props = defineProps<Props>()

const authStore = useAuthStore()

const comments = ref<Comment[]>([])
const childCommentsMap = ref<Record<number, Comment[]>>({})
const loading = ref(false)
const submitting = ref(false)
const content = ref('')
const replyParentId = ref<number | null>(null)
const replyToNickname = ref('')

const fetchComments = async () => {
  loading.value = true
  try {
    const res = await getCommentsByArticle(props.articleId)
    comments.value = res.data.records || []
  } catch (error) {
    console.error('获取评论失败', error)
  } finally {
    loading.value = false
  }
}

const fetchChildren = async (rootCommentId: number) => {
  try {
    const res = await getChildComments(rootCommentId)
    childCommentsMap.value[rootCommentId] = res.data.records || []
  } catch (error) {
    console.error('获取子评论失败', error)
  }
}

const handleReply = (parentId: number, nickname: string) => {
  replyParentId.value = parentId
  replyToNickname.value = nickname
}

const cancelReply = () => {
  replyParentId.value = null
  replyToNickname.value = ''
}

const handleSubmit = async () => {
  if (!content.value.trim() || !authStore.isLoggedIn) return

  submitting.value = true
  try {
    await createComment({
      articleId: props.articleId,
      content: content.value.trim(),
      parentId: replyParentId.value || undefined,
    })
    content.value = ''
    replyParentId.value = null
    replyToNickname.value = ''
    await fetchComments()
  } catch (error) {
    console.error('发布评论失败', error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <section class="mt-12 pt-8 border-t border-border">
    <div class="flex items-center gap-2 mb-6">
      <MessageSquare class="w-5 h-5 text-text-title" />
      <h3 class="text-lg font-bold text-text-title">评论</h3>
      <span class="text-sm text-text-meta">({{ comments.length }})</span>
    </div>

    <!-- 评论输入框 -->
    <div v-if="authStore.isLoggedIn" class="mb-8">
      <div
        v-if="replyParentId"
        class="flex items-center gap-2 mb-2 text-sm text-primary"
      >
        <span>回复 @{{ replyToNickname }}</span>
        <button class="text-text-meta hover:text-text-title" @click="cancelReply">
          取消
        </button>
      </div>
      <textarea
        v-model="content"
        rows="3"
        class="w-full px-4 py-3 bg-bg-surface border border-border rounded-xl text-sm text-text-body placeholder:text-text-meta focus:outline-none focus:border-primary resize-none"
        :placeholder="replyParentId ? `回复 @${replyToNickname}...` : '写下你的评论...'"
      />
      <div class="flex justify-end mt-2">
        <button
          class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-none disabled:opacity-50"
          :disabled="!content.trim() || submitting"
          @click="handleSubmit"
        >
          {{ submitting ? '发送中...' : '发送' }}
        </button>
      </div>
    </div>

    <div v-else class="mb-8 p-4 bg-bg-surface rounded-xl text-center text-sm text-text-meta">
      <router-link to="/login" class="text-primary hover:underline">登录</router-link>
      后参与评论
    </div>

    <!-- 评论列表 -->
    <LoadingBlock v-if="loading" />

    <EmptyState
      v-else-if="comments.length === 0"
      title="暂无评论"
      description="成为第一个评论的人吧"
    />

    <div v-else class="space-y-6">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :article-id="articleId"
        @reply="handleReply"
        @deleted="fetchComments"
        @load-children="fetchChildren"
      >
        <template #children>
          <div class="mt-3 space-y-3">
            <CommentItem
              v-for="child in childCommentsMap[comment.id] || []"
              :key="child.id"
              :comment="child"
              :article-id="articleId"
              is-child
              @reply="handleReply"
              @deleted="fetchComments"
            />
          </div>
        </template>
      </CommentItem>
    </div>
  </section>
</template>
