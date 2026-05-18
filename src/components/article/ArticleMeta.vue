<template>
  <div class="flex flex-wrap gap-4">
    <span v-if="article.category" class="flex items-center gap-1 text-[13px] text-[#6b7280] transition-colors duration-300 hover:text-[#00f0ff]">
      <FolderOpen class="w-3.5 h-3.5 text-[#00f0ff] opacity-70 transition-opacity duration-300 hover:opacity-100" />
      {{ article.category.name }}
    </span>
    <span v-if="article.tags && article.tags.length > 0" class="flex items-center gap-1 text-[13px] text-[#6b7280] transition-colors duration-300 hover:text-[#00f0ff]">
      <Tag class="w-3.5 h-3.5 text-[#00f0ff] opacity-70 transition-opacity duration-300 hover:opacity-100" />
      {{ article.tags.map(t => t.name).join(', ') }}
    </span>
    <span class="flex items-center gap-1 text-[13px] text-[#6b7280] transition-colors duration-300 hover:text-[#00f0ff]">
      <Eye class="w-3.5 h-3.5 text-[#00f0ff] opacity-70 transition-opacity duration-300 hover:opacity-100" />
      {{ formatNumber(article.viewCount) }}
    </span>
    <span class="flex items-center gap-1 text-[13px] text-[#6b7280] transition-colors duration-300 hover:text-[#00f0ff]">
      <MessageSquare class="w-3.5 h-3.5 text-[#00f0ff] opacity-70 transition-opacity duration-300 hover:opacity-100" />
      {{ article.commentCount }}
    </span>
    <span class="flex items-center gap-1 text-[13px] text-[#6b7280] transition-colors duration-300 hover:text-[#00f0ff]">
      <Heart class="w-3.5 h-3.5 text-[#00f0ff] opacity-70 transition-opacity duration-300 hover:opacity-100" />
      {{ article.likeCount }}
    </span>
    <span class="flex items-center gap-1 text-[13px] text-[#6b7280] transition-colors duration-300 hover:text-[#00f0ff]">
      <Clock class="w-3.5 h-3.5 text-[#00f0ff] opacity-70 transition-opacity duration-300 hover:opacity-100" />
      {{ formatDateTime(article.updateTime) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Eye, MessageSquare, Heart, Clock, FolderOpen, Tag } from 'lucide-vue-next'
import type { Article } from '@/types/article.d'
import { formatDateTime, formatNumber } from '@/utils/format'

defineProps<{
  article: Article
}>()
</script>
