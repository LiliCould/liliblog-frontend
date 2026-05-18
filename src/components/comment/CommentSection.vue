<template>
  <div class="flex flex-col gap-6">
    <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-4">
      <div class="flex gap-3">
        <img
          v-if="userStore.isLoggedIn && userStore.avatar"
          :src="userStore.avatar"
          :alt="userStore.nickname"
          class="w-10 h-10 rounded-full border border-[rgba(0,240,255,0.2)] shrink-0"
        />
        <div
          v-else
          class="w-10 h-10 rounded-full border border-[rgba(0,240,255,0.2)] shrink-0 bg-[#1a1a24] flex items-center justify-center text-[#6b7280] text-xs"
        >
          匿
        </div>
        <div class="flex-1 min-w-0">
          <textarea
            v-model="commentContent"
            :placeholder="userStore.isLoggedIn ? '写下你的评论...' : '请先登录后评论'"
            :disabled="!userStore.isLoggedIn"
            class="w-full min-h-[80px] p-3 rounded-lg bg-[#0a0a0f] border border-[rgba(0,240,255,0.15)] text-[#e0e0e8] text-sm placeholder-[#6b7280] outline-none resize-none transition-all duration-300 focus:border-[#00f0ff] focus:shadow-[0_0_8px_rgba(0,240,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          ></textarea>
          <div class="flex justify-end mt-2">
            <button
              class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] text-[#00f0ff] text-sm font-semibold transition-all duration-300 hover:bg-[rgba(0,240,255,0.2)] hover:shadow-[0_0_10px_rgba(0,240,255,0.15)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!userStore.isLoggedIn || !commentContent.trim()"
              @click="submitComment"
            >
              <Send class="w-4 h-4" />
              发送
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="comments.length > 0" class="flex flex-col gap-4">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @reply="handleReply"
        @load-children="handleLoadChildren"
      />
    </div>

    <EmptyState v-else message="暂无评论" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Send } from 'lucide-vue-next'
import type { Comment, CommentCreateDTO } from '@/types/comment.d'
import { getComments, getChildComments, createComment } from '@/api/comment'
import { useUserStore } from '@/stores/user'
import CommentItem from './CommentItem.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const props = defineProps<{
  articleId: number
}>()

const userStore = useUserStore()
const comments = ref<Comment[]>([])
const commentContent = ref('')

async function loadComments() {
  try {
    const res = await getComments({ id: props.articleId, current: 1, size: 50 }) as any
    comments.value = res.data || []
  } catch {
    // skip
  }
}

async function submitComment() {
  if (!commentContent.value.trim()) return
  try {
    const data: CommentCreateDTO = {
      articleId: props.articleId,
      content: commentContent.value.trim(),
      parentId: 0,
      rootId: 0,
    }
    await createComment(data)
    commentContent.value = ''
    await loadComments()
  } catch {
    // skip
  }
}

function handleReply(comment: Comment) {
  commentContent.value = `@${comment.creator?.nickname} `
}

async function handleLoadChildren(comment: Comment) {
  try {
    await getChildComments({ id: comment.id, current: 1, size: 50 })
    const parent = comments.value.find(c => c.id === comment.id)
    if (parent) {
      // children will be handled by CommentItem internally
    }
  } catch {
    // skip
  }
}

onMounted(() => {
  loadComments()
})
</script>
