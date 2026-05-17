<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { MessageCircle, Trash2 } from 'lucide-vue-next'
import type { Comment } from '@/types'
import { formatDate } from '@/utils/format'
import { deleteComment } from '@/api'

interface Props {
  comment: Comment
  articleId: number
  isChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isChild: false,
})

const emit = defineEmits<{
  (e: 'reply', parentId: number, replyToNickname: string): void
  (e: 'deleted'): void
  (e: 'loadChildren', rootCommentId: number): void
}>()

const authStore = useAuthStore()
const showChildren = ref(false)
const deleting = ref(false)

const handleReply = () => {
  emit('reply', props.comment.id, props.comment.user.nickname)
}

const handleDelete = async () => {
  if (!confirm('确定要删除这条评论吗？')) return
  deleting.value = true
  try {
    await deleteComment(props.comment.id)
    emit('deleted')
  } catch (error) {
    console.error('删除评论失败', error)
  } finally {
    deleting.value = false
  }
}

const toggleChildren = () => {
  if (!showChildren.value) {
    emit('loadChildren', props.comment.id)
  }
  showChildren.value = !showChildren.value
}
</script>

<template>
  <div :class="['flex gap-3', isChild ? 'ml-12 mt-3' : '']">
    <!-- 头像 -->
    <img
      :src="comment.user.avatar || '/favicon.svg'"
      :alt="comment.user.nickname"
      class="w-9 h-9 rounded-full object-cover border border-border flex-shrink-0"
    />

    <!-- 内容区 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-sm font-semibold text-text-title">{{ comment.user.nickname }}</span>
        <span class="text-xs text-text-meta">{{ formatDate(comment.createTime) }}</span>
      </div>

      <p class="text-sm text-text-body leading-relaxed mb-2">
        <span v-if="comment.replyToNickname" class="text-primary mr-1">
          @{{ comment.replyToNickname }}
        </span>
        {{ comment.content }}
      </p>

      <!-- 操作按钮 -->
      <div class="flex items-center gap-4">
        <button
          class="flex items-center gap-1 text-xs text-text-meta hover:text-accent-rose transition-none"
          @click="handleReply"
        >
          <MessageCircle class="w-3.5 h-3.5" />
          回复
        </button>

        <button
          v-if="authStore.isAdmin || (authStore.userInfo && authStore.userInfo.id === comment.user.id)"
          class="flex items-center gap-1 text-xs text-text-meta hover:text-accent-rose transition-none"
          :disabled="deleting"
          @click="handleDelete"
        >
          <Trash2 class="w-3.5 h-3.5" />
          删除
        </button>

        <button
          v-if="comment.childCount && comment.childCount > 0"
          class="flex items-center gap-1 text-xs text-primary hover:underline transition-none"
          @click="toggleChildren"
        >
          {{ showChildren ? '收起' : `展开 ${comment.childCount} 条回复` }}
        </button>
      </div>

      <!-- 嵌套子评论 -->
      <slot v-if="showChildren" name="children" />
    </div>
  </div>
</template>
