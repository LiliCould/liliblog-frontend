<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Eye, Heart, Clock } from 'lucide-vue-next'
import type { Article } from '@/types'
import { formatDate } from '@/utils/format'

interface Props {
  article: Article
}

defineProps<Props>()

const router = useRouter()
</script>

<template>
  <article
    class="bg-bg-surface rounded-2xl overflow-hidden card-shadow cursor-pointer transition-none hover:card-shadow-hover"
    @click="router.push(`/article/${article.id}`)"
  >
    <!-- 封面图 -->
    <div class="relative aspect-video overflow-hidden">
      <img
        :src="article.coverImage || '/hero.png'"
        :alt="article.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <!-- 状态角标 -->
      <span
        v-if="article.status === 0"
        class="absolute top-3 right-3 pill-badge bg-accent-amber text-white"
      >
        审核中
      </span>
      <span
        v-else-if="article.status === 2"
        class="absolute top-3 right-3 pill-badge bg-text-meta text-white"
      >
        草稿
      </span>
    </div>

    <!-- 内容区 -->
    <div class="p-5">
      <!-- 标题 -->
      <h2 class="text-lg font-bold text-text-title mb-2 line-clamp-2 leading-snug">
        {{ article.title }}
      </h2>

      <!-- 摘要 -->
      <p class="text-sm text-text-meta mb-4 line-clamp-2 leading-relaxed">
        {{ article.summary }}
      </p>

      <!-- 元数据行 -->
      <div class="flex items-center gap-4 text-xs text-text-meta">
        <span class="flex items-center gap-1">
          <Clock class="w-3.5 h-3.5" />
          {{ formatDate(article.createTime) }}
        </span>
        <span class="flex items-center gap-1">
          <Eye class="w-3.5 h-3.5" />
          {{ article.viewCount }}
        </span>
        <span class="flex items-center gap-1 text-accent-rose">
          <Heart class="w-3.5 h-3.5" />
          {{ article.likeCount }}
        </span>
      </div>

      <!-- 分类和标签 -->
      <div class="flex items-center gap-2 mt-3 flex-wrap">
        <span
          v-if="article.category"
          class="pill-badge bg-primary/10 text-primary"
        >
          {{ article.category.name }}
        </span>
        <span
          v-for="tag in article.tags"
          :key="tag.id"
          class="pill-badge bg-bg-canvas text-text-meta"
        >
          {{ tag.name }}
        </span>
      </div>
    </div>
  </article>
</template>
