<template>
  <div class="rounded-xl bg-[#111118] border border-[rgba(0,240,255,0.15)] p-4 transition-all duration-300 hover:border-[rgba(0,240,255,0.3)]">
    <div class="flex gap-3">
      <img
        :src="comment.creator?.avatar || '/default-avatar.png'"
        :alt="comment.creator?.nickname"
        class="w-10 h-10 rounded-full border border-[rgba(0,240,255,0.2)] shrink-0"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-sm font-semibold text-[#00f0ff]">{{ comment.creator?.nickname }}</span>
          <span class="text-xs text-[#6b7280]">{{ formatRelativeTime(comment.createTime) }}</span>
        </div>

        <p class="text-sm text-[#e0e0e8] leading-relaxed mb-2">{{ comment.content }}</p>

        <div class="flex items-center gap-4">
          <button class="flex items-center gap-1 text-xs text-[#6b7280] transition-colors duration-300 hover:text-[#ff2d78]" @click="emit('reply', comment)">
            <MessageSquare class="w-3.5 h-3.5" />
            回复
          </button>
          <button class="flex items-center gap-1 text-xs text-[#6b7280] transition-colors duration-300 hover:text-[#ff2d78]">
            <Heart class="w-3.5 h-3.5" />
            {{ comment.likeCount }}
          </button>

          <button
            v-if="comment.childCount > 0"
            class="flex items-center gap-1 text-xs text-[#00f0ff] transition-all duration-300 hover:text-[#ff2d78]"
            @click="emit('load-children', comment)"
          >
            <ChevronDown class="w-3.5 h-3.5" />
            展开 {{ comment.childCount }} 条回复
          </button>
        </div>

        <div v-if="children.length > 0" class="mt-3 pl-4 border-l border-[rgba(0,240,255,0.15)]">
          <CommentItem
            v-for="child in children"
            :key="child.id"
            :comment="child"
            @reply="(c: Comment) => emit('reply', c)"
            @load-children="(c: Comment) => emit('load-children', c)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Heart, MessageSquare, ChevronDown } from 'lucide-vue-next'
import type { Comment } from '@/types/comment.d'
import { formatRelativeTime } from '@/utils/format'

defineProps<{
  comment: Comment
}>()

const emit = defineEmits<{
  (e: 'reply', comment: Comment): void
  (e: 'load-children', comment: Comment): void
}>()

const children = ref<Comment[]>([])
</script>
